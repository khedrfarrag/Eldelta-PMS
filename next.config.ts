import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ignore ESLint during builds for production
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable source maps to avoid file permission issues
  productionBrowserSourceMaps: false,
};

export default nextConfig;
