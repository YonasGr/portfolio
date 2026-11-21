export type ThemeChoice = "light" | "dark" | "system";

/** Runs before first paint (inlined in <head>) so there is never a theme flash. */
export const themeScript = `(function(){try{var s=localStorage.getItem('theme');var m=matchMedia('(prefers-color-scheme: dark)');var d=s?s==='dark':m.matches;document.documentElement.dataset.theme=d?'dark':'light';m.addEventListener('change',function(e){if(!localStorage.getItem('theme'))document.documentElement.dataset.theme=e.matches?'dark':'light'})}catch(e){document.documentElement.dataset.theme='light'}})()`;

export function applyTheme(choice: ThemeChoice) {
  const dark = choice === "system" ? matchMedia("(prefers-color-scheme: dark)").matches : choice === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  try {
    if (choice === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", choice);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
}

export function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}
