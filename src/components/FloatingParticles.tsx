import { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * Soft, slow-drifting magical particles for the final screen background.
 * Pure SVG + framer-motion — no canvas, no perf cost.
 */
export function FloatingParticles({ count = 28 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        delay: Math.random() * 4,
        duration: 8 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 80,
        hue: Math.random() > 0.5 ? "oklch(0.92 0.16 85)" : "oklch(0.85 0.13 320)",
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: `${p.left}%`,
            bottom: -20,
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 ${p.size * 2}px ${p.hue}`,
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: [`0vh`, `-110vh`],
            x: [0, p.drift, -p.drift, 0],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}