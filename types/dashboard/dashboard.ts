import type { MenuProps } from 'antd';
import React from 'react';

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
  prefix?: React.ReactNode;
  precision?: number;
}

// 快捷操作数据类型
export interface QuickActionData {
  title: string;
  icon: React.ReactNode;
  type: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  description: string;
}

// 待办事项数据类型
export interface TodoItem {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  type: string;
  assignee: string;
}

// 数据采集状态类型
export interface CollectionStatus {
  name: string;
  status: 'running' | 'warning' | 'error' | 'stopped';
  progress: number;
  lastUpdate: string;
  todayCount: number;
  totalCount: number;
}

// 最新动态数据类型
export interface RecentActivity {
  id: number;
  action: string;
  content: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
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
  isMobile?: boolean; // 添加移动端标识
  onMenuClick?: () => void; // 添加菜单点击回调
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

// 招标项目数据类型
export interface TenderProject {
  id: string;
  title: string;
  type: string;
  status: 'draft' | 'published' | 'bidding' | 'evaluation' | 'completed' | 'cancelled';
  publishDate: string;
  deadline: string;
  budget: number;
  location: string;
  description?: string;
}

// 标书分析结果类型
export interface BidAnalysisResult {
  id: string;
  projectId: string;
  fileName: string;
  analysisDate: string;
  status: 'analyzing' | 'completed' | 'failed';
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestions: string[];
  keyPoints: string[];
}

// 资质审查数据类型
export interface QualificationReview {
  id: string;
  companyName: string;
  reviewDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  reviewer: string;
  qualificationType: string;
  validUntil: string;
  documents: string[];
}

// 评标数据类型
export interface EvaluationData {
  id: string;
  projectId: string;
  evaluatorName: string;
  evaluationDate: string;
  technicalScore: number;
  commercialScore: number;
  totalScore: number;
  ranking: number;
  comments: string;
}
