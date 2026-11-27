"use client";

import { useEffect, useRef } from "react";

/**
 * A vertical woven thread that fills as the reader's eye (a line 60% down the viewport) passes down the list.
 * It writes a CSS variable and data attributes directly, so scrolling never triggers a React render.
 * Children mark each entry with `data-thread-node`.
 */
export function Thread({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-thread-node]"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.6;
      const box = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - box.top) / box.height));
      el.style.setProperty("--p", p.toFixed(4));
      for (const n of nodes) n.dataset.on = String(n.getBoundingClientRect().top < line);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule); // highlights expanding or collapsing changes the height
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="thread">
      {children}
    </div>
  );
}
