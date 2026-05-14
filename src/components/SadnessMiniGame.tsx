import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";

type Frag = { id: number; left: number; top: number; size: number; delay: number };

export function SadnessMiniGame({
  total = 7,
  onComplete,
}: {
  total?: number;
  onComplete: () => void;
}) {
  const [frags] = useState<Frag[]>(() =>
    Array.from({ length: total }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 15 + Math.random() * 65,
      size: 36 + Math.random() * 28,
      delay: Math.random() * 1.2,
    })),
  );
  const [transformed, setTransformed] = useState<number[]>([]);
  const progress = transformed.length / total;

  useEffect(() => {
    if (transformed.length === total) {
      const t = setTimeout(() => {
        void audio.play("complete");
        onComplete();
      }, 900);
      return () => clearTimeout(t);
    }
  }, [transformed.length, total, onComplete]);

  const tap = (id: number) => {
    if (transformed.includes(id)) return;
    void audio.play("collect");
    setTransformed((p) => [...p, id]);
  };

  // Background brightens with progress
  const bg = `radial-gradient(ellipse at 50% 60%,
      oklch(${0.35 + progress * 0.3} ${0.10 + progress * 0.05} ${260 - progress * 180} / ${0.55 + progress * 0.35}),
      transparent 65%),
      radial-gradient(circle at 25% 30%,
      oklch(${0.30 + progress * 0.35} 0.10 ${250 - progress * 170} / ${0.45 + progress * 0.3}), transparent 55%)`;

  return (
    <div className="relative w-full h-[55vh] sm:h-[60vh] jrpg-frame overflow-hidden">
      <span className="jrpg-corner tl" />
      <span className="jrpg-corner tr" />
      <span className="jrpg-corner bl" />
      <span className="jrpg-corner br" />

      <div
        className="absolute inset-0 transition-[background] duration-700"
        style={{ background: bg }}
      />

      {frags.map((f) => {
        const done = transformed.includes(f.id);
        return (
          <button
            key={f.id}
            onClick={() => tap(f.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              animation: `float-slow ${4 + f.delay}s ease-in-out ${f.delay}s infinite`,
            }}
            aria-label={done ? "warm light" : "fragment of sadness"}
          >
            <div
              className="rounded-full transition-all duration-700"
              style={{
                width: f.size,
                height: f.size,
                background: done
                  ? "radial-gradient(circle, oklch(0.92 0.16 85 / 0.95), oklch(0.78 0.18 60 / 0.4) 60%, transparent 75%)"
                  : "radial-gradient(circle, oklch(0.65 0.10 240 / 0.85), oklch(0.40 0.08 260 / 0.4) 55%, transparent 75%)",
                boxShadow: done
                  ? "0 0 30px oklch(0.92 0.16 85 / 0.8)"
                  : "0 0 14px oklch(0.55 0.10 250 / 0.55)",
                filter: done ? "none" : "blur(0.5px)",
                opacity: done ? 1 : 0.85,
              }}
            />
          </button>
        );
      })}

      {/* HUD */}
      <div className="absolute top-3 left-3 text-sm font-display">
        <span className="text-primary/80 tracking-widest text-xs uppercase mr-2">
          Эмоциональное состояние
        </span>
        <span className="text-primary text-glow-gold">
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="absolute top-3 right-3 text-sm text-primary text-glow-gold font-display">
        ✦ {transformed.length} / {total}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-3 left-3 right-3 h-1.5 rounded-full bg-foreground/15 overflow-hidden">
        <div
          className="h-full transition-[width] duration-500"
          style={{
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, oklch(0.55 0.10 250), oklch(0.92 0.16 85))",
            boxShadow: "0 0 12px oklch(0.92 0.16 85 / 0.7)",
          }}
        />
      </div>
    </div>
  );
}