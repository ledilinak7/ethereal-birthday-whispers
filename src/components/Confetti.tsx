import { useEffect } from "react";
import confetti from "canvas-confetti";

const FANTASY_COLORS = [
  "#f5c542", // gold
  "#fff0a8", // pale gold
  "#c084fc", // amethyst
  "#7dd3fc", // sky crystal
  "#fb7185", // rose
  "#86efac", // emerald
];

export function Confetti() {
  useEffect(() => {
    let raf = 0;
    let cancelled = false;

    // Opening burst — two angled cannons
    const burst = () => {
      confetti({
        particleCount: 90,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0.15, y: 0.7 },
        angle: 60,
        colors: FANTASY_COLORS,
        scalar: 1.1,
      });
      confetti({
        particleCount: 90,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0.85, y: 0.7 },
        angle: 120,
        colors: FANTASY_COLORS,
        scalar: 1.1,
      });
    };

    burst();
    const t1 = window.setTimeout(burst, 700);
    const t2 = window.setTimeout(burst, 1500);

    // Gentle continuous fall for ~6s
    const end = Date.now() + 6000;
    const fall = () => {
      if (cancelled) return;
      confetti({
        particleCount: 3,
        startVelocity: 0,
        ticks: 240,
        origin: { x: Math.random(), y: -0.05 },
        gravity: 0.45,
        scalar: 0.9,
        colors: FANTASY_COLORS,
        shapes: ["circle", "square"],
        drift: (Math.random() - 0.5) * 1.5,
      });
      if (Date.now() < end) {
        raf = window.requestAnimationFrame(fall);
      }
    };
    raf = window.requestAnimationFrame(fall);

    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}