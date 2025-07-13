"use client";

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  loading: boolean;
  onSubmit: (values: ForgotPasswordFormData) => Promise<void>;
  emailSent?: boolean;
}

export default function ForgotPasswordForm({ loading, onSubmit, emailSent = false }: ForgotPasswordFormProps) {
  const [form] = Form.useForm<ForgotPasswordFormData>();
  const router = useRouter();

  const handleFinish = async (values: ForgotPasswordFormData) => {
    await onSubmit(values);
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl text-green-500 mb-4">
          <CheckCircleOutlined />
        </div>

        <div>
          <Title level={3} className="mb-2 text-gray-800">
            邮件已发送
          </Title>
          <Text type="secondary" className="text-sm sm:text-base block mb-4">
            我们已向您的邮箱发送了重置密码的链接
          </Text>
          <Text type="secondary" className="text-xs sm:text-sm">
            请检查您的邮箱（包括垃圾邮件文件夹）
          </Text>
        </div>

        <Space direction="vertical" className="w-full" size="middle">
          <Button
            type="primary"
            size="large"
            onClick={handleBackToLogin}
            className="rounded-lg h-10 sm:h-12 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
            block
          >
            返回登录
          </Button>

          <Button
            size="large"
            onClick={() => window.location.reload()}
            className="rounded-lg h-10 sm:h-12 font-medium text-sm sm:text-base border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
            block
          >
            重新发送邮件
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 页面标题 */}
      <div className="text-center mb-6 sm:mb-8">
        <Title level={3} className="mb-2 text-gray-800">
          重置密码
        </Title>
        <Text type="secondary" className="text-sm sm:text-base">
          请输入您的邮箱地址，我们将发送重置密码的链接给您
        </Text>
      </div>

      {/* 表单 */}
      <Form
        form={form}
        name="forgotPassword"
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

        <Form.Item className="mb-0 pt-2 sm:pt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="rounded-lg h-10 sm:h-12 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? "发送中..." : "发送重置链接"}
          </Button>
        </Form.Item>
      </Form>

      {/* 分割线和返回链接 */}
      <div>
        <Divider className="my-4 sm:my-6">
          <Text type="secondary" className="text-xs sm:text-sm font-medium">
            其他选项
          </Text>
        </Divider>

        <Button
          size="large"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToLogin}
          className="rounded-lg h-10 sm:h-12 w-full border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all duration-200 font-medium text-sm sm:text-base"
        >
          返回登录
        </Button>
      </div>
    </div>
  );
}
