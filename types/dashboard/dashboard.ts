import React from 'react';
import type { MenuProps } from 'antd';

// 菜单项类型
export type MenuItem = Required<MenuProps>['items'][number];

// 仪表板布局组件属性
export interface DashboardLayoutProps {
  children: React.ReactNode;
}

// 用户菜单项类型
export interface UserMenuItem {
  key: string;
  label: string;
  type?: 'divider';
}

// 统计卡片数据类型
export interface StatisticCardData {
  title: string;
  value: number;
  valueStyle?: React.CSSProperties;
  suffix?: string;
  prefix?: string;
  precision?: number;
}

// 仪表板状态类型
export interface DashboardState {
  isLoading: boolean;
  loadingKey: number;
}

// 面包屑导航项类型
export interface BreadcrumbItem {
  title: string;
  href?: string;
}

// 菜单配置类型
export interface MenuConfig {
  label: string;
  key: string;
  icon?: React.ReactNode;
  children?: MenuConfig[];
}

// 页头组件属性
export interface DashboardHeaderProps {
  title?: string;
  searchPlaceholder?: string;
  notificationCount?: number;
  userName?: string;
  onSearch?: (value: string) => void;
  onUserMenuClick?: (key: string) => void;
}

// 页脚组件属性
export interface DashboardFooterProps {
  companyName?: string;
  teamName?: string;
  year?: number;
  style?: React.CSSProperties;
}