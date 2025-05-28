import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Enable environment variables
  env: {
    MONGODB_URI: process.env.MONGODB_URI || '',
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
};

export default nextConfig;
