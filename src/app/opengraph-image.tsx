import { loadOgFonts, renderOg, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name}, ${site.title}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();
  return renderOg({
    title: site.name,
    subtitle: site.title,
    eyebrow: `${site.city}, ${site.country}`,
    amharic: site.nameAmharic,
    fonts,
  });
}
