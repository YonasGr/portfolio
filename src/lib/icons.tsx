import "server-only";
import * as simpleIcons from "simple-icons";
import { glyphs, Svg } from "./glyph";

type SvgProps = { className?: string };

const bySlug = new Map(
  Object.values(simpleIcons)
    .filter((i): i is simpleIcons.SimpleIcon => typeof i === "object" && i !== null && "slug" in i)
    .map((i) => [i.slug, i.path]),
);

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
  "Buy Me a Coffee": "buymeacoffee",
  LeetCode: "leetcode",
};



/** Brand mark for a technology, rendered as inline SVG on the server. */
export function TechIcon({ name, className }: { name: string } & SvgProps) {
  const slug = skillSlugs[name];
  const d = slug ? bySlug.get(slug) : undefined;
  return d ? <Svg d={d} className={className} /> : null;
}

/** Brand mark for a social link. */
export function SocialIcon({ name, className }: { name: string } & SvgProps) {
  const key = socialSlugs[name];
  if (!key) return null;
  const d = key.startsWith("@") ? glyphs[key as "@linkedin" | "@mail"] : bySlug.get(key);
  return d ? <Svg d={d} className={className} /> : null;
}
