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
  Avatar,
  Progress,
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface TeamMember {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
  tasksCompleted: number;
  accuracy: number;
  joinDate: string;
  lastActive: string;
}

const TeamPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const mockMembers: TeamMember[] = [
    {
      key: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'annotator',
      status: 'active',
      tasksCompleted: 245,
      accuracy: 94.5,
      joinDate: '2024-01-01',
      lastActive: '2024-01-15 14:30',
    },
    {
      key: '2',
      name: '李四',
      email: 'lisi@example.com',
      role: 'reviewer',
      status: 'active',
      tasksCompleted: 156,
      accuracy: 97.2,
      joinDate: '2024-01-05',
      lastActive: '2024-01-15 13:45',
    },
    {
      key: '3',
      name: '王五',
      email: 'wangwu@example.com',
      role: 'admin',
      status: 'inactive',
      tasksCompleted: 89,
      accuracy: 92.8,
      joinDate: '2023-12-20',
      lastActive: '2024-01-10 09:20',
    },
  ];

  const columns: ColumnsType<TeamMember> = [
    {
      title: '成员',
      key: 'member',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          admin: { color: 'red', text: '管理员' },
          reviewer: { color: 'blue', text: '审核员' },
          annotator: { color: 'green', text: '标注员' },
        };
        const config = roleMap[role as keyof typeof roleMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          active: { color: 'success', text: '活跃' },
          inactive: { color: 'default', text: '离线' },
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '完成任务',
      dataIndex: 'tasksCompleted',
      key: 'tasksCompleted',
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy) => (
        <Progress
          percent={accuracy}
          size="small"
          status={accuracy >= 95 ? 'success' : accuracy >= 90 ? 'normal' : 'exception'}
        />
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" icon={<MailOutlined />}>
            发消息
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            移除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddMember = () => {
    form.validateFields().then((values) => {
      console.log('添加成员:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      {/* 团队统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="团队成员"
              value={12}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="活跃成员"
              value={9}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="平均准确率"
              value={94.8}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="本月完成"
              value={1847}
              suffix="任务"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 成员列表 */}
      <Card
        title="团队成员"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            邀请成员
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mockMembers}
          pagination={{
            total: mockMembers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* 邀请成员弹窗 */}
      <Modal
        title="邀请团队成员"
        open={isModalVisible}
        onOk={handleAddMember}
        onCancel={() => setIsModalVisible(false)}
        okText="发送邀请"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="annotator">标注员</Select.Option>
              <Select.Option value="reviewer">审核员</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="message" label="邀请消息">
            <Input.TextArea
              rows={3}
              placeholder="可选：添加邀请消息"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamPage;