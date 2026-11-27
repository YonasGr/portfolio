"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LensProject = { id: string; name: string; skills: string[] };
type Lens = { kind: "project"; id: string } | { kind: "skill"; name: string } | null;

const LensContext = createContext<{
  lens: Lens;
  toggleSkill: (name: string) => void;
  lit: Set<string> | null;
} | null>(null);

/**
 * Links the stack to the work: pick a project to light up the tools it used,
 * or pick a tool to see which projects it shipped in. Escape clears it.
 * The chips themselves stay server-rendered (icons are server-only) and read this context.
 */
export function StackLens({ projects, children }: { projects: LensProject[]; children: React.ReactNode }) {
  const [lens, setLens] = useState<Lens>(null);

  const lit = useMemo(() => {
    if (!lens) return null;
    if (lens.kind === "skill") return new Set([lens.name]);
    return new Set(projects.find((p) => p.id === lens.id)?.skills ?? []);
  }, [lens, projects]);

  useEffect(() => {
    if (!lens) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLens(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lens]);

  const toggleSkill = (name: string) =>
    setLens((cur) => (cur?.kind === "skill" && cur.name === name ? null : { kind: "skill", name }));

  const activeProject = lens?.kind === "project" ? projects.find((p) => p.id === lens.id) : undefined;
  const skillProjects = lens?.kind === "skill" ? projects.filter((p) => p.skills.includes(lens.name)) : [];

  return (
    <LensContext value={{ lens, toggleSkill, lit }}>
      <div className="sticky top-[4.25rem] z-30 -mx-1 border-b border-line bg-paper/90 px-1 pb-3 pt-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-sm text-ink-2">Projects</span>
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {projects.map((p) => {
              const on = lens?.kind === "project" && lens.id === p.id;
              return (
                <li key={p.id} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setLens(on ? null : { kind: "project", id: p.id })}
                    className={`rounded-sm border-[1.5px] px-3 py-1 text-sm font-semibold transition-colors ${
                      on ? "border-accent bg-accent text-accent-ink" : "border-ink hover:bg-paper-2"
                    }`}
                  >
                    {p.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p aria-live="polite" className="mt-2 min-h-7 text-[0.95rem] text-ink-2">
          {!lens && "Select a project to light up its tools, or a tool to see where it shipped."}
          {activeProject && (
            <>
              <strong className="text-ink">{activeProject.name}</strong> used {activeProject.skills.length} of these tools.{" "}
              <Link href={`/projects/${activeProject.id}`} className="link font-semibold text-ink">
                Read the case study
              </Link>
            </>
          )}
          {lens?.kind === "skill" && (
            <>
              {skillProjects.length === 0 ? (
                <>No listed project uses <strong className="text-ink">{lens.name}</strong> yet.</>
              ) : (
                <>
                  <strong className="text-ink">{lens.name}</strong> shipped in{" "}
                  {skillProjects.map((p, i) => (
                    <span key={p.id}>
                      {i > 0 && (i === skillProjects.length - 1 ? " and " : ", ")}
                      <Link href={`/projects/${p.id}`} className="link font-semibold text-ink">
                        {p.name}
                      </Link>
                    </span>
                  ))}
                  .
                </>
              )}
            </>
          )}
          {lens && (
            <>
              <span className="mx-2 inline-block h-4 w-px translate-y-0.5 bg-line" aria-hidden="true" />
              <button type="button" onClick={() => setLens(null)} className="link font-semibold text-ink">
                Show all
              </button>
            </>
          )}
        </p>
      </div>
      {children}
    </LensContext>
  );
}

export function SkillChip({
  name,
  label,
  className,
  children,
}: {
  name: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(LensContext);
  const state = ctx?.lit ? (ctx.lit.has(name) ? "on" : "off") : undefined;
  const pressed = ctx?.lens?.kind === "skill" && ctx.lens.name === name;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      data-lens={state}
      onClick={() => ctx?.toggleSkill(name)}
      className={`skill lens-chip ${className}`}
    >
      {children}
    </button>
  );
}
