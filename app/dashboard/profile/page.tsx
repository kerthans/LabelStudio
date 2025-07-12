"use client";
import type {
  OperationLog,
  PasswordChangeData,
  ProfileFormData,
  ProfileStats,
  SecuritySettings,
  TwoFactorSettings,
  UserPreferences,
} from "@/types/dashboard/profile";
import type { User } from "@/types/dashboard/user";
import {
  AuditOutlined,
  BellOutlined,
  CalendarOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  LockOutlined,
  LoginOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Progress,
  QRCode,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, description, trend }) => (
  <Card className="h-full hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className={`p-2 rounded-lg bg-${color}-50 mr-3`}>
            <div className={`text-${color}-600 text-lg`}>{icon}</div>
          </div>
          <div>
            <Text type="secondary" className="text-sm">{title}</Text>
            <div className="text-2xl font-semibold text-gray-900">{value}</div>
          </div>
        </div>
        {description && (
          <Text type="secondary" className="text-xs">{description}</Text>
        )}
      </div>
      {trend && (
        <div className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
          {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  </Card>
);

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [preferencesForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState("overview");
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [backupCodesVisible, setBackupCodesVisible] = useState(false);

  // 模拟数据
  const mockUser: User = {
    id: "1",
    username: "admin",
    email: "admin@magnify.ai",
    phone: "13800138000",
    realName: "张三",
    avatar: "",
    role: "admin" as any,
    status: "active" as any,
    verificationStatus: "verified" as any,
    twoFactorStatus: "enabled" as any,
    permissions: [],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    lastLoginAt: "2024-01-15T09:00:00Z",
    loginCount: 156,
  };

  const mockStats: ProfileStats = {
    loginCount: 156,
    lastLoginTime: "2024-01-15T09:00:00Z",
    accountAge: 365,
    operationCount: 1234,
    securityScore: 85,
  };

  const mockOperationLogs: OperationLog[] = [
    {
      id: "1",
      action: "登录系统",
      description: "用户成功登录系统",
      ip: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0",
      location: "北京市",
      timestamp: "2024-01-15T09:00:00Z",
      status: "success",
    },
    {
      id: "2",
      action: "修改密码",
      description: "用户修改登录密码",
      ip: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0",
      location: "北京市",
      timestamp: "2024-01-14T15:30:00Z",
      status: "success",
    },
    {
      id: "3",
      action: "启用2FA",
      description: "用户启用双因子认证",
      ip: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0",
      location: "北京市",
      timestamp: "2024-01-13T11:20:00Z",
      status: "success",
    },
  ];

  const mockTwoFactorSettings: TwoFactorSettings = {
    enabled: true,
    method: "app",
    backupCodes: ["123456", "789012", "345678", "901234", "567890"],
    lastUsed: "2024-01-15T09:00:00Z",
  };

  const mockSecuritySettings: SecuritySettings = {
    loginNotification: true,
    passwordExpiry: true,
    sessionTimeout: 30,
    allowMultipleLogin: false,
    ipWhitelist: ["192.168.1.0/24"],
  };

  const mockPreferences: UserPreferences = {
    language: "zh-CN",
    timezone: "Asia/Shanghai",
    dateFormat: "YYYY-MM-DD",
    theme: "light",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(mockUser);
      setStats(mockStats);
      setOperationLogs(mockOperationLogs);
      setTwoFactorSettings(mockTwoFactorSettings);
      setSecuritySettings(mockSecuritySettings);
      setPreferences(mockPreferences);

      profileForm.setFieldsValue({
        realName: mockUser.realName,
        email: mockUser.email,
        phone: mockUser.phone,
      });

      securityForm.setFieldsValue(mockSecuritySettings);
      preferencesForm.setFieldsValue(mockPreferences);
    } catch (error) {
      message.error("加载个人信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (values: ProfileFormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("个人信息更新成功");
      loadProfileData();
    } catch (error) {
      message.error("更新失败");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: PasswordChangeData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("密码修改成功");
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error("密码修改失败");
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      setTwoFactorModalVisible(true);
    } else {
      Modal.confirm({
        title: "确认关闭双因子认证",
        content: "关闭双因子认证会降低账户安全性，确定要关闭吗？",
        onOk: async () => {
          setLoading(true);
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setTwoFactorSettings(prev => prev ? { ...prev, enabled: false } : null);
            message.success("双因子认证已关闭");
          } catch (error) {
            message.error("操作失败");
          } finally {
            setLoading(false);
          }
        },
      });
    }
  };

  const handleSecurityUpdate = async (values: SecuritySettings) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSecuritySettings(values);
      message.success("安全设置更新成功");
    } catch (error) {
      message.error("更新失败");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async (values: UserPreferences) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPreferences(values);
      message.success("偏好设置更新成功");
    } catch (error) {
      message.error("更新失败");
    } finally {
      setLoading(false);
    }
  };

  const operationLogColumns = [
    {
      title: "操作类型",
      dataIndex: "action",
      key: "action",
      width: 120,
      render: (action: string) => (
        <Tag color="blue" icon={<AuditOutlined />}>
          {action}
        </Tag>
      ),
    },
    {
      title: "操作描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
      width: 140,
      render: (ip: string) => <Text code>{ip}</Text>,
    },
    {
      title: "地理位置",
      dataIndex: "location",
      key: "location",
      width: 100,
      render: (location: string) => (
        <span>
          <GlobalOutlined className="mr-1" />
          {location}
        </span>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status: string) => {
        const statusConfig = {
          success: { color: "success", text: "成功", icon: <CheckCircleOutlined /> },
          failed: { color: "error", text: "失败", icon: <ExclamationCircleOutlined /> },
          warning: { color: "warning", text: "警告", icon: <InfoCircleOutlined /> },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "操作时间",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (timestamp: string) => (
        <Tooltip title={new Date(timestamp).toLocaleString()}>
          <span>
            <CalendarOutlined className="mr-1" />
            {new Date(timestamp).toLocaleDateString()}
          </span>
        </Tooltip>
      ),
    },
  ];

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    return "#ff4d4f";
  };

  const getSecurityScoreStatus = (score: number) => {
    if (score >= 80) return "优秀";
    if (score >= 60) return "良好";
    return "需要改进";
  };

  const getVerificationStatusConfig = (status: string) => {
    const configs = {
      verified: { color: "success", text: "已认证", icon: <CheckCircleOutlined /> },
      pending: { color: "warning", text: "待认证", icon: <ClockCircleOutlined /> },
      rejected: { color: "error", text: "认证失败", icon: <ExclamationCircleOutlined /> },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  if (!user || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text type="secondary">加载中...</Text>
        </div>
      </div>
    );
  }

  const verificationConfig = getVerificationStatusConfig(user.verificationStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <Title level={2} className="mb-2">个人中心</Title>
          <Paragraph type="secondary" className="text-base">
            管理您的个人信息、安全设置和系统偏好
          </Paragraph>
        </div>

        {/* 用户信息卡片 */}
        <Card className="mb-6 shadow-sm">
          <Row gutter={24} align="middle">
            <Col flex="none">
              <div className="relative">
                <Avatar
                  size={88}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg"
                />
                <Tooltip title="更换头像">
                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<CameraOutlined />}
                    className="absolute -bottom-1 -right-1 shadow-md"
                  />
                </Tooltip>
              </div>
            </Col>
            <Col flex="auto">
              <div className="mb-3">
                <div className="flex items-center mb-2">
                  <Title level={3} className="mb-0 mr-3">{user.realName}</Title>
                  <Tag
                    color={verificationConfig.color}
                    icon={verificationConfig.icon}
                    className="ml-2"
                  >
                    {verificationConfig.text}
                  </Tag>
                </div>
                <Text type="secondary" className="text-base">@{user.username}</Text>
              </div>
              <Space size="large" wrap>
                <div className="flex items-center">
                  <MailOutlined className="mr-2 text-gray-500" />
                  <Text>{user.email}</Text>
                </div>
                {user.phone && (
                  <div className="flex items-center">
                    <PhoneOutlined className="mr-2 text-gray-500" />
                    <Text>{user.phone}</Text>
                  </div>
                )}
                <div className="flex items-center">
                  <TeamOutlined className="mr-2 text-gray-500" />
                  <Text>系统管理员</Text>
                </div>
                <div className="flex items-center">
                  <LoginOutlined className="mr-2 text-gray-500" />
                  <Text>最后登录: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "从未登录"}</Text>
                </div>
              </Space>
            </Col>
            <Col flex="none">
              <Button type="primary" icon={<EditOutlined />} size="large">
                编辑资料
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 统计数据卡片 */}
        <Row gutter={[24, 24]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="登录次数"
              value={stats.loginCount}
              icon={<LoginOutlined />}
              color="blue"
              description="累计登录系统次数"
              trend={{ value: 12, isPositive: true }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="账户天数"
              value={`${stats.accountAge}天`}
              icon={<CalendarOutlined />}
              color="green"
              description="账户创建至今"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="操作记录"
              value={stats.operationCount}
              icon={<AuditOutlined />}
              color="purple"
              description="系统操作总数"
              trend={{ value: 8, isPositive: true }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="h-full hover:shadow-md transition-shadow duration-200">
              <div className="text-center">
                <div className="mb-3">
                  <Text type="secondary" className="text-sm">安全评分</Text>
                </div>
                <Progress
                  type="circle"
                  size={80}
                  percent={stats.securityScore}
                  strokeColor={getSecurityScoreColor(stats.securityScore)}
                  format={() => (
                    <div className="text-center">
                      <div className="text-xl font-semibold">{stats.securityScore}</div>
                      <div className="text-xs text-gray-500">
                        {getSecurityScoreStatus(stats.securityScore)}
                      </div>
                    </div>
                  )}
                />
                <div className="mt-3">
                  <Text type="secondary" className="text-xs">账户安全等级评估</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 主要内容区域 */}
        <Card className="shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: 32 }}
          >
            {/* 概览标签页 */}
            <TabPane
              tab={
                <span className="flex items-center">
                  <UserOutlined className="mr-2" />
                  账户概览
                </span>
              }
              key="overview"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card title="基本信息" className="mb-6">
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="真实姓名">{user.realName}</Descriptions.Item>
                      <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                      <Descriptions.Item label="邮箱地址">{user.email}</Descriptions.Item>
                      <Descriptions.Item label="手机号码">{user.phone || "未设置"}</Descriptions.Item>
                      <Descriptions.Item label="账户状态">
                        <Badge status="success" text="正常" />
                      </Descriptions.Item>
                      <Descriptions.Item label="创建时间">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card title="最近活动" extra={<Button icon={<ReloadOutlined />} size="small">刷新</Button>}>
                    {operationLogs.length > 0 ? (
                      <List
                        dataSource={operationLogs.slice(0, 5)}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <div className="p-2 bg-blue-50 rounded-full">
                                  <AuditOutlined className="text-blue-600" />
                                </div>
                              }
                              title={item.action}
                              description={
                                <div>
                                  <div>{item.description}</div>
                                  <Text type="secondary" className="text-xs">
                                    {new Date(item.timestamp).toLocaleString()} · {item.location}
                                  </Text>
                                </div>
                              }
                            />
                            <Tag color={item.status === "success" ? "success" : "error"}>
                              {item.status === "success" ? "成功" : "失败"}
                            </Tag>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Empty description="暂无活动记录" />
                    )}
                  </Card>
                </Col>

                <Col xs={24} lg={8}>
                  <Card title="安全状态" className="mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <SecurityScanOutlined className="text-green-600 mr-3" />
                          <div>
                            <div className="font-medium">双因子认证</div>
                            <Text type="secondary" className="text-sm">已启用</Text>
                          </div>
                        </div>
                        <CheckCircleOutlined className="text-green-600" />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          <LockOutlined className="text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium">密码强度</div>
                            <Text type="secondary" className="text-sm">强</Text>
                          </div>
                        </div>
                        <CheckCircleOutlined className="text-blue-600" />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center">
                          <BellOutlined className="text-orange-600 mr-3" />
                          <div>
                            <div className="font-medium">登录通知</div>
                            <Text type="secondary" className="text-sm">已启用</Text>
                          </div>
                        </div>
                        <CheckCircleOutlined className="text-orange-600" />
                      </div>
                    </div>

                    <Divider />

                    <div className="text-center">
                      <Button type="primary" block icon={<SettingOutlined />}>
                        安全设置
                      </Button>
                    </div>
                  </Card>

                  <Card title="快速操作">
                    <div className="space-y-3">
                      <Button
                        block
                        icon={<LockOutlined />}
                        onClick={() => setPasswordModalVisible(true)}
                      >
                        修改密码
                      </Button>
                      <Button
                        block
                        icon={<SecurityScanOutlined />}
                        onClick={() => setActiveTab("security")}
                      >
                        安全设置
                      </Button>
                      <Button
                        block
                        icon={<SettingOutlined />}
                        onClick={() => setActiveTab("preferences")}
                      >
                        偏好设置
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            {/* 基本信息编辑 */}
            <TabPane
              tab={
                <span className="flex items-center">
                  <EditOutlined className="mr-2" />
                  基本信息
                </span>
              }
              key="basic"
            >
              <div className="max-w-4xl">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                  size="large"
                >
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="真实姓名"
                        name="realName"
                        rules={[{ required: true, message: "请输入真实姓名" }]}
                      >
                        <Input placeholder="请输入真实姓名" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="用户名"
                        name="username"
                        initialValue={user.username}
                      >
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="邮箱地址"
                        name="email"
                        rules={[
                          { required: true, message: "请输入邮箱地址" },
                          { type: "email", message: "请输入有效的邮箱地址" },
                        ]}
                      >
                        <Input placeholder="请输入邮箱地址" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="手机号码"
                        name="phone"
                        rules={[
                          { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码" },
                        ]}
                      >
                        <Input placeholder="请输入手机号码" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <Form.Item label="部门" name="department">
                        <Input placeholder="请输入部门" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="职位" name="position">
                        <Input placeholder="请输入职位" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="个人简介" name="bio">
                    <Input.TextArea rows={4} placeholder="请输入个人简介" showCount maxLength={200} />
                  </Form.Item>

                  <Form.Item>
                    <Space size="large">
                      <Button type="primary" htmlType="submit" loading={loading} size="large">
                        保存更改
                      </Button>
                      <Button onClick={() => profileForm.resetFields()} size="large">
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>

            {/* 安全设置 */}
            <TabPane
              tab={
                <span className="flex items-center">
                  <SecurityScanOutlined className="mr-2" />
                  安全设置
                </span>
              }
              key="security"
            >
              <div className="max-w-4xl space-y-6">
                {/* 密码设置 */}
                <Card title="密码设置" size="small">
                  <Alert
                    message="密码安全建议"
                    description="为了您的账户安全，建议定期更换密码，密码应包含大小写字母、数字和特殊字符，长度不少于8位。"
                    type="info"
                    showIcon
                    className="mb-4"
                  />
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    onClick={() => setPasswordModalVisible(true)}
                  >
                    修改密码
                  </Button>
                </Card>

                {/* 双因子认证 */}
                <Card title="双因子认证" size="small">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <Title level={5} className="mb-1">双因子认证 (2FA)</Title>
                      <Text type="secondary">
                        启用双因子认证可以大大提高您账户的安全性
                      </Text>
                    </div>
                    <Switch
                      checked={twoFactorSettings?.enabled}
                      onChange={handleTwoFactorToggle}
                      loading={loading}
                    />
                  </div>

                  {twoFactorSettings?.enabled ? (
                    <Card size="small" className="bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center mb-1">
                            <CheckCircleOutlined className="text-green-600 mr-2" />
                            <Text strong>双因子认证已启用</Text>
                          </div>
                          <Text type="secondary">
                            认证方式: {twoFactorSettings.method === "app" ? "认证应用" :
                              twoFactorSettings.method === "sms" ? "短信" : "邮箱"}
                          </Text>
                          {twoFactorSettings.lastUsed && (
                            <div>
                              <Text type="secondary">
                                最后使用: {new Date(twoFactorSettings.lastUsed).toLocaleString()}
                              </Text>
                            </div>
                          )}
                        </div>
                        <Space>
                          <Button size="small" onClick={() => setQrCodeVisible(true)}>
                            查看二维码
                          </Button>
                          <Button size="small" onClick={() => setBackupCodesVisible(true)}>
                            备用代码
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  ) : (
                    <Alert
                      message="建议启用双因子认证"
                      description="双因子认证为您的账户提供额外的安全保护，即使密码被泄露，攻击者也无法访问您的账户。"
                      type="warning"
                      showIcon
                      action={
                        <Button size="small" type="primary" onClick={() => handleTwoFactorToggle(true)}>
                          立即启用
                        </Button>
                      }
                    />
                  )}
                </Card>

                {/* 其他安全设置 */}
                <Card title="其他安全设置" size="small">
                  <Form
                    form={securityForm}
                    layout="vertical"
                    onFinish={handleSecurityUpdate}
                  >
                    <Row gutter={24}>
                      <Col xs={24} md={8}>
                        <Form.Item label="登录通知" name="loginNotification" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="密码过期提醒" name="passwordExpiry" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="允许多设备登录" name="allowMultipleLogin" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="会话超时时间（分钟）" name="sessionTimeout">
                      <Select>
                        <Select.Option value={15}>15分钟</Select.Option>
                        <Select.Option value={30}>30分钟</Select.Option>
                        <Select.Option value={60}>1小时</Select.Option>
                        <Select.Option value={120}>2小时</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        保存安全设置
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
            </TabPane>

            {/* 操作日志 */}
            <TabPane
              tab={
                <span className="flex items-center">
                  <HistoryOutlined className="mr-2" />
                  操作日志
                </span>
              }
              key="logs"
            >
              <div className="mb-4">
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={4}>操作记录</Title>
                    <Text type="secondary">查看您的账户操作历史记录</Text>
                  </Col>
                  <Col>
                    <Space>
                      <Button icon={<ReloadOutlined />} onClick={loadProfileData}>
                        刷新
                      </Button>
                      <Button icon={<DownloadOutlined />}>
                        导出日志
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>

              <Table
                columns={operationLogColumns}
                dataSource={operationLogs}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
                scroll={{ x: 800 }}
              />
            </TabPane>

            {/* 偏好设置 */}
            <TabPane
              tab={
                <span className="flex items-center">
                  <SettingOutlined className="mr-2" />
                  偏好设置
                </span>
              }
              key="preferences"
            >
              <div className="max-w-4xl">
                <Form
                  form={preferencesForm}
                  layout="vertical"
                  onFinish={handlePreferencesUpdate}
                  size="large"
                >
                  <Card title="界面设置" className="mb-6" size="small">
                    <Row gutter={24}>
                      <Col xs={24} md={8}>
                        <Form.Item label="语言" name="language">
                          <Select>
                            <Select.Option value="zh-CN">简体中文</Select.Option>
                            <Select.Option value="en-US">English</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="时区" name="timezone">
                          <Select>
                            <Select.Option value="Asia/Shanghai">北京时间</Select.Option>
                            <Select.Option value="UTC">UTC</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="主题" name="theme">
                          <Select>
                            <Select.Option value="light">浅色</Select.Option>
                            <Select.Option value="dark">深色</Select.Option>
                            <Select.Option value="auto">自动</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Card title="通知设置" className="mb-6" size="small">
                    <Row gutter={24}>
                      <Col xs={24} md={8}>
                        <Form.Item label="邮件通知" name="emailNotifications" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="短信通知" name="smsNotifications" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="推送通知" name="pushNotifications" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>

                  <Form.Item>
                    <Space size="large">
                      <Button type="primary" htmlType="submit" loading={loading}>
                        保存设置
                      </Button>
                      <Button onClick={() => preferencesForm.resetFields()}>
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: "请输入当前密码" }]}
          >
            <Input.Password placeholder="请输入当前密码" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 8, message: "密码长度至少8位" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: "密码必须包含大小写字母和数字",
              },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 2FA设置模态框 */}
      <Modal
        title="启用双因子认证"
        open={twoFactorModalVisible}
        onCancel={() => setTwoFactorModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="text-center">
          <Title level={4}>扫描二维码</Title>
          <Text type="secondary" className="block mb-4">
            使用认证应用（如Google Authenticator、Microsoft Authenticator）扫描下方二维码
          </Text>
          <div className="mb-4">
            <QRCode value="otpauth://totp/Magnify-AI:admin@magnify.ai?secret=JBSWY3DPEHPK3PXP&issuer=Magnify-AI" />
          </div>
          <Text type="secondary" className="block mb-4">
            或手动输入密钥: JBSWY3DPEHPK3PXP
          </Text>
          <Form
            onFinish={async (values) => {
              setLoading(true);
              try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setTwoFactorSettings(prev => prev ? { ...prev, enabled: true } : null);
                setTwoFactorModalVisible(false);
                message.success("双因子认证启用成功");
              } catch (error) {
                message.error("验证失败");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Form.Item
              name="code"
              rules={[{ required: true, message: "请输入验证码" }]}
            >
              <Input
                placeholder="请输入6位验证码"
                maxLength={6}
                className="text-center text-lg"
              />
            </Form.Item>
            <Form.Item>
              <Space className="w-full justify-center">
                <Button onClick={() => setTwoFactorModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  验证并启用
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* 备用代码模态框 */}
      <Modal
        title="备用代码"
        open={backupCodesVisible}
        onCancel={() => setBackupCodesVisible(false)}
        footer={[
          <Button key="download" icon={<DownloadOutlined />}>
            下载备用代码
          </Button>,
          <Button key="close" type="primary" onClick={() => setBackupCodesVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <Alert
          message="重要提示"
          description="请将这些备用代码保存在安全的地方。当您无法使用认证应用时，可以使用这些代码登录。每个代码只能使用一次。"
          type="warning"
          showIcon
          className="mb-4"
        />
        <div className="grid grid-cols-2 gap-2">
          {twoFactorSettings?.backupCodes.map((code, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <Text code>{code}</Text>
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  message.success("已复制到剪贴板");
                }}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
