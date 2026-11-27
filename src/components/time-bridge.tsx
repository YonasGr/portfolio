"use client";

import { useState, useSyncExternalStore } from "react";
import { clockLabel, ethiopianLabel } from "@/lib/ethiopia";

const ADDIS_OFFSET = 180; // UTC+3, no daylight saving
const DAY = 1440;
const STEP = 15;
const mod = (n: number) => ((n % DAY) + DAY) % DAY;

type Seg = { from: number; to: number };

/** Runs of 15-minute steps, in the visitor's minutes, where `test` holds for the matching Addis minute. */
function runs(shift: number, test: (addisMinute: number) => boolean): Seg[] {
  const out: Seg[] = [];
  let start = -1;
  for (let p = 0; p <= DAY; p += STEP) {
    const on = p < DAY && test(mod(p + shift));
    if (on && start < 0) start = p;
    if (!on && start >= 0) {
      out.push({ from: start, to: p });
      start = -1;
    }
  }
  return out;
}

const noop = () => () => {};
const readOffset = () => -new Date().getTimezoneOffset();
const subscribeMinute = (cb: () => void) => {
  const id = setInterval(cb, 15000);
  return () => clearInterval(id);
};
const readNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

const tickLabel = (m: number) => {
  const x = mod(m);
  return x % 60 ? clockLabel(x) : `${Math.floor(x / 60) % 12 || 12} ${x < 720 ? "AM" : "PM"}`;
};
const hourOnly = (m: number) => `${Math.floor(mod(m) / 60) % 12 || 12} ${mod(m) < 720 ? "AM" : "PM"}`;

const pct = (m: number) => `${(m / DAY) * 100}%`;

function Track({ base, segs, tone }: { base: string; segs: { list: Seg[]; className: string }[]; tone?: string }) {
  return (
    <div className={`relative h-9 overflow-hidden ${base} ${tone ?? ""}`} aria-hidden="true">
      {segs.flatMap((s, i) =>
        s.list.map((g) => (
          <span
            key={`${i}-${g.from}`}
            className={`absolute inset-y-0 ${s.className}`}
            style={{ left: pct(g.from), width: pct(g.to - g.from) }}
          />
        )),
      )}
    </div>
  );
}

/**
 * Two aligned days: the visitor's and Addis Ababa's, with the Ethiopian clock under Addis.
 * Drag across it to compare any moment. Built as a native range input, so touch and keyboard work.
 */
export function TimeBridge({ workStart, workEnd }: { workStart: number; workEnd: number }) {
  const offset = useSyncExternalStore<number | null>(noop, readOffset, () => null);
  const nowMin = useSyncExternalStore(subscribeMinute, readNow, () => 0);
  const [picked, setPicked] = useState<number | null>(null);

  if (offset === null) return <div aria-hidden="true" className="h-[24rem] sm:h-[22rem]" />;

  const d = ADDIS_OFFSET - offset; // minutes Addis is ahead of the visitor
  const p = picked ?? nowMin;
  const addisAt = mod(p + d);
  const a = workStart * 60;
  const b = workEnd * 60;
  const isNight = (m: number) => m < 360 || m >= 1080;
  const isWork = (m: number) => m >= a && m < b;

  const night = runs(d, isNight);
  const work = runs(d, isWork);

  const ahead = d / 60;
  const relation =
    d === 0
      ? "You’re on Addis Ababa time."
      : `Addis Ababa is ${Math.abs(ahead)} hour${Math.abs(ahead) === 1 ? "" : "s"} ${d > 0 ? "ahead of" : "behind"} you.`;
  const status = isWork(addisAt) ? "Inside my working day" : isNight(addisAt) ? "Night in Addis Ababa" : "Daytime, outside my working day";

  const ticks = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-x-4 tabular-nums">
        <div>
          <p className="text-sm text-ink-2">Your time</p>
          <p className="h-sub text-2xl sm:text-4xl">{clockLabel(p)}</p>
        </div>
        <div>
          <p className="text-sm text-ink-2">Addis Ababa</p>
          <p className="h-sub text-2xl sm:text-4xl">{clockLabel(addisAt)}</p>
        </div>
        <div>
          <p className="text-sm text-ink-2">Ethiopian clock</p>
          <p className="h-sub text-2xl sm:text-4xl">{ethiopianLabel(addisAt)}</p>
        </div>
      </div>

      <div className="mt-7 select-none">
        <div className="relative h-5 text-xs text-ink-2" aria-hidden="true">
          {ticks.map((h) => (
            <span
              key={h}
              className={`absolute ${h % 6 ? "max-sm:hidden" : ""} ${h === 0 ? "" : "-translate-x-1/2"}`}
              style={{ left: pct(h * 60) }}
            >
              {tickLabel(h * 60)}
            </span>
          ))}
        </div>

        <div className="relative mt-1 space-y-1">
          <Track base="bg-paper-2" segs={[{ list: work, className: "bg-saffron" }]} />
          <Track
            base="bg-paper-2"
            segs={[
              { list: night, className: "bg-ink" },
              { list: work, className: "bg-accent" },
            ]}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[-6px] w-0.5 -translate-x-1/2 bg-vermilion"
            style={{ left: pct(p) }}
          >
            <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-vermilion" />
            <span className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-vermilion" />
          </span>
          <input
            type="range"
            min={0}
            max={DAY - 1}
            step={STEP}
            value={Math.floor(p / STEP) * STEP}
            onChange={(e) => setPicked(Number(e.target.value))}
            aria-label="Compare times"
            aria-valuetext={`${clockLabel(p)} where you are, ${clockLabel(addisAt)} in Addis Ababa, ${ethiopianLabel(addisAt)} on the Ethiopian clock`}
            className="scrub"
          />
        </div>

        <div className="relative mt-1 h-10 text-xs text-ink-2 tabular-nums" aria-hidden="true">
          {ticks.map((h) => (
            <span
              key={h}
              className={`absolute text-center leading-tight ${h % 6 ? "max-sm:hidden" : ""} ${h === 0 ? "" : "-translate-x-1/2"}`}
              style={{ left: pct(h * 60) }}
            >
              {tickLabel(h * 60 + d)}
              <br />
              <span className="font-semibold text-ink">{ethiopianLabel(h * 60 + d)}</span>
            </span>
          ))}
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2" aria-hidden="true">
        <li className="flex items-center gap-2"><span className="size-3 bg-saffron" />My working day, on your clock</li>
        <li className="flex items-center gap-2"><span className="size-3 bg-accent" />My working day, in Addis</li>
        <li className="flex items-center gap-2"><span className="size-3 bg-ink" />Night in Addis</li>
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="measure text-ink-2">
          <strong className="text-ink">{status}.</strong> My working day, {hourOnly(a)} to {hourOnly(b)} in Addis, is{" "}
          {d === 0 ? "the same for you" : `${tickLabel(a - d)} to ${tickLabel(b - d)} where you are`}. {relation}
        </p>
        {picked !== null && (
          <button type="button" onClick={() => setPicked(null)} className="btn btn-ghost min-h-10 px-4 text-sm">
            Back to now
          </button>
        )}
      </div>
    </div>
  );
}
