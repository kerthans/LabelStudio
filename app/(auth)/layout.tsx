import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            Magnify AI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            欢迎使用智能AI平台
          </p>
        </div>

        {children}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            登录即表示您同意我们的{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              服务条款
            </a>
            {' '}和{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              隐私政策
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}