import type { Metric } from "../types";

/**
 * Metrics can be authored as `{ label, value }` or as a plain string such as
 * "99.9% Crash-Free". Strings are split on the first space so the leading
 * figure becomes the value and the remainder becomes the label.
 */
export function parseMetric(metric: Metric): { value: string; label: string } {
  if (typeof metric !== "string") return metric;
  const trimmed = metric.trim();
  const i = trimmed.indexOf(" ");
  if (i === -1) return { value: trimmed, label: "" };
  return { value: trimmed.slice(0, i), label: trimmed.slice(i + 1).trim() };
}
