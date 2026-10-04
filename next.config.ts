import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the share-card image (/api/card) reads its fonts from disk at runtime
  outputFileTracingIncludes: {
    "/api/card": ["./assets/fonts/**"],
  },
};

export default nextConfig;
