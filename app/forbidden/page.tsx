"use client";

import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

export default function ForbiddenTest() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面。"
          extra={
            <div className="space-x-4">
              <Button
                type="primary"
                icon={<HomeOutlined />}
                onClick={handleGoHome}
                size="large"
              >
                返回首页
              </Button>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleGoBack}
                size="large"
              >
                返回上页
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}
