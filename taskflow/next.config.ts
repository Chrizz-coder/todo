import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix Turbopack lockfile warning when nested inside a parent workspace
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
