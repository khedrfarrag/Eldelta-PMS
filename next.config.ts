import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ignore ESLint during builds for production
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable source maps to avoid file permission issues
  productionBrowserSourceMaps: false,
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/webp', 'image/avif'],
  },
  // Enable static exports for better performance
  output: 'standalone',
};

export default nextConfig;