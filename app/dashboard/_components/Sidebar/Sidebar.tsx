'use client';
import React, { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import type { MenuItem } from '@/types/dashboard/dashboard';
import type {
  DashboardSidebarProps,
  MenuConfig,
  RouteMap,
  SidebarStyles,
  MenuClickEvent,
} from '@/types/dashboard/sidebar';
import { MENU_CONFIG_DATA, type MenuConfigData } from './menuConfig';

const { Sider } = Layout;

// 图标映射表
const ICON_MAP: Record<string, React.ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  PieChartOutlined: <PieChartOutlined />,
  DesktopOutlined: <DesktopOutlined />,
  UserOutlined: <UserOutlined />,
  TeamOutlined: <TeamOutlined />,
  VideoCameraOutlined: <VideoCameraOutlined />,
  FileOutlined: <FileOutlined />,
  SettingOutlined: <SettingOutlined />,
};

// 将数据配置转换为包含 React 组件的配置
const transformDataToMenuConfig = (data: MenuConfigData[]): MenuConfig[] => {
  return data.map(item => ({
    key: item.key,
    label: item.label,
    icon: ICON_MAP[item.iconType],
    path: item.path,
    children: item.children?.map(child => ({
      key: child.key,
      label: child.label,
      path: child.path,
    })),
  }));
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
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  logo: {
    height: 64,
    margin: 16,
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  menu: {
    borderRight: 0,
  },
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ collapsed, onCollapse }) => {
  const router = useRouter();
  
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
    fontSize: collapsed ? '14px' : '16px',
  }), [collapsed]);

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={onCollapse}
      breakpoint="lg"
      collapsedWidth="80"
      style={SIDEBAR_STYLES.sider}
    >
      <div style={logoStyle}>
        {collapsed ? 'MA' : 'Magnify AI'}
      </div>
      
      <Menu 
        theme="dark" 
        defaultSelectedKeys={['dashboard']} 
        mode="inline" 
        items={menuItems}
        onClick={handleMenuClick}
        style={SIDEBAR_STYLES.menu}
      />
    </Sider>
  );
};

export default DashboardSidebar;