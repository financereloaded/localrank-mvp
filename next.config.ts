import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel deployment - allow all origins
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
