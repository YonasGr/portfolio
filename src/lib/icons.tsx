import "server-only";
import * as simpleIcons from "simple-icons";
import { glyphs, Svg } from "./glyph";

type SvgProps = { className?: string };

const icons = Object.values(simpleIcons).filter(
  (i): i is simpleIcons.SimpleIcon => typeof i === "object" && i !== null && "slug" in i,
);
const bySlug = new Map(icons.map((i) => [i.slug, i.path]));
const hexBySlug = new Map(icons.map((i) => [i.slug, `#${i.hex}`]));

/** White glyph on dark brand colours, ink glyph on light ones, so every tile stays legible. */
function glyphOn(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r!) + 0.7152 * lin(g!) + 0.0722 * lin(b!);
  return luminance > 0.4 ? "#141B4D" : "#FFFFFF";
}

/** Skill name → simple-icons slug. Skills not listed render without an icon. */
const skillSlugs: Record<string, string> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
  "Go (Golang)": "go",
  "C++": "cplusplus",
  Rust: "rust",
  "C#": "dotnet",
  React: "react",
  "Next.js": "nextdotjs",
  Astro: "astro",
  "Three.js / WebGL": "threedotjs",
  "Tailwind CSS": "tailwindcss",
  "HTML5 & Web APIs": "html5",
  "Node.js": "nodedotjs",
  FastAPI: "fastapi",
  PostgreSQL: "postgresql",
  Supabase: "supabase",
  Redis: "redis",
  Firebase: "firebase",
  "React Native": "react",
  Flutter: "flutter",
  "Cross-Platform Storage & Sync": "sqlite",
  Docker: "docker",
  "Git & GitHub": "github",
  Vercel: "vercel",
  "Jest & Testing": "jest",
  Figma: "figma",
};

/** Social name → brand slug (simple-icons) or a UI glyph key. */
const socialSlugs: Record<string, string> = {
  GitHub: "github",
  LinkedIn: "@linkedin",
  Telegram: "telegram",
  WhatsApp: "whatsapp",
  "Twitter / X": "x",
  Instagram: "instagram",
  Facebook: "facebook",
  Email: "@mail",
  "GitHub Sponsors": "githubsponsors",
  "Buy Me a Coffee": "buymeacoffee",
  LeetCode: "leetcode",
};



/** Technology mark: the brand glyph on a tile in the technology's official colour. */
export function TechIcon({ name, className = "" }: { name: string } & SvgProps) {
  const slug = skillSlugs[name];
  const d = slug ? bySlug.get(slug) : undefined;
  const hex = slug ? hexBySlug.get(slug) : undefined;
  if (!d || !hex) return null;
  return (
    <span
      className={`grid size-6 shrink-0 place-items-center rounded-[4px] ring-1 ring-black/10 dark:ring-white/25 ${className}`}
      style={{ background: hex, color: glyphOn(hex) }}
    >
      <Svg d={d} className="size-3.5" />
    </span>
  );
}

/** Brand mark for a social link. */
export function SocialIcon({ name, className }: { name: string } & SvgProps) {
  const key = socialSlugs[name];
  if (!key) return null;
  const d = key.startsWith("@") ? glyphs[key as "@linkedin" | "@mail"] : bySlug.get(key);
  return d ? <Svg d={d} className={className} /> : null;
}
