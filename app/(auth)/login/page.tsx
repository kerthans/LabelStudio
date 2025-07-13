"use client";

import {
  MobileOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Divider,
  Space,
  Tabs,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import LoginForm from "../_components/LoginForm";
import RegisterForm from "../_components/RegisterForm";

const { Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreement?: boolean;
}

interface AuthError {
  type: "validation" | "network" | "auth" | "server";
  message: string;
  details?: string;
}

// 将使用 useSearchParams 的逻辑提取到单独的组件中
function AuthPageContent() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [searchParams]);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const handleError = useCallback((error: unknown, type: AuthError["type"] = "server") => {
    console.error("Auth error:", error);

    let errorMessage = "操作失败，请稍后重试";
    let details = "";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    if (type === "auth" && loginAttempts >= 2) {
      errorMessage = "多次登录失败，请检查账号信息或稍后重试";
      details = "为了账户安全，请确认您的登录信息是否正确";
    }

    setAuthError({ type, message: errorMessage, details });
  }, [loginAttempts]);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    clearError();

    try {
      console.log("登录信息:", values);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1200));

      // 模拟登录验证
      if (values.email === "demo@example.com" && values.password === "demo123") {
        message.success({
          content: "登录成功，正在跳转...",
          duration: 2,
          className: "custom-message",
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setLoginAttempts(prev => prev + 1);
        throw new Error("邮箱或密码错误");
      }
    } catch (error) {
      handleError(error, "auth");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    clearError();

    try {
      console.log("注册信息:", values);

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success({
        content: "注册成功！请使用新账号登录",
        duration: 3,
      });

      setActiveTab("login");
      router.replace("/login");
    } catch (error) {
      handleError(error, "server");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    clearError();

    if (key === "register") {
      router.replace("/login?tab=register");
    } else {
      router.replace("/login");
    }
  };

  const handlePhoneLogin = async () => {
    setLoading(true);
    clearError();

    try {
      console.log("手机号登录");
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.info("手机号登录功能即将上线，敬请期待");
    } catch (error) {
      handleError(error, "network");
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: "login",
      label: "登录",
      children: (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <LoginForm loading={loading} onSubmit={handleLogin} />
        </div>
      ),
    },
    {
      key: "register",
      label: "注册",
      children: (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <RegisterForm loading={loading} onSubmit={handleRegister} />
        </div>
      ),
    },
  ];

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

      {/* 主要内容 */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        centered
        size="large"
        className="auth-tabs"
        items={tabItems}
      />

      {/* 分割线和其他登录方式 */}
      <div className="px-4 sm:px-6">
        <Divider className="my-4 sm:my-6">
          <Text type="secondary" className="text-xs sm:text-sm font-medium">
            其他登录方式
          </Text>
        </Divider>

        <Space direction="vertical" className="w-full" size="middle">
          <Tooltip title="使用手机号快速登录">
            <Button
              block
              size="large"
              className="rounded-lg h-10 sm:h-12 border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 font-medium text-sm sm:text-base"
              icon={<MobileOutlined className="text-base sm:text-lg" />}
              onClick={handlePhoneLogin}
              loading={loading}
            >
              使用手机号登录
            </Button>
          </Tooltip>
        </Space>
      </div>
    </div>
  );
}

// 主组件用 Suspense 包装
export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-4 sm:p-6">加载中...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
