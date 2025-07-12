"use client";

import {
  MailOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Typography,
} from "antd";
import Link from "next/link";

interface ForgotPasswordForm {
  email: string;
}

interface ForgotPasswordFormProps {
  loading: boolean;
  onSubmit: (values: ForgotPasswordForm) => Promise<void>;
}

export default function ForgotPasswordForm({ loading, onSubmit }: ForgotPasswordFormProps) {
  const [form] = Form.useForm<ForgotPasswordForm>();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Typography.Title level={3} className="mb-2">
          重置密码
        </Typography.Title>
        <Typography.Text type="secondary">
          请输入您的邮箱地址，我们将发送重置密码的链接给您
        </Typography.Text>
      </div>

      <Form
        form={form}
        name="forgotPassword"
        onFinish={onSubmit}
        layout="vertical"
        size="large"
        className="space-y-4"
      >
        <Form.Item
          name="email"
          label="邮箱地址"
          rules={[
            { required: true, message: "请输入邮箱地址" },
            { type: "email", message: "请输入有效的邮箱地址" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="请输入邮箱地址"
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="rounded-lg h-12 font-medium"
          >
            发送重置链接
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center">
        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
          返回登录
        </Link>
      </div>
    </div>
  );
}
