'use client'

import React, { useEffect } from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { LogoutOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // 这里可以添加实际的登出逻辑
    // 比如清除 token、清除本地存储等
    console.log('用户已登出');
  }, []);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <Card className="shadow-xl border-0 rounded-2xl text-center">
      <Space direction="vertical" size="large" className="w-full">
        <div className="text-6xl text-blue-500 mb-4">
          <LogoutOutlined />
        </div>
        
        <div>
          <Title level={3} className="mb-2">
            您已成功登出
          </Title>
          <Text type="secondary" className="text-lg">
            感谢您使用 Magnify AI，期待您的再次访问
          </Text>
        </div>

        <Space direction="vertical" className="w-full" size="middle">
          <Button
            type="primary"
            size="large"
            icon={<LogoutOutlined />}
            onClick={handleBackToLogin}
            className="rounded-lg h-12 font-medium"
            block
          >
            重新登录
          </Button>
          
          <Button
            size="large"
            icon={<HomeOutlined />}
            onClick={handleBackToHome}
            className="rounded-lg h-12 font-medium"
            block
          >
            返回首页
          </Button>
        </Space>
      </Space>
    </Card>
  );
}