export type ThemeChoice = "light" | "dark" | "system";

/**
 * Runs before first paint (inlined in <head>) so there is never a theme flash.
 * It also handles clicks on [data-theme-toggle], so the toggle works even if the app's JavaScript fails to load.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('theme');var m=matchMedia('(prefers-color-scheme: dark)');var d=s?s==='dark':m.matches;document.documentElement.dataset.theme=d?'dark':'light';m.addEventListener('change',function(e){if(!localStorage.getItem('theme'))document.documentElement.dataset.theme=e.matches?'dark':'light'})}catch(e){document.documentElement.dataset.theme='light'}document.addEventListener('click',function(e){var t=e.target&&e.target.closest&&e.target.closest('[data-theme-toggle]');if(!t)return;var n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(_){}})})()`;

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
