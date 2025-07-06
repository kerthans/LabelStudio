'use client';
import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Progress,
  Input,
  Select,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  EditOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface AnnotationTask {
  key: string;
  name: string;
  type: string;
  dataset: string;
  progress: number;
  status: string;
  assignee: string;
  createTime: string;
  deadline: string;
}

const AnnotationPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockTasks: AnnotationTask[] = [
    {
      key: '1',
      name: '动物图像分类标注',
      type: '图像分类',
      dataset: '动物数据集',
      progress: 75,
      status: 'in_progress',
      assignee: '张三',
      createTime: '2024-01-15',
      deadline: '2024-02-15',
    },
    {
      key: '2',
      name: '商品评论情感分析',
      type: '文本分类',
      dataset: '电商评论数据',
      progress: 45,
      status: 'in_progress',
      assignee: '李四',
      createTime: '2024-01-12',
      deadline: '2024-02-10',
    },
    {
      key: '3',
      name: '目标检测标注任务',
      type: '目标检测',
      dataset: '交通场景数据',
      progress: 100,
      status: 'completed',
      assignee: '王五',
      createTime: '2024-01-08',
      deadline: '2024-01-30',
    },
  ];

  const columns: ColumnsType<AnnotationTask> = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <EditOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '标注类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colorMap: Record<string, string> = {
          '图像分类': 'blue',
          '文本分类': 'green',
          '目标检测': 'orange',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: '数据集',
      dataIndex: 'dataset',
      key: 'dataset',
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          status={progress === 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          in_progress: { color: 'processing', text: '进行中' },
          completed: { color: 'success', text: '已完成' },
          paused: { color: 'warning', text: '已暂停' },
          pending: { color: 'default', text: '待开始' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>
            查看
          </Button>
          <Button type="link" icon={<PlayCircleOutlined />}>
            开始标注
          </Button>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={48}
              prefix={<EditOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="进行中"
              value={23}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已完成"
              value={18}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均进度"
              value={67.5}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 任务列表 */}
      <Card
        title="标注任务"
        extra={
          <Space>
            <Input
              placeholder="搜索任务"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="in_progress">进行中</Select.Option>
              <Select.Option value="completed">已完成</Select.Option>
              <Select.Option value="paused">已暂停</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />}>
              创建任务
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={mockTasks}
          pagination={{
            total: mockTasks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default AnnotationPage;