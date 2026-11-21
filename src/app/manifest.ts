import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} Portfolio`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5f1",
    theme_color: "#2b3ff2",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
