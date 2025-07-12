"use client";
import type { DashboardFooterProps } from "@/types/dashboard/dashboard";
import { CopyrightOutlined } from "@ant-design/icons";
import { Layout, theme } from "antd";
import React from "react";

const { Footer } = Layout;

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
      <span style={{ color: colorTextSecondary, fontSize: "14px" }}>
        <CopyrightOutlined /> {currentYear} {companyName} | 由 {teamName} 开发运营
      </span>
    </Footer>
  );
};

export default DashboardFooter;
