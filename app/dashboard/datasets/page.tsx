'use client';
import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Dropdown,
  Input,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  DatabaseOutlined,
  UploadOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface DatasetItem {
  key: string;
  name: string;
  type: string;
  size: string;
  samples: number;
  status: string;
  createTime: string;
  description: string;
}

const DatasetsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const mockData: DatasetItem[] = [
    {
      key: '1',
      name: '图像分类数据集',
      type: '图像',
      size: '2.3 GB',
      samples: 10000,
      status: 'active',
      createTime: '2024-01-15',
      description: '包含动物、植物等多类别图像数据',
    },
    {
      key: '2',
      name: '文本情感分析数据',
      type: '文本',
      size: '156 MB',
      samples: 50000,
      status: 'processing',
      createTime: '2024-01-10',
      description: '电商评论情感标注数据集',
    },
    {
      key: '3',
      name: '语音识别数据集',
      type: '音频',
      size: '5.8 GB',
      samples: 8000,
      status: 'completed',
      createTime: '2024-01-08',
      description: '中文语音识别训练数据',
    },
  ];

  const columns: ColumnsType<DatasetItem> = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <DatabaseOutlined />
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
          '图像': 'blue',
          '文本': 'green',
          '音频': 'orange',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '样本数',
      dataIndex: 'samples',
      key: 'samples',
      render: (samples) => samples.toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          active: { color: 'success', text: '活跃' },
          processing: { color: 'processing', text: '处理中' },
          completed: { color: 'default', text: '已完成' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" icon={<DownloadOutlined />}>
            下载
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总数据集"
              value={156}
              prefix={<DatabaseOutlined />}
              suffix="个"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总样本数"
              value={2847293}
              suffix="条"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="存储空间"
              value={45.8}
              suffix="GB"
            />
          </Card>
        </Col>
      </Row>

      {/* 数据集列表 */}
      <Card
        title="数据集列表"
        extra={
          <Space>
            <Input
              placeholder="搜索数据集"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button type="primary" icon={<PlusOutlined />}>
              创建数据集
            </Button>
            <Button icon={<UploadOutlined />}>
              上传数据
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

export default DatasetsPage;