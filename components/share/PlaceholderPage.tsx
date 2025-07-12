"use client";
import React from "react";
import {
  Button,
  Card,
  Result,
  Space,
} from "antd";
import { HomeOutlined, ToolOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface PlaceholderPageProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title = "页面开发中",
  description = "该功能正在紧张开发中，敬请期待！",
  showBackButton = true,
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  return (
    <Card style={{ minHeight: "60vh" }}>
      <Result
        icon={<ToolOutlined style={{ color: "#1890ff" }} />}
        title={title}
        subTitle={description}
        extra={
          <Space>
            {showBackButton && (
              <Button onClick={handleGoBack}>
                返回上页
              </Button>
            )}
            <Button type="primary" icon={<HomeOutlined />} onClick={handleGoHome}>
              回到首页
            </Button>
          </Space>
        }
      >
        <div style={{
          padding: "24px",
          background: "#fafafa",
          borderRadius: "8px",
          margin: "24px 0",
        }}>
          <p style={{
            color: "#666",
            fontSize: "14px",
            margin: 0,
            textAlign: "center",
          }}>
            🚧 此页面仅作为路由占位，实际功能开发中...
          </p>
        </div>
      </Result>
    </Card>
  );
};

export default PlaceholderPage;
