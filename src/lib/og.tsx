import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

async function readFont(file: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(process.cwd(), "src/app/fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

/** Loads the bundled fonts once at build time; 'use cache' keeps the image routes static. */
export async function loadOgFonts() {
  "use cache";
  cacheLife("max");
  const load = readFont;
  const [bold, medium, ethiopic] = await Promise.all([
    load("bricolage-800.woff"),
    load("bricolage-500.woff"),
    load("ethiopic-og.woff"),
  ]);
  return { bold, medium, ethiopic };
}

/** Strip characters the bundled Latin font can't draw (satori would render tofu boxes). */
const safe = (s: string) => s.replace(/[^\x20-\x7E\u2019\u2018\u201C\u201D\u2013]/g, "").trim();

const stripe = (color: string, h: number) => <div style={{ display: "flex", height: h, background: color }} />;

export async function loadIconFont() {
  "use cache";
  cacheLife("max");
  return readFont("ethiopic-og.woff");
}

export function renderOg({
  title,
  subtitle,
  eyebrow,
  amharic,
  fonts,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  amharic?: string;
  fonts: { bold: ArrayBuffer; medium: ArrayBuffer; ethiopic: ArrayBuffer };
}) {
  const diamonds = Array.from({ length: 36 });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#141B4D", color: "#EDEFFF" }}>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "64px 72px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Bricolage", fontWeight: 500, fontSize: 30, color: "#A3AAD8" }}>
            <span>{eyebrow ? safe(eyebrow) : "yonasgr portfolio"}</span>
            {amharic && <span style={{ fontFamily: "Ethiopic", fontSize: 46, color: "#F2B124" }}>{amharic}</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Bricolage", fontWeight: 800, fontSize: title.length > 14 ? 120 : 168, lineHeight: 0.95, letterSpacing: -4 }}>
              {safe(title)}
            </div>
            {subtitle && (
              <div style={{ marginTop: 26, fontFamily: "Bricolage", fontWeight: 500, fontSize: 38, lineHeight: 1.25, color: "#A3AAD8", maxWidth: 980 }}>
                {safe(subtitle)}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {stripe("#F2B124", 8)}
          {stripe("#DD4B2F", 8)}
          {stripe("#1E8559", 8)}
          <div style={{ display: "flex", background: "#2B3FF2", height: 46, alignItems: "center", overflow: "hidden" }}>
            {diamonds.map((_, i) => (
              <div key={i} style={{ display: "flex", width: 34, height: 34, margin: "0 0 0 0", flexShrink: 0, alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 22, height: 22, background: "#F2B124", transform: "rotate(45deg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 9, height: 9, background: "#141B4D", display: "flex" }} />
                </div>
              </div>
            ))}
          </div>
          {stripe("#1E8559", 8)}
          {stripe("#DD4B2F", 8)}
          {stripe("#F2B124", 8)}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Bricolage", data: fonts.bold, weight: 800, style: "normal" },
        { name: "Bricolage", data: fonts.medium, weight: 500, style: "normal" },
        { name: "Ethiopic", data: fonts.ethiopic, weight: 700, style: "normal" },
      ],
    },
  );
}
