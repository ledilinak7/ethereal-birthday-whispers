export function GiftBox({ opened = false }: { opened?: boolean }) {
  return (
    <div className="relative mx-auto w-48 h-48 animate-gift-bob">
      <div className="absolute inset-0 rounded-full blur-2xl bg-primary/40 animate-pulse-glow" />
      <svg viewBox="0 0 200 200" className="relative w-full h-full drop-shadow-[0_0_25px_oklch(0.85_0.15_85_/_0.7)]">
        <defs>
          <linearGradient id="boxg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.10 320)" />
            <stop offset="100%" stopColor="oklch(0.55 0.15 320)" />
          </linearGradient>
          <linearGradient id="ribg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.92 0.16 85)" />
            <stop offset="100%" stopColor="oklch(0.70 0.18 60)" />
          </linearGradient>
        </defs>
        {/* lid */}
        <g style={{ transition: "transform 0.8s", transform: opened ? "translateY(-40px) rotate(-8deg)" : "none", transformOrigin: "100px 80px" }}>
          <rect x="30" y="60" width="140" height="35" rx="6" fill="url(#boxg)" />
          <rect x="92" y="60" width="16" height="35" fill="url(#ribg)" />
        </g>
        {/* body */}
        <rect x="40" y="95" width="120" height="80" rx="6" fill="url(#boxg)" />
        <rect x="92" y="95" width="16" height="80" fill="url(#ribg)" />
        {/* bow */}
        <g>
          <ellipse cx="80" cy="55" rx="20" ry="14" fill="url(#ribg)" />
          <ellipse cx="120" cy="55" rx="20" ry="14" fill="url(#ribg)" />
          <circle cx="100" cy="55" r="8" fill="url(#ribg)" />
        </g>
        {/* sparkles emitted on open */}
        {opened && (
          <>
            <circle cx="100" cy="40" r="3" fill="white">
              <animate attributeName="cy" from="80" to="0" dur="1.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="40" r="2" fill="oklch(0.92 0.16 85)">
              <animate attributeName="cy" from="80" to="-10" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="130" cy="40" r="2.5" fill="oklch(0.85 0.13 250)">
              <animate attributeName="cy" from="80" to="-10" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}
