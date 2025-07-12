"use client";
import { useTheme } from "@/contexts/ThemeContext";
import type { MenuItem } from "@/types/dashboard/dashboard";
import type {
  DashboardSidebarProps,
  MenuClickEvent,
  MenuConfig,
  RouteMap,
  SidebarStyles,
} from "@/types/dashboard/sidebar";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Drawer, Layout, Menu } from "antd"; // 添加 Drawer
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import { MENU_CONFIG_DATA, type MenuConfigData } from "./menuConfig";

const { Sider } = Layout;

// 图标映射表
const ICON_MAP: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  EditOutlined: <EditOutlined />,
  ProjectOutlined: <ProjectOutlined />,
  UnorderedListOutlined: <UnorderedListOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  TeamOutlined: <TeamOutlined />,
  SettingOutlined: <SettingOutlined />,
  UserOutlined: <UserOutlined />,
  QuestionCircleOutlined: <QuestionCircleOutlined />,
};

// 将数据配置转换为包含 React 组件的配置
const transformDataToMenuConfig = (data: MenuConfigData[]): MenuConfig[] => {
  return data.map(item => {
    const config: MenuConfig = {
      key: item.key,
      label: item.label,
      icon: ICON_MAP[item.iconType],
      path: item.path,
    };
    // 只在有children时添加children属性
    if (item.children) {
      config.children = item.children.map(child => ({
        key: child.key,
        label: child.label,
        path: child.path,
      }));
    }
    return config;
  });
};

// 构建路由映射表
const buildRouteMap = (configs: MenuConfig[]): RouteMap => {
  const routeMap: RouteMap = {};

  const traverse = (items: MenuConfig[]) => {
    items.forEach(item => {
      routeMap[item.key] = item.path;
      if (item.children) {
        item.children.forEach(child => {
          routeMap[child.key] = child.path;
        });
      }
    });
  };

  traverse(configs);
  return routeMap;
};

// 转换为 Ant Design Menu 所需格式
const transformToMenuItems = (configs: MenuConfig[]): MenuItem[] => {
  return configs.map(config => ({
    key: config.key,
    icon: config.icon,
    label: config.label,
    children: config.children?.map(child => ({
      key: child.key,
      label: child.label,
    })),
  }));
};

// 样式常量
const SIDEBAR_STYLES: SidebarStyles = {
  sider: {
    overflow: "hidden", // 改为 hidden，让内部 Menu 处理滚动
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  logo: {
    height: 64,
    margin: 16,
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
  },
  menu: {
    borderRight: 0,
    height: "calc(100vh - 160px)", // 计算可用高度
    overflowY: "auto", // 启用滚动
    overflowX: "hidden",
  },
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  onCollapse,
  isMobile = false,
}) => {
  const router = useRouter();
  const { theme } = useTheme();

  // 将数据配置转换为包含 React 组件的配置
  const menuConfig = useMemo(() => transformDataToMenuConfig(MENU_CONFIG_DATA), []);

  // 缓存路由映射表和菜单项
  const routeMap = useMemo(() => buildRouteMap(menuConfig), [menuConfig]);
  const menuItems = useMemo(() => transformToMenuItems(menuConfig), [menuConfig]);

  // 缓存事件处理函数
  const handleMenuClick = useCallback((e: MenuClickEvent) => {
    const path = routeMap[e.key];
    if (path) {
      router.push(path);
    } else {
      console.warn(`未找到菜单项 ${e.key} 对应的路由`);
    }
  }, [router, routeMap]);

  // 动态计算 logo 样式
  const logoStyle = useMemo(() => ({
    ...SIDEBAR_STYLES.logo,
    fontSize: collapsed ? "14px" : "16px",
    background: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
  }), [collapsed, theme]);

  // 动态计算 Sider 样式
  const siderStyle = useMemo(() => ({
    ...SIDEBAR_STYLES.sider,
    backgroundColor: theme === "dark" ? "#0f0f0f" : undefined,
  }), [theme]);

  // 在组件顶部添加图标导入


  // 在 DashboardSidebar 组件中，替换 return 部分：
  // 移动端使用 Drawer，桌面端使用 Sider
  if (isMobile) {
    return (
      <Drawer
        title={
          <div style={{
            height: "48px",
            margin: "8px 16px",
            background: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#364452",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}>
            <span className="text-base font-bold">
              <span className="bg-gradient-to-r from-slate-200 via-gray-100 to-slate-200 bg-clip-text text-transparent">
                Label
              </span>
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent font-bold">
                Studio
              </span>
            </span>
          </div>
        }
        placement="left"
        onClose={() => onCollapse(true)}
        open={!collapsed}
        width={280}
        bodyStyle={{ padding: 0 }}
        headerStyle={{
          backgroundColor: theme === "dark" ? "#141414" : "#041527", // light主题使用指定的侧边栏颜色
          borderBottom: `1px solid ${theme === "dark" ? "#434343" : "#1a2332"}`, // 调整边框颜色
          padding: "16px 24px",
        }}
        closeIcon={
          <span style={{
            color: "#F5F5DC", // 象牙灰白色，两个主题统一
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "22px",
            height: "22px",
            borderRadius: "4px",
            transition: "all 0.2s ease",
          }}>
            ×
          </span>
        }
        style={{
          zIndex: 1001,
        }}
        maskClosable={true}
      >
        <Menu
          theme="dark" // 手机端统一使用dark主题菜单
          defaultSelectedKeys={["dashboard"]}
          mode="inline"
          items={menuItems}
          onClick={(e) => {
            handleMenuClick(e);
            onCollapse(true);
          }}
          style={{
            backgroundColor: theme === "dark" ? "#141414" : "#041527", // light主题使用指定颜色
            border: "none",
            height: "100%",
          }}
        />
      </Drawer>
    );
  }

  // 桌面端使用原有的 Sider
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      collapsedWidth="80"
      style={siderStyle}
      trigger={
        <div style={{
          background: theme === "dark" ? "#141414" : "#001529",
          color: "white",
          textAlign: "center",
          padding: "16px 0",
          cursor: "pointer",
          transition: "all 0.3s ease",
          borderTop: `1px solid ${theme === "dark" ? "#434343" : "#002140"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          height: "48px",
        }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      }
    >
      <div style={logoStyle}>
        {collapsed ? (
          <span className="text-sm font-bold">
            <span className="bg-gradient-to-r from-slate-200 via-gray-100 to-slate-200 bg-clip-text text-transparent">
              L
            </span>
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent font-bold">
              S
            </span>
          </span>
        ) : (
          <span className="text-base font-bold">
            <span className="bg-gradient-to-r from-slate-200 via-gray-100 to-slate-200 bg-clip-text text-transparent">
              Label
            </span>
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent font-bold">
              Studio
            </span>
          </span>
        )}
      </div>

      <Menu
        theme={theme === "dark" ? "dark" : "dark"}
        defaultSelectedKeys={["dashboard"]}
        mode="inline"
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          ...SIDEBAR_STYLES.menu,
          backgroundColor: theme === "dark" ? "#0f0f0f" : undefined,
        }}
      />
    </Sider>
  );
};

export default DashboardSidebar;
