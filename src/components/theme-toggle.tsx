"use client";

import { Glyph } from "@/lib/glyph";
import { toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      className="grid size-10 place-items-center rounded-sm border border-line transition-colors hover:border-ink"
    >
      <Glyph name="moon" className="size-5 dark:hidden" />
      <Glyph name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
