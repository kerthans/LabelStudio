'use client';
import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Select,
  DatePicker,
} from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface QualityItem {
  key: string;
  taskName: string;
  annotator: string;
  reviewer: string;
  accuracy: number;
  status: string;
  reviewTime: string;
  issues: number;
}

const QualityPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');

  const mockData: QualityItem[] = [
    {
      key: '1',
      taskName: '动物图像分类',
      annotator: '张三',
      reviewer: '审核员A',
      accuracy: 95.5,
      status: 'approved',
      reviewTime: '2024-01-15 14:30',
      issues: 0,
    },
    {
      key: '2',
      taskName: '文本情感分析',
      annotator: '李四',
      reviewer: '审核员B',
      accuracy: 87.2,
      status: 'rejected',
      reviewTime: '2024-01-15 13:20',
      issues: 3,
    },
    {
      key: '3',
      taskName: '目标检测标注',
      annotator: '王五',
      reviewer: '审核员A',
      accuracy: 92.8,
      status: 'pending',
      reviewTime: '-',
      issues: 1,
    },
  ];

  const columns: ColumnsType<QualityItem> = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '标注员',
      dataIndex: 'annotator',
      key: 'annotator',
    },
    {
      title: '审核员',
      dataIndex: 'reviewer',
      key: 'reviewer',
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy) => (
        <Progress
          percent={accuracy}
          size="small"
          status={accuracy >= 90 ? 'success' : accuracy >= 80 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          approved: { color: 'success', text: '通过', icon: <CheckCircleOutlined /> },
          rejected: { color: 'error', text: '拒绝', icon: <CloseCircleOutlined /> },
          pending: { color: 'processing', text: '待审核', icon: <ExclamationCircleOutlined /> },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '问题数',
      dataIndex: 'issues',
      key: 'issues',
      render: (issues) => (
        <span style={{ color: issues > 0 ? '#f5222d' : '#52c41a' }}>
          {issues}
        </span>
      ),
    },
    {
      title: '审核时间',
      dataIndex: 'reviewTime',
      key: 'reviewTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>
            查看详情
          </Button>
          {record.status === 'pending' && (
            <Button type="link">
              开始审核
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 质量统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总审核数"
              value={1284}
              prefix={<SafetyCertificateOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="通过率"
              value={89.5}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均准确率"
              value={91.8}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="待审核"
              value={45}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 审核列表 */}
      <Card
        title="质量审核"
        extra={
          <Space>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Select.Option value="today">今天</Select.Option>
              <Select.Option value="week">本周</Select.Option>
              <Select.Option value="month">本月</Select.Option>
            </Select>
            <Button type="primary">
              开始批量审核
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={{
            total: mockData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default QualityPage;