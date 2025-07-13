"use client";

import {
  MobileOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

interface PhoneLoginFormData {
  phone: string;
  verificationCode: string;
}

interface PhoneLoginFormProps {
  loading: boolean;
  onSubmit: (values: PhoneLoginFormData) => Promise<void>;
  onSendCode: (phone: string) => Promise<void>;
}

export default function PhoneLoginForm({ loading, onSubmit, onSendCode }: PhoneLoginFormProps) {
  const [form] = Form.useForm<PhoneLoginFormData>();
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleFinish = async (values: PhoneLoginFormData) => {
    await onSubmit(values);
  };

  const handleSendCode = async () => {
    try {
      const phone = form.getFieldValue('phone');
      if (!phone) {
        form.setFields([{
          name: 'phone',
          errors: ['请先输入手机号']
        }]);
        return;
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        form.setFields([{
          name: 'phone',
          errors: ['请输入正确的手机号格式']
        }]);
        return;
      }

      setSendingCode(true);
      await onSendCode(phone);
      setCountdown(60); // 60秒倒计时
    } catch (error) {
      console.error('发送验证码失败:', error);
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Form
        form={form}
        name="phoneLogin"
        onFinish={handleFinish}
        layout="vertical"
        size="large"
        className="space-y-1"
        requiredMark={false}
      >
        <Form.Item
          name="phone"
          label={<Text strong className="text-sm sm:text-base">手机号</Text>}
          rules={[
            { required: true, message: "请输入手机号" },
            { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式" },
          ]}
        >
          <Input
            prefix={<MobileOutlined className="text-gray-400" />}
            placeholder="请输入您的手机号"
            className="rounded-lg h-10 sm:h-12 text-sm sm:text-base"
            autoComplete="tel"
            maxLength={11}
          />
        </Form.Item>

        <Form.Item
          name="verificationCode"
          label={<Text strong className="text-sm sm:text-base">验证码</Text>}
          rules={[
            { required: true, message: "请输入验证码" },
            { len: 6, message: "验证码为6位数字" },
          ]}
        >
          <Row gutter={8}>
            <Col span={14}>
              <Input
                prefix={<SafetyOutlined className="text-gray-400" />}
                placeholder="请输入6位验证码"
                className="rounded-lg h-10 sm:h-12 text-sm sm:text-base"
                maxLength={6}
              />
            </Col>
            <Col span={10}>
              <Button
                onClick={handleSendCode}
                loading={sendingCode}
                disabled={countdown > 0}
                className="rounded-lg h-10 sm:h-12 w-full text-xs sm:text-sm"
                type="default"
              >
                {countdown > 0 ? `${countdown}s后重发` : sendingCode ? '发送中...' : '获取验证码'}
              </Button>
            </Col>
          </Row>
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
            {loading ? "登录中..." : "立即登录"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
