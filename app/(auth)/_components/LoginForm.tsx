'use client'

import React from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  message
} from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import Link from 'next/link';

interface LoginForm {
  email: string;
  password: string;
}

interface LoginFormProps {
  loading: boolean;
  onSubmit: (values: LoginForm) => Promise<void>;
}

export default function LoginForm({ loading, onSubmit }: LoginFormProps) {
  const [form] = Form.useForm<LoginForm>();

  return (
    <Form
      form={form}
      name="login"
      onFinish={onSubmit}
      layout="vertical"
      size="large"
      className="space-y-4"
    >
      <Form.Item
        name="email"
        label="邮箱地址"
        rules={[
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '请输入有效的邮箱地址' }
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-gray-400" />}
          placeholder="请输入邮箱地址"
          className="rounded-lg"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位字符' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="请输入密码"
          className="rounded-lg"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>

      <div className="flex justify-between items-center mb-4">
        <Link href="/forgotpd" className="text-sm text-blue-600 hover:text-blue-800">
          忘记密码？
        </Link>
      </div>

      <Form.Item className="mb-0">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="rounded-lg h-12 font-medium"
        >
          登录
        </Button>
      </Form.Item>
    </Form>
  );
}