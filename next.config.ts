import type { NextConfig } from "next";

const mediaHostname = process.env.MEDIA_HOSTNAME?.trim();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "passionategrace.org",
      },
      ...(mediaHostname
        ? [{ protocol: "https" as const, hostname: mediaHostname, pathname: "/**" }]
        : []),
      {
        protocol: "http",
        hostname: "localhost",
        port: "9002",
      },
    ],
  },
};

export default nextConfig;
