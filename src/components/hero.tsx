import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/portrait-mono.jpg";
import { profile } from "@/lib/content";
import { site } from "@/lib/site";
import { Glyph } from "@/lib/glyph";
import { AddisClock } from "./addis-clock";
import { Weave } from "./weave";

const delay = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative pt-8 md:pt-10">
      <div className="wrap grid items-end gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="pb-2 lg:col-span-7 lg:pb-12">
          <p className="fade-up text-xl font-medium" style={delay(0.05)}>
            <span lang="am" className="amharic text-cobalt dark:text-accent">
              ሰላም
            </span>
            , I’m
          </p>

          <h1
            id="hero-title"
            className="display mt-3 text-[clamp(5.5rem,27vw,8.5rem)] lg:text-[clamp(8rem,12.5vw,12rem)]"
            aria-label={site.name}
          >
            <span className="line-mask" aria-hidden="true">
              <span style={delay(0.15)}>Yonas</span>
            </span>
            <span className="line-mask" aria-hidden="true">
              <span style={delay(0.27)}>Girma</span>
            </span>
          </h1>

          <p className="h-sub fade-up mt-8 text-2xl md:text-3xl balance" style={delay(0.7)}>
            {profile.title}
          </p>
          <p className="fade-up mt-4 measure text-lg text-ink-2 pretty" style={delay(0.8)}>
            {profile.headline}
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={delay(0.9)}>
            <Link href="/#contact" className="btn btn-primary">
              Start a conversation
            </Link>
            <a href={site.resumeUrl} className="btn btn-ghost" download>
              Résumé
              <Glyph name="arrowDown" className="size-4" />
            </a>
          </div>

          {profile.availability.status === "available" && (
            <p className="fade-up mt-7 flex items-center gap-3 text-[0.95rem] text-ink-2" style={delay(1)}>
              <span className="relative flex size-2.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-leaf" />
              </span>
              {profile.availability.badgeText}
            </p>
          )}
        </div>

        <figure className="lg:col-span-5 lg:pb-12">
          <div className="relative aspect-[4/5] overflow-hidden bg-cobalt lg:aspect-auto lg:h-[min(56vh,33rem)]" style={delay(0.25)}>
            <Image
              src={portrait}
              alt={`Portrait of ${site.name}`}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="object-cover object-[50%_35%] mix-blend-screen brightness-110 contrast-125"
            />
            <span className="curtain curtain-up" aria-hidden="true" />
          </div>
          <figcaption className="fade-up mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4" style={delay(1.1)}>
            <p lang="am" className="amharic text-4xl leading-none sm:text-5xl">
              {site.nameAmharic}
            </p>
            <AddisClock className="text-sm" />
          </figcaption>
        </figure>
      </div>

      <div className="mt-6 lg:mt-0">
        <Weave animate />
      </div>
    </section>
  );
}
