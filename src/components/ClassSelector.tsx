import { audio } from "@/lib/audio";

export type HeroClass = "listener" | "dreamer" | "guardian";

const CLASSES: {
  id: HeroClass;
  symbol: string;
  name: string;
  desc: string;
  glow: string;
}[] = [
  {
    id: "listener",
    symbol: "❀",
    name: "Слушающий",
    desc: "Умеет утешать печаль тишиной и вниманием.",
    glow: "oklch(0.78 0.13 200 / 0.7)",
  },
  {
    id: "dreamer",
    symbol: "✦",
    name: "Мечтатель",
    desc: "Превращает грусть в свет и сны.",
    glow: "oklch(0.85 0.16 85 / 0.75)",
  },
  {
    id: "guardian",
    symbol: "✜",
    name: "Хранитель",
    desc: "Оберегает и удерживает чувства в равновесии.",
    glow: "oklch(0.70 0.14 150 / 0.7)",
  },
];

export function ClassSelector({ onChoose }: { onChoose: (c: HeroClass) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-rise">
      {CLASSES.map((c) => (
        <button
          key={c.id}
          onClick={() => {
            void audio.play("choice");
            onChoose(c.id);
          }}
          className="jrpg-frame relative p-5 text-center group transition hover:bg-primary/5"
        >
          <span className="jrpg-corner tl" />
          <span className="jrpg-corner tr" />
          <span className="jrpg-corner bl" />
          <span className="jrpg-corner br" />
          <div
            className="mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center font-display text-3xl text-primary text-glow-gold animate-pulse-glow"
            style={{ boxShadow: `0 0 30px ${c.glow}, inset 0 0 18px ${c.glow}` }}
          >
            {c.symbol}
          </div>
          <div className="font-display text-lg text-glow-gold">{c.name}</div>
          <div className="text-sm text-foreground/80 mt-1">{c.desc}</div>
        </button>
      ))}
    </div>
  );
}