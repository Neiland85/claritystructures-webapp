import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },

  // Docker: generate standalone output for minimal production image
  output: "standalone",

  // Production optimizations
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // Compiler optimizations — strip console.log/debug/info in production
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },

  transpilePackages: [
    "@claritystructures/domain",
    "@claritystructures/types",
    "@claritystructures/config",
    "@claritystructures/infra-notifications",
    "@claritystructures/infra-persistence",
  ],

  // Mark packages as external for server-side bundling
  serverExternalPackages: [
    "pg",
    "@prisma/adapter-pg",
    "nodemailer",
    "nodemailer/lib/mailer",
  ],

  // Security headers — fallback for static assets not processed by proxy.ts
  // Values MUST match proxy.ts (the canonical source for dynamic routes)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
