import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MagicalBackground } from "@/components/MagicalBackground";
import { DialogueBox, type DialogueLine } from "@/components/DialogueBox";
import { QuestBanner } from "@/components/QuestBanner";
import { LightCollector } from "@/components/LightCollector";
import { ChoiceMenu } from "@/components/ChoiceMenu";

import { FantasyButton } from "@/components/FantasyButton";
import { SoundToggle } from "@/components/SoundToggle";
import { audio } from "@/lib/audio";
import { Confetti } from "@/components/Confetti";
import { FloatingParticles } from "@/components/FloatingParticles";
import { motion } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import forestPath from "@/assets/forest-path.png";
import memoryOrb from "@/assets/memory-orb.png";
import inventoryBg from "@/assets/inventory-bg.png";
import cakeReward from "@/assets/cake-reward.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "С Днём Рождения ✨ — Магическое поздравление" },
      {
        name: "description",
        content:
          "Маленькая интерактивная сказка-поздравление в стиле фэнтези JRPG: пройди квест и получи особенный подарок.",
      },
      { property: "og:title", content: "С Днём Рождения ✨" },
      { property: "og:description", content: "Интерактивное магическое поздравление." },
    ],
  }),
});

type Stage =
  | "hero"
  | "scene1"
  | "quest1"
  | "scene2"
  | "scene2-done"
  | "scene3"
  | "scene3-response"
  | "scene4"
  | "quest-complete"
  | "open"
  | "final";

const COLORS = {
  narrator: "text-accent",
  hero: "text-secondary",
  companion: "text-primary",
};

