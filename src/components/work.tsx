import Link from "next/link";
import { ViewTransition } from "react";
import { featuredProjects, otherProjects, type Project } from "@/lib/content";
import { Glyph } from "@/lib/glyph";
import { ProjectMedia } from "./project-media";

function Metrics({ project }: { project: Project }) {
  if (!project.metrics.length) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-[0.95rem]">
      {project.metrics.map((m) => (
        <li key={m.value + m.label}>
          <strong className="font-bold">{m.value}</strong> <span className="text-ink-2">{m.label}</span>
        </li>
      ))}
    </ul>
  );
}

function FeaturedRow({ project, first }: { project: Project; first: boolean }) {
  return (
    <article className="grid gap-x-12 gap-y-8 border-t border-line py-12 lg:grid-cols-12 lg:py-16">
      <ViewTransition name={`project-${project.id}`} share="morph" default="none">
        <Link
          href={`/projects/${project.id}`}
          className="group relative block aspect-[1200/630] overflow-hidden bg-paper-2 lg:col-span-7"
          aria-label={`${project.name}: read the case study`}
          tabIndex={-1}
        >
          <ProjectMedia
            project={project}
            priority={first}
            sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 92vw"
          />
        </Link>
      </ViewTransition>

      <div className="flex flex-col lg:col-span-5">
        <p className="text-[0.95rem] text-ink-2">
          {project.category}, {project.year}
        </p>
        <h3 className="h-sub mt-2 text-4xl md:text-5xl">
          <Link href={`/projects/${project.id}`} className="hover:text-accent">
            {project.name}
          </Link>
        </h3>
        {project.subtitle && <p className="mt-1 text-lg text-ink-2">{project.subtitle}</p>}
        <p className="mt-5 pretty">{project.tagline}</p>
        <Metrics project={project} />
        <p className="mt-5 text-[0.95rem] text-ink-2">{project.tech.slice(0, 6).join(", ")}</p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-semibold">
          <Link href={`/projects/${project.id}`} className="link inline-flex items-center gap-2">
            Read the case study
            <Glyph name="arrowRight" className="size-4" />
          </Link>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-2">
              Visit site
              <Glyph name="arrowUpRight" className="size-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="pt-24 md:pt-32">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="work-title" className="h-section lg:col-span-7">
            Selected work
          </h2>
          <p className="measure text-lg text-ink-2 pretty lg:col-span-5 lg:self-end">
            Products built end to end, from offline-first mobile to real-time backends and interactive 3D.
          </p>
        </div>

        <div className="mt-12">
          {featuredProjects.map((p, i) => (
            <FeaturedRow key={p.id} project={p} first={i === 0} />
          ))}
        </div>

        <div className="border-t border-line pt-10">
          <h3 className="h-sub text-2xl">More projects</h3>
          <ul className="mt-4">
            {otherProjects.map((p) => (
              <li key={p.id} className="border-t border-line first:border-0">
                <Link
                  href={`/projects/${p.id}`}
                  className="group grid items-baseline gap-x-8 gap-y-1 py-6 transition-colors hover:bg-paper-2 md:grid-cols-[5rem_1.3fr_1fr_1.4fr] md:px-3"
                >
                  <span className="tabular-nums text-ink-2">{p.year}</span>
                  <span>
                    <span className="h-sub block text-2xl group-hover:text-accent">{p.name}</span>
                    {p.subtitle && <span className="block text-[0.95rem] text-ink-2">{p.subtitle}</span>}
                  </span>
                  <span className="text-[0.95rem] text-ink-2">{p.category}</span>
                  <span className="text-[0.95rem] text-ink-2">{p.tech.slice(0, 4).join(", ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
