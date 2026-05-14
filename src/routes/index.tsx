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
import { GiftMaterialize } from "@/components/GiftMaterialize";
import { LevelUpScreen } from "@/components/LevelUpScreen";
import { motion } from "framer-motion";
import heroPortrait from "@/assets/hero-portrait.png";
import forestPath from "@/assets/forest-path.png";
import memoryOrb from "@/assets/memory-orb.png";
import inventoryBg from "@/assets/inventory-bg.png";
import cakeReward from "@/assets/cake-reward.png";
import sadnessSpirit from "@/assets/sadness-spirit.png";
import ch3ClassImg from "@/assets/ch3-class.png";
import ch3BossImg from "@/assets/ch3-boss.png";
import ch3TransformImg from "@/assets/ch3-transform.png";
import ch3MinigameImg from "@/assets/ch3-minigame.png";
import { ClassSelector, type HeroClass } from "@/components/ClassSelector";
import { SadnessMiniGame } from "@/components/SadnessMiniGame";

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
  | "ch3-intro"
  | "ch3-class"
  | "ch3-class-response"
  | "ch3-boss-intro"
  | "ch3-minigame"
  | "ch3-transform"
  | "scene3"
  | "scene3-response"
  | "scene4"
  | "gift-cinematic"
  | "gift-narrator"
  | "level-up"
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
  const [heroClass, setHeroClass] = useState<HeroClass | null>(null);
  const [opened, setOpened] = useState(false);

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

  const ch3Intro: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Ветер стихает. Между деревьев медленно проступает тень — мягкая, печальная, тяжёлая.",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Это… Дух Печали. Он не злой. Просто очень одинокий.",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Прежде чем подойти ближе — выбери, кем ты будешь сегодня.",
      },
    ],
    []
  );

  const classResponse: Record<HeroClass, DialogueLine[]> = useMemo(
    () => ({
      listener: [
        {
          speaker: "Симба",
          color: COLORS.companion,
          text: "Слушающий… Хороший выбор. Иногда печаль уходит сама — если её просто услышать.",
        },
      ],
      dreamer: [
        {
          speaker: "Симба",
          color: COLORS.companion,
          text: "Мечтатель! Ты умеешь превращать тяжёлое в светящееся. Сегодня это пригодится.",
        },
      ],
      guardian: [
        {
          speaker: "Симба",
          color: COLORS.companion,
          text: "Хранитель. Ты бережно держишь чувства, чтобы они не разбились. Спасибо тебе.",
        },
      ],
    }),
    []
  );

  const bossIntro: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Дух медленно приближается. Вокруг кружат прохладные синие искры — осколки чьей-то грусти.",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Не нужно сражаться. Просто коснись каждого осколка — и он станет тёплым светом.",
      },
    ],
    []
  );

  const transformDialogue: DialogueLine[] = useMemo(() => {
    const flavour: Record<HeroClass, string> = {
      listener: "Печаль кивает тебе и тихо растворяется — ей просто нужно было, чтобы кто-то побыл рядом.",
      dreamer: "Ты вдыхаешь тень — и выдыхаешь золотой свет. Грусть превращается в сны и улетает вверх.",
      guardian: "Ты держишь печаль так бережно, что она перестаёт бояться — и сама становится светом.",
    };
    return [
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Тень вздрагивает. Синие искры одна за другой загораются золотым.",
      },
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: flavour[heroClass ?? "dreamer"],
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Видишь? Иногда грусть просто хочет стать светом. Ты помог.",
      },
    ];
  }, [heroClass]);

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

  // Cat reaction right BEFORE the gift fully materializes
  const catReaction: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Подожди… я чувствую это! *уши торчком, глаза светятся*",
      },
    ],
    []
  );

  // Narrator dialogue right AFTER the gift fully materializes
  const giftNarrator: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Этот подарок… появился не просто так.",
      },
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Ты собрал его сам.",
      },
    ],
    []
  );

  const finalDialogue: DialogueLine[] = useMemo(
    () => [
      {
        speaker: "Система",
        color: "text-primary",
        text: "📜 Проверка данных…",
      },
      {
        speaker: "Система",
        color: "text-primary",
        text: "📜 Инвентарь синхронизирован.",
      },
      {
        speaker: "Система",
        color: "text-primary",
        text: "📜 Эмоциональный уровень: высокий.",
      },
      {
        speaker: "Система",
        color: "text-primary",
        text: "📜 Бонус активирован: Полная история.",
      },
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "Ты прошёл этот путь…",
      },
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "И собрал не просто свет…",
      },
      {
        speaker: "Рассказчик",
        color: COLORS.narrator,
        text: "…а моменты, которые имеют значение.",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Эй… я всё видел!",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "Ты правда круто справился.",
      },
      {
        speaker: "Симба",
        color: COLORS.companion,
        text: "И да… без меня ты бы не справился 😼",
      },
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
      {
        speaker: "Система",
        color: "text-primary",
        text: "🎮 Роль обновлена: Главный герой.",
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
            onAdvance={() => setStage("ch3-intro")}
          />
        </SceneShell>
      )}

      {/* CHAPTER III — The Shadow of Sadness */}
      {stage === "ch3-intro" && (
        <SceneShell title="Глава III — Тень печали" bgImage={sadnessSpirit}>
          <DialogueBox
            line={ch3Intro[idx]}
            onAdvance={() => advance(ch3Intro, "ch3-class")}
          />
        </SceneShell>
      )}

      {stage === "ch3-class" && (
        <SceneShell title="Глава III — Тень печали" bgImage={ch3ClassImg}>
          <div className="space-y-6">
            <div className="text-center font-display text-glow-gold text-lg">
              Выбери свой путь сердца
            </div>
            <ClassSelector
              onChoose={(c) => {
                setHeroClass(c);
                setStage("ch3-class-response");
              }}
            />
          </div>
        </SceneShell>
      )}

      {stage === "ch3-class-response" && heroClass && (
        <SceneShell title="Глава III — Тень печали" bgImage={ch3ClassImg}>
          <DialogueBox
            line={classResponse[heroClass][idx]}
            onAdvance={() =>
              advance(classResponse[heroClass], "ch3-boss-intro")
            }
          />
        </SceneShell>
      )}

      {stage === "ch3-boss-intro" && (
        <SceneShell title="Глава III — Тень печали" bgImage={ch3BossImg}>
          <DialogueBox
            line={bossIntro[idx]}
            onAdvance={() => advance(bossIntro, "ch3-minigame")}
          />
        </SceneShell>
      )}

      {stage === "ch3-minigame" && (
        <SceneShell title="Глава III — Тень печали" bgImage={ch3MinigameImg}>
          <div className="space-y-4">
            <div className="text-center text-foreground/80 text-sm">
              Касайся синих осколков — они станут тёплым светом ✦
            </div>
            <SadnessMiniGame onComplete={() => setStage("ch3-transform")} />
          </div>
        </SceneShell>
      )}

      {stage === "ch3-transform" && (
        <SceneShell title="Глава III — Тень печали" bgImage={ch3TransformImg}>
          <DialogueBox
            line={transformDialogue[idx]}
            onAdvance={() => advance(transformDialogue, "scene3")}
          />
        </SceneShell>
      )}

      {/* SCENE 3 — funny choice */}
      {stage === "scene3" && (
        <SceneShell
          title="Глава IV — Великое испытание"
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
        <SceneShell title="Глава IV — Великое испытание" bgImage={cakeReward}>
          <DialogueBox
            line={{ speaker: "Симба", color: COLORS.companion, text: choiceResp }}
            onAdvance={() => setStage("scene4")}
          />
        </SceneShell>
      )}

      {/* SCENE 4 — gift appears */}
      {stage === "scene4" && (
        <SceneShell title="Глава V — Дар света" bgImage={cakeReward}>
          <div className="space-y-8">
            <DialogueBox
              line={scene4[idx]}
              onAdvance={() => {
                if (idx + 1 < scene4.length) setIdx(idx + 1);
                else {
                  setIdx(0);
                  setStage("gift-cinematic");
                }
              }}
            />
          </div>
        </SceneShell>
      )}

      {/* CINEMATIC — memories merge into the gift */}
      {stage === "gift-cinematic" && (
        <SceneShell title="Глава V — Дар света">
          <div className="space-y-6">
            {idx === 0 ? (
              <>
                <GiftMaterialize onDone={() => setIdx(1)} />
                <DialogueBox
                  line={catReaction[0]}
                  onAdvance={() => setIdx(1)}
                  hint="✦ цепочка света... ✦"
                />
              </>
            ) : (
              <DialogueBox
                line={giftNarrator[Math.min(idx - 1, giftNarrator.length - 1)]}
                onAdvance={() => {
                  if (idx - 1 + 1 < giftNarrator.length) setIdx(idx + 1);
                  else {
                    setIdx(0);
                    setStage("gift-narrator");
                  }
                }}
              />
            )}
          </div>
        </SceneShell>
      )}

      {/* Bridge stage just to reset idx and move to quest-complete */}
      {stage === "gift-narrator" && (
        <SceneShell title="Глава V — Дар света" bgImage={cakeReward}>
          <div className="text-center space-y-6">
            <div className="font-display text-2xl text-glow-gold">
              ✦ Подарок готов ✦
            </div>
            <FantasyButton onClick={() => setStage("level-up")}>
              Дальше
            </FantasyButton>
          </div>
        </SceneShell>
      )}

      {stage === "level-up" && (
        <LevelUpScreen
          heroClass={heroClass}
          onContinue={() => setStage("quest-complete")}
        />
      )}

      {stage === "quest-complete" && (
        <SceneShell title="Глава V — Дар света" bgImage={cakeReward}>
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

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <FantasyButton
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.location.reload();
            }}
          >
            Продолжить приключение
          </FantasyButton>
          <FantasyButton
            variant="ghost"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Открыть инвентарь воспоминаний
          </FantasyButton>
        </motion.div>

      </motion.div>
    </section>
  );
}
