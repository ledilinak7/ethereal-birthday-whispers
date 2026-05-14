export function ChoiceMenu({
  choices,
  onChoose,
}: {
  choices: { label: string; value: string }[];
  onChoose: (value: string) => void;
}) {
  return (
    <div className="mx-auto max-w-md jrpg-frame p-3 animate-rise">
      <span className="jrpg-corner tl" />
      <span className="jrpg-corner tr" />
      <span className="jrpg-corner bl" />
      <span className="jrpg-corner br" />
      <ul className="divide-y divide-primary/20">
        {choices.map((c) => (
          <li key={c.value}>
            <button
              onClick={() => onChoose(c.value)}
              className="group w-full text-left px-4 py-3 flex items-center gap-3 transition hover:bg-primary/10"
            >
              <span className="text-primary opacity-0 group-hover:opacity-100 transition">
                ▶
              </span>
              <span className="font-body text-base sm:text-lg">{c.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
