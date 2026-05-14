import { useEffect, useMemo } from "react";

export function MagicalBackground() {
  // stable star + cloud positions
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    []
  );
  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 5,
      })),
    []
  );
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        top: 5 + i * 18,
        scale: 0.6 + Math.random() * 0.8,
        opacity: 0.18 + Math.random() * 0.18,
        delay: -Math.random() * 60,
        duration: 70 + Math.random() * 50,
      })),
    []
  );

  useEffect(() => {}, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      {/* sky gradient already on body; add aurora wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, oklch(0.55 0.15 290 / 0.5), transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(0.65 0.13 250 / 0.45), transparent 60%), radial-gradient(ellipse at 50% 100%, oklch(0.85 0.10 320 / 0.4), transparent 70%)",
        }}
      />

      {/* stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}

      {/* sparkles (gold) */}
      {sparkles.map((s) => (
        <div
          key={`sp-${s.id}`}
          className="absolute animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: 6,
            height: 6,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            background:
              "radial-gradient(circle, oklch(0.92 0.16 85) 0%, transparent 70%)",
            filter: "drop-shadow(0 0 6px oklch(0.92 0.16 85))",
          }}
        />
      ))}

      {/* drifting clouds */}
      {clouds.map((c) => (
        <div
          key={`c-${c.id}`}
          className="absolute animate-drift-slow"
          style={{
            top: `${c.top}%`,
            left: 0,
            transform: `scale(${c.scale})`,
            opacity: c.opacity,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        >
          <svg width="240" height="80" viewBox="0 0 240 80" fill="none">
            <ellipse cx="60" cy="50" rx="50" ry="22" fill="white" />
            <ellipse cx="110" cy="38" rx="45" ry="26" fill="white" />
            <ellipse cx="160" cy="48" rx="55" ry="22" fill="white" />
            <ellipse cx="200" cy="52" rx="35" ry="18" fill="white" />
          </svg>
        </div>
      ))}

      {/* floating islands silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-40"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        style={{ height: "30vh" }}
      >
        <defs>
          <linearGradient id="island" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.45 0.10 280)" />
            <stop offset="100%" stopColor="oklch(0.20 0.08 285)" />
          </linearGradient>
        </defs>
        <path
          d="M0,140 C200,80 350,160 520,120 C700,80 880,180 1060,130 C1240,90 1380,150 1440,130 L1440,200 L0,200 Z"
          fill="url(#island)"
        />
      </svg>
    </div>
  );
}
