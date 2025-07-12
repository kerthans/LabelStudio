"use client";
import React from "react";
import { Layout, theme } from "antd";
import { CopyrightOutlined } from "@ant-design/icons";
import type { DashboardFooterProps } from "@/types/dashboard/dashboard";

const { Footer } = Layout;

const DashboardFooter: React.FC<DashboardFooterProps> = ({
  companyName = "腾升·千江AI",
  teamName = "四川腾升建设工程项目管理有限公司",
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
      <span style={{ color: colorTextSecondary, fontSize: "14px" }}>
        <CopyrightOutlined /> {currentYear} {companyName} | 由 {teamName} 开发运营
      </span>
    </Footer>
  );
};

export default DashboardFooter;
