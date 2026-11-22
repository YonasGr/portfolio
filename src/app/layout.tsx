import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { contactSocials, projects, sponsor } from "@/lib/content";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const bricolage = localFont({
  src: "./fonts/bricolage.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const ethiopic = localFont({
  src: "./fonts/ethiopic.woff2",
  variable: "--font-ethiopic",
  weight: "100 900",
  display: "swap",
  fallback: ["serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}, ${site.title}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: ["Yonas Girma", "full-stack developer", "React Native", "Next.js", "TypeScript", "Addis Ababa", "Ethiopia"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: `${site.name} Portfolio`,
    title: `${site.name}, ${site.title}`,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: `${site.name}, ${site.title}`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f2c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} ${ethiopic.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-20 rounded-sm bg-accent px-4 py-2 font-semibold text-accent-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header sponsorUrl={sponsor?.url} />
        <main id="main">{children}</main>
        <Footer />
        <CommandPalette
          data={{
            email: site.email,
            resumeUrl: site.resumeUrl,
            projects: projects.map((p) => ({ id: p.id, name: p.name, tagline: p.tagline })),
            socials: contactSocials.filter((s) => s.name !== "Email").map((s) => ({ name: s.name, url: s.url })),
          }}
        />
        <Suspense>
          <Analytics />
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  );
}

