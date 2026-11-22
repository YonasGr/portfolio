import Image from "next/image";
import desk from "@/assets/portrait-desk.webp";
import sketchbook from "@/assets/sketchbook.webp";
import { profile } from "@/lib/content";
import { ImageLightbox } from "./image-lightbox";

export function About() {
  const stat = (label: string) => profile.stats.find((s) => s.label.toLowerCase().includes(label))?.value;
  return (
    <section id="about" aria-labelledby="about-title" className="pt-24 md:pt-32">
      <div className="wrap grid gap-x-14 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="about-title" className="h-section">
            About
          </h2>
          <p className="mt-8 text-xl leading-relaxed pretty md:text-2xl md:leading-relaxed">{profile.bio}</p>

          <p className="mt-8 text-ink-2 pretty">
            {stat("years")} years in, {stat("apps")} production apps shipped, {stat("users")} people reached, working across{" "}
            {stat("technologies")} technologies.
          </p>

          <h3 className="h-sub mt-12 text-2xl">Open to</h3>
          <ul className="mt-4">
            {profile.availability.openTo.map((o) => (
              <li key={o} className="border-t border-line py-3 text-lg font-medium last:border-b">
                {o}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div className="grid grid-cols-[1.25fr_1fr] items-start gap-4 md:gap-6">
            <figure>
              <ImageLightbox
                src={sketchbook}
                alt="Sketchbook page titled My Developer Journey, with illustrations of Yonas, his tech stack and his learning roadmap"
                caption="My Developer Journey sketchbook page"
                sizes="(min-width: 1024px) 380px, 55vw"
                className="aspect-[2/3] -rotate-1 border border-line shadow-xl transition-transform duration-300 hover:rotate-0"
              />
              <figcaption className="mt-3 text-sm text-ink-2">My developer journey, sketched. Tap to enlarge.</figcaption>
            </figure>
            <figure className="mt-16">
              <div className="relative aspect-[3/4] overflow-hidden rotate-1">
                <Image
                  src={desk}
                  alt="Yonas at his desk in a red Manchester United jersey, with posters, programming books and a lit shelf behind him"
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 300px, 40vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-ink-2">At my desk.</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
