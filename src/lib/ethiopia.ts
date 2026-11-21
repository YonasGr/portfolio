import { site } from "./site";

const tz = site.timeZone;

const hour23 = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" });
const standard = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true });
const minuteOnly = new Intl.DateTimeFormat("en-US", { timeZone: tz, minute: "2-digit" });
const calendarEn = new Intl.DateTimeFormat("en-u-ca-ethiopic", { timeZone: tz, day: "numeric", month: "long", year: "numeric" });
const calendarAm = new Intl.DateTimeFormat("am-ET-u-ca-ethiopic", { timeZone: tz, day: "numeric", month: "long" });

export interface AddisTime {
  /** 12-hour clock as used internationally, e.g. "3:42 PM". */
  standard: string;
  /** Traditional Ethiopian clock, which starts the day at sunrise (6:00 local = 12:00). */
  ethiopian: string;
  /** Ethiopian calendar date in English, e.g. "Hidar 10, 2019". */
  dateEn: string;
  /** Ethiopian month and day in Amharic. */
  dateAm: string;
}

const part = (parts: Intl.DateTimeFormatPart[], type: string) =>
  parts.find((p) => p.type === type)?.value ?? "";

export function addisTime(date: Date): AddisTime {
  const h = Number(hour23.format(date)) % 24;
  const ethHour = ((h + 6) % 12) || 12;
  const minute = minuteOnly.format(date).padStart(2, "0");

  const en = calendarEn.formatToParts(date);
  const am = calendarAm.formatToParts(date);

  return {
    standard: standard.format(date),
    ethiopian: `${ethHour}:${minute}`,
    dateEn: `${part(en, "month")} ${part(en, "day")}, ${part(en, "year")}`,
    dateAm: `${part(am, "month")} ${part(am, "day")}`,
  };
}
