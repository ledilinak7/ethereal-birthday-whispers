import { audio } from "@/lib/audio";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function FantasyButton({ variant = "primary", className = "", children, onClick, ...rest }: Props) {
  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-display tracking-wider text-sm uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const styles =
    variant === "primary"
      ? "bg-gradient-gold text-primary-foreground shadow-glow-gold hover:scale-[1.04] hover:brightness-110 active:scale-100"
      : "border border-primary/60 text-primary hover:bg-primary/10 hover:scale-[1.03]";
  return (
    <button
      {...rest}
      onClick={(e) => {
        void audio.play("click");
        onClick?.(e);
      }}
      className={`${base} ${styles} ${className}`}
    >
      <span className="absolute -inset-0.5 rounded-xl bg-primary/30 blur-md opacity-0 hover:opacity-100 transition pointer-events-none" />
      <span className="relative">{children}</span>
    </button>
  );
}
