import type { StaticImageData } from "next/image";
import home from "@/data/home.json";
import careerData from "@/data/career.json";
import techData from "@/data/tech.json";
import projectsData from "@/data/projects.json";
import logosPath from "@/assets/logos-path.webp";

/* ---------- Profile ---------- */

export interface Social {
  name: string;
  url: string;
  handle: string;
  showInContact: boolean;
  showInHero: boolean;
}

export const profile = {
  name: home.name,
  title: home.title,
  headline: home.headline,
  bio: home.bio,
  availability: home.availability,
  stats: home.stats,
  socials: home.socials as Social[],
};

export const contactSocials = profile.socials.filter((s) => s.showInContact);

/* ---------- Helpers ---------- */

/** "A — B" → ["A", "B"]. Splits the template's long project titles. */
function splitTitle(title: string): [string, string | undefined] {
  const [name, ...rest] = title.split(" — ");
  return [name ?? title, rest.length ? rest.join(" — ") : undefined];
}

/** "2023 — Present" → "2023–Present". */
export const formatPeriod = (period: string) => period.replace(/\s*—\s*/g, "–");

/** "99.9% Crash-Free" → { value: "99.9%", label: "Crash-Free" }. */
export function parseMetric(metric: string): { value: string; label: string } {
  const trimmed = metric.trim();
  const i = trimmed.indexOf(" ");
  return i === -1
    ? { value: trimmed, label: "" }
    : { value: trimmed.slice(0, i), label: trimmed.slice(i + 1).trim() };
}

/* ---------- Projects ---------- */

export interface Project {
  id: string;
  name: string;
  subtitle?: string;
  tagline: string;
  description: string;
  category: string;
  featured: boolean;
  year: string;
  impact?: string;
  metrics: { value: string; label: string }[];
  highlights: string[];
  tech: string[];
  platforms: string[];
  link?: string;
  github?: string;
  /** Real screenshot if one exists; otherwise a generated cover is shown. */
  image?: StaticImageData;
}

// Only projects with a real screenshot are listed. The rest get generated
// woven covers instead of the placeholder art from the old site.
const screenshots: Record<string, StaticImageData> = {
  "logos-path": logosPath,
};

const githubProfile = profile.socials.find((s) => s.name === "GitHub")?.url;

export const projects: Project[] = projectsData.map((p) => {
  const [name, subtitle] = splitTitle(p.title);
  return {
    id: p.id,
    name,
    subtitle,
    tagline: p.tagline,
    description: p.description,
    category: p.category,
    featured: Boolean(p.featured),
    year: p.year,
    impact: p.impact,
    metrics: (p.metrics ?? []).map(parseMetric),
    highlights: p.highlights ?? [],
    tech: p.tech,
    platforms: p.platforms ?? [],
    link: p.link && p.link !== githubProfile ? p.link : undefined,
    // A bare profile URL isn't a repository, so it's not shown as a source link.
    github: p.github && p.github !== githubProfile ? p.github : undefined,
    image: screenshots[p.id],
  };
});

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
export const getProject = (id: string) => projects.find((p) => p.id === id);

export function adjacentProjects(id: string) {
  const i = projects.findIndex((p) => p.id === id);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length]!,
    next: projects[(i + 1) % projects.length]!,
  };
}

/* ---------- Experience ---------- */

export interface Role {
  organization: string;
  role: string;
  period: string;
  type?: string;
  location?: string;
  description: string;
  achievements: string[];
  skills: string[];
}

const toRole = (c: (typeof careerData)[number]): Role => ({
  organization: c.company.replace(/\s*\/\s*/g, " / "),
  role: c.role,
  period: formatPeriod(c.period),
  type: c.type,
  location: c.location?.split(" · ").join(" / "),
  description: c.description,
  achievements: c.achievements ?? [],
  skills: c.skills ?? [],
});

const isEducation = (c: (typeof careerData)[number]) => c.type === "Higher Education";
export const experience: Role[] = careerData.filter((c) => !isEducation(c)).map(toRole);
export const studies: Role[] = careerData.filter(isEducation).map(toRole);

/* ---------- Stack ---------- */

export type Tier = "daily" | "advanced" | "proficient";

export interface Skill {
  name: string;
  tier: Tier;
  description?: string;
}

export interface StackGroup {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}

const tierOf = (tier: string): Tier =>
  tier === "Advanced" ? "advanced" : tier === "Proficient" ? "proficient" : "daily";

export const stack: StackGroup[] = techData.categories.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  skills: c.skills.map((s) => ({
    name: s.name,
    tier: tierOf(s.tier),
    description: s.description,
  })),
}));
