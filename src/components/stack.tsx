import { stack, type Tier } from "@/lib/content";
import { TechIcon } from "@/lib/icons";

const tierStyle: Record<Tier, string> = {
  daily: "bg-ink text-paper border-ink",
  advanced: "border-ink",
  proficient: "border-dashed border-ink-2 text-ink-2",
};

const tierLabel: Record<Tier, string> = {
  daily: "Daily driver",
  advanced: "Advanced",
  proficient: "Proficient",
};

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="overflow-x-clip pt-24 md:pt-32">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="stack-title" className="h-section lg:col-span-7">
            Stack
          </h2>
          <div className="lg:col-span-5 lg:self-end">
            <p className="measure text-lg text-ink-2 pretty">The tools I reach for, grouped by the job they do.</p>
            <ul className="mt-5 flex flex-wrap gap-3 text-sm" aria-label="Legend">
              {(Object.keys(tierLabel) as Tier[]).map((t) => (
                <li key={t} className={`rounded-sm border-[1.5px] px-2.5 py-1 font-medium ${tierStyle[t]}`}>
                  {tierLabel[t]}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          {stack.map((group) => (
            <div key={group.id} className="grid gap-x-12 gap-y-5 border-t border-line py-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <h3 className="h-sub text-2xl">{group.title}</h3>
                <p className="mt-2 max-w-sm text-[0.95rem] text-ink-2 pretty">{group.description}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-2.5 lg:col-span-8">
                {group.skills.map((s) => (
                  <li
                    key={s.name}
                    tabIndex={0}
                    aria-label={`${s.name}, ${tierLabel[s.tier]}${s.description ? `. ${s.description}` : ""}`}
                    className={`skill inline-flex items-center gap-2 rounded-sm border-[1.5px] px-3.5 py-2 font-medium ${tierStyle[s.tier]}`}
                  >
                    <TechIcon name={s.name} className="size-4 shrink-0" />
                    {s.name}
                    {s.description && (
                      <span className="skill-tip" aria-hidden="true">
                        {s.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
