import type { NextConfig } from "next";
const MeasureBuildTimePlugin = require("./webpackTime");
const TerserPlugin = require("terser-webpack-plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com"],
    loader: "default",
  },
  typescript: {
    ignoreBuildErrors: true, // 允许使用 any 类型
  },
  webpack: (config) => {
    config.plugins.push(new MeasureBuildTimePlugin());

    // 优化代码分割策略
    config.optimization.splitChunks = {
      chunks: "all",
      minSize: 20000,
      maxSize: 244000, // 增加最大尺寸限制
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: "~",
      cacheGroups: {
        // 核心库单独分包
        tiptap: {
          test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
          name: "tiptap",
          priority: 20,
          reuseExistingChunk: true,
        },
        liveblocks: {
          test: /[\\/]node_modules[\\/](@liveblocks|y-protocols)[\\/]/,
          name: "liveblocks",
          priority: 20,
        },
        convex: {
          test: /[\\/]node_modules[\\/](convex|zustand)[\\/]/,
          name: "convex",
          priority: 20,
        },
        clerk: {
          test: /[\\/]node_modules[\\/]@clerk[\\/]/,
          name: "clerk",
          priority: 20,
        },
        // 新增组件库独立分包
        components: {
          test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
          name: "components",
          priority: -5, // 优先级高于默认组
          reuseExistingChunk: true,
          minSize: 0 // 允许小体积组件合并
        },
        // 公共模块
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };

    if (config.optimization) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          parallel: true, // 启用并行压缩
          terserOptions: {
            compress: {
              drop_console: process.env.NODE_ENV === "production",
              passes: 2, // 增加压缩次数
            },
            output: {
              comments: false,
            },
          },
          extractComments: false,
        })
      );
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
