import { contactSocials } from "@/lib/content";
import { SocialIcon } from "@/lib/icons";
import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

/** Brand colour per social: tile background and glyph colour. GitHub and X follow the theme's ink. */
const brand: Record<string, { bg: string; fg: string }> = {
  GitHub: { bg: "var(--ink)", fg: "var(--paper)" },
  LinkedIn: { bg: "#0A66C2", fg: "#fff" },
  Telegram: { bg: "#26A5E4", fg: "#fff" },
  WhatsApp: { bg: "#25D366", fg: "#fff" },
  "Twitter / X": { bg: "var(--ink)", fg: "var(--paper)" },
  Instagram: { bg: "linear-gradient(45deg, #F58529, #DD2A7B 55%, #8134AF)", fg: "#fff" },
  Facebook: { bg: "#1877F2", fg: "#fff" },
  "Buy Me a Coffee": { bg: "#FFDD00", fg: "#141B4D" },
  LeetCode: { bg: "#FFA116", fg: "#141B4D" },
};

export function Contact() {
  // Evaluated at build time: add the env vars in Vercel and redeploy to switch the form on.
  const formEnabled = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
  const others = contactSocials.filter((s) => s.name !== "Email");

  return (
    <section id="contact" aria-labelledby="contact-title" className="pt-24 md:pt-32">
      <div className="wrap">
        <h2 id="contact-title" className="h-section max-w-4xl">
          Start a conversation
        </h2>

        <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-12">
          <div className={formEnabled ? "lg:col-span-6" : "lg:col-span-12"}>
            <p className="measure text-xl text-ink-2 pretty">
              Have a product to build, a team to join or a problem to untangle? Write to me directly.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="h-sub mt-6 inline-block break-all text-[clamp(1.6rem,5vw,3.6rem)] underline decoration-2 underline-offset-[0.18em] decoration-accent hover:text-accent"
            >
              {site.email}
            </a>

            <ul className={`mt-12 grid gap-x-8 ${formEnabled ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
              {others.map((s) => (
                <li key={s.name} className="border-t border-line">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 py-4"
                  >
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-sm transition-transform group-hover:-rotate-6 group-hover:scale-105"
                      style={{ background: brand[s.name]?.bg ?? "var(--ink)", color: brand[s.name]?.fg ?? "var(--paper)" }}
                    >
                      <SocialIcon name={s.name} className="size-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">{s.name}</span>
                      <span className="block text-sm text-ink-2">{s.handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {formEnabled && (
            <div className="lg:col-span-6">
              <ContactForm />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
