import { useEffect, useState } from "react";
import { Typewriter } from "./Typewriter";
import { audio } from "@/lib/audio";

export type DialogueLine = {
  speaker: string;
  text: string;
  color?: string; // tailwind class for speaker name color
};

export function DialogueBox({
  line,
  onAdvance,
  hint = "Нажми, чтобы продолжить ▾",
}: {
  line: DialogueLine;
  onAdvance: () => void;
  hint?: string;
}) {
  const [done, setDone] = useState(false);
  useEffect(() => setDone(false), [line]);

  const handleClick = () => {
    void audio.play("tick");
    if (!done) setDone(true);
    else onAdvance();
  };

  return (
    <div
      className="jrpg-frame mx-auto w-full max-w-3xl px-6 sm:px-8 py-6 cursor-pointer select-none animate-rise"
      onClick={handleClick}
      role="button"
    >
      <span className="jrpg-corner tl" />
      <span className="jrpg-corner tr" />
      <span className="jrpg-corner bl" />
      <span className="jrpg-corner br" />
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`text-glow-gold font-display text-lg ${line.color ?? "text-primary"}`}
        >
          {line.speaker}
        </span>
        <span className="h-px flex-1 bg-primary/40" />
      </div>
      <p className="text-foreground/95 leading-relaxed text-base sm:text-lg md:text-xl min-h-[3.5em] break-words whitespace-pre-line">
        {done ? line.text : <Typewriter text={line.text} onDone={() => setDone(true)} />}
      </p>
      <div className="mt-4 pt-2 border-t border-primary/10 flex justify-end items-center min-h-[1.25rem]">
        <span
          className={`text-[11px] sm:text-xs text-primary/80 animate-twinkle tracking-wide transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}
        >
          {hint}
        </span>
      </div>
    </div>
  );
}
