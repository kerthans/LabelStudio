import React from "react";
import { ConfigProvider, theme } from "antd";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
          fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
        },
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
        {/* 背景装饰 - 固定位置确保始终可见 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        {/* 主内容区域 - 动态高度适应内容 */}
        <div className="relative flex items-center justify-center min-h-screen p-4 py-8 sm:py-12">
          <div className="w-full max-w-md lg:max-w-lg">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  腾升·千江
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 bg-clip-text text-transparent font-bold ml-1">
                  AI
                </span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium px-4">
                工程项管 AI 平台，赋能基建数字化蝶变
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20">
              {children}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-4">
                登录即表示您同意我们的
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mx-1 font-medium transition-colors"
                >
                  服务条款
                </a>
                和
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mx-1 font-medium transition-colors"
                >
                  隐私政策
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 底部渐变延伸 - 确保长内容时背景完整 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 via-blue-50/50 to-transparent dark:from-slate-900 dark:via-slate-800/50 dark:to-transparent pointer-events-none" />
      </div>
    </ConfigProvider>
  );
}
