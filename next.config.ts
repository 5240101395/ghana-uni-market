import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow your phone to load Next.js dev assets
  allowedDevOrigins: ['10.128.38.134'],
  experimental: {
    instantInsights: {
      validationLevel: 'manual-warning',
    },
  },
};

export default nextConfig;