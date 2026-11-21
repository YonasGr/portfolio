import { experience, studies, type Role } from "@/lib/content";
import { site } from "@/lib/site";
import { Glyph } from "@/lib/glyph";

function RoleEntry({ role, open = false }: { role: Role; open?: boolean }) {
  return (
    <article className="grid gap-x-10 gap-y-3 border-t border-line py-9 md:grid-cols-[9.5rem_1fr]">
      <p className="tabular-nums text-ink-2">{role.period}</p>
      <div>
        <h3 className="h-sub text-2xl md:text-3xl">{role.role}</h3>
        <p className="mt-1 font-medium">{role.organization}</p>
        <p className="mt-1 text-[0.95rem] text-ink-2">
          {[role.type, role.location].filter(Boolean).join(", ")}
        </p>
        <p className="measure mt-4 pretty">{role.description}</p>

        {role.achievements.length > 0 && (
          <details open={open} className="group mt-4">
            <summary className="link inline-flex cursor-pointer items-center gap-2 font-semibold">
              <span className="group-open:hidden">Show highlights</span>
              <span className="hidden group-open:inline">Hide highlights</span>
            </summary>
            <ul className="mt-4 space-y-3">
              {role.achievements.map((a) => (
                <li key={a} className="measure relative pl-5 pretty before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-ink">
                  {a}
                </li>
              ))}
            </ul>
          </details>
        )}

        {role.skills.length > 0 && <p className="mt-5 text-[0.95rem] text-ink-2">{role.skills.join(", ")}</p>}
      </div>
    </article>
  );
}

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="pt-24 md:pt-32">
      <div className="wrap grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="experience-title" className="h-section">
              Experience
            </h2>
            <p className="mt-5 max-w-sm text-lg text-ink-2 pretty">
              From interactive front-end work at an agency to leading mobile and full-stack products.
            </p>
            <a href={site.resumeUrl} className="btn btn-ghost mt-7" download>
              Full résumé
              <Glyph name="arrowDown" className="size-4" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-8">
          {experience.map((r, i) => (
            <RoleEntry key={r.organization + r.period} role={r} open={i === 0} />
          ))}
          <h3 className="h-sub mt-10 border-t border-line pt-9 text-2xl">Education</h3>
          {studies.map((r) => (
            <div key={r.organization} className="grid gap-x-10 gap-y-1 pt-5 md:grid-cols-[9.5rem_1fr]">
              <p className="tabular-nums text-ink-2">{r.period}</p>
              <div>
                <p className="text-xl font-semibold">{r.role}</p>
                <p className="mt-1">{r.organization}</p>
                {r.location && <p className="text-[0.95rem] text-ink-2">{r.location}</p>}
                <p className="measure mt-3 text-ink-2 pretty">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
