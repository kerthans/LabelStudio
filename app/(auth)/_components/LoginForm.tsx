"use client";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";

const { Text } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginFormProps {
  loading: boolean;
  onSubmit: (values: LoginFormData) => Promise<void>;
}

export default function LoginForm({ loading, onSubmit }: LoginFormProps) {
  const [form] = Form.useForm<LoginFormData>();
  const [rememberMe, setRememberMe] = useState(false);

  const handleFinish = async (values: LoginFormData) => {
    await onSubmit({ ...values, remember: rememberMe });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Form
        form={form}
        name="login"
        onFinish={handleFinish}
        layout="vertical"
        size="large"
        className="space-y-1"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label={<Text strong className="text-sm sm:text-base">邮箱地址</Text>}
          rules={[
            { required: true, message: "请输入邮箱地址" },
            { type: "email", message: "请输入有效的邮箱地址" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="请输入您的邮箱地址"
            className="rounded-lg h-10 sm:h-12 text-sm sm:text-base"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<Text strong className="text-sm sm:text-base">密码</Text>}
          rules={[
            { required: true, message: "请输入密码" },
            { min: 6, message: "密码至少6位字符" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="请输入您的密码"
            className="rounded-lg h-10 sm:h-12 text-sm sm:text-base"
            autoComplete="current-password"
            iconRender={(visible) => (
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            )}
          />
        </Form.Item>

        <div className="flex justify-between items-center py-2">
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="text-xs sm:text-sm"
          >
            <Text className="text-xs sm:text-sm">记住我</Text>
          </Checkbox>

          <Link
            href="/forgotpd"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            忘记密码？
          </Link>
        </div>

        <Form.Item className="mb-0 pt-2 sm:pt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="rounded-lg h-10 sm:h-12 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? "登录中..." : "立即登录"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
