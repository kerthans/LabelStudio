import React from 'react';

// 侧边栏组件属性类型
export interface DashboardSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  isMobile?: boolean; // 添加移动端标识
}

// 菜单配置类型
export interface MenuConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  children?: Omit<MenuConfig, 'icon' | 'children'>[];
}

// 子菜单配置类型（不包含图标和子菜单）
export interface SubMenuConfig {
  key: string;
  label: string;
  path: string;
}

// 路由映射表类型
export type RouteMap = Record<string, string>;

// 侧边栏样式类型
export interface SidebarStyles {
  sider: React.CSSProperties;
  logo: React.CSSProperties;
  menu: React.CSSProperties;
}

// 菜单点击事件类型
export interface MenuClickEvent {
  key: string;
}
