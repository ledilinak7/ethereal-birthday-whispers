import { useEffect } from "react";
import { motion } from "framer-motion";
import { audio } from "@/lib/audio";
import { FantasyButton } from "@/components/FantasyButton";
import { FloatingParticles } from "@/components/FloatingParticles";
import type { HeroClass } from "@/components/ClassSelector";

const CLASS_LABEL: Record<HeroClass, string> = {
  listener: "Слушающий ❀",
  dreamer: "Мечтатель ✦",
  guardian: "Хранитель ✜",
};

const STATS: { icon: string; name: string; value: number; flavor: string }[] = [
  { icon: "💡", name: "Интеллект (Coding Power)", value: 25, flavor: "Пишет код быстрее, чем баги успевают появляться" },
  { icon: "🎸", name: "Харизма (Guitar Aura)", value: 18, flavor: "Создаёт атмосферу за пару аккордов" },
  { icon: "🐾", name: "Эмпатия (Cat Affinity)", value: 30, flavor: "Коты выбирают его. Всегда." },
  { icon: "🏋️", name: "Сила (Deadlift Force)", value: 22, flavor: "Поднимает железо и мораль команды" },
  { icon: "🧠", name: "Мудрость (Debugging Sense)", value: 27, flavor: "Находит баг до того, как он найден" },
  { icon: "🎮", name: "Реакция (Gamer Reflex)", value: 20, flavor: "Быстро реагирует — особенно на запуск игры" },
];

const SKILLS: { icon: string; name: string; note: string }[] = [
  { icon: "🖥️", name: "Запустилось с первого раза", note: "легендарный шанс: 1%" },
  { icon: "🎸", name: "Исцеление аккордами", note: "лечит душу" },
  { icon: "🐱", name: "Кот лёг на клавиатуру", note: "останавливает работу" },
  { icon: "⚔️", name: "Ща быстро пофикшу", note: "активирует хаос" },
];

const ACHIEVEMENTS = [
  "🏆 Победитель багов (иногда)",
  "🌙 Ночной деплой выжил",
  "😼 Выбран котами",
  "🎯 Понимает, что путь важнее финала",
];

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function LevelUpScreen({
  heroClass,
  onContinue,
}: {
  heroClass: HeroClass | null;
  onContinue: () => void;
}) {
  useEffect(() => {
    void audio.play("complete");
  }, []);

  const className = heroClass ? CLASS_LABEL[heroClass] : "Странник ✧";

  return (
    <section className="relative min-h-screen flex flex-col items-center px-4 sm:px-6 py-12 animate-rise overflow-hidden">
      <FloatingParticles count={22} />

      {/* Light burst */}
      <motion.div
        className="absolute left-1/2 top-32 -translate-x-1/2 rounded-full pointer-events-none -z-10"
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: [0, 700], height: [0, 700], opacity: [0, 0.55, 0] }}
        transition={{ duration: 2.4, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, oklch(1 0.05 85 / 0.9) 0%, oklch(0.92 0.16 85 / 0.4) 35%, transparent 70%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-3xl flex flex-col items-center"
      >
        <motion.div
          variants={item}
          className="text-primary text-glow-gold tracking-[0.5em] text-xs uppercase mb-3"
        >
          ✦ Level Up ✦
        </motion.div>

        <motion.h2
          variants={item}
          className="font-display text-3xl sm:text-5xl text-glow-gold text-center"
        >
          Поздравляем!
        </motion.h2>

        <motion.div
          variants={item}
          className="mt-2 font-display text-xl sm:text-2xl text-accent text-center"
          animate={{
            textShadow: [
              "0 0 12px oklch(0.92 0.16 85 / 0.5)",
              "0 0 28px oklch(0.92 0.16 85 / 0.95)",
              "0 0 12px oklch(0.92 0.16 85 / 0.5)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          Уровень повышен: 35
        </motion.div>

        {/* Character card */}
        <motion.div
          variants={item}
          className="jrpg-frame relative mt-8 w-full px-5 sm:px-8 py-6"
        >
          <span className="jrpg-corner tl" />
          <span className="jrpg-corner tr" />
          <span className="jrpg-corner bl" />
          <span className="jrpg-corner br" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary/80">📊 Персонаж</div>
              <div className="font-display text-lg text-glow-gold">Сергей</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-primary/80">🏷️ Класс</div>
              <div className="font-display text-lg text-glow-gold">{className}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-primary/80">🐾 Компаньон</div>
              <div className="font-display text-lg text-glow-gold">
                Симба <span className="text-foreground/70 text-sm">(всегда выше)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={item}
          className="jrpg-frame relative mt-5 w-full px-5 sm:px-8 py-6"
        >
          <span className="jrpg-corner tl" />
          <span className="jrpg-corner tr" />
          <span className="jrpg-corner bl" />
          <span className="jrpg-corner br" />
          <div className="text-xs uppercase tracking-widest text-primary/80 mb-4">
            📈 Основные статы
          </div>
          <ul className="space-y-3">
            {STATS.map((s, i) => (
              <motion.li
                key={s.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
              >
                <span className="text-foreground/95 min-w-[16rem]">
                  {s.icon} {s.name}
                  <span className="ml-2 text-primary text-glow-gold font-display">
                    +{s.value}
                  </span>
                </span>
                <span className="text-foreground/70 text-sm italic">
                  «{s.flavor}»
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Skills + Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mt-5">
          <motion.div variants={item} className="jrpg-frame relative px-5 py-5">
            <span className="jrpg-corner tl" />
            <span className="jrpg-corner tr" />
            <span className="jrpg-corner bl" />
            <span className="jrpg-corner br" />
            <div className="text-xs uppercase tracking-widest text-primary/80 mb-3">
              🧩 Навыки
            </div>
            <ul className="space-y-2 text-foreground/95">
              {SKILLS.map((s) => (
                <li key={s.name}>
                  <span>{s.icon} «{s.name}»</span>
                  <span className="ml-2 text-foreground/65 text-sm italic">({s.note})</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item} className="jrpg-frame relative px-5 py-5">
            <span className="jrpg-corner tl" />
            <span className="jrpg-corner tr" />
            <span className="jrpg-corner bl" />
            <span className="jrpg-corner br" />
            <div className="text-xs uppercase tracking-widest text-primary/80 mb-3">
              🏆 Достижения
            </div>
            <ul className="space-y-2 text-foreground/95">
              {ACHIEVEMENTS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Simba reaction */}
        <motion.div
          variants={item}
          className="jrpg-frame relative mt-6 w-full px-5 sm:px-8 py-5"
        >
          <span className="jrpg-corner tl" />
          <span className="jrpg-corner tr" />
          <span className="jrpg-corner bl" />
          <span className="jrpg-corner br" />
          <div className="text-primary font-display text-glow-gold mb-2">Симба</div>
          <p className="text-foreground/95 leading-relaxed">
            «35 уровень?! Ты теперь не просто герой… Ты тот, к кому приходят за
            советом 😼»
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-10">
          <FantasyButton onClick={onContinue}>Продолжить</FantasyButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
