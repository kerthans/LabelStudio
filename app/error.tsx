"use client";

import { ArrowLeftOutlined, HomeOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

export default function InternalServerError() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Result
          status="500"
          title="500"
          subTitle="抱歉，服务器出现了一些问题，请稍后再试。"
          extra={
            <div className="space-x-4">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                size="large"
              >
                刷新页面
              </Button>
              <Button
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
