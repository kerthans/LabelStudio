'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // 重定向到登录页面，并设置默认 tab 为注册
    router.replace('/login?tab=register');
  }, [router]);

  return null;
}