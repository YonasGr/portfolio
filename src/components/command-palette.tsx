"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Glyph } from "@/lib/glyph";
import { applyTheme } from "@/lib/theme";

export interface PaletteData {
  email: string;
  resumeUrl: string;
  projects: { id: string; name: string; tagline: string }[];
  socials: { name: string; url: string }[];
}

interface Item {
  id: string;
  group: "Go to" | "Projects" | "Actions" | "Elsewhere";
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

const sections = ["Work", "Experience", "Stack", "About", "Contact"];

export function CommandPalette({ data }: { data: PaletteData }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Keep the native <dialog> in sync with state (Esc is handled via onClose).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((o) => !o);
      }
    };
    const onOpen = () => setIsOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  const items = useMemo<Item[]>(() => {
    const go = (fn: () => void) => () => {
      setIsOpen(false);
      fn();
    };
    return [
      ...sections.map<Item>((s) => ({
        id: `go-${s}`,
        group: "Go to",
        label: s,
        run: go(() => router.push(`/#${s.toLowerCase()}`)),
      })),
      ...data.projects.map<Item>((p) => ({
        id: `p-${p.id}`,
        group: "Projects",
        label: p.name,
        hint: p.tagline,
        keywords: "project case study",
        run: go(() => router.push(`/projects/${p.id}`)),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: data.email,
        keywords: "mail contact",
        run: () => {
          navigator.clipboard?.writeText(data.email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          });
        },
      },
      {
        id: "resume",
        group: "Actions",
        label: "Open résumé",
        hint: "PDF",
        keywords: "cv resume download",
        run: go(() => window.open(data.resumeUrl, "_blank", "noopener")),
      },
      { id: "t-light", group: "Actions", label: "Light theme", keywords: "appearance", run: go(() => applyTheme("light")) },
      { id: "t-dark", group: "Actions", label: "Dark theme", keywords: "appearance night", run: go(() => applyTheme("dark")) },
      { id: "t-system", group: "Actions", label: "Match system theme", keywords: "appearance auto", run: go(() => applyTheme("system")) },
      ...data.socials.map<Item>((s) => ({
        id: `s-${s.name}`,
        group: "Elsewhere",
        label: s.name,
        keywords: "social link",
        run: go(() => window.open(s.url, "_blank", "noopener")),
      })),
    ];
  }, [data, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.keywords ?? ""}`.toLowerCase().includes(q));
  }, [items, query]);

  const active = Math.min(cursor, Math.max(results.length - 1, 0));

  useEffect(() => {
    document.getElementById(`pal-${results[active]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((active + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((active - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    }
  };

  let lastGroup = "";

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command menu"
      onClose={() => {
        setIsOpen(false);
        setQuery("");
        setCursor(0);
      }}
      onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
      className="m-auto mt-[12vh] w-[min(36rem,calc(100%-1.5rem))] overflow-hidden rounded-md border border-line bg-paper p-0 shadow-2xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Glyph name="search" className="size-5 shrink-0 text-ink-2" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="pal-list"
          aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined}
          placeholder="Jump to a section, project or action"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-ink-2"
        />
        <kbd className="shrink-0 rounded-sm border border-line px-1.5 text-xs text-ink-2">Esc</kbd>
      </div>

      <ul id="pal-list" role="listbox" className="max-h-[min(24rem,55vh)] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-8 text-center text-ink-2">Nothing matches “{query}”.</li>}
        {results.map((item, i) => {
          const header = item.group !== lastGroup;
          lastGroup = item.group;
          return (
            <li key={item.id} role="presentation">
              {header && <p className="px-3 pb-1 pt-3 text-xs font-semibold text-ink-2">{item.group}</p>}
              <div
                id={`pal-${item.id}`}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setCursor(i)}
                onClick={item.run}
                className="flex cursor-pointer items-baseline justify-between gap-4 rounded-sm px-3 py-2.5 aria-selected:bg-accent aria-selected:text-accent-ink"
              >
                <span className="shrink-0 whitespace-nowrap font-medium">
                  {item.id === "copy-email" && copied ? "Copied to clipboard" : item.label}
                </span>
                {item.hint && <span className="min-w-0 truncate text-sm opacity-70">{item.hint}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </dialog>
  );
}
