"use client";

import type { BreadcrumbItem } from "@/types/dashboard/dashboard";
import {
  BellOutlined,
  MenuOutlined // 添加菜单图标
  ,



  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Button, Dropdown, Layout, theme as antdTheme } from "antd";
import { usePathname } from "next/navigation";
import React, { useMemo, useRef } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { MENU_CONFIG_DATA, type MenuConfigData } from "./Sidebar/menuConfig";

const { Header } = Layout;

interface DashboardHeaderProps {
  notificationCount?: number;
  userName?: string;
  isMobile?: boolean; // 添加移动端标识
  onMenuClick?: () => void; // 添加菜单点击回调
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  notificationCount,
  userName = "管理员",
  isMobile = false, // 默认值
  onMenuClick, // 菜单点击回调
}) => {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const { token } = antdTheme.useToken();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // 构建路径到标题的映射
  const buildPathTitleMap = (): Record<string, string> => {
    const pathTitleMap: Record<string, string> = {};

    const traverse = (items: MenuConfigData[]) => {
      items.forEach(item => {
        pathTitleMap[item.path] = item.label;
        if (item.children) {
          item.children.forEach(child => {
            pathTitleMap[child.path] = child.label;
          });
        }
      });
    };

    traverse(MENU_CONFIG_DATA);
    return pathTitleMap;
  };

  // 查找最匹配的路径标题
  const findBestMatchTitle = (pathname: string, pathTitleMap: Record<string, string>): string | null => {
    if (pathTitleMap[pathname]) {
      return pathTitleMap[pathname];
    }

    const segments = pathname.split("/").filter(Boolean);
    let bestMatch = "";
    let bestTitle = null;

    for (let i = segments.length; i > 0; i--) {
      const testPath = "/" + segments.slice(0, i).join("/");
      if (pathTitleMap[testPath] && testPath.length > bestMatch.length) {
        bestMatch = testPath;
        bestTitle = pathTitleMap[testPath];
      }
    }

    return bestTitle;
  };

  // 生成面包屑
  const generateBreadcrumb = (): BreadcrumbItem[] => {
    const pathTitleMap = buildPathTitleMap();

    // 如果是 dashboard 首页，只显示首页
    if (pathname === "/dashboard") {
      return [{ title: "首页" }];
    }

    // 对于其他 dashboard 子页面，显示：首页 > 当前页面
    if (pathname.startsWith("/dashboard/")) {
      const matchedTitle = findBestMatchTitle(pathname, pathTitleMap);

      let currentPageTitle = matchedTitle;

      if (!currentPageTitle) {
        const lastSegment = pathname.split("/").pop();
        currentPageTitle = lastSegment ?
          lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) :
          "未知页面";
      }

      // 处理动态路由
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 2) {
        const parentPath = "/" + segments.slice(0, -1).join("/");
        const parentTitle = pathTitleMap[parentPath];
        const lastSegment = segments[segments.length - 1];

        if (parentTitle && /^[0-9a-f-]+$/i.test(lastSegment)) {
          currentPageTitle = `${parentTitle}详情`;
        }
      }

      return [
        { title: "首页", href: "/dashboard" },
        { title: currentPageTitle },
      ];
    }

    return [{ title: "首页" }];
  };

  // 动态生成面包屑
  const breadcrumbItems = useMemo(() => {
    return generateBreadcrumb();
  }, [pathname]);

  // 转换为 Ant Design Breadcrumb 组件需要的格式
  const antdBreadcrumbItems = breadcrumbItems.map((item, index) => ({
    title: item.href ? (
      <a href={item.href}>{item.title}</a>
    ) : (
      item.title
    ),
    key: index,
  }));

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "个人资料",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "系统设置",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "退出登录",
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    console.log("用户菜单点击:", key);
  };

  const handleThemeToggle = (_event: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;

    const button = toggleButtonRef.current;
    if (button) {
      button.classList.add("animate");

      setTimeout(() => {
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const mouseEvent = new MouseEvent("click", {
          clientX: x,
          clientY: y,
          bubbles: true,
          cancelable: true,
        });

        toggleTheme(mouseEvent);
      }, 150);

      setTimeout(() => {
        button.classList.remove("animate");
      }, 300);
    }
  };

  return (
    <Header
      style={{
        padding: "0 24px",
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
      }}
    >
      {/* 左侧区域 */}
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {/* 移动端菜单按钮 */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuClick}
            style={{
              fontSize: "18px",
              width: 40,
              height: 40,
              marginRight: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="打开菜单"
          />
        )}

        {/* 面包屑导航 */}
        <Breadcrumb
          items={antdBreadcrumbItems}
          style={{
            fontSize: isMobile ? "12px" : "14px", // 移动端字体稍小
            color: token.colorTextSecondary,
          }}
        />
      </div>

      {/* 右侧操作区 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 4 : 8, // 移动端间距更小
      }}>
        {/* 主题切换按钮 */}
        <Button
          ref={toggleButtonRef}
          type="text"
          icon={theme === "light" ? <MoonOutlined /> : <SunOutlined />}
          onClick={handleThemeToggle}
          loading={isTransitioning}
          className="theme-toggle-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? 36 : 40, // 移动端稍小
            height: isMobile ? 36 : 40,
          }}
          title={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
        />

        {/* 通知按钮 */}
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? 36 : 40,
            height: isMobile ? 36 : 40,
            position: "relative",
          }}
          title="通知中心"
        >
          {notificationCount && notificationCount > 0 && (
            <span style={{
              position: "absolute",
              top: isMobile ? 6 : 8,
              right: isMobile ? 6 : 8,
              background: token.colorError,
              color: "white",
              borderRadius: "50%",
              width: isMobile ? 14 : 16,
              height: isMobile ? 14 : 16,
              fontSize: isMobile ? 9 : 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              border: `2px solid ${token.colorBgContainer}`,
            }}>
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </Button>

        {/* 用户菜单 */}
        <Dropdown
          menu={{
            items: userMenuItems,
            onClick: handleUserMenuClick,
          }}
          placement="bottomRight"
          arrow
        >
          <Button
            type="text"
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 4 : 8,
              height: isMobile ? 36 : 40,
              padding: isMobile ? "0 8px" : "0 12px",
            }}
          >
            <UserOutlined />
            {/* 移动端可以选择隐藏用户名以节省空间 */}
            {!isMobile && (
              <span style={{ fontSize: "14px" }}>{userName}</span>
            )}
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default DashboardHeader;
