'use client';
import React, { useState } from 'react';
import {
  Layout,
} from 'antd';
import type { DashboardLayoutProps } from '@/types/dashboard/dashboard';
import DashboardHeader from './_components/Header';
import DashboardFooter from './_components/Footer';
import DashboardSidebar from './_components/Sidebar/Sidebar';
import DynamicBreadcrumb from './_components/DynamicBreadcrumb';

const { Content } = Layout;

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <DashboardSidebar 
        collapsed={collapsed} 
        onCollapse={setCollapsed} 
      />
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <DashboardHeader
          title="控制台"
          searchPlaceholder="搜索功能、内容..."
          notificationCount={5}
          userName="管理员"
        />
        <div style={{ padding: '16px 24px 0' }}>
          <DynamicBreadcrumb />
        </div>
        <Content style={{ margin: '16px 24px 0', overflow: 'initial' }}>
          {children}
        </Content>
        <DashboardFooter
          companyName="Magnify AI Dashboard"
          teamName="Your Team"
        />
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;