import type { NextConfig } from "next";

// Cache Components are switched off on purpose: every listing page reads live
// data from Supabase on each request, which is the simplest model for an MVP.
const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the dev server by this PC's address.
  // Dev only; update it if the router hands this PC a different address.
  allowedDevOrigins: ["192.168.1.161"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Machine photos from the public Supabase Storage bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/machine-photos/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // The machinery form sends up to 6 photos, resized in the browser to a
      // few hundred KB each. Vercel caps request bodies at 4.5 MB.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
