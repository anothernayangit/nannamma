import confetti from 'canvas-confetti';

export function fireProposalConfetti(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 35,
    spread: 60,
    origin: { x, y },
    colors: ['#047857', '#10b981', '#f59e0b', '#fbbf24', '#d97706', '#ffffff'],
    shapes: ['circle'],
    ticks: 180,
    gravity: 0.85,
    scalar: 1.1,
  });
}

export function fireMilestoneConfetti() {
  const duration = 3.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 70, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 45 * (timeLeft / duration);
    // Left cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#047857', '#10b981', '#065f46', '#f59e0b', '#fbbf24', '#ffffff']
    });
    // Right cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#047857', '#10b981', '#065f46', '#f59e0b', '#fbbf24', '#ffffff']
    });
  }, 250);
}
