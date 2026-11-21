import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/project-media";
import { adjacentProjects, getProject, projects } from "@/lib/content";
import { Glyph } from "@/lib/glyph";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = project.subtitle ? `${project.name}: ${project.subtitle}` : project.name;
  return {
    title,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: { type: "article", title, description: project.tagline, url: `/projects/${project.id}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = adjacentProjects(project.id);

  return (
    <article className="pb-8 pt-8 md:pt-12">
      <div className="wrap">
        <Link href="/#work" className="link inline-flex items-center gap-2 font-semibold">
          <Glyph name="arrowLeft" className="size-4" />
          All work
        </Link>

        <header className="mt-10 grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-ink-2">
              {project.category}, {project.year}
            </p>
            <h1 className="display mt-3 text-[clamp(3.5rem,11vw,9rem)]">{project.name}</h1>
            {project.subtitle && <p className="h-sub mt-5 text-2xl text-ink-2 md:text-3xl">{project.subtitle}</p>}
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Visit site
                <Glyph name="arrowUpRight" className="size-4" />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Source code
                <Glyph name="arrowUpRight" className="size-4" />
              </a>
            )}
          </div>
        </header>

        <div className="relative mt-12 aspect-[1200/630] overflow-hidden bg-paper-2">
          <ProjectMedia project={project} priority sizes="(min-width: 1280px) 1248px, 92vw" />
        </div>

        <div className="mt-16 grid gap-x-14 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-2xl leading-snug pretty md:text-3xl md:leading-snug">{project.tagline}</p>
            <p className="measure mt-8 text-lg pretty">{project.description}</p>
            {project.impact && (
              <div className="mt-10 border-l-4 border-accent pl-6">
                <h2 className="h-sub text-xl">Impact</h2>
                <p className="measure mt-2 pretty">{project.impact}</p>
              </div>
            )}
            {project.highlights.length > 0 && (
              <>
                <h2 className="h-sub mt-12 text-2xl">What made it interesting</h2>
                <ul className="mt-4">
                  {project.highlights.map((h) => (
                    <li key={h} className="measure border-t border-line py-4 pretty last:border-b">
                      {h}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="space-y-10 lg:col-span-5">
            {project.metrics.length > 0 && (
              <section aria-labelledby="results">
                <h2 id="results" className="h-sub text-xl">
                  Results
                </h2>
                <dl className="mt-3">
                  {project.metrics.map((m) => (
                    <div key={m.value + m.label} className="flex items-baseline justify-between gap-6 border-t border-line py-3 last:border-b">
                      <dt className="text-ink-2">{m.label}</dt>
                      <dd className="h-sub text-2xl">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
            <section aria-labelledby="built-with">
              <h2 id="built-with" className="h-sub text-xl">
                Built with
              </h2>
              <p className="mt-3 text-lg">{project.tech.join(", ")}</p>
            </section>
            {project.platforms.length > 0 && (
              <section aria-labelledby="platforms">
                <h2 id="platforms" className="h-sub text-xl">
                  Platforms
                </h2>
                <p className="mt-3 text-lg">{project.platforms.join(", ")}</p>
              </section>
            )}
          </aside>
        </div>

        <nav aria-label="More projects" className="mt-24 grid border-t border-line sm:grid-cols-2">
          <Link href={`/projects/${prev.id}`} className="group py-8 pr-6 transition-colors hover:bg-paper-2 sm:px-4">
            <span className="flex items-center gap-2 text-sm text-ink-2">
              <Glyph name="arrowLeft" className="size-4" />
              Previous
            </span>
            <span className="h-sub mt-2 block text-3xl group-hover:text-accent">{prev.name}</span>
          </Link>
          <Link href={`/projects/${next.id}`} className="group border-line py-8 transition-colors hover:bg-paper-2 sm:border-l sm:px-4 sm:text-right">
            <span className="flex items-center gap-2 text-sm text-ink-2 sm:justify-end">
              Next
              <Glyph name="arrowRight" className="size-4" />
            </span>
            <span className="h-sub mt-2 block text-3xl group-hover:text-accent">{next.name}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
