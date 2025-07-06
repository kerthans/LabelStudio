'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Progress,
  List,
  Avatar,
  Tag,
} from 'antd';
import {
  DatabaseOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import DashboardLoading from './loading';
import type { StatisticCardData, DashboardState } from '@/types/dashboard/dashboard';

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingKey, setLoadingKey] = useState<number>(0);

  // 数据标注平台统计数据配置
  const statisticData: StatisticCardData[] = [
    {
      title: '总数据集',
      value: 156,
      valueStyle: { color: '#3f8600' },
      suffix: '个',
    },
    {
      title: '待标注任务',
      value: 2847,
      valueStyle: { color: '#1890ff' },
      suffix: '条',
    },
    {
      title: '已完成标注',
      value: 18293,
      valueStyle: { color: '#52c41a' },
      suffix: '条',
    },
    {
      title: '标注准确率',
      value: 94.8,
      precision: 1,
      valueStyle: { color: '#722ed1' },
      suffix: '%',
    },
  ];

  // 最近活动数据
  const recentActivities = [
    {
      id: 1,
      title: '图像分类任务 - 动物识别',
      description: '张三完成了100条数据标注',
      time: '2分钟前',
      type: 'completed',
      avatar: <UserOutlined />,
    },
    {
      id: 2,
      title: '文本标注任务 - 情感分析',
      description: '李四创建了新的标注任务',
      time: '15分钟前',
      type: 'created',
      avatar: <FileTextOutlined />,
    },
    {
      id: 3,
      title: '数据集上传',
      description: '王五上传了新的训练数据集',
      time: '1小时前',
      type: 'uploaded',
      avatar: <DatabaseOutlined />,
    },
    {
      id: 4,
      title: '质量审核',
      description: '赵六审核通过了50条标注数据',
      time: '2小时前',
      type: 'reviewed',
      avatar: <CheckCircleOutlined />,
    },
  ];

  // 项目进度数据
  const projectProgress = [
    { name: '图像分类项目', progress: 85, status: 'active' },
    { name: '文本情感分析', progress: 62, status: 'active' },
    { name: '目标检测任务', progress: 94, status: 'success' },
    { name: '语音识别标注', progress: 38, status: 'normal' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'created':
        return <EditOutlined style={{ color: '#1890ff' }} />;
      case 'uploaded':
        return <DatabaseOutlined style={{ color: '#722ed1' }} />;
      case 'reviewed':
        return <CheckCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getActivityTag = (type: string) => {
    switch (type) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'created':
        return <Tag color="processing">新建</Tag>;
      case 'uploaded':
        return <Tag color="purple">上传</Tag>;
      case 'reviewed':
        return <Tag color="warning">审核</Tag>;
      default:
        return <Tag>其他</Tag>;
    }
  };

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

      {/* 主要内容区域 */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          {/* 项目进度卡片 */}
          <Card title="项目进度" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {projectProgress.map((project, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>{project.name}</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress 
                    percent={project.progress} 
                    status={project.status as any}
                    showInfo={false}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          {/* 快速操作卡片 */}
          <Card title="快速操作" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button type="primary" block size="large" icon={<DatabaseOutlined />}>
                创建数据集
              </Button>
              <Button block size="large" icon={<EditOutlined />}>
                新建标注任务
              </Button>
              <Button block size="large" icon={<FileTextOutlined />}>
                导入数据
              </Button>
              <Button block size="large" icon={<CheckCircleOutlined />}>
                质量审核
              </Button>
              <Button 
                block 
                size="large" 
                onClick={handleLoadingDemo}
                style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', color: 'white' }}
                icon={<ClockCircleOutlined />}
              >
                Loading 演示
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 最近活动卡片 */}
      <Card title="最近活动" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={getActivityIcon(item.type)} />}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{item.title}</span>
                    {getActivityTag(item.type)}
                  </div>
                }
                description={
                  <div>
                    <div>{item.description}</div>
                    <div style={{ color: '#999', fontSize: '12px', marginTop: 4 }}>
                      {item.time}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Dashboard;