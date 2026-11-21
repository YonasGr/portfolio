/** The tibeb-style woven band: the site's single decorative motif. */
export function Weave({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  const svg = (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`block w-full ${className}`}
      height="34"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="weave-diamond" width="34" height="34" patternUnits="userSpaceOnUse">
          <path d="M17 7 L27 17 L17 27 L7 17 Z" fill="#F2B124" />
          <path d="M17 12 L22 17 L17 22 L12 17 Z" fill="#141B4D" />
        </pattern>
      </defs>
      <rect width="100%" height="34" fill="#2B3FF2" />
      <rect y="0" width="100%" height="3" fill="#F2B124" />
      <rect y="3" width="100%" height="3" fill="#DD4B2F" />
      <rect y="6" width="100%" height="3" fill="#1E8559" />
      <rect y="9" width="100%" height="16" fill="url(#weave-diamond)" />
      <rect y="25" width="100%" height="3" fill="#1E8559" />
      <rect y="28" width="100%" height="3" fill="#DD4B2F" />
      <rect y="31" width="100%" height="3" fill="#F2B124" />
    </svg>
  );

  if (!animate) return svg;
  return (
    <div className="relative overflow-hidden" style={{ "--d": "1.2s" } as React.CSSProperties}>
      {svg}
      <span className="curtain curtain-right" aria-hidden="true" />
    </div>
  );
}
