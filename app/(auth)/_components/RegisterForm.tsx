"use client";

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Typography,
} from "antd";

const { Text } = Typography;

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  loading: boolean;
  onSubmit: (values: RegisterForm) => Promise<void>;
}

export default function RegisterForm({ loading, onSubmit }: RegisterFormProps) {
  const [form] = Form.useForm<RegisterForm>();

  return (
    <Form
      form={form}
      name="register"
      onFinish={onSubmit}
      layout="vertical"
      size="large"
      className="space-y-2 sm:space-y-3"
    >
      <Form.Item
        name="username"
        label={<Text strong className="text-sm sm:text-base">用户名</Text>}
        rules={[
          { required: true, message: "请输入用户名" },
          { min: 2, message: "用户名至少2位字符" },
          { max: 20, message: "用户名最多20位字符" },
        ]}
        className="mb-3 sm:mb-4"
      >
        <Input
          prefix={<UserOutlined className="text-gray-400" />}
          placeholder="请输入用户名"
          className="rounded-lg h-10 sm:h-12 text-sm sm:text-base"
          autoComplete="username"
        />
      </Form.Item>

      <Form.Item
        name="email"
        label={<Text strong className="text-sm sm:text-base">邮箱地址</Text>}
        rules={[
          { required: true, message: "请输入邮箱地址" },
          { type: "email", message: "请输入有效的邮箱地址" },
        ]}
        className="mb-3 sm:mb-4"
      >
        <Input
          prefix={<MailOutlined className="text-gray-400" />}
          placeholder="请输入邮箱地址"
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
          { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: "密码必须包含字母和数字" },
        ]}
        className="mb-3 sm:mb-4"
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="请输入密码（至少6位，包含字母和数字）"
          className="rounded-lg h-10 sm:h-12 text-sm sm:text-base"
          autoComplete="new-password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label={<Text strong className="text-sm sm:text-base">确认密码</Text>}
        dependencies={["password"]}
        rules={[
          { required: true, message: "请确认密码" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("两次输入的密码不一致"));
            },
          }),
        ]}
        className="mb-4 sm:mb-6"
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="请再次输入密码"
          className="rounded-lg h-10 sm:h-12 text-sm sm:text-base"
          autoComplete="new-password"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          size="large"
          className="rounded-lg h-10 sm:h-12 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {loading ? "注册中..." : "立即注册"}
        </Button>
      </Form.Item>
    </Form>
  );
}
