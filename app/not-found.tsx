"use client";

import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

export default function NotFound() {
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
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在。"
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
