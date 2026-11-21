import { cacheLife } from "next/cache";
import { contactSocials } from "./content";

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  pushed: string; // ISO date
}

const username =
  contactSocials.find((s) => s.name === "GitHub")?.url.split("/").filter(Boolean).pop() ?? "yonasgr";

interface ApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

/**
 * Most recently pushed public repositories. Cached for hours so the page stays
 * static; set GITHUB_TOKEN to avoid the 60 req/hour limit on shared IPs.
 * Returns [] (cached only briefly) if GitHub can't be reached.
 */
export async function getRecentRepos(limit = 6): Promise<Repo[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?type=owner&sort=pushed&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const repos = (await res.json()) as ApiRepo[];
    return repos
      .filter((r) => !r.fork && !r.archived && r.name.toLowerCase() !== username.toLowerCase())
      .slice(0, limit)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        url: r.html_url,
        pushed: r.pushed_at,
      }));
  } catch {
    cacheLife("minutes"); // retry soon rather than caching the failure for hours
    return [];
  }
}
