'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
} from 'antd';
import DashboardLoading from './loading';
import type { StatisticCardData, DashboardState } from '@/types/dashboard/dashboard';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingKey, setLoadingKey] = useState<number>(0);

  // 统计数据配置
  const statisticData: StatisticCardData[] = [
    {
      title: '总用户数',
      value: 11280,
      valueStyle: { color: '#3f8600' },
      suffix: '人',
    },
    {
      title: '今日访问',
      value: 1128,
      valueStyle: { color: '#1890ff' },
      suffix: '次',
    },
    {
      title: '销售额',
      value: 112893,
      precision: 2,
      valueStyle: { color: '#cf1322' },
      prefix: '¥',
    },
    {
      title: '转化率',
      value: 9.3,
      precision: 2,
      valueStyle: { color: '#722ed1' },
      suffix: '%',
    },
  ];

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setLoadingKey(prev => prev + 1);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  if (isLoading) {
    return <DashboardLoading key={loadingKey} />;
  }

  return (
    <>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {statisticData.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={stat.valueStyle}
                suffix={stat.suffix}
                prefix={stat.prefix}
                precision={stat.precision}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要内容卡片 */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="数据趋势" style={{ marginBottom: 16 }}>
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#fafafa',
              borderRadius: 8
            }}>
              <p style={{ color: '#999', fontSize: '16px' }}>📊 这里可以放置图表组件</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="快速操作" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button type="primary" block size="large">
                🚀 新建项目
              </Button>
              <Button block size="large">
                📥 导入数据
              </Button>
              <Button block size="large">
                📊 生成报告
              </Button>
              <Button block size="large">
                ⚙️ 系统设置
              </Button>
              <Button 
                block 
                size="large" 
                onClick={handleLoadingDemo}
                style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', color: 'white' }}
              >
                ⏳ Loading 演示
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="最近活动" style={{ marginTop: 16 }}>
        <div style={{ 
          height: 200, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#fafafa',
          borderRadius: 8
        }}>
          <p style={{ color: '#999', fontSize: '16px' }}>📋 这里可以显示最近的活动列表</p>
        </div>
      </Card>
    </>
  );
};

export default Dashboard;