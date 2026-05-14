import { useEffect } from "react";
import { motion } from "framer-motion";
import { audio } from "@/lib/audio";

/**
 * Cinematic sequence: collected memories rise out of an inventory bar,
 * orbit a glowing core, and merge into a fully formed gift box.
 * Auto-completes after ~7s by calling onDone.
 */
export function GiftMaterialize({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t1 = window.setTimeout(() => void audio.play("collect"), 1800);
    const t2 = window.setTimeout(() => void audio.play("collect"), 3200);
    const t3 = window.setTimeout(() => void audio.play("complete"), 5400);
    const t4 = window.setTimeout(onDone, 7400);
    return () => {
      [t1, t2, t3, t4].forEach((t) => window.clearTimeout(t));
    };
  }, [onDone]);

  const memories = [
    { label: "Тёплое воспоминание", angleStart: -140 },
    { label: "Искренний смех", angleStart: -20 },
    { label: "Счастливый момент", angleStart: 100 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-xl aspect-square">
      {/* Inventory label */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: [0, 1, 1, 0], y: 0 }}
        transition={{ duration: 3, times: [0, 0.15, 0.7, 1] }}
        className="absolute top-2 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em] text-primary/90 text-glow-gold"
      >
        ✦ Собранные воспоминания ✦
      </motion.div>

      {/* Central core */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ width: 8, height: 8, opacity: 0 }}
        animate={{
          width: [8, 24, 80, 140, 180],
          height: [8, 24, 80, 140, 180],
          opacity: [0, 0.5, 0.9, 1, 0.85],
        }}
        transition={{ duration: 6, times: [0, 0.2, 0.55, 0.8, 1], ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, oklch(0.95 0.16 85 / 0.95) 0%, oklch(0.85 0.15 85 / 0.5) 45%, transparent 75%)",
          boxShadow: "0 0 80px oklch(0.92 0.16 85 / 0.8)",
        }}
      />

      {/* Memory orbs flying to center */}
      {memories.map((m, i) => {
        const startRad = (m.angleStart * Math.PI) / 180;
        const radius = 180;
        const sx = Math.cos(startRad) * radius;
        const sy = Math.sin(startRad) * radius;
        // orbit positions
        const orbit = Array.from({ length: 6 }).map((_, k) => {
          const a = startRad + (k / 6) * Math.PI * 2;
          const r = radius * (1 - k / 8);
          return { x: Math.cos(a) * r, y: Math.sin(a) * r };
        });
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full"
            initial={{ x: sx, y: sy, opacity: 0, scale: 0.5 }}
            animate={{
              x: [sx, ...orbit.map((p) => p.x), 0],
              y: [sy, ...orbit.map((p) => p.y), 0],
              opacity: [0, 1, 1, 1, 1, 1, 1, 0.9],
              scale: [0.5, 1, 1, 1, 1, 1, 1, 1.4],
            }}
            transition={{
              duration: 5,
              delay: 0.6 + i * 0.3,
              ease: "easeInOut",
            }}
            style={{
              translateX: "-50%",
              translateY: "-50%",
              background:
                "radial-gradient(circle, white 0%, oklch(0.92 0.16 85) 60%, transparent 100%)",
              boxShadow: "0 0 24px oklch(0.92 0.16 85 / 0.95)",
            }}
          >
            <motion.span
              className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-widest text-primary/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.6, delay: 0.6 + i * 0.3 }}
            >
              {m.label}
            </motion.span>
          </motion.div>
        );
      })}

      {/* Gift outline → solid materialization */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0, 0.4, 0.8, 1], scale: [0.4, 0.4, 0.85, 1.05, 1] }}
        transition={{ duration: 7, times: [0, 0.55, 0.7, 0.85, 1], ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-44 h-44 drop-shadow-[0_0_30px_oklch(0.92_0.16_85_/_0.9)]"
        >
          <defs>
            <linearGradient id="gm-box" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.10 320)" />
              <stop offset="100%" stopColor="oklch(0.55 0.15 320)" />
            </linearGradient>
            <linearGradient id="gm-rib" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.92 0.16 85)" />
              <stop offset="100%" stopColor="oklch(0.70 0.18 60)" />
            </linearGradient>
          </defs>
          <rect x="30" y="60" width="140" height="35" rx="6" fill="url(#gm-box)" />
          <rect x="92" y="60" width="16" height="35" fill="url(#gm-rib)" />
          <rect x="40" y="95" width="120" height="80" rx="6" fill="url(#gm-box)" />
          <rect x="92" y="95" width="16" height="80" fill="url(#gm-rib)" />
          <ellipse cx="80" cy="55" rx="20" ry="14" fill="url(#gm-rib)" />
          <ellipse cx="120" cy="55" rx="20" ry="14" fill="url(#gm-rib)" />
          <circle cx="100" cy="55" r="8" fill="url(#gm-rib)" />
        </svg>
      </motion.div>

      {/* Final light burst */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{
          width: [0, 0, 600],
          height: [0, 0, 600],
          opacity: [0, 0, 0.9, 0],
        }}
        transition={{ duration: 7, times: [0, 0.75, 0.82, 1], ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, oklch(1 0.05 85 / 0.95) 0%, oklch(0.92 0.16 85 / 0.4) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