function Index() {
  const [stage, setStage] = useState<Stage>("hero");
  const confirmedName = "Сергей";
  const [choiceResp, setChoiceResp] = useState<string>("");
  const [opened, setOpened] = useState(false);
  const [saved, setSaved] = useState(false);

  // Scene dialogue scripts
  const scene1: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Ты оказываешься в странном, но красивом месте… Воздух наполнен мягким светом.",
      },
      {
        speaker: "Сергей",
        color: COLORS.hero,
        text: "Где я?.. Почему всё кажется таким… важным?",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Ты здесь не просто так. Сегодня особенный день!",
      },
    ],
    []
  );

  const scene2Intro: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Видишь эти огоньки? Собери их — каждый хранит частицу тепла.",
      },
    ],
    []
  );

  const scene2Done: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Ты справляешься отлично!",
      },
    ],
    []
  );

  const scene3Intro: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Финальное испытание! Очень серьёзное!",
      },
    ],
    []
  );

  const scene4: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Свет начинает собираться вместе…",
      },
      {
        speaker: "Сергей",
        color: COLORS.hero,
        text: "Это… для меня?",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Ты прошёл квест.",
      },
    ],
    []
  );

  const finalDialogue: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Сегодня даже кристаллы светят ярче…",
      },
      {
        speaker: "Система",
        color: "text-primary",
        text: "Получен предмет: 🎂 День Рождения. Редкость: Легендарная.",
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [stage]);

  // Start the fantasy music as soon as the user begins the adventure
  // (browsers require a user gesture before AudioContext can play).
  useEffect(() => {
    if (stage !== "hero") {
      void audio.startMusic();
    }
  }, [stage]);

  useEffect(() => {
    return () => {
      audio.stopMusic();
    };
  }, []);

  const advance = (lines: DialogueLine[], next: Stage) => {
    if (idx + 1 < lines.length) setIdx(idx + 1);
    else setStage(next);
  };

  return (
    <main className="relative min-h-screen w-full">
      <MagicalBackground />
      <SoundToggle />

      {/* HERO */}
      {stage === "hero" && (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center animate-rise">
          <SceneArt src={heroPortrait} alt="Сергей и Симба" className="w-44 h-44 sm:w-56 sm:h-56 rounded-full mb-8" round />
          <p className="uppercase tracking-[0.5em] text-primary/80 text-xs mb-4">
            ✦ Final Wishes ✦
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-glow-gold leading-tight max-w-3xl">
            Сегодня особенный день…
          </h1>
          <p className="mt-6 max-w-xl text-foreground/85 text-lg">
            Маленькая сказка, написанная только для тебя. Готов отправиться в
            путешествие?
          </p>

          <div className="mt-10">
            <FantasyButton onClick={() => setStage("scene1")}>
              Начать приключение
            </FantasyButton>
          </div>

          <div className="mt-12 text-xs text-foreground/50">
            ✧ Нажимай на диалоги, чтобы продолжать историю ✧
          </div>
        </section>
      )}

      {/* SCENE 1 */}
      {stage === "scene1" && (
        <SceneShell title="Глава I — Пробуждение" bgImage={forestPath}>
          <DialogueBox
            line={scene1[idx]}
            onAdvance={() => advance(scene1, "quest1")}
          />
        </SceneShell>
      )}

      {/* QUEST 1 BANNER */}
      {stage === "quest1" && (
        <SceneShell title="Глава I — Пробуждение" bgImage={forestPath}>
          <QuestBanner title="Найти праздничный артефакт 🎁" />
          <div className="mt-8 text-center">
            <FantasyButton onClick={() => setStage("scene2")}>
              Продолжить
            </FantasyButton>
          </div>
        </SceneShell>
      )}

      {/* SCENE 2 — collect lights */}
      {stage === "scene2" && (
        <SceneShell title="Глава II — Огни воспоминаний" bgImage={memoryOrb}>
          <div className="space-y-6">
            <DialogueBox
              line={scene2Intro[idx]}
              onAdvance={() => setIdx(scene2Intro.length)}
              hint="Собери огоньки ниже ✦"
            />
            <LightCollector
              lights={[
                { label: "Тёплое воспоминание" },
                { label: "Искренний смех" },
                { label: "Счастливый момент" },
              ]}
              onComplete={() => setStage("scene2-done")}
            />
          </div>
        </SceneShell>
      )}

      {stage === "scene2-done" && (
        <SceneShell title="Глава II — Огни воспоминаний" bgImage={memoryOrb}>
          <DialogueBox
            line={scene2Done[idx]}
            onAdvance={() => setStage("scene3")}
          />
        </SceneShell>
      )}

      {/* SCENE 3 — funny choice */}
      {stage === "scene3" && (
        <SceneShell
          title="Глава III — Великое испытание"
          bgImage={idx >= scene3Intro.length ? cakeReward : undefined}
        >
          {idx < scene3Intro.length ? (
            <DialogueBox
              line={scene3Intro[idx]}
              onAdvance={() => setIdx(idx + 1)}
            />
          ) : (
            <ChoiceMenu
              choices={[
                { label: "Съесть торт сразу 🍰", value: "1" },
                { label: "Поделиться 🤝", value: "2" },
                { label: "Сфоткать 📸", value: "3" },
              ]}
              onChoose={(v) => {
                setChoiceResp(
                  v === "1"
                    ? "Сильный ход."
                    : v === "2"
                      ? "Настоящий герой."
                      : "Контент превыше всего!"
                );
                setStage("scene3-response");
              }}
            />
          )}
        </SceneShell>
      )}

      {stage === "scene3-response" && (
        <SceneShell title="Глава III — Великое испытание" bgImage={cakeReward}>
          <DialogueBox
            line={{ speaker: "Симба", color: COLORS.companion, text: choiceResp }}
            onAdvance={() => setStage("scene4")}
          />
        </SceneShell>
      )}

      {/* SCENE 4 — gift appears */}
      {stage === "scene4" && (
        <SceneShell title="Глава IV — Дар света" bgImage={cakeReward}>
          <div className="space-y-8">
            <DialogueBox
              line={scene4[idx]}
              onAdvance={() => advance(scene4, "quest-complete")}
            />
          </div>
        </SceneShell>
      )}

      {stage === "quest-complete" && (
        <SceneShell title="Глава IV — Дар света" bgImage={cakeReward}>
          <div className="space-y-8">
            <QuestBanner title="Квест выполнен 🎉" complete />
            <div className="text-center">
              <FantasyButton onClick={() => { setOpened(true); setStage("open"); }}>
                Открыть подарок
              </FantasyButton>
            </div>
          </div>
        </SceneShell>
      )}

      {/* OPEN — gift opens, transition */}
      {stage === "open" && (
        <SceneShell title="✦" bgImage={cakeReward}>
          <div className="space-y-8">
            {idx < finalDialogue.length ? (
              <DialogueBox
                line={finalDialogue[idx]}
                onAdvance={() => advance(finalDialogue, "final")}
              />
            ) : null}
          </div>
        </SceneShell>
      )}

      {/* FINAL */}
      {stage === "final" && (
        <FinalScreen name={confirmedName} />
      )}
    </main>
  );
}

