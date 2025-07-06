'use client'

import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  message,
  Space,
  Divider,
  Button,
  Typography
} from 'antd';
import {
  GithubOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '../_components/LoginForm';
import RegisterForm from '../_components/RegisterForm';

const { Text } = Typography;
const { TabPane } = Tabs;

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  // 登录处理
  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    try {
      // 这里添加实际的登录逻辑
      console.log('登录信息:', values);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('登录成功！');
      router.push('/dashboard');
    } catch (error) {
      message.error('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  // 注册处理
  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      // 这里添加实际的注册逻辑
      console.log('注册信息:', values);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('注册成功！请登录');
      setActiveTab('login');
      // 清除 URL 参数
      router.replace('/login');
    } catch (error) {
      message.error('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // 更新 URL 参数
    if (key === 'register') {
      router.replace('/login?tab=register');
    } else {
      router.replace('/login');
    }
  };

  return (
    <Card className="shadow-xl border-0 rounded-2xl">
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        centered
        size="large"
        className="mb-4"
      >
        <TabPane tab="登录" key="login">
          <LoginForm loading={loading} onSubmit={handleLogin} />
        </TabPane>

        <TabPane tab="注册" key="register">
          <RegisterForm loading={loading} onSubmit={handleRegister} />
        </TabPane>
      </Tabs>

      <Divider className="my-6">
        <Text type="secondary" className="text-sm">
          其他登录方式
        </Text>
      </Divider>

      <Space direction="vertical" className="w-full" size="middle">          
        <Button
          block
          size="large"
          className="rounded-lg h-12 border-gray-300 hover:border-blue-400"
          icon={<GithubOutlined />}
        >
          使用 GitHub 账号登录
        </Button>
      </Space>
    </Card>
  );
}