"use client";

import { ConfigProvider } from "antd";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthLayoutContent({ children }: AuthLayoutProps) {
  const { theme: currentTheme, antdTheme } = useTheme();
  const isDark = currentTheme === "dark";

  return (
    <ConfigProvider
      theme={{
        ...antdTheme,
        token: {
          ...antdTheme.token,
          colorPrimary: "#1890ff",
          borderRadius: 8,
          fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          // 深色模式下的自定义颜色
          ...(isDark && {
            colorBgContainer: "#1a1a1a",
            colorBgElevated: "#1f1f1f",
            colorBgLayout: "#141414",
            colorBorder: "#2a2a2a",
            colorBorderSecondary: "#262626",
            colorText: "#e8e8e8",
            colorTextSecondary: "#a8a8a8",
            colorTextTertiary: "#888888",
            colorFill: "#262626",
            colorFillSecondary: "#1f1f1f",
            colorFillTertiary: "#1a1a1a",
            colorFillQuaternary: "#171717",
          }),
        },
      }}
    >
      <div className={`min-h-screen relative ${
        isDark
          ? "bg-gradient-to-br from-[#141414] via-[#1a1a1a] to-[#0f0f0f]"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}>
        {/* 背景装饰 - 固定位置确保始终可见 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            isDark
              ? "bg-blue-500/5"
              : "bg-blue-400/10"
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            isDark
              ? "bg-indigo-500/5"
              : "bg-indigo-400/10"
          }`} />
        </div>

        {/* 主内容区域 - 动态高度适应内容 */}
        <div className="relative flex items-center justify-center min-h-screen p-4 py-8 sm:py-12">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                  isDark
                    ? "from-gray-200 via-gray-100 to-gray-200"
                    : "from-slate-700 via-gray-800 to-slate-700"
                }`}>
                  Label
                </span>
                <span className={`bg-gradient-to-r bg-clip-text text-transparent font-bold ${
                  isDark
                    ? "from-emerald-400 via-teal-400 to-cyan-400"
                    : "from-emerald-600 via-teal-600 to-cyan-600"
                }`}>
                  Studio
                </span>
              </h1>
              <p className={`text-sm sm:text-base font-medium px-4 ${
                isDark
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}>
                智能数据标注平台，精准训练 AI 模型
              </p>
            </div>

            <div className={`backdrop-blur-xl rounded-2xl shadow-2xl border ${
              isDark
                ? "bg-[#1a1a1a]/90 border-[#2a2a2a]/50"
                : "bg-white/80 border-white/20"
            }`}>
              {children}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <p className={`text-xs sm:text-sm leading-relaxed px-4 ${
                isDark
                  ? "text-gray-500"
                  : "text-gray-500"
              }`}>
                登录即表示您同意我们的
                <a
                  href="/terms-of-service"
                  className={`mx-1 font-medium transition-colors ${
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  服务条款
                </a>
                |
                <a
                  href="/privacy-policy"
                  className={`mx-1 font-medium transition-colors ${
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  隐私政策
                </a>
                |
                <a
                  href="/license-agreement"
                  className={`mx-1 font-medium transition-colors ${
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  许可协议
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t pointer-events-none ${
          isDark
            ? "from-[#141414] via-[#1a1a1a]/50 to-transparent"
            : "from-slate-50 via-blue-50/50 to-transparent"
        }`} />
      </div>
    </ConfigProvider>
  );
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthLayoutContent>
      {children}
    </AuthLayoutContent>
  );
}
