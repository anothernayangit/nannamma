-- ==============================================================================
-- "Mujhse Shaadi Karogi???" - Supabase Database Schema & Atomic RPC
-- ==============================================================================

-- 1. Create Proposal Counter Table
CREATE TABLE IF NOT EXISTS proposal_counter (
  id TEXT PRIMARY KEY DEFAULT 'global',
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  last_proposal_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  celebrated_milestones INTEGER[] NOT NULL DEFAULT '{}',
  last_milestone INTEGER NULL,
  last_milestone_message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure the singleton 'global' row exists with count = 0
INSERT INTO proposal_counter (id, count, last_proposal_at, celebrated_milestones, last_milestone, last_milestone_message)
VALUES ('global', 0, NOW(), '{}', NULL, NULL)
ON CONFLICT (id) DO UPDATE
SET count = 0, celebrated_milestones = '{}', last_milestone = NULL, last_milestone_message = NULL, updated_at = NOW();

-- 2. Audit Log Table
CREATE TABLE IF NOT EXISTS proposal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount INTEGER NOT NULL CHECK (amount > 0),
  new_total INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'button',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE proposal_counter ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view proposal counter" ON proposal_counter;
CREATE POLICY "Public can view proposal counter"
  ON proposal_counter FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public can view proposal logs" ON proposal_logs;
CREATE POLICY "Public can view proposal logs"
  ON proposal_logs FOR SELECT TO public USING (true);

-- 4. Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'proposal_counter'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE proposal_counter;
  END IF;
END $$;

-- 5. Helper Function: get_milestone_phrase
CREATE OR REPLACE FUNCTION get_milestone_phrase(p_milestone INT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_phrases TEXT[] := ARRAY[
    'abhi toh aur puchenge',
    'haa keh diya tha?',
    'mummy se bhi puchenge',
    'puchta rahunga',
    'thak jaane ke baad bhi puchunga',
    'haan kehne ke baad bhi puchunga',
    'parutty ki permission bhi toh leni hai',
    'ab nah keh diya toh kidnap karenge'
  ];
  v_idx INT;
BEGIN
  IF p_milestone = 10 THEN RETURN 'abhi toh aur puchenge';
  ELSIF p_milestone = 20 THEN RETURN 'haa keh diya tha?';
  ELSIF p_milestone = 30 THEN RETURN 'mummy se bhi puchenge';
  ELSIF p_milestone = 40 THEN RETURN 'puchta rahunga';
  ELSIF p_milestone = 50 THEN RETURN 'thak jaane ke baad bhi puchunga';
  ELSIF p_milestone = 60 THEN RETURN 'haan kehne ke baad bhi puchunga';
  ELSIF p_milestone = 70 THEN RETURN 'parutty ki permission bhi toh leni hai';
  ELSIF p_milestone = 80 THEN RETURN 'ab nah keh diya toh kidnap karenge';
  ELSE
    -- Randomise among the 8 phrases for any 10th milestone > 80
    v_idx := floor(random() * 8 + 1)::INT;
    RETURN v_phrases[v_idx];
  END IF;
END;
$$;

-- 6. Atomic RPC: increment_proposal_counter
-- Triggers a message strictly at every 10th proposal (10, 20, 30...)
CREATE OR REPLACE FUNCTION increment_proposal_counter(
  amount_to_add INT,
  p_source TEXT DEFAULT 'button'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_count INT;
  v_new_count INT;
  v_now TIMESTAMPTZ := NOW();
  v_celebrated INT[];
  v_newly_crossed INT[] := '{}';
  v_highest_new_milestone INT := NULL;
  v_message TEXT := NULL;
  m INT;
  v_start10 INT;
  v_result JSONB;
BEGIN
  IF amount_to_add IS NULL OR amount_to_add < 1 THEN
    RAISE EXCEPTION 'Increment amount must be a positive whole number (received %)', amount_to_add;
  END IF;

  INSERT INTO proposal_counter (id, count, last_proposal_at, celebrated_milestones)
  VALUES ('global', 0, v_now, '{}')
  ON CONFLICT (id) DO NOTHING;

  -- Atomic row lock
  SELECT count, celebrated_milestones
  INTO v_old_count, v_celebrated
  FROM proposal_counter
  WHERE id = 'global'
  FOR UPDATE;

  v_new_count := v_old_count + amount_to_add;

  -- Find every 10th milestone crossed in (v_old_count, v_new_count]
  v_start10 := (floor(v_old_count / 10)::INT + 1) * 10;
  FOR m IN v_start10..v_new_count BY 10 LOOP
    IF NOT (m = ANY(v_celebrated)) THEN
      v_newly_crossed := array_append(v_newly_crossed, m);
      v_celebrated := array_append(v_celebrated, m);
      v_highest_new_milestone := m;
    END IF;
  END LOOP;

  IF v_highest_new_milestone IS NOT NULL THEN
    v_message := get_milestone_phrase(v_highest_new_milestone);
  END IF;

  UPDATE proposal_counter
  SET
    count = v_new_count,
    last_proposal_at = v_now,
    celebrated_milestones = v_celebrated,
    last_milestone = COALESCE(v_highest_new_milestone, last_milestone),
    last_milestone_message = COALESCE(v_message, last_milestone_message),
    updated_at = v_now
  WHERE id = 'global';

  INSERT INTO proposal_logs (amount, new_total, source, created_at)
  VALUES (amount_to_add, v_new_count, p_source, v_now);

  v_result := jsonb_build_object(
    'count', v_new_count,
    'last_proposal_at', v_now,
    'celebrated_milestones', v_celebrated,
    'newly_crossed_milestone', v_highest_new_milestone,
    'milestone_message', v_message,
    'all_newly_crossed', v_newly_crossed
  );

  RETURN v_result;
END;
$$;

-- 7. Helper RPC: set_proposal_counter (Reset or specific count)
CREATE OR REPLACE FUNCTION set_proposal_counter(
  target_count INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
  v_celebrated INT[] := '{}';
  m INT;
  v_highest INT := NULL;
  v_msg TEXT := NULL;
BEGIN
  IF target_count < 0 THEN
    RAISE EXCEPTION 'Target count cannot be negative';
  END IF;

  FOR m IN 10..target_count BY 10 LOOP
    v_celebrated := array_append(v_celebrated, m);
    v_highest := m;
  END LOOP;

  IF v_highest IS NOT NULL THEN
    v_msg := get_milestone_phrase(v_highest);
  END IF;

  UPDATE proposal_counter
  SET
    count = target_count,
    last_proposal_at = v_now,
    celebrated_milestones = v_celebrated,
    last_milestone = v_highest,
    last_milestone_message = v_msg,
    updated_at = v_now
  WHERE id = 'global';

  RETURN jsonb_build_object(
    'count', target_count,
    'last_proposal_at', v_now,
    'celebrated_milestones', v_celebrated,
    'last_milestone', v_highest,
    'last_milestone_message', v_msg
  );
END;
$$;
