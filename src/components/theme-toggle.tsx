import { Glyph } from "@/lib/glyph";

/** Wired up by the inline theme script (see lib/theme.ts), so it needs no client JavaScript of its own. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Toggle light and dark theme"
      className="grid size-10 place-items-center rounded-sm border border-line transition-colors hover:border-ink"
    >
      <Glyph name="moon" className="size-5 dark:hidden" />
      <Glyph name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
