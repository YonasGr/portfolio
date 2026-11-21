/**
 * Shared class tokens for the UI primitives.
 * Colors follow the design rules: neutral zinc foundation, single brand
 * accent (`accent`, defined in global.css) for the primary CTA, active
 * navigation and focus rings only.
 */

export const focusRing = [
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-accent",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white",
  "dark:focus-visible:ring-offset-zinc-950",
].join(" ");

/** Layout + states shared by every button-like control. */
export const controlBase = [
  "inline-flex shrink-0 items-center justify-center rounded-lg",
  "transition-colors cursor-pointer select-none",
  "disabled:pointer-events-none disabled:opacity-50",
  "aria-disabled:pointer-events-none aria-disabled:opacity-50",
  focusRing,
].join(" ");

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "floating";
export type ButtonSize = "sm" | "md";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-accent text-on-accent hover:opacity-90 active:opacity-80",
  secondary: [
    "border border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300",
    "dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800 dark:active:bg-zinc-700",
  ].join(" "),
  outline: [
    "border border-zinc-200 bg-transparent text-zinc-900 hover:border-zinc-300 hover:bg-zinc-100 active:bg-zinc-200",
    "dark:border-zinc-800 dark:text-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:active:bg-zinc-800",
  ].join(" "),
  ghost: [
    "border border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200",
    "dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:active:bg-zinc-800",
  ].join(" "),
  // Solid surface + shadow-sm: only for elements that float above content.
  floating: [
    "border border-zinc-200 bg-white text-zinc-900 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100",
    "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:active:bg-zinc-800",
  ].join(" "),
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-2 px-3 text-xs font-semibold [&_svg]:size-4 [&_svg]:shrink-0",
  md: "h-10 gap-2 px-4 text-sm font-semibold [&_svg]:size-4 [&_svg]:shrink-0",
};

/** Navigation link (header, mobile menu, footer). Accent only when current. */
export const navLink = [
  "rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors",
  "hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200",
  "dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 dark:active:bg-zinc-800",
  "aria-[current=true]:text-accent",
  focusRing,
].join(" ");

/** Tier-1 / tier-2 / tier-3 / tier-4 text tokens. */
export const text = {
  title: "text-zinc-900 dark:text-zinc-50",
  body: "text-zinc-700 dark:text-zinc-300",
  label: "text-zinc-500 dark:text-zinc-400",
  meta: "text-zinc-400 dark:text-zinc-500",
};

/** Elevated surface used by cards: 1px border, subtle fill, no shadow. */
export const surface =
  "rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/40";

export const surfaceHover =
  "transition-colors hover:border-zinc-300 dark:hover:border-zinc-700";
