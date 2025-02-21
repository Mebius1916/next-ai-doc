import type { NextConfig } from "next";
const MeasureBuildTimePlugin = require("./MeasureBuildTimePlugin");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com"],
  },
  typescript: {
    ignoreBuildErrors: true, // 允许使用 any 类型
  },
  webpack: (config) => {
    config.plugins.push(new MeasureBuildTimePlugin());
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig)
