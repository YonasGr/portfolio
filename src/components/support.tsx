import { sponsor } from "@/lib/content";
import { Glyph } from "@/lib/glyph";

/** Prominent support call-out. Renders nothing while GitHub Sponsors is hidden in home.json. */
export function Support() {
  if (!sponsor) return null;
  return (
    <section aria-labelledby="support-title" className="pt-24 md:pt-32">
      <div className="wrap">
        <div className="grid items-center gap-x-12 gap-y-8 border-[1.5px] border-ink p-8 md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <h2 id="support-title" className="h-section">
              Enjoy what I build?
            </h2>
            <p className="measure mt-4 text-lg text-ink-2 pretty">
              Sponsoring me on GitHub is the easiest way to back my work. It helps me keep building, learning and sharing.
            </p>
          </div>
          <a
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn min-h-14 justify-center border-[#BF3989] bg-[#BF3989] px-8 text-lg text-white hover:border-ink hover:bg-ink"
          >
            <Glyph name="heart" className="size-5" />
            Sponsor on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
