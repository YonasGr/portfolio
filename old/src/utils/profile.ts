import homeData from "../data/home.json";
import type { Availability, Social, Stat } from "../types";

/** Single source of truth for profile data used across components. */
export const profileName: string = homeData.name;
export const profileTitle: string = homeData.title;
export const profileLocation: string = homeData.location;
export const profileBio: string = homeData.bio || homeData.intro || "";
export const resumeUrl: string = homeData.resumeUrl || "/yonasgr-resume.pdf";
export const stats = (homeData.stats ?? []) as Stat[];
export const availability = homeData.availability as Availability | undefined;

export const socials = (homeData.socials ?? []) as Social[];

const hasUrl = (s: Social) => Boolean(s.url) && s.url !== "#";

export const heroSocials = socials.filter((s) => s.showInHero !== false && hasUrl(s));
export const contactSocials = socials.filter((s) => s.showInContact && hasUrl(s));

/** Derived from the "Email" social so the address is only defined once. */
export const email: string =
  socials.find((s) => s.name === "Email")?.handle ?? "yonasgirma222@gmail.com";
