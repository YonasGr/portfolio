/**
 * Addis Ababa time on the international and traditional Ethiopian clocks, plus the Ethiopian date.
 *
 * Plain arithmetic on purpose: Ethiopia has no daylight saving (always UTC+3), so no Intl time-zone
 * or calendar support is needed. That keeps it working on any browser, including older Android WebViews.
 */
const OFFSET_MS = 3 * 60 * 60 * 1000;

const MONTHS_EN = ["Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"];
const MONTHS_AM = ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"];

export interface AddisTime {
  /** 12-hour clock as used internationally, e.g. "3:42 PM". */
  standard: string;
  /** Traditional Ethiopian clock, which starts the day at sunrise (6:00 local = 12:00). */
  ethiopian: string;
  /** Ethiopian calendar date in English, e.g. "Hidar 12, 2019". */
  dateEn: string;
  /** Ethiopian month and day in Amharic. */
  dateAm: string;
}

/** Gregorian date to Julian Day Number. */
function julianDay(year: number, month: number, day: number) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/** Julian Day Number to Ethiopian (Amete Mihret) date. */
function toEthiopian(jdn: number) {
  const days = jdn - 1723856;
  const r = days % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  return {
    year: 4 * Math.floor(days / 1461) + Math.floor(r / 365) - Math.floor(r / 1460),
    month: Math.floor(n / 30), // 0-based
    day: (n % 30) + 1,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function addisTime(date: Date): AddisTime {
  const local = new Date(date.getTime() + OFFSET_MS); // read with the UTC getters = Addis wall clock
  const h = local.getUTCHours();
  const m = local.getUTCMinutes();
  const eth = toEthiopian(julianDay(local.getUTCFullYear(), local.getUTCMonth() + 1, local.getUTCDate()));

  return {
    standard: `${h % 12 || 12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`,
    ethiopian: `${(h + 6) % 12 || 12}:${pad(m)}`,
    dateEn: `${MONTHS_EN[eth.month]} ${eth.day}, ${eth.year}`,
    dateAm: `${MONTHS_AM[eth.month]} ${eth.day}`,
  };
}

const wrapDay = (minutes: number) => ((Math.round(minutes) % 1440) + 1440) % 1440;

/** Minutes since midnight to a 12-hour label, e.g. 905 -> "3:05 PM". */
export function clockLabel(minutes: number) {
  const m = wrapDay(minutes);
  const h = Math.floor(m / 60);
  return `${h % 12 || 12}:${pad(m % 60)} ${h < 12 ? "AM" : "PM"}`;
}

/** The same instant on the Ethiopian clock, where the day starts at sunrise (6:00 local reads 12:00). */
export function ethiopianLabel(minutes: number) {
  const m = wrapDay(minutes);
  const h = Math.floor(m / 60);
  return `${(h + 6) % 12 || 12}:${pad(m % 60)}`;
}
