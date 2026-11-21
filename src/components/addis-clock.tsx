"use client";

import { useSyncExternalStore } from "react";
import { addisTime } from "@/lib/ethiopia";

// The snapshot is a string that only changes when the minute does,
// so the component re-renders once a minute even though we tick every second.
const read = () => {
  const t = addisTime(new Date());
  return [t.standard, t.ethiopian, t.dateEn, t.dateAm].join("|");
};
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};

/** Live Addis Ababa time on both the international and the traditional Ethiopian clock. */
export function AddisClock({ className = "" }: { className?: string }) {
  const snap = useSyncExternalStore(subscribe, read, () => "");
  const [standard, ethiopian, dateEn, dateAm] = snap ? snap.split("|") : ["", "", "", ""];

  return (
    <dl className={`grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 tabular-nums ${className}`}>
      <dt className="text-ink-2">Addis Ababa</dt>
      <dd className="min-w-[5.5ch] font-semibold">{standard || "\u00a0"}</dd>
      <dt className="text-ink-2">Ethiopian clock</dt>
      <dd className="font-semibold">{ethiopian || "\u00a0"}</dd>
      <dt className="text-ink-2">Ethiopian date</dt>
      <dd className="font-semibold">
        {dateEn || "\u00a0"}
        {dateAm && (
          <span lang="am" className="amharic ml-2 text-ink-2">
            {dateAm}
          </span>
        )}
      </dd>
    </dl>
  );
}
