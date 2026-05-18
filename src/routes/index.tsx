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
import { GiftBox } from "@/components/GiftBox";
import { LevelUpScreen } from "@/components/LevelUpScreen";
import { EpilogueScene } from "@/components/EpilogueScene";
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
  const [showChapters, setShowChapters] = useState(false);

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

          <div className="mt-8 w-full max-w-2xl">
            <button
              onClick={() => {
                void audio.play("click");
                setShowChapters((v) => !v);
              }}
              className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/40 backdrop-blur-sm px-5 py-2 text-xs uppercase tracking-[0.35em] text-primary/80 hover:border-primary/80 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <span>✦ Выбор главы ✦</span>
              <span
                className={`transition-transform duration-300 ${showChapters ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>

            <div
              className={`grid transition-all duration-500 ease-out ${
                showChapters
                  ? "grid-rows-[1fr] opacity-100 mt-5"
                  : "grid-rows-[0fr] opacity-0 mt-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "I — Пробуждение", stage: "scene1" as Stage },
                    { label: "II — Огни воспоминаний", stage: "scene2" as Stage },
                    { label: "III — Тень печали", stage: "ch3-intro" as Stage },
                    { label: "IV — Великое испытание", stage: "scene3" as Stage },
                    { label: "V — Дар света", stage: "scene4" as Stage },
                    { label: "✦ Level Up ✦", stage: "level-up" as Stage },
                  ].map((ch) => (
                    <button
                      key={ch.stage}
                      onClick={() => {
                        void audio.play("click");
                        setStage(ch.stage);
                      }}
                      className="group relative rounded-xl border border-primary/30 bg-background/40 backdrop-blur-sm px-4 py-3 text-sm text-foreground/90 hover:border-primary/70 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <span className="font-display tracking-wide">{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-foreground/50">
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
            <div className="jrpg-frame mx-auto w-full max-w-3xl px-5 sm:px-8 py-5 sm:py-6 animate-rise overflow-hidden">
              <span className="jrpg-corner tl" />
              <span className="jrpg-corner tr" />
              <span className="jrpg-corner bl" />
              <span className="jrpg-corner br" />
              <div className="mb-2 flex items-center gap-2">
                <span className={`text-glow-gold font-display text-lg ${COLORS.companion}`}>
                  {scene2Intro[0].speaker}
                </span>
                <span className="h-px flex-1 bg-primary/40" />
              </div>
              <p className="text-foreground/95 leading-relaxed text-base sm:text-lg md:text-xl break-words whitespace-pre-line">
                {scene2Intro[0].text}
              </p>
            </div>
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
            onAdvance={() => advance(transformDialogue, "level-up")}
          />
        </SceneShell>
      )}

      {stage === "level-up" && (
        <LevelUpScreen
          heroClass={heroClass}
          onContinue={() => setStage("scene3")}
        />
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
        <SceneShell title="Глава V — Дар света">
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
          <div className="space-y-6 animate-rise">
            {idx === 0 ? (
              <GiftMaterialize onDone={() => setIdx(1)} />
            ) : (
              <>
                <motion.div
                  key="giftbox-reveal"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GiftBox opened={false} />
                </motion.div>
                <motion.div
                  key={`line-${idx}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx === 1 ? 0.5 : 0.1, ease: "easeOut" }}
                >
                  <DialogueBox
                    line={
                      idx === 1
                        ? catReaction[0]
                        : giftNarrator[Math.min(idx - 2, giftNarrator.length - 1)]
                    }
                    onAdvance={() => {
                      const totalLines = 1 + giftNarrator.length; // cat + narrator lines
                      if (idx < totalLines) setIdx(idx + 1);
                      else {
                        setIdx(0);
                        setStage("gift-narrator");
                      }
                    }}
                  />
                </motion.div>
              </>
            )}
          </div>
        </SceneShell>
      )}

      {/* Bridge stage just to reset idx and move to quest-complete */}
      {stage === "gift-narrator" && (
        <SceneShell title="Глава V — Дар света">
          <div className="text-center space-y-6">
            <GiftBox opened={false} />
            <div className="font-display text-2xl text-glow-gold">
              ✦ Подарок готов ✦
            </div>
            <FantasyButton onClick={() => setStage("quest-complete")}>
              Дальше
            </FantasyButton>
          </div>
        </SceneShell>
      )}

      {stage === "quest-complete" && (
        <SceneShell title="Глава V — Дар света">
          <div className="space-y-8">
            <GiftBox opened={false} />
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
        <SceneShell title="✦" bgImage={heroPortrait}>
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
        <div
          key={bgImage}
          className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none transition-opacity duration-700 ease-out opacity-100"
        >
          <img
            src={bgImage}
            alt=""
            className="max-w-full max-h-full w-auto h-auto object-contain opacity-90"
            loading="eager"
            decoding="async"
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
  const [epilogue, setEpilogue] = useState(false);
  useEffect(() => {
    void audio.play("complete");
    // Final hero burst — synced with the "Ты главный герой" line reveal
    const burstDelay = 2400;
    const t = window.setTimeout(() => {
      void import("canvas-confetti").then(({ default: confetti }) => {
        const colors = ["#f5c542", "#fff0a8", "#c084fc", "#7dd3fc", "#fb7185"];
        confetti({
          particleCount: 140,
          spread: 90,
          startVelocity: 50,
          origin: { x: 0.5, y: 0.55 },
          colors,
          scalar: 1.2,
          ticks: 260,
        });
        window.setTimeout(() => {
          confetti({
            particleCount: 70,
            spread: 120,
            startVelocity: 35,
            origin: { x: 0.5, y: 0.6 },
            colors,
            scalar: 1.0,
            shapes: ["circle"],
          });
        }, 350);
      });
    }, burstDelay);
    return () => window.clearTimeout(t);
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
          ✨ Сегодня даже кристаллы светят ярче…
        </p>
        <p className="text-foreground/90 italic">И не просто так.</p>

        <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
          <div className="text-xs uppercase tracking-widest text-accent/90 mb-1">
            🎮 Система зафиксировала событие
          </div>
          <div className="text-foreground/95">
            Повышение уровня →{" "}
            <span className="text-primary text-glow-gold font-display">35</span>
          </div>
        </div>

        <p className="text-foreground/95 leading-relaxed">
          💫 Ты — как редкий артефакт:{" "}
          <span className="text-primary text-glow-gold">
            ценный, уникальный
          </span>{" "}
          и с пассивным эффектом{" "}
          <span className="text-primary">«Радость +100 ко всем вокруг»</span>
        </p>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="text-xs uppercase tracking-widest text-primary/80 mb-2">
            Если бы жизнь была RPG:
          </div>
          <ul className="space-y-1 text-foreground/90">
            <li>— Харизма: <span className="text-primary">максимум</span></li>
            <li>— Удача: <span className="text-primary">стабильно высокая</span></li>
            <li>— Доброта: <span className="text-primary">легендарная</span></li>
            <li>— Интеллект (кодинг): <span className="text-primary">критический урон по багам</span></li>
            <li>— Сила: <span className="text-primary">хватает и на штангу, и на сложные дни</span></li>
            <li>— Уют (котики): <span className="text-primary">за пределами шкалы 🐾</span></li>
          </ul>
        </div>

        <div className="text-foreground/95 leading-relaxed space-y-1">
          <div>Пусть впереди будут:</div>
          <div>✨ светлые дороги</div>
          <div>🧭 надёжные спутники</div>
          <div>🎯 квесты, которые хочется проходить</div>
          <div>🎁 и лут, который радует</div>
        </div>

        <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4 text-foreground/90 space-y-1">
          <div className="text-xs uppercase tracking-widest text-secondary/90 mb-1">
            📈 Level Up бонусы
          </div>
          <div>— +1 уровень получен</div>
          <div>— Открыт перк: «Опыт и спокойствие»</div>
          <div>— Торт без дебаффа 🎂</div>
          <div>— Шанс на счастливые случайные встречи увеличен</div>
          <div>— Бафф: «Всё как-нибудь сложится» активирован</div>
        </div>

        <div className="rounded-lg border border-accent/40 bg-accent/5 p-4">
          <div className="text-xs uppercase tracking-widest text-accent/90 mb-1">
            ⚙ Система
          </div>
          <div className="text-foreground/95 space-y-1">
            <div>
              Получен предмет:{" "}
              <span className="text-primary">🎂 День Рождения</span>
            </div>
            <div>
              Редкость:{" "}
              <span className="text-primary text-glow-gold font-display">
                Легендарная
              </span>
            </div>
            <div>Эффект:</div>
            <div>— Восстанавливает настроение</div>
            <div>— Усиливает тепло вокруг</div>
            <div>— Призывает хороших людей рядом</div>
          </div>
        </div>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="text-primary font-display text-glow-gold mb-2">
            😼 Симба
          </div>
          <p className="text-foreground/95">«35 уровень… неплохо.»</p>
          <p className="text-foreground/80 italic mt-1">
            «Но не расслабляйся — впереди ещё много квестов»
          </p>
        </div>

        <div className="text-foreground/95 leading-relaxed text-center space-y-2 pt-2">
          <div className="text-primary">💖 И главное:</div>
          <div>Ты не просто прокачался.</div>
          <motion.div
            className="font-display text-2xl sm:text-3xl text-glow-gold relative inline-block"
            initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              textShadow: [
                "0 0 16px oklch(0.92 0.16 85 / 0.5)",
                "0 0 48px oklch(0.92 0.16 85 / 1)",
                "0 0 24px oklch(0.92 0.16 85 / 0.7)",
              ],
            }}
            transition={{
              duration: 2.4,
              delay: 1.8,
              ease: [0.22, 1, 0.36, 1],
              textShadow: { duration: 3, repeat: Infinity, repeatType: "mirror" },
            }}
          >
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none -z-10"
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: [0, 520],
                height: [0, 520],
                opacity: [0, 0.7, 0],
              }}
              transition={{ duration: 2.2, delay: 2.2, ease: "easeOut" }}
              style={{
                background:
                  "radial-gradient(circle, oklch(1 0.05 85 / 0.95) 0%, oklch(0.92 0.16 85 / 0.45) 35%, transparent 70%)",
              }}
            />
            Ты уже давно — главный герой этой истории ✨
          </motion.div>
        </div>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <FantasyButton
            onClick={() => {
              void audio.play("choice");
              setEpilogue(true);
            }}
          >
            Продолжить приключение
          </FantasyButton>
        </motion.div>

        {epilogue && <EpilogueScene />}

      </motion.div>
    </section>
  );
}
