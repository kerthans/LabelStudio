'use client'

import React, { useState } from 'react';
import { Card, message } from 'antd';
import ForgotPasswordForm from '../_components/ForgotPasswordForm';

interface ForgotPasswordFormData {
  email: string;
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (values: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      console.log('重置密码邮箱:', values.email);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('重置密码链接已发送到您的邮箱，请查收');
    } catch (error) {
      message.error('发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 rounded-2xl">
      <ForgotPasswordForm loading={loading} onSubmit={handleForgotPassword} />
    </Card>
  );
}