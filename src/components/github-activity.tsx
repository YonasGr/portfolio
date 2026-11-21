import { getRecentRepos } from "@/lib/github";
import { Glyph } from "@/lib/glyph";

const month = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** Live from the GitHub API, refreshed hourly without a redeploy. Renders nothing if GitHub is unreachable. */
export async function GithubActivity() {
  const repos = await getRecentRepos(6);
  if (repos.length === 0) return null;

  return (
    <section aria-labelledby="github-title" className="pt-24 md:pt-32">
      <div className="wrap grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="github-title" className="h-section">
            On GitHub
          </h2>
          <p className="mt-5 max-w-sm text-lg text-ink-2 pretty">
            What I pushed to most recently. Pulled live from the GitHub API and refreshed hourly.
          </p>
        </div>
        <ul className="lg:col-span-8">
          {repos.map((r) => (
            <li key={r.name} className="border-t border-line first:border-0 lg:first:border-t">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-x-6 gap-y-1 py-5 transition-colors hover:bg-paper-2 sm:grid-cols-[1fr_auto] md:px-3"
              >
                <span>
                  <span className="h-sub inline-flex items-center gap-2 text-xl group-hover:text-accent">
                    {r.name}
                    <Glyph name="arrowUpRight" className="size-4 opacity-60" />
                  </span>
                  {r.description && <span className="mt-1 block text-[0.95rem] text-ink-2 pretty">{r.description}</span>}
                </span>
                <span className="text-sm tabular-nums text-ink-2 sm:text-right">
                  {[r.language, r.stars > 0 ? `${r.stars} stars` : null, month.format(new Date(r.pushed))]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
