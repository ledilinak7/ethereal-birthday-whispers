import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audio } from "@/lib/audio";
import { DialogueBox, type DialogueLine } from "@/components/DialogueBox";
import heroSong from "@/assets/hero-song.mp3";
import heroSprite from "@/assets/hero-walking.png";

type Phase = "fadeout" | "save" | "road-intro" | "dialogue" | "silence" | "music" | "glitch" | "after";

const dialogue: DialogueLine[] = [
  { speaker: "🎮 Система", text: "Сценарий завершён", color: "text-accent" },
  { speaker: "💫 Рассказчик", text: "Это был лишь один из квестов", color: "text-secondary" },
  { speaker: "😼 Симба (off-screen)", text: "Пойдём дальше?", color: "text-primary" },
  { speaker: "😼 Симба", text: "Теперь всё только начинается 😼", color: "text-primary" },
];

export function EpilogueScene() {
  const [phase, setPhase] = useState<Phase>("fadeout");
  const [lineIdx, setLineIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const glitchTimer = useRef<number | null>(null);

  // Sequence: fadeout(1.2s) -> save chime -> road-intro(2s) -> dialogue
  useEffect(() => {
    const t1 = window.setTimeout(() => {
      void audio.play("complete");
      setPhase("save");
    }, 1200);
    const t2 = window.setTimeout(() => setPhase("road-intro"), 2400);
    const t3 = window.setTimeout(() => setPhase("dialogue"), 4400);
    return () => {
      [t1, t2, t3].forEach(clearTimeout);
    };
  }, []);

  // Auto-advance dialogue
  useEffect(() => {
    if (phase !== "dialogue") return;
    const isPause = lineIdx === 3;
    const delay = isPause ? 2600 : 3200;
    const t = window.setTimeout(() => {
      if (lineIdx < dialogue.length - 1) {
        setLineIdx((i) => i + 1);
      } else {
        setPhase("silence");
      }
    }, delay);
    return () => clearTimeout(t);
  }, [phase, lineIdx]);

  // Silence -> start hero song with fade-in
  useEffect(() => {
    if (phase !== "silence") return;
    const t = window.setTimeout(() => {
      audio.stopMusic();
      setPhase("music");
      requestAnimationFrame(() => {
        const el = audioRef.current;
        if (!el) return;
        el.volume = 0;
        void el.play().catch(() => {});
        const start = performance.now();
        const fade = (now: number) => {
          const p = Math.min(1, (now - start) / 3000);
          if (el) el.volume = p * 0.85;
          if (p < 1) requestAnimationFrame(fade);
        };
        requestAnimationFrame(fade);
      });
    }, 1600);
    return () => clearTimeout(t);
  }, [phase]);

  // When song starts -> schedule easter egg glitch
  useEffect(() => {
    if (phase !== "music") return;
    glitchTimer.current = window.setTimeout(() => setPhase("glitch"), 10000);
    return () => {
      if (glitchTimer.current) clearTimeout(glitchTimer.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "glitch") return;
    const t = window.setTimeout(() => setPhase("after"), 4200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-[#0a0612]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Chapter title */}
      <header className="absolute top-6 left-0 right-0 text-center z-10 animate-rise pointer-events-none">
        <div className="font-display text-primary/80 tracking-[0.4em] text-xs uppercase">
          ✦ Эпилог ✦
        </div>
        <div className="mx-auto mt-2 h-px w-32 bg-primary/40" />
      </header>

      {/* Save chime flash */}
      <AnimatePresence>
        {phase === "save" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute w-[60vmin] h-[60vmin] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.95 0.12 70 / 0.7), transparent 60%)",
                filter: "blur(20px)",
              }}
            />
            <div className="font-display text-glow-gold text-xl tracking-widest text-primary/90 relative">
              ✦ Прогресс сохранён ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Road scene (appears at road-intro and stays) */}
      <AnimatePresence>
        {(phase === "road-intro" ||
          phase === "dialogue" ||
          phase === "silence" ||
          phase === "music" ||
          phase === "glitch" ||
          phase === "after") && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: phase === "glitch" ? "hue-rotate(8deg) contrast(1.1)" : "none",
            }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <RoadScene phase={phase} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogue */}
      <AnimatePresence mode="wait">
        {phase === "dialogue" && (
          <motion.div
            key={lineIdx}
            className="absolute inset-x-0 bottom-[12vh] flex justify-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="jrpg-frame mx-auto w-full max-w-3xl px-5 sm:px-8 py-5 sm:py-6 overflow-hidden text-center">
              <span className="jrpg-corner tl" />
              <span className="jrpg-corner tr" />
              <span className="jrpg-corner bl" />
              <span className="jrpg-corner br" />
              <div className="mb-2 flex items-center gap-2">
                <span className={`text-glow-gold font-display text-lg ${dialogue[lineIdx].color}`}>
                  {dialogue[lineIdx].speaker}
                </span>
                <span className="h-px flex-1 bg-primary/40" />
              </div>
              <p className="text-foreground/95 leading-relaxed text-base sm:text-lg md:text-xl min-h-[3.5em] break-words whitespace-pre-line">
                {dialogue[lineIdx].text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero sprite + final on-screen text (appear together with the song) */}
      <AnimatePresence>
        {(phase === "music" || phase === "glitch" || phase === "after") && (
          <motion.div
            className="absolute inset-x-0 bottom-[14vh] flex flex-col items-center px-6 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.4, ease: "easeOut" }}
          >
            <motion.img
              src={heroSprite}
              alt=""
              className="w-[34vmin] max-w-[280px] h-auto select-none"
              style={{
                imageRendering: "pixelated",
                filter:
                  "drop-shadow(0 8px 16px rgba(0,0,0,0.55)) drop-shadow(0 0 22px oklch(0.9 0.15 70 / 0.45))",
              }}
              animate={{ y: [0, -4, 0, -4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.4, delay: 0.8 }}
            >
              <div className="font-display text-2xl sm:text-3xl text-glow-gold text-primary/95 leading-relaxed">
                История ещё не дописана…
              </div>
              <div className="font-display text-xl sm:text-2xl text-glow-gold text-accent/90 mt-2">
                Продолжение следует ✨
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter-egg glitch overlay */}
      <AnimatePresence>
        {phase === "glitch" && (
          <>
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.1, 0.5, 0] }}
              transition={{ duration: 1.2, times: [0, 0.2, 0.4, 0.6, 1] }}
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent 0 2px, oklch(0.95 0.15 70 / 0.15) 2px 3px)",
              }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-[3vh] flex justify-center px-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0.85, 0] }}
              transition={{ duration: 4, times: [0, 0.15, 0.75, 1] }}
            >
              <div className="text-center backdrop-blur-sm bg-background/20 rounded-xl px-6 py-3 border border-accent/30">
                <div className="text-accent/80 text-sm font-display tracking-wider">
                  🎮 Система: …обнаружен скрытый путь
                </div>
                <div className="text-primary/70 text-xs italic mt-1">
                  😼 Симба: «Ты заметил? 😼»
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={heroSong} loop className="hidden" />
    </motion.div>
  );
}

