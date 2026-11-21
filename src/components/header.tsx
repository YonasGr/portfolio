"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Glyph } from "@/lib/glyph";
import { ThemeToggle } from "./theme-toggle";

const sections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!onHome) return;
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  const openPalette = () => window.dispatchEvent(new Event("open-palette"));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <span
            lang="am"
            aria-hidden="true"
            className="amharic grid size-9 place-items-center rounded-sm bg-cobalt text-xl leading-none text-white transition-transform group-hover:-rotate-6"
          >
            ዮ
          </span>
          <span className="h-sub text-lg">Yonas Girma</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/#${s.id}`}
                  aria-current={onHome && active === s.id ? "location" : undefined}
                  className="relative px-3 py-2 text-[0.95rem] font-medium text-ink-2 transition-colors hover:text-ink aria-[current=location]:text-ink after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform aria-[current=location]:after:scale-x-100"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="hidden h-10 items-center gap-3 rounded-sm border border-line px-3 text-sm text-ink-2 transition-colors hover:border-ink hover:text-ink sm:flex"
            aria-label="Open command menu"
          >
            <Glyph name="search" className="size-4" />
            Search
            <kbd className="rounded-sm border border-line px-1.5 text-xs font-medium">Ctrl K</kbd>
          </button>
          <button
            type="button"
            onClick={openPalette}
            className="grid size-10 place-items-center rounded-sm border border-line sm:hidden"
            aria-label="Open command menu"
          >
            <Glyph name="search" className="size-5" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-sm border border-line md:hidden"
          >
            <Glyph name={menuOpen ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper md:hidden">
          <ul className="wrap py-3">
            {sections.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/#${s.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="h-sub block border-b border-line py-4 text-2xl last:border-0"
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="progress" aria-hidden="true" />
    </header>
  );
}
