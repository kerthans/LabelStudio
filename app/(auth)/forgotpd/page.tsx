"use client";

import {
  Alert,
  message,
} from "antd";
import { Suspense, useCallback, useState } from "react";
import ForgotPasswordForm from "../_components/ForgotPasswordForm";

interface ForgotPasswordFormData {
  email: string;
}

interface AuthError {
  type: "validation" | "network" | "auth" | "server";
  message: string;
  details?: string;
}

function ForgotPasswordContent() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const handleError = useCallback((error: unknown, type: AuthError["type"] = "server") => {
    console.error("Forgot password error:", error);

    let errorMessage = "操作失败，请稍后重试";
    const details = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    setAuthError({ type, message: errorMessage, details });
  }, []);

  const handleForgotPassword = async (values: ForgotPasswordFormData) => {
    setLoading(true);
    clearError();

    try {
      console.log("重置密码请求:", values);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 模拟邮箱验证
      if (values.email && values.email.includes("@")) {
        message.success({
          content: "重置密码链接已发送到您的邮箱，请查收",
          duration: 3,
          className: "custom-message",
        });
        setEmailSent(true);
      } else {
        throw new Error("请输入有效的邮箱地址");
      }
    } catch (error) {
      handleError(error, "validation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* 错误提示 */}
      {authError && (
        <Alert
          message={authError.message}
          description={authError.details}
          type="error"
          showIcon
          closable
          onClose={clearError}
          className="mb-4 sm:mb-6 rounded-lg text-sm"
        />
      )}

      {/* 成功提示 */}
      {emailSent && (
        <Alert
          message="邮件发送成功"
          description="请检查您的邮箱（包括垃圾邮件文件夹），点击链接重置密码"
          type="success"
          showIcon
          className="mb-4 sm:mb-6 rounded-lg text-sm"
        />
      )}

      {/* 主要内容 */}
      <div className="max-w-md mx-auto">
        <ForgotPasswordForm
          loading={loading}
          onSubmit={handleForgotPassword}
          emailSent={emailSent}
        />
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="p-4 sm:p-6">加载中...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
