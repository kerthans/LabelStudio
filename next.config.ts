import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 允许的开发环境来源
  allowedDevOrigins: [
    "47.109.158.250",
  ],

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 编译器配置
  compiler: {
    // 生产环境移除 console.log
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // Turbopack 配置（替代 Webpack）
  turbopack: {
    // 解析别名
    resolveAlias: {
      "@": "./",
    },
    // 自定义扩展名解析
    resolveExtensions: [
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
    ],
  },

  // 实验性功能
  experimental: {
    // 优化包大小
    optimizePackageImports: ["antd", "@ant-design/icons", "lucide-react"],
  },

  // 输出配置
  output: "standalone",

  // 图片优化
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 压缩配置
  compress: true,

  // 性能配置
  poweredByHeader: false,

  // 安全头配置
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
