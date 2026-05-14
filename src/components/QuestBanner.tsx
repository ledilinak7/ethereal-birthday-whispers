export function QuestBanner({ title, complete = false }: { title: string; complete?: boolean }) {
  return (
    <div className="animate-rise mx-auto max-w-md jrpg-frame px-5 py-3 text-center">
      <span className="jrpg-corner tl" />
      <span className="jrpg-corner tr" />
      <span className="jrpg-corner bl" />
      <span className="jrpg-corner br" />
      <div className="text-xs uppercase tracking-[0.3em] text-primary/80">
        {complete ? "Quest complete" : "New quest"}
      </div>
      <div className="font-display text-xl text-glow-gold mt-1">{title}</div>
    </div>
  );
}
