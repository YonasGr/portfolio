import { ImageResponse } from "next/og";
import { loadIconFont } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadIconFont();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2B3FF2", color: "#fff", fontFamily: "Ethiopic", fontSize: 140 }}>
        ዮ
      </div>
    ),
    { ...size, fonts: [{ name: "Ethiopic", data: font, weight: 700, style: "normal" }] },
  );
}
