"use client";
import type { DashboardLayoutProps } from "@/types/dashboard/dashboard";
import {
  Layout,
} from "antd";
import React, { useEffect, useState } from "react";
import DashboardFooter from "./_components/Footer";
import DashboardHeader from "./_components/Header";
import DashboardSidebar from "./_components/Sidebar/Sidebar";

const { Content } = Layout;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // 移动端默认收起侧边栏（关闭抽屉）
      if (mobile) {
        setCollapsed(true);
      } else {
        // 桌面端恢复之前的状态或默认展开
        setCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 计算主内容区域的边距
  const getMarginLeft = () => {
    // 移动端不需要左边距，因为使用抽屉
    if (isMobile) return 0;

    // 桌面端根据侧边栏状态计算边距
    return collapsed ? 80 : 200;
  };

  // 处理菜单按钮点击
  const handleMenuClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh" }} className="responsive-layout">
      <DashboardSidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        isMobile={isMobile}
      />
      <Layout
        style={{
          marginLeft: getMarginLeft(),
          transition: "margin-left 0.2s ease-in-out",
        }}
        className="main-layout"
      >
        <DashboardHeader
          notificationCount={5}
          userName="管理员"
          isMobile={isMobile}
          onMenuClick={handleMenuClick} // 传递菜单点击处理函数
        />
        <Content
          style={{
            margin: isMobile ? "12px" : "24px",
            overflow: "initial",
            minHeight: "calc(100vh - 64px - 70px)", // 减去头部和底部高度
          }}
          className="responsive-content"
        >
          <div className={`${isMobile
            ? "px-2" // 移动端更小的内边距
            : "container-responsive" // 桌面端使用响应式容器
          }`}>
            {children}
          </div>
        </Content>
        <DashboardFooter
          companyName="LabelStudio"
          teamName="Clint"
          isMobile={isMobile}
        />
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
