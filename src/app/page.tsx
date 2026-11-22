import { Suspense } from "react";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { GithubActivity } from "@/components/github-activity";
import { Hero } from "@/components/hero";
import { Stack } from "@/components/stack";
import { Support } from "@/components/support";
import { Work } from "@/components/work";
import { contactSocials, profile } from "@/lib/content";
import { site } from "@/lib/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.nameAmharic,
  jobTitle: profile.title,
  description: site.description,
  url: site.url,
  email: `mailto:${site.email}`,
  image: `${site.url}/opengraph-image`,
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "ET" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Haramaya University" },
  sameAs: contactSocials.filter((s) => s.name !== "Email" && s.name !== "WhatsApp").map((s) => s.url),
  knowsAbout: ["TypeScript", "React", "Next.js", "React Native", "Node.js", "Three.js", "Python", "Go"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Work />
      <Experience />
      <Stack />
      <Suspense fallback={null}>
        <GithubActivity />
      </Suspense>
      <About />
      <Contact />
      <Support />
    </>
  );
}
