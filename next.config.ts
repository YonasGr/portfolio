import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Next.js 16: opt in to Cache Components ('use cache') and instant, SPA-like navigations.
  cacheComponents: true,
  partialPrefetching: true,
  // Automatic memoization at build time.
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 768, 1024, 1280, 1600, 1920],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/resume", destination: "/yonasgr-resume.pdf", permanent: false },
      { source: "/cv", destination: "/yonasgr-resume.pdf", permanent: false },
    ];
  },
};

export default nextConfig;
