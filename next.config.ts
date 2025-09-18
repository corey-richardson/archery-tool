import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* this dont seem smart */
  typescript: {
    // Skip type checking during build
    ignoreBuildErrors: true, // pnpm tsc --noEmit
  },
  // Explicitly set output mode for Vercel
  output: 'standalone',
};

export default nextConfig;
