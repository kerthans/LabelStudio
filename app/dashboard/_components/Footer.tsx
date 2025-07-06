'use client';
import React from 'react';
import { Layout, theme } from 'antd';
import type { DashboardFooterProps } from '@/types/dashboard/dashboard';

const { Footer } = Layout;

const DashboardFooter: React.FC<DashboardFooterProps> = ({
  companyName = 'Magnify AI',
  teamName = 'Magnify Team',
  year,
  style,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const currentYear = year || new Date().getFullYear();

  return (
    <Footer 
      style={{ 
        textAlign: 'center', 
        background: colorBgContainer,
        marginTop: 24,
        ...style,
      }}
    >
      {companyName} ©{currentYear} Created by {teamName}
    </Footer>
  );
};

export default DashboardFooter;