"use client";

import { 
  HomeOutlined, 
  LoginOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { 
  Button, 
  Space, 
  Typography,
  Divider,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function LogoutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 这里可以添加实际的登出逻辑
    // 比如清除 token、清除本地存储等
    console.log("用户已登出");
    
    // 清除可能的认证信息
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
  }, []);

  useEffect(() => {
    // 5秒后自动跳转到登录页面
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-md mx-auto text-center space-y-6 sm:space-y-8">
        {/* 成功图标 */}
        <div className="text-6xl sm:text-7xl text-green-500 mb-4">
          <CheckCircleOutlined />
        </div>

        {/* 标题和描述 */}
        <div className="space-y-2 sm:space-y-3">
          <Title level={3} className="mb-2 text-gray-800">
            您已成功登出
          </Title>
          <Text type="secondary" className="text-sm sm:text-base block">
            感谢您使用LabelStudio，期待您的再次访问
          </Text>
          <Text type="secondary" className="text-xs sm:text-sm">
            {countdown > 0 ? `${countdown}秒后自动跳转到登录页面` : "正在跳转..."}
          </Text>
        </div>

        {/* 操作按钮 */}
        <Space direction="vertical" className="w-full" size="middle">
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            onClick={handleBackToLogin}
            className="rounded-lg h-10 sm:h-12 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
            block
          >
            立即登录
          </Button>

          <Button
            size="large"
            icon={<HomeOutlined />}
            onClick={handleBackToHome}
            className="rounded-lg h-10 sm:h-12 font-medium text-sm sm:text-base border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
            block
          >
            返回首页
          </Button>
        </Space>

        {/* 分割线和额外信息 */}
        <div>
          <Divider className="my-4 sm:my-6">
            <Text type="secondary" className="text-xs sm:text-sm font-medium">
              安全提示
            </Text>
          </Divider>
          
          <Text type="secondary" className="text-xs sm:text-sm">
            为了您的账户安全，我们已清除了本地存储的登录信息
          </Text>
        </div>
      </div>
    </div>
  );
}
