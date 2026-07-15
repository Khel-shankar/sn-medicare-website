import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [65, 75, 78, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
