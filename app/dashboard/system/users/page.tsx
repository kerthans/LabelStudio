"use client";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  UnlockOutlined,
  UserAddOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  realName: string;
  avatar: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  createdAt: string;
  annotationCount: number;
  qualityScore: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  permissions: string[];
}

const UsersPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // 模拟用户数据
  const [users] = useState<User[]>([
    {
      id: "user_001",
      username: "zhangming",
      email: "zhangming@company.com",
      phone: "13800138001",
      realName: "张明",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhang",
      role: "标注员",
      department: "医疗AI部",
      status: 'active',
      lastLogin: "2024-01-15 14:30",
      createdAt: "2023-12-01",
      annotationCount: 15680,
      qualityScore: 96.8,
      level: 'expert',
      permissions: ["标注任务", "质量检查"]
    },
    {
      id: "user_002",
      username: "lihong",
      email: "lihong@company.com",
      phone: "13800138002",
      realName: "李红",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=li",
      role: "项目经理",
      department: "项目管理部",
      status: 'active',
      lastLogin: "2024-01-15 16:45",
      createdAt: "2023-11-15",
      annotationCount: 8920,
      qualityScore: 94.2,
      level: 'advanced',
      permissions: ["项目管理", "任务分配", "质量审核"]
    },
    {
      id: "user_003",
      username: "wangqiang",
      email: "wangqiang@company.com",
      phone: "13800138003",
      realName: "王强",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=wang",
      role: "质量专家",
      department: "质量控制部",
      status: 'active',
      lastLogin: "2024-01-15 09:20",
      createdAt: "2023-10-20",
      annotationCount: 12450,
      qualityScore: 98.1,
      level: 'expert',
      permissions: ["质量审核", "标准制定", "培训管理"]
    },
    {
      id: "user_004",
      username: "zhaomei",
      email: "zhaomei@company.com",
      phone: "13800138004",
      realName: "赵美",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhao",
      role: "标注员",
      department: "数据标注部",
      status: 'inactive',
      lastLogin: "2024-01-10 17:30",
      createdAt: "2024-01-05",
      annotationCount: 2340,
      qualityScore: 89.5,
      level: 'beginner',
      permissions: ["标注任务"]
    },
    {
      id: "user_005",
      username: "sunwei",
      email: "sunwei@company.com",
      phone: "13800138005",
      realName: "孙伟",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=sun",
      role: "系统管理员",
      department: "技术部",
      status: 'locked',
      lastLogin: "2024-01-12 11:15",
      createdAt: "2023-09-01",
      annotationCount: 0,
      qualityScore: 0,
      level: 'advanced',
      permissions: ["系统管理", "用户管理", "权限配置"]
    }
  ]);

  const statusOptions = [
    { value: "all", label: "全部状态" },
    { value: "active", label: "正常" },
    { value: "inactive", label: "停用" },
    { value: "locked", label: "锁定" },
  ];

  const roleOptions = [
    { value: "all", label: "全部角色" },
    { value: "标注员", label: "标注员" },
    { value: "项目经理", label: "项目经理" },
    { value: "质量专家", label: "质量专家" },
    { value: "系统管理员", label: "系统管理员" },
  ];

  const departmentOptions = [
    { value: "all", label: "全部部门" },
    { value: "医疗AI部", label: "医疗AI部" },
    { value: "项目管理部", label: "项目管理部" },
    { value: "质量控制部", label: "质量控制部" },
    { value: "数据标注部", label: "数据标注部" },
    { value: "技术部", label: "技术部" },
  ];

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.realName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'locked': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '正常';
      case 'inactive': return '停用';
      case 'locked': return '锁定';
      default: return '未知';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'gold';
      case 'advanced': return 'blue';
      case 'intermediate': return 'green';
      case 'beginner': return 'default';
      default: return 'default';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'expert': return '专家';
      case 'advanced': return '高级';
      case 'intermediate': return '中级';
      case 'beginner': return '初级';
      default: return '未知';
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setUserModalVisible(true);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 "${user.realName}" 吗？此操作不可恢复。`,
      onOk: () => {
        message.success(`用户 "${user.realName}" 已删除`);
      },
    });
  };

  const handleStatusChange = (user: User, newStatus: string) => {
    const statusText = getStatusText(newStatus);
    message.success(`用户 "${user.realName}" 状态已更改为 "${statusText}"`);
  };

  const columns: ColumnsType<User> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 280,
      render: (_, user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge
            dot
            color={user.status === 'active' ? '#52c41a' : user.status === 'locked' ? '#ff4d4f' : '#d9d9d9'}
            offset={[-2, 32]}
          >
            <Avatar src={user.avatar} size={40} />
          </Badge>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>{user.realName}</div>
            <div style={{ fontSize: 12, color: '#666' }}>@{user.username}</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '角色部门',
      key: 'roleInfo',
      width: 200,
      render: (_, user) => (
        <div>
          <Tag color="blue" style={{ marginBottom: 4 }}>{user.role}</Tag>
          <div style={{ fontSize: 12, color: '#666' }}>{user.department}</div>
          <Tag color={getLevelColor(user.level)} className="small-tag">
            {getLevelText(user.level)}
          </Tag>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 150,
      render: (_, user) => (
        <div>
          <div style={{ fontSize: 12, marginBottom: 2 }}>
            <PhoneOutlined style={{ marginRight: 4 }} />
            {user.phone}
          </div>
        </div>
      ),
    },
    {
      title: '工作统计',
      key: 'stats',
      width: 150,
      render: (_, user) => (
        <div>
          <div style={{ fontSize: 12, marginBottom: 2 }}>标注: {user.annotationCount.toLocaleString()}</div>
          {user.qualityScore > 0 && (
            <div style={{ fontSize: 12 }}>质量: {user.qualityScore}%</div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, user) => (
        <Tag color={getStatusColor(user.status)}>
          {getStatusText(user.status)}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      key: 'lastLogin',
      width: 150,
      render: (_, user) => (
        <div style={{ fontSize: 12, color: '#666' }}>
          {user.lastLogin}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_, user) => {
        const menuItems = [
          {
            key: 'view',
            label: '查看详情',
            icon: <EyeOutlined />,
          },
          {
            key: 'edit',
            label: '编辑用户',
            icon: <EditOutlined />,
            onClick: () => handleEdit(user),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'activate',
            label: user.status === 'active' ? '停用用户' : '激活用户',
            icon: user.status === 'active' ? <LockOutlined /> : <UnlockOutlined />,
            onClick: () => handleStatusChange(user, user.status === 'active' ? 'inactive' : 'active'),
          },
          {
            key: 'lock',
            label: user.status === 'locked' ? '解锁用户' : '锁定用户',
            icon: user.status === 'locked' ? <UnlockOutlined /> : <LockOutlined />,
            onClick: () => handleStatusChange(user, user.status === 'locked' ? 'active' : 'locked'),
          },
          {
            type: 'divider' as const,
          },
          {
            key: 'delete',
            label: '删除用户',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(user),
          },
        ];

        return (
          <Space>
            <Button type="text" icon={<EyeOutlined />} size="small">
              查看
            </Button>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Button type="text" size="small">
                更多
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <UserOutlined />
              用户管理
            </Title>
            <Text type="secondary">管理系统用户账户、角色权限和工作状态</Text>
          </div>
          <Space>
            <Button icon={<UserAddOutlined />}>批量导入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setEditingUser(null);
              form.resetFields();
              setUserModalVisible(true);
            }}>
              新增用户
            </Button>
          </Space>
        </div>

        {/* 搜索和筛选 */}
        <Row gutter={16}>
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="搜索用户名、姓名或邮箱"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
          <Col xs={8} sm={4} md={3}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              size="large"
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={4} md={3}>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: "100%" }}
              size="large"
            >
              {roleOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={4} md={3}>
            <Select
              value={departmentFilter}
              onChange={setDepartmentFilter}
              style={{ width: "100%" }}
              size="large"
            >
              {departmentOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* 批量操作 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginTop: 16, padding: 16, background: '#f0f2f5', borderRadius: 8 }}>
            <Space>
              <Text>已选择 {selectedRowKeys.length} 个用户</Text>
              <Button size="small">批量激活</Button>
              <Button size="small">批量停用</Button>
              <Button size="small" danger>批量删除</Button>
            </Space>
          </div>
        )}
      </div>

      {/* 用户表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            total: filteredUsers.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 用户编辑弹窗 */}
      <Modal
        title={editingUser ? "编辑用户" : "新增用户"}
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            console.log('Form values:', values);
            message.success(editingUser ? '用户信息已更新' : '用户创建成功');
            setUserModalVisible(false);
          });
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="realName" label="真实姓名" rules={[{ required: true }]}>
                <Input placeholder="请输入真实姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="role" label="角色" rules={[{ required: true }]}>
                <Select placeholder="请选择角色">
                  <Option value="标注员">标注员</Option>
                  <Option value="项目经理">项目经理</Option>
                  <Option value="质量专家">质量专家</Option>
                  <Option value="系统管理员">系统管理员</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="部门" rules={[{ required: true }]}>
                <Select placeholder="请选择部门">
                  <Option value="医疗AI部">医疗AI部</Option>
                  <Option value="项目管理部">项目管理部</Option>
                  <Option value="质量控制部">质量控制部</Option>
                  <Option value="数据标注部">数据标注部</Option>
                  <Option value="技术部">技术部</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="level" label="技能等级" rules={[{ required: true }]}>
                <Select placeholder="请选择技能等级">
                  <Option value="beginner">初级</Option>
                  <Option value="intermediate">中级</Option>
                  <Option value="advanced">高级</Option>
                  <Option value="expert">专家</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                <Select placeholder="请选择状态">
                  <Option value="active">正常</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="locked">锁定</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
