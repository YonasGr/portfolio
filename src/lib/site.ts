import home from "@/data/home.json";

const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

/** Canonical site URL: explicit env var, then Vercel's production host, then localhost. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");

export const site = {
  name: home.name,
  nameAmharic: "ዮናስ ግርማ",
  title: home.title,
  description: home.headline,
  url: siteUrl,
  email: home.socials.find((s) => s.name === "Email")?.handle ?? "",
  resumeUrl: home.resumeUrl,
  city: "Addis Ababa",
  country: "Ethiopia",
  timeZone: "Africa/Addis_Ababa",
} as const;
