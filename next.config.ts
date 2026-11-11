import type { NextConfig } from "next";

// Cache Components are switched off on purpose: every listing page reads live
// data from Supabase on each request, which is the simplest model for an MVP.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
