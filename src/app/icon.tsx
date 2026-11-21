import { ImageResponse } from "next/og";
import { loadIconFont } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const font = await loadIconFont();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2B3FF2", color: "#fff", fontFamily: "Ethiopic", fontSize: 50, borderRadius: 12 }}>
        ዮ
      </div>
    ),
    { ...size, fonts: [{ name: "Ethiopic", data: font, weight: 700, style: "normal" }] },
  );
}
