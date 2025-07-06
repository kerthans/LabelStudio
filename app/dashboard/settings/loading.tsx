'use client';
import React from 'react';
import LoadingSkeleton from '@/components/share/LoadingSkeleton';

const DashboardLoading: React.FC = () => {
  return (
    <LoadingSkeleton 
      type="adaptive"
      showTitle={true} 
      showAvatar={true}
      layout={{
        columns: 3,
        hasStatistics: true,
        hasChart: true,
        hasQuickActions: true,
        hasRecentActivity: true,
      }}
      contentAreas={[
        {
          span: 16,
          title: true,
          type: 'chart',
          rows: 8,
        },
        {
          span: 8,
          title: true,
          type: 'buttons',
          rows: 5, // 现在有5个按钮了
        },
      ]}
    />
  );
};

export default DashboardLoading;