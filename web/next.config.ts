import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.gatcg.com",
        pathname: "/cards/images/**",
      },
      {
        protocol: "https",
        hostname: "accounts.gatcg.com",
        pathname: "/images/avatars/**",
      },
    ],
  },
};

export default nextConfig;
