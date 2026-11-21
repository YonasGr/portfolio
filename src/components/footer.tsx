import Link from "next/link";
import { site } from "@/lib/site";
import { cacheLife } from "next/cache";
import { Weave } from "./weave";

async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="mt-24">
      <Weave />
      <div className="wrap grid gap-12 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="amharic text-5xl" lang="am">
            {site.nameAmharic}
          </p>
          <p className="mt-3 max-w-xs text-ink-2">
            Designed and built by {site.name} in {site.city}, {site.country}.
          </p>
        </div>

        <p className="self-start text-[0.95rem] text-ink-2">
          Based in {site.city}, {site.country} (UTC+3). Working with teams and clients worldwide.
        </p>

        <ul className="grid grid-cols-2 content-start gap-x-6 gap-y-2 text-[0.95rem]">
          {["Work", "Experience", "Stack", "About", "Contact"].map((label) => (
            <li key={label}>
              <Link href={`/#${label.toLowerCase()}`} className="link">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a href={site.resumeUrl} className="link" download>
              Résumé
            </a>
          </li>
        </ul>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-3 border-t border-line py-6 text-sm text-ink-2">
        <p>© <Year /> {site.name}</p>
        <p>
          Built with Next.js, React and Tailwind CSS. <Link href="/#main" className="link">Back to top</Link>
        </p>
      </div>
    </footer>
  );
}
