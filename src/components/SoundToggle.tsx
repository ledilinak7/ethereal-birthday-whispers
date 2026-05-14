import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";

export function SoundToggle() {
  const [muted, setMuted] = useState(() => audio.isMuted());

  useEffect(() => {
    return audio.onChange(setMuted);
  }, []);

  return (
    <button
      type="button"
      onClick={() => audio.toggleMute()}
      aria-label={muted ? "Включить звук" : "Выключить звук"}
      className="fixed top-4 right-4 z-50 w-11 h-11 rounded-full border border-primary/50 bg-background/70 backdrop-blur text-primary shadow-glow-gold hover:bg-primary/10 hover:scale-105 transition flex items-center justify-center"
    >
      {muted ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}