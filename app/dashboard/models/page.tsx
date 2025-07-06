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
  Modal,
  Form,
  Input,
} from 'antd';
import {
  ExperimentOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface ModelItem {
  key: string;
  name: string;
  type: string;
  dataset: string;
  status: string;
  progress: number;
  accuracy: number;
  createTime: string;
  duration: string;
}

const ModelsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const mockData: ModelItem[] = [
    {
      key: '1',
      name: 'ResNet50-动物分类',
      type: '图像分类',
      dataset: '动物数据集',
      status: 'training',
      progress: 65,
      accuracy: 87.5,
      createTime: '2024-01-15 10:00',
      duration: '2h 30m',
    },
    {
      key: '2',
      name: 'BERT-情感分析',
      type: '文本分类',
      dataset: '评论数据集',
      status: 'completed',
      progress: 100,
      accuracy: 92.3,
      createTime: '2024-01-14 14:20',
      duration: '4h 15m',
    },
    {
      key: '3',
      name: 'YOLO-目标检测',
      type: '目标检测',
      dataset: '交通数据集',
      status: 'failed',
      progress: 45,
      accuracy: 0,
      createTime: '2024-01-13 09:30',
      duration: '1h 20m',
    },
  ];

  const columns: ColumnsType<ModelItem> = [
    {
      title: '模型名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <ExperimentOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '类型',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          training: { color: 'processing', text: '训练中' },
          completed: { color: 'success', text: '已完成' },
          failed: { color: 'error', text: '失败' },
          paused: { color: 'warning', text: '已暂停' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress, record) => (
        <Progress
          percent={progress}
          size="small"
          status={record.status === 'failed' ? 'exception' : progress === 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy) => accuracy > 0 ? `${accuracy}%` : '-',
    },
    {
      title: '训练时长',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>
            查看
          </Button>
          {record.status === 'training' && (
            <Button type="link" icon={<PauseCircleOutlined />}>
              暂停
            </Button>
          )}
          {record.status === 'paused' && (
            <Button type="link" icon={<PlayCircleOutlined />}>
              继续
            </Button>
          )}
          {(record.status === 'training' || record.status === 'paused') && (
            <Button type="link" danger icon={<StopOutlined />}>
              停止
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateModel = () => {
    form.validateFields().then((values) => {
      console.log('创建模型:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      {/* 模型统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总模型数"
              value={24}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="训练中"
              value={3}
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
              title="平均准确率"
              value={89.7}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 模型列表 */}
      <Card
        title="模型训练"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            创建训练任务
          </Button>
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

      {/* 创建模型弹窗 */}
      <Modal
        title="创建训练任务"
        open={isModalVisible}
        onOk={handleCreateModel}
        onCancel={() => setIsModalVisible(false)}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="模型名称"
            rules={[{ required: true, message: '请输入模型名称' }]}
          >
            <Input placeholder="请输入模型名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="模型类型"
            rules={[{ required: true, message: '请选择模型类型' }]}
          >
            <Select placeholder="请选择模型类型">
              <Select.Option value="image_classification">图像分类</Select.Option>
              <Select.Option value="text_classification">文本分类</Select.Option>
              <Select.Option value="object_detection">目标检测</Select.Option>
              <Select.Option value="ner">命名实体识别</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dataset"
            label="训练数据集"
            rules={[{ required: true, message: '请选择数据集' }]}
          >
            <Select placeholder="请选择数据集">
              <Select.Option value="dataset1">动物数据集</Select.Option>
              <Select.Option value="dataset2">评论数据集</Select.Option>
              <Select.Option value="dataset3">交通数据集</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModelsPage;