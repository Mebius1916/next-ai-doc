import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.clerk.com'],
    // 如果需要更严格的安全控制，可以使用remotePatterns替代：
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'img.clerk.com',
    //   },
    // ],
  },
  /* config options here */
};

export default nextConfig;