function SceneArt({
  src,
  alt,
  className = "",
  round = false,
  fit = "contain",
}: {
  src: string;
  alt: string;
  className?: string;
  round?: boolean;
  fit?: "cover" | "contain";
}) {
  return (
    <div className={`relative mx-auto overflow-hidden ${round ? "rounded-full" : "rounded-2xl"} ${className}`}
      style={{
        boxShadow:
          "0 0 40px oklch(0.85 0.15 85 / 0.45), 0 0 0 2px oklch(0.85 0.15 85 / 0.5) inset",
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"} animate-rise`}
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 55%, oklch(0.18 0.05 290 / 0.55) 100%)",
      }} />
    </div>
  );
}

function SceneShell({
  title,
  children,
  bgImage,
}: {
  title: string;
  children: React.ReactNode;
  bgImage?: string;
}) {
  return (
    <section className="relative min-h-screen flex flex-col px-4 sm:px-6 py-10">
      {bgImage && (
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <img
            src={bgImage}
            alt=""
            className="max-w-full max-h-full w-auto h-auto object-contain opacity-90 animate-rise"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, oklch(0.18 0.05 290 / 0.7) 100%)",
            }}
          />
        </div>
      )}
      <header className="relative text-center mb-6 animate-rise">
        <div className="font-display text-primary/80 tracking-[0.4em] text-xs uppercase">
          {title}
        </div>
        <div className="mx-auto mt-2 h-px w-32 bg-primary/40" />
      </header>
      <div className="relative flex-1 flex flex-col justify-end gap-6 pb-6 max-w-4xl mx-auto w-full">
        {children}
      </div>
    </section>
  );
}

function FinalScreen({ name }: { name: string }) {
  useEffect(() => {
    void audio.play("complete");
  }, []);
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center animate-rise overflow-hidden">
      <Confetti />
      <FloatingParticles />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: `url(${inventoryBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/30 to-background/80" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full flex flex-col items-center"
      >
        <motion.div
          variants={item}
          className="mb-6 text-primary text-glow-gold tracking-[0.5em] text-xs uppercase"
        >
          ✦ Легендарный момент ✦
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-4xl sm:text-6xl text-glow-gold max-w-3xl leading-tight"
        >
          <motion.span
            className="inline-block"
            animate={{
              textShadow: [
                "0 0 20px oklch(0.92 0.16 85 / 0.6)",
                "0 0 40px oklch(0.92 0.16 85 / 0.95)",
                "0 0 20px oklch(0.92 0.16 85 / 0.6)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            С днём рождения, {name} ✨
          </motion.span>
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-10 jrpg-frame max-w-2xl w-full px-6 sm:px-10 py-8 text-left space-y-5"
        >
        <span className="jrpg-corner tl" />
        <span className="jrpg-corner tr" />
        <span className="jrpg-corner bl" />
        <span className="jrpg-corner br" />

        <p className="text-accent italic">
          Сегодня даже кристаллы светят ярче…
        </p>

        <p className="text-foreground/95 leading-relaxed">
          Ты — как редкий артефакт:{" "}
          <span className="text-primary text-glow-gold">
            ценный, уникальный
          </span>{" "}
          и с бонусом к радости{" "}
          <span className="text-primary">+100 💫</span>
        </p>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="text-xs uppercase tracking-widest text-primary/80 mb-2">
            Если бы жизнь была RPG:
          </div>
          <ul className="space-y-1 text-foreground/90">
            <li>— Харизма: <span className="text-primary">максимум</span></li>
            <li>— Удача: <span className="text-primary">высокая</span></li>
            <li>— Доброта: <span className="text-primary">легендарная</span></li>
          </ul>
        </div>

        <p className="text-foreground/95 leading-relaxed">
          Пусть впереди будут только светлые дороги, надёжные спутники и
          счастливые моменты.
        </p>

        <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4 text-foreground/90 space-y-1">
          <div>— +1 уровень получен</div>
          <div>— Торт без дебаффа</div>
          <div>— Только хорошие случайные встречи</div>
        </div>

        <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
          <div className="text-xs uppercase tracking-widest text-accent/90 mb-1">
            ⚙ Система
          </div>
          <div className="text-foreground/95">
            Получен предмет: <span className="text-primary">🎂 День Рождения</span>
            <br />
            Редкость:{" "}
            <span className="text-primary text-glow-gold font-display">
              Легендарная
            </span>
          </div>
        </div>

        <p className="text-center font-display text-xl text-glow-gold pt-2">
          Ты главный герой этой истории ✨
        </p>
        </motion.div>

      </motion.div>
    </section>
  );
}
