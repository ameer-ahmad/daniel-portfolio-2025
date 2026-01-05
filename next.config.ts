import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath: process.env.NODE_ENV === 'development' ? '' : '/daniel-portfolio-2025',
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : '/daniel-portfolio-2025',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
