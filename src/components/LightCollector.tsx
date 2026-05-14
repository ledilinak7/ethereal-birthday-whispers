import { useState } from "react";
import { audio } from "@/lib/audio";

type Light = { id: number; left: number; top: number; label: string };

export function LightCollector({
  lights,
  onComplete,
}: {
  lights: { label: string }[];
  onComplete: () => void;
}) {
  const [items] = useState<Light[]>(() =>
    lights.map((l, i) => ({
      id: i,
      label: l.label,
      left: 15 + Math.random() * 70,
      top: 15 + Math.random() * 60,
    }))
  );
  const [collected, setCollected] = useState<number[]>([]);
  const [popup, setPopup] = useState<string | null>(null);

  const collect = (l: Light) => {
    if (collected.includes(l.id)) return;
    const next = [...collected, l.id];
    setCollected(next);
    setPopup(l.label);
    void audio.play("collect");
    setTimeout(() => setPopup(null), 1400);
    if (next.length === items.length) {
      setTimeout(() => void audio.play("complete"), 600);
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="relative w-full h-[55vh] sm:h-[60vh] jrpg-frame overflow-hidden">
      <span className="jrpg-corner tl" />
      <span className="jrpg-corner tr" />
      <span className="jrpg-corner bl" />
      <span className="jrpg-corner br" />

      {/* glowing forest backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 80%, oklch(0.50 0.14 280 / 0.7), transparent 55%), radial-gradient(circle at 75% 30%, oklch(0.65 0.12 250 / 0.6), transparent 55%)",
        }}
      />

      {/* lights */}
      {items.map((l) => {
        const taken = collected.includes(l.id);
        return (
          <button
            key={l.id}
            onClick={() => collect(l)}
            disabled={taken}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              left: `${l.left}%`,
              top: `${l.top}%`,
              opacity: taken ? 0 : 1,
              transform: `translate(-50%, -50%) scale(${taken ? 0.2 : 1})`,
            }}
            aria-label={l.label}
          >
            <div className="relative animate-float-slow">
              <div className="w-12 h-12 rounded-full bg-gradient-gold animate-pulse-glow" />
              <div className="absolute inset-0 rounded-full bg-white/60 blur-md" />
            </div>
          </button>
        );
      })}

      {/* HUD */}
      <div className="absolute top-3 left-3 text-sm text-primary text-glow-gold font-display">
        ✦ {collected.length} / {items.length}
      </div>

      {/* popup */}
      {popup && (
        <div className="absolute inset-x-0 top-1/3 text-center pointer-events-none animate-rise">
          <div className="inline-block jrpg-frame px-6 py-2 font-display text-xl text-glow-gold">
            ✨ {popup}
          </div>
        </div>
      )}
    </div>
  );
}
