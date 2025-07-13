"use client";
import type { DashboardFooterProps } from "@/types/dashboard/dashboard";
import { CopyrightOutlined } from "@ant-design/icons";
import { Divider, Layout, Space, Typography, theme } from "antd";
import Link from "next/link";
import React from "react";

const { Footer } = Layout;
const { Text } = Typography;

const DashboardFooter: React.FC<DashboardFooterProps> = ({
  companyName = "LabelStudio",
  teamName = "Clint",
  year,
  style,
}) => {
  const {
    token: { colorBgContainer, colorTextSecondary, colorBorderSecondary },
  } = theme.useToken();

  const currentYear = year || new Date().getFullYear();

  return (
    <Footer
      style={{
        textAlign: "center",
        background: colorBgContainer,
        borderTop: `1px solid ${colorBorderSecondary}`,
        marginTop: 48,
        padding: "20px 24px",
        ...style,
      }}
    >
      <div style={{ color: colorTextSecondary, fontSize: "12px" }}>
        <Space split={<Divider type="vertical" />}>
          <span>
            <CopyrightOutlined /> {currentYear} {companyName}. 保留所有权利.
          </span>
          <Link href="/privacy-policy" style={{ color: colorTextSecondary }}>
            <Text style={{ color: "inherit", fontSize: "12px" }}>隐私政策</Text>
          </Link>
          <Link href="/terms-of-service" style={{ color: colorTextSecondary }}>
            <Text style={{ color: "inherit", fontSize: "12px" }}>服务条款</Text>
          </Link>
          <Link href="/license-agreement" style={{ color: colorTextSecondary }}>
            <Text style={{ color: "inherit", fontSize: "12px" }}>许可协议</Text>
          </Link>
          <span>由 {teamName} 开发运营</span>
        </Space>
      </div>
    </Footer>
  );
};

export default DashboardFooter;
