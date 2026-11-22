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
export function AddisClock({
  className = "",
  inline = false,
  style,
}: {
  className?: string;
  inline?: boolean;
  style?: React.CSSProperties;
}) {
  const snap = useSyncExternalStore(subscribe, read, () => "");
  const [standard, ethiopian, dateEn, dateAm] = snap ? snap.split("|") : ["", "", "", ""];

  if (inline) {
    return (
      <p className={`flex flex-wrap gap-x-5 gap-y-1 tabular-nums ${className}`} style={style} aria-label="Current time in Addis Ababa">
        <span>
          <span className="text-ink-2">Addis Ababa </span>
          <strong>{standard || "\u00a0"}</strong>
        </span>
        <span>
          <span className="text-ink-2">Ethiopian clock </span>
          <strong>{ethiopian || "\u00a0"}</strong>
        </span>
        <span>
          <strong>{dateEn || "\u00a0"}</strong>
          {dateAm && (
            <span lang="am" className="amharic ml-2 text-ink-2">
              {dateAm}
            </span>
          )}
        </span>
      </p>
    );
  }

  return (
    <dl className={`grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 tabular-nums ${className}`} style={style}>
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
