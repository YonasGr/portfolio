import type { ImageMetadata } from "astro";

export interface Social {
  name: string;
  url: string;
  handle?: string;
  icon?: string;
  showInHero?: boolean;
  showInContact?: boolean;
}

export interface Stat {
  label: string;
  value: string;
}

export interface Availability {
  status: string;
  badgeText?: string;
  openTo?: string[];
}

export interface CareerItem {
  company: string;
  role: string;
  period: string;
  type?: string;
  location?: string;
  description: string;
  achievements?: string[];
  skills?: string[];
}

export type Metric = string | { label: string; value: string };

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  featured?: boolean;
  year: string;
  impact?: string;
  metrics?: Metric[];
  highlights?: string[];
  tech: string[];
  platforms?: string[];
  link?: string;
  github?: string;
  images: string[];
}

export interface ResolvedProject extends Project {
  primaryImage: ImageMetadata | null;
}

export interface TechSkill {
  name: string;
  icon: string;
  tier: string;
  level?: number;
  description?: string;
}

export interface TechCategory {
  id: string;
  title: string;
  description: string;
  skills: TechSkill[];
}