function RoadScene({ phase }: { phase: Phase }) {
  const showSecretPath = phase === "glitch";
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky / sunset gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #2a1340 0%, #6b2a4a 25%, #d96a3a 55%, #f0a868 75%, #f8d8a0 90%, #fff0d0 100%)",
        }}
      />
      {/* Sun glow on horizon */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: "38%",
          width: "60vmin",
          height: "60vmin",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, oklch(0.95 0.15 75 / 0.95) 0%, oklch(0.85 0.18 60 / 0.7) 30%, transparent 65%)",
          filter: "blur(2px)",
        }}
        animate={{
          opacity: showSecretPath ? [0.9, 1, 0.9] : [0.75, 0.9, 0.75],
          scale: showSecretPath ? [1, 1.08, 1] : [1, 1.03, 1],
        }}
        transition={{ duration: showSecretPath ? 1.6 : 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ground / road with perspective */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #4a2a3a 0%, #2a1820 60%, #1a0e18 100%)",
          }}
        />
        {/* Road shape */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.85 0.12 70 / 0.5)" />
              <stop offset="60%" stopColor="oklch(0.65 0.10 50 / 0.7)" />
              <stop offset="100%" stopColor="oklch(0.35 0.06 40 / 0.9)" />
            </linearGradient>
            <linearGradient id="secret" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.95 0.18 95 / 0.9)" />
              <stop offset="100%" stopColor="oklch(0.7 0.15 95 / 0)" />
            </linearGradient>
          </defs>
          <polygon points="48,0 52,0 70,50 30,50" fill="url(#road)" />
          {showSecretPath && (
            <motion.polygon
              points="50,0 51,0 62,50 42,50"
              fill="url(#secret)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.9, 0] }}
              transition={{ duration: 4, times: [0, 0.2, 0.75, 1] }}
            />
          )}
        </svg>
      </div>

      {/* Drifting light particles */}
      <Particles />



      {/* Camera-forward subtle zoom */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((i) => {
        const left = (i * 37) % 100;
        const delay = (i * 0.4) % 6;
        const size = 2 + ((i * 13) % 5);
        const dur = 8 + (i % 5) * 1.5;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              bottom: "20%",
              width: size,
              height: size,
              background: "oklch(0.95 0.12 80)",
              boxShadow: "0 0 10px oklch(0.95 0.15 80 / 0.9)",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-20, -300 - (i % 4) * 40],
              opacity: [0, 0.9, 0.9, 0],
              x: [0, (i % 2 === 0 ? 1 : -1) * 30],
            }}
            transition={{
              duration: dur,
              delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
