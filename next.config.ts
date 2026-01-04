import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! PERINGATAN !!
    // Memperbolehkan build selesai meskipun project memiliki type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Memperbolehkan build selesai meskipun project memiliki ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
