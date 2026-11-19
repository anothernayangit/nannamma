# Forever & Always — Romantic Proposal Counter Website 💍❤️

A romantic, real-time proposal counter built with **Vite, React, TypeScript, Tailwind CSS**, and a **Supabase** backend with atomic database functions.

---

## ✨ Features Implemented

### 1. Main Proposal Counter
- **Large Romantic Counter**: Displays the total proposal count in gradient rose/gold typography.
- **Main Button**: `"Yes, you asked again! 💍"`
- **Heartfelt Micro-Interactions**: Gentle harp chimes, heart-shaped confetti bursts, glowing pulsating rings, and playful confirmation messages:
  - *"Forever and always! 💖"*
  - *"Yes! A thousand times yes! 💍"*
  - *"Another magical memory recorded! ✨"*
  - *"My heart will always choose you. 🥰"*
- **Last Proposed Timestamp**: Formatted relative/calendar timestamp showing the exact moment of the latest proposal.

### 2. Manual Counter Addition Section
- **Visually Distinct Card**: Soft rose/blush card with a dashed border below the heart divider.
- **Section Heading**: `"Were there proposals we missed? 👀"`
- **Supporting Text**: `"Add the ones that happened when you weren't here to click!"`
- **Numeric Input Field**:
  - Placeholder: `"Enter number of times..."`
  - Strict client and backend validation: accepts **only positive whole numbers** ($N \ge 1$). Rejects zero, negative numbers, decimals, non-numeric strings, or empty submissions.
- **Add Button**: `"Add to our count ❤️"`
- **Action Behavior**:
  1. Reads the entered number.
  2. Atomically increments the same global counter in Supabase via Postgres RPC (`increment_proposal_counter`).
  3. Updates the counter immediately.
  4. Automatically clears the input field.
  5. Shows romantic confirmation feedback:
     - *"Every single one counts! ❤️"*
     - *"Added to the history!"*
     - *"Your dedication has been recorded. 💍"*

### 3. Persistent Milestone Messages & Popup
Celebrates relationship milestones with animated popups, fanfare, and fireworks confetti.

| Counter Reaches | Exact Milestone Message |
|---|---|
| **10** | Okay, you're really committed. ❤️ |
| **25** | This is becoming a tradition. |
| **50** | aur puchunga ❤️ |
| **100** | abhi toh aur bacha hai 😌 |
| **150** | Puchta rahunga madam! 💍 |

#### Milestone Logic:
- **Persistent Storage**: Celebrated milestones are saved in the database (`celebrated_milestones INTEGER[]`), not just local React state.
- **No Duplicate Triggers**: Milestones only trigger once when crossed.
- **Multi-Milestone Jumps**: If a manual addition crosses multiple milestones (e.g. from 0 to 100), the **highest milestone** (`100`) is displayed in the popup, while all reached milestones (10, 25, 50, 100) are marked as celebrated in the database.
- **Non-Exact Thresholds**: Jumping from 47 to 52 (+5) properly triggers the 50 milestone (`"aur puchunga ❤️"`).
- **Dedicated Celebration Card**: Below the counter, shows the latest unlocked milestone and progress toward the next one.

### 4. Database & Reliability
- **Atomic Operations**: Uses Postgres `FOR UPDATE` row locking inside `increment_proposal_counter(amount_to_add INT)` to eliminate race conditions under concurrent clicks.
- **Real-Time Synchronization**: Supabase Realtime channel (`postgres_changes`) keeps all open tabs and devices instantly synchronized.
- **Offline / Local Fallback**: Includes a BroadcastChannel-backed simulated atomic backend for local testing without database credentials.
- **Footer**: `"Some questions are worth asking a thousand times. ❤️"`

---

## 🚀 Setup & Deployment

### 1. Supabase Setup
1. Open your project on [Supabase Dashboard](https://app.supabase.com).
2. Go to the **SQL Editor** tab.
3. Paste and run the contents of [`supabase_setup.sql`](./supabase_setup.sql).
4. Go to **Project Settings -> API** and copy:
   - Project URL
   - `anon` `public` key

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Locally
```bash
npm install
npm run dev
```

### 4. Run Test Suite
```bash
npm test
```

### 5. Build for Production (Vercel)
```bash
npm run build
```
Deploy directly to Vercel with zero extra configuration. `vercel.json` is preconfigured for SPA routing and asset caching.

---

## 🧪 Verified Test Scenarios

The test suite in [`src/test/proposalCounter.test.ts`](./src/test/proposalCounter.test.ts) and [`src/test/components.test.tsx`](./src/test/components.test.tsx) validates all 8 requirements:

1. **Main button increments 49 to 50**: displays `"aur puchunga ❤️"`.
2. **Manual addition of 5 changes 47 to 52**: triggers the 50 milestone.
3. **Manual addition of 100 from 0**: triggers the highest 100 milestone (`"abhi toh aur bacha hai 😌"`).
4. **Adding 5 when count is 148**: reaches 153 and triggers the 150 milestone (`"Puchta rahunga madam! 💍"`).
5. **Refreshing the page**: retains the correct count and celebrated milestones.
6. **Two different devices / tabs**: real-time synchronization updates both devices simultaneously.
7. **Simultaneous concurrent clicks**: atomic queuing and database row-locking prevent lost updates.
8. **Invalid inputs**: zero, negative numbers, decimals, non-numeric characters, and empty submissions are rejected with user-friendly error messages.
