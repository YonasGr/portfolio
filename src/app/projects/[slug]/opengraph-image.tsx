import { getProject, projects } from "@/lib/content";
import { loadOgFonts, ogSize, renderOg } from "@/lib/og";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const fonts = await loadOgFonts();
  return renderOg({
    title: project?.name ?? site.name,
    subtitle: project?.tagline,
    eyebrow: project ? `${project.category}, ${project.year}` : undefined,
    amharic: site.nameAmharic,
    fonts,
  });
}
