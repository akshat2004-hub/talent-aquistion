import type { NextConfig } from "next";

const backendApiBase = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001").replace(
  /\/$/,
  "",
);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendApiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
