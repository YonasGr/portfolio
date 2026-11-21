/**
 * Generated cover for projects without a real screenshot.
 * Built from the same tibeb-style weave as the rest of the site and seeded by
 * the project id, so every project gets a stable, distinct pattern.
 */
const PALETTE = ["#2B3FF2", "#F2B124", "#DD4B2F", "#1E8559", "#F4F5F1", "#141B4D"] as const;
const MOTIFS = ["diamond", "cross", "zigzag"] as const;

function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

/** Motifs are drawn for a 44px tile. */
function motifPath(kind: (typeof MOTIFS)[number]) {
  switch (kind) {
    case "diamond":
      return "M22 4 L40 22 L22 40 L4 22 Z";
    case "cross":
      return "M18 6h8v12h12v8h-12v12h-8v-12h-12v-8h12z";
    case "zigzag":
      return "M4 30 L22 12 L40 30 L40 38 L22 20 L4 38 Z";
  }
}

export function CoverArt({ seed, className }: { seed: string; className?: string }) {
  const next = rng(seed);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(next() * list.length)]!;
  const W = 1200;
  const H = 630;
  const heights = [10, 18, 30, 54, 84, 120];

  type Band = { y: number; h: number; fill: string; motif?: (typeof MOTIFS)[number]; accent?: string };
  const bands: Band[] = [];
  let y = 0;
  let prev = "";
  while (y < H) {
    const h = Math.min(pick(heights), H - y);
    let fill = pick(PALETTE);
    while (fill === prev) fill = pick(PALETTE);
    prev = fill;
    const isMotif = h >= 54 && next() > 0.45;
    bands.push(
      isMotif
        ? { y, h, fill: "#141B4D", motif: pick(MOTIFS), accent: pick(["#F2B124", "#F4F5F1", "#DD4B2F"] as const) }
        : { y, h, fill },
    );
    y += h;
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        {bands.map(
          (b, i) =>
            b.motif && (
              <pattern key={i} id={`${seed}-p${i}`} x="0" y={b.y + (b.h - 44) / 2} width="44" height="44" patternUnits="userSpaceOnUse">
                <path d={motifPath(b.motif)} fill={b.accent} />
              </pattern>
            ),
        )}
      </defs>
      {bands.map((b, i) => (
        <g key={i}>
          <rect x="0" y={b.y} width={W} height={b.h} fill={b.fill} />
          {b.motif && (
            <rect x="0" y={b.y + (b.h - 44) / 2} width={W} height="44" fill={`url(#${seed}-p${i})`} />
          )}
        </g>
      ))}
    </svg>
  );
}
