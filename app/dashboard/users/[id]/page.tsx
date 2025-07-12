"use client";
import type {
  TwoFactorStatus,
  User,
  UserRole,
  UserStatus,
  VerificationStatus,
} from "@/types/dashboard/user";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DesktopOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  GlobalOutlined,
  HistoryOutlined,
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  MobileOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  ConfigProvider,
  Descriptions,
  Divider,
  Form,
  List,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
  message,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface LoginRecord {
  id: string;
  loginTime: string;
  ip: string;
  location: string;
  device: string;
  status: "success" | "failed";
  browser?: string;
  os?: string;
}

interface OperationRecord {
  id: string;
  action: string;
  target: string;
  time: string;
  result: "success" | "failed";
  description: string;
  module: string;
  risk: "low" | "medium" | "high";
}

const UserDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = theme.useToken();
  const userId = params.id as string;

  const [_loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [form] = Form.useForm();

  // 模拟用户数据
  const mockUser: User = {
    id: userId,
    username: "admin",
    email: "admin@magnify.ai",
    phone: "13800138000",
    realName: "张三",
    avatar: "",
    role: "admin" as UserRole,
    status: "active" as UserStatus,
    verificationStatus: "verified" as VerificationStatus,
    twoFactorStatus: "enabled" as TwoFactorStatus,
    permissions: [
      { id: "1", name: "用户管理", description: "管理系统用户", module: "user" },
      { id: "2", name: "项目管理", description: "管理招标项目", module: "project" },
      { id: "3", name: "系统设置", description: "修改系统配置", module: "system" },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    lastLoginAt: "2024-01-15T10:30:00Z",
    loginCount: 156,
  };

  // 模拟登录记录
  const mockLoginRecords: LoginRecord[] = [
    {
      id: "1",
      loginTime: "2024-01-15 10:30:25",
      ip: "192.168.1.100",
      location: "北京市朝阳区",
      device: "Chrome 120.0 / Windows 10",
      browser: "Chrome 120.0",
      os: "Windows 10",
      status: "success",
    },
    {
      id: "2",
      loginTime: "2024-01-14 15:20:10",
      ip: "192.168.1.100",
      location: "北京市朝阳区",
      device: "Chrome 120.0 / Windows 10",
      browser: "Chrome 120.0",
      os: "Windows 10",
      status: "success",
    },
    {
      id: "3",
      loginTime: "2024-01-13 09:15:30",
      ip: "192.168.1.101",
      location: "上海市浦东新区",
      device: "Safari 17.0 / macOS",
      browser: "Safari 17.0",
      os: "macOS",
      status: "failed",
    },
  ];

  // 模拟操作记录
  const mockOperationRecords: OperationRecord[] = [
    {
      id: "1",
      action: "创建用户",
      target: "user_002",
      time: "2024-01-15 14:30:00",
      result: "success",
      description: "创建新用户 manager01",
      module: "用户管理",
      risk: "medium",
    },
    {
      id: "2",
      action: "修改权限",
      target: "user_003",
      time: "2024-01-15 11:20:00",
      result: "success",
      description: "为用户 user01 添加项目管理权限",
      module: "权限管理",
      risk: "high",
    },
    {
      id: "3",
      action: "重置密码",
      target: "user_004",
      time: "2024-01-14 16:45:00",
      result: "success",
      description: "重置用户 viewer01 的登录密码",
      module: "安全管理",
      risk: "medium",
    },
  ];

  // 角色配置
  const roleConfig = {
    super_admin: { label: "超级管理员", color: "red" },
    admin: { label: "管理员", color: "orange" },
    manager: { label: "经理", color: "blue" },
    user: { label: "用户", color: "green" },
    viewer: { label: "访客", color: "default" },
  };

  // 状态配置
  const statusConfig = {
    active: { label: "活跃", color: "success" },
    inactive: { label: "非活跃", color: "default" },
    pending: { label: "待审核", color: "processing" },
    suspended: { label: "已暂停", color: "error" },
  };

  // 认证状态配置
  const verificationConfig = {
    verified: { label: "已认证", color: "success", icon: <CheckCircleOutlined /> },
    pending: { label: "待审核", color: "processing", icon: <ClockCircleOutlined /> },
    rejected: { label: "已拒绝", color: "error", icon: <ExclamationCircleOutlined /> },
    not_submitted: { label: "未提交", color: "default", icon: <UserOutlined /> },
  };

  // 风险等级配置
  const riskConfig = {
    low: { label: "低风险", color: "success" },
    medium: { label: "中风险", color: "warning" },
    high: { label: "高风险", color: "error" },
  };

  // 登录记录表格列
  const loginColumns: ColumnsType<LoginRecord> = [
    {
      title: "登录时间",
      dataIndex: "loginTime",
      key: "loginTime",
      width: 160,
      render: (time: string) => (
        <div>
          <div style={{ fontWeight: 500, color: token.colorText }}>
            {new Date(time).toLocaleDateString()}
          </div>
          <div style={{ fontSize: "12px", color: token.colorTextSecondary }}>
            {new Date(time).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      width: 130,
      render: (ip: string) => (
        <Text code style={{ fontSize: "12px" }}>{ip}</Text>
      ),
    },
    {
      title: "登录地点",
      dataIndex: "location",
      key: "location",
      width: 140,
      render: (location: string) => (
        <Space size={4}>
          <GlobalOutlined style={{ color: token.colorTextSecondary }} />
          <span style={{ fontSize: "13px" }}>{location}</span>
        </Space>
      ),
    },
    {
      title: "设备信息",
      dataIndex: "device",
      key: "device",
      width: 200,
      render: (device: string, record) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {record.os?.includes("Windows") ? <DesktopOutlined /> :
              record.os?.includes("macOS") ? <DesktopOutlined /> : <MobileOutlined />}
            <span style={{ fontSize: "13px", fontWeight: 500 }}>{record.browser}</span>
          </div>
          <div style={{ fontSize: "12px", color: token.colorTextSecondary }}>
            {record.os}
          </div>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Badge
          status={status === "success" ? "success" : "error"}
          text={
            <span style={{
              fontWeight: 500,
              color: status === "success" ? token.colorSuccess : token.colorError,
            }}>
              {status === "success" ? "成功" : "失败"}
            </span>
          }
        />
      ),
    },
  ];

  // 加载用户数据
  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUser);
    } catch (_error) {
      message.error("加载用户数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // 处理编辑用户
  const handleEditUser = () => {
    if (user) {
      form.setFieldsValue({
        role: user.role,
        status: user.status,
        twoFactorStatus: user.twoFactorStatus === "enabled",
      });
      setEditModalVisible(true);
    }
  };

  // 处理保存编辑
  const handleSaveEdit = async (_values: { role: UserRole; status: UserStatus; twoFactorStatus: boolean }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      message.success("用户信息更新成功");
      setEditModalVisible(false);
      loadUserData();
    } catch (_error) {
      message.error("更新失败，请重试");
    }
  };

  // 处理权限管理
  const handlePermissionManagement = () => {
    setPermissionModalVisible(true);
  };

  // 处理重置密码
  const handleResetPassword = () => {
    Modal.confirm({
      title: "重置密码",
      content: `确定要重置用户 ${user?.realName || user?.username} 的密码吗？`,
      icon: <SafetyOutlined style={{ color: token.colorWarning }} />,
      okText: "确认重置",
      cancelText: "取消",
      onOk: () => {
        message.success("密码重置成功，新密码已发送到用户邮箱");
      },
    });
  };

  // 处理账户锁定/解锁
  const handleToggleAccount = () => {
    const isActive = user?.status === "active";
    Modal.confirm({
      title: isActive ? "锁定账户" : "解锁账户",
      content: `确定要${isActive ? "锁定" : "解锁"}用户 ${user?.realName || user?.username} 的账户吗？`,
      icon: <ExclamationCircleOutlined style={{ color: token.colorError }} />,
      okType: isActive ? "danger" : "primary",
      okText: isActive ? "确认锁定" : "确认解锁",
      cancelText: "取消",
      onOk: () => {
        message.success(`账户${isActive ? "锁定" : "解锁"}成功`);
      },
    });
  };

  useEffect(() => {
    loadUserData();
  }, [loadUserData, userId]);

  if (!user) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
      }}>
        <Text>加载中...</Text>
      </div>
    );
  }

  return (
    <div style={{
      padding: "24px",
      backgroundColor: token.colorBgLayout,
      minHeight: "100vh",
    }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space size={16}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              style={{ borderRadius: "6px" }}
            >
              返回
            </Button>
            <div>
              <Title level={2} style={{ margin: 0, color: token.colorText }}>
                用户详情
              </Title>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                查看和管理用户的详细信息
              </Text>
            </div>
          </Space>
        </Col>
        <Col>
          <Space size={12}>
            <Button
              icon={<EditOutlined />}
              onClick={handleEditUser}
              style={{ borderRadius: "6px" }}
            >
              编辑用户
            </Button>
            <Button
              icon={<SafetyOutlined />}
              onClick={handleResetPassword}
              style={{ borderRadius: "6px" }}
            >
              重置密码
            </Button>
            <Button
              icon={user.status === "active" ? <LockOutlined /> : <UnlockOutlined />}
              onClick={handleToggleAccount}
              danger={user.status === "active"}
              style={{ borderRadius: "6px" }}
            >
              {user.status === "active" ? "锁定账户" : "解锁账户"}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 用户基本信息卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: "8px",
              border: `1px solid ${token.colorBorder}`,
              height: "100%",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                src={user.avatar}
                style={{
                  backgroundColor: user.avatar ? "transparent" : token.colorPrimary,
                  border: `2px solid ${token.colorBorder}`,
                  marginBottom: "16px",
                }}
              />
              <div>
                <Title level={4} style={{ margin: "0 0 8px 0" }}>
                  {user.realName || user.username}
                </Title>
                <Tag
                  color={roleConfig[user.role]?.color}
                  style={{
                    borderRadius: "6px",
                    fontWeight: 500,
                    border: "none",
                  }}
                >
                  {roleConfig[user.role]?.label}
                </Tag>
              </div>
            </div>

            <Divider style={{ margin: "16px 0" }} />

            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text strong>账户状态</Text>
                <Badge
                  status={statusConfig[user.status]?.color as "success" | "processing" | "error" | "default" | "warning"}
                  text={
                    <span style={{
                      fontWeight: 500,
                      color: user.status === "active" ? token.colorSuccess : token.colorTextSecondary,
                    }}>
                      {statusConfig[user.status]?.label}
                    </span>
                  }
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text strong>实名认证</Text>
                <Space size={6}>
                  <span style={{
                    color: user.verificationStatus === "verified" ? token.colorSuccess :
                      user.verificationStatus === "rejected" ? token.colorError :
                        user.verificationStatus === "pending" ? token.colorWarning : token.colorTextSecondary,
                  }}>
                    {verificationConfig[user.verificationStatus]?.icon}
                  </span>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: user.verificationStatus === "verified" ? token.colorSuccess :
                      user.verificationStatus === "rejected" ? token.colorError :
                        user.verificationStatus === "pending" ? token.colorWarning : token.colorTextSecondary,
                  }}>
                    {verificationConfig[user.verificationStatus]?.label}
                  </span>
                </Space>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text strong>双因子认证</Text>
                <Tag
                  color={user.twoFactorStatus === "enabled" ? "success" : "default"}
                  style={{
                    borderRadius: "6px",
                    fontWeight: 500,
                    border: "none",
                  }}
                >
                  {user.twoFactorStatus === "enabled" ? "已启用" : "未启用"}
                </Tag>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <SecurityScanOutlined style={{ color: token.colorPrimary }} />
                <span>用户统计</span>
              </Space>
            }
            style={{
              borderRadius: "8px",
              border: `1px solid ${token.colorBorder}`,
              height: "100%",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="登录次数"
                  value={user.loginCount}
                  suffix="次"
                  valueStyle={{ color: token.colorSuccess, fontWeight: 600 }}
                  prefix={<LoginOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="在线时长"
                  value={245}
                  suffix="小时"
                  valueStyle={{ color: token.colorInfo, fontWeight: 600 }}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="操作次数"
                  value={89}
                  suffix="次"
                  valueStyle={{ color: token.colorWarning, fontWeight: 600 }}
                  prefix={<SettingOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="安全评分"
                  value={95}
                  suffix="分"
                  valueStyle={{ color: token.colorError, fontWeight: 600 }}
                  prefix={<SafetyCertificateOutlined />}
                />
              </Col>
            </Row>

            <Divider style={{ margin: "24px 0 16px 0" }} />

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>账户安全度</Text>
                  <Text type="secondary" style={{ float: "right" }}>95%</Text>
                </div>
                <Progress
                  percent={95}
                  status="active"
                  strokeColor={{
                    "0%": token.colorSuccess,
                    "100%": token.colorSuccessActive,
                  }}
                  style={{ marginBottom: 0 }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>权限完整度</Text>
                  <Text type="secondary" style={{ float: "right" }}>78%</Text>
                </div>
                <Progress
                  percent={78}
                  strokeColor={{
                    "0%": token.colorInfo,
                    "100%": token.colorInfoActive,
                  }}
                  style={{ marginBottom: 0 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 详细信息标签页 */}
      <Card
        style={{
          borderRadius: "8px",
          border: `1px solid ${token.colorBorder}`,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        }}
      >
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                cardBg: token.colorFillAlter,
              },
            },
          }}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            style={{ marginTop: "-8px" }}
          >
            <TabPane
              tab={
                <Space>
                  <UserOutlined />
                  <span>基本信息</span>
                </Space>
              }
              key="info"
            >
              <Descriptions
                bordered
                column={{ xs: 1, sm: 1, md: 2 }}
                size="middle"
                style={{ marginTop: "16px" }}
              >
                <Descriptions.Item
                  label={
                    <Space>
                      <UserOutlined style={{ color: token.colorTextSecondary }} />
                      <span>用户名</span>
                    </Space>
                  }
                >
                  <Text code>{user.username}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <UserOutlined style={{ color: token.colorTextSecondary }} />
                      <span>真实姓名</span>
                    </Space>
                  }
                >
                  {user.realName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <MailOutlined style={{ color: token.colorTextSecondary }} />
                      <span>邮箱地址</span>
                    </Space>
                  }
                >
                  <Text copyable>{user.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <PhoneOutlined style={{ color: token.colorTextSecondary }} />
                      <span>手机号码</span>
                    </Space>
                  }
                >
                  <Text copyable>{user.phone || "未设置"}</Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <SafetyCertificateOutlined style={{ color: token.colorTextSecondary }} />
                      <span>用户角色</span>
                    </Space>
                  }
                >
                  <Tag
                    color={roleConfig[user.role]?.color}
                    style={{
                      borderRadius: "6px",
                      fontWeight: 500,
                      border: "none",
                    }}
                  >
                    {roleConfig[user.role]?.label}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <CheckCircleOutlined style={{ color: token.colorTextSecondary }} />
                      <span>账户状态</span>
                    </Space>
                  }
                >
                  <Badge
                    status={statusConfig[user.status]?.color as "success" | "processing" | "error" | "default" | "warning"}
                    text={
                      <span style={{
                        fontWeight: 500,
                        color: user.status === "active" ? token.colorSuccess : token.colorTextSecondary,
                      }}>
                        {statusConfig[user.status]?.label}
                      </span>
                    }
                  />
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <CalendarOutlined style={{ color: token.colorTextSecondary }} />
                      <span>创建时间</span>
                    </Space>
                  }
                >
                  {new Date(user.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <CalendarOutlined style={{ color: token.colorTextSecondary }} />
                      <span>最后更新</span>
                    </Space>
                  }
                >
                  {new Date(user.updatedAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <LoginOutlined style={{ color: token.colorTextSecondary }} />
                      <span>最后登录</span>
                    </Space>
                  }
                >
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "从未登录"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <Space>
                      <EyeOutlined style={{ color: token.colorTextSecondary }} />
                      <span>登录次数</span>
                    </Space>
                  }
                >
                  <Text strong style={{ color: token.colorPrimary }}>
                    {user.loginCount.toLocaleString()} 次
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane
              tab={
                <Space>
                  <SafetyCertificateOutlined />
                  <span>权限管理</span>
                </Space>
              }
              key="permissions"
            >
              <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                  <Title level={4} style={{ margin: 0 }}>当前权限列表</Title>
                  <Text type="secondary">用户拥有的系统权限和访问范围</Text>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    onClick={handlePermissionManagement}
                    style={{ borderRadius: "6px" }}
                  >
                    调整权限
                  </Button>
                </Col>
              </Row>
              <List
                dataSource={user.permissions}
                renderItem={(permission) => (
                  <List.Item
                    style={{
                      padding: "16px",
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: "6px",
                      marginBottom: "8px",
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <SafetyCertificateOutlined
                          style={{
                            color: token.colorSuccess,
                            fontSize: "18px",
                          }}
                        />
                      }
                      title={
                        <Text strong style={{ fontSize: "14px" }}>
                          {permission.name}
                        </Text>
                      }
                      description={
                        <Text type="secondary" style={{ fontSize: "13px" }}>
                          {permission.description}
                        </Text>
                      }
                    />
                    <Tag
                      style={{
                        borderRadius: "6px",
                        fontWeight: 500,
                      }}
                    >
                      {permission.module}
                    </Tag>
                  </List.Item>
                )}
              />
            </TabPane>

            <TabPane
              tab={
                <Space>
                  <LoginOutlined />
                  <span>登录记录</span>
                </Space>
              }
              key="login"
            >
              <Table
                columns={loginColumns}
                dataSource={mockLoginRecords}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => (
                    <Text type="secondary">
                      第 {range[0]}-{range[1]} 条，共 {total} 条
                    </Text>
                  ),
                  style: { marginTop: "16px" },
                }}
                scroll={{ x: 800 }}
                style={{ marginTop: "16px" }}
              />
            </TabPane>

            <TabPane
              tab={
                <Space>
                  <HistoryOutlined />
                  <span>操作历史</span>
                </Space>
              }
              key="operations"
            >
              <div style={{ marginTop: "16px" }}>
                <Timeline>
                  {mockOperationRecords.map((record) => (
                    <Timeline.Item
                      key={record.id}
                      color={record.result === "success" ? token.colorSuccess : token.colorError}
                      dot={
                        record.result === "success" ?
                          <CheckCircleOutlined style={{ color: token.colorSuccess }} /> :
                          <ExclamationCircleOutlined style={{ color: token.colorError }} />
                      }
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <Space size={8}>
                          <Text strong style={{ fontSize: "14px" }}>
                            {record.action}
                          </Text>
                          <Tag
                            style={{
                              borderRadius: "4px",
                              fontSize: "12px",
                            }}
                          >
                            {record.target}
                          </Tag>
                          <Tag
                            color={riskConfig[record.risk]?.color}
                            style={{
                              borderRadius: "4px",
                              fontSize: "12px",
                              border: "none",
                            }}
                          >
                            {riskConfig[record.risk]?.label}
                          </Tag>
                        </Space>
                      </div>
                      <div style={{
                        color: token.colorTextSecondary,
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}>
                        {record.time} · {record.module}
                      </div>
                      <Paragraph
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          color: token.colorText,
                        }}
                      >
                        {record.description}
                      </Paragraph>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </TabPane>
          </Tabs>
        </ConfigProvider>
      </Card>

      {/* 编辑用户模态框 */}
      <Modal
        title={
          <Space>
            <EditOutlined style={{ color: token.colorPrimary }} />
            <span>编辑用户信息</span>
          </Space>
        }
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
        style={{ borderRadius: "8px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveEdit}
          style={{ marginTop: "16px" }}
        >
          <Form.Item
            name="role"
            label="用户角色"
            rules={[{ required: true, message: "请选择用户角色" }]}
          >
            <Select
              placeholder="请选择用户角色"
              size="large"
              style={{ borderRadius: "6px" }}
            >
              {Object.entries(roleConfig).map(([key, value]) => (
                <Option key={key} value={key}>{value.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="账户状态"
            rules={[{ required: true, message: "请选择账户状态" }]}
          >
            <Select
              placeholder="请选择账户状态"
              size="large"
              style={{ borderRadius: "6px" }}
            >
              {Object.entries(statusConfig).map(([key, value]) => (
                <Option key={key} value={key}>{value.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="twoFactorStatus"
            label="双因子认证"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              style={{ borderRadius: "12px" }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => setEditModalVisible(false)}
                style={{ borderRadius: "6px" }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ borderRadius: "6px" }}
              >
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限管理模态框 */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: token.colorPrimary }} />
            <span>权限管理</span>
          </Space>
        }
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() => setPermissionModalVisible(false)}
            style={{ borderRadius: "6px" }}
          >
            取消
          </Button>,
          <Button
            key="save"
            type="primary"
            style={{ borderRadius: "6px" }}
          >
            保存
          </Button>,
        ]}
        width={800}
        style={{ borderRadius: "8px" }}
      >
        <Alert
          message="权限调整提醒"
          description="修改用户权限后将立即生效，请谨慎操作。"
          type="warning"
          showIcon
          style={{
            marginBottom: 16,
            borderRadius: "6px",
          }}
        />
        <div style={{
          padding: "24px",
          textAlign: "center",
          color: token.colorTextSecondary,
        }}>
          权限管理功能开发中...
        </div>
      </Modal>
    </div>
  );
};

export default UserDetailPage;
