"use client";
import {
  AuditOutlined,
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  GlobalOutlined,
  LockOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SettingOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  TimePicker,
  Tooltip,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Shield, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
// 添加 useCallback 导入
import React, { useCallback, useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;

// 安全配置接口
interface SecurityConfig {
  passwordPolicy: {
    minLength: number;
    maxLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    forbidCommonPasswords: boolean;
    expirationDays: number;
    historyCount: number;
    maxAttempts: number;
  };
  loginRestrictions: {
    maxFailedAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    maxConcurrentSessions: number;
    allowMultipleDevices: boolean;
    forceLogoutOnPasswordChange: boolean;
    restrictedHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  ipWhitelist: {
    enabled: boolean;
    allowedIPs: string[];
    blockUnknownIPs: boolean;
    autoBlockSuspiciousIPs: boolean;
  };
  alertConfig: {
    enableEmailAlerts: boolean;
    enableSMSAlerts: boolean;
    alertRecipients: string[];
    alertTypes: string[];
    alertThresholds: {
      failedLoginAttempts: number;
      suspiciousActivity: number;
      dataExfiltration: number;
    };
  };
}

// IP白名单项
interface IPWhitelistItem {
  id: string;
  ip: string;
  description: string;
  createdAt: string;
  createdBy: string;
  status: "active" | "inactive";
}

// 安全事件
interface SecurityEvent {
  id: string;
  type: "login_failed" | "suspicious_activity" | "ip_blocked" | "password_changed";
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  user?: string;
  ip?: string;
  status: "new" | "investigating" | "resolved";
}

const SecuritySettingsPage: React.FC = () => {
  const _router = useRouter();
  const [_loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [ipForm] = Form.useForm();
  const [ipModalVisible, setIpModalVisible] = useState(false);
  const [editingIP, setEditingIP] = useState<IPWhitelistItem | null>(null);
  const [ipWhitelist, setIpWhitelist] = useState<IPWhitelistItem[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);

  // 模拟安全配置数据
  const mockSecurityConfig: SecurityConfig = {
    passwordPolicy: {
      minLength: 8,
      maxLength: 32,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      forbidCommonPasswords: true,
      expirationDays: 90,
      historyCount: 5,
      maxAttempts: 3,
    },
    loginRestrictions: {
      maxFailedAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 30,
      maxConcurrentSessions: 3,
      allowMultipleDevices: true,
      forceLogoutOnPasswordChange: true,
      restrictedHours: {
        enabled: false,
        startTime: "22:00",
        endTime: "06:00",
      },
    },
    ipWhitelist: {
      enabled: false,
      allowedIPs: [],
      blockUnknownIPs: false,
      autoBlockSuspiciousIPs: true,
    },
    alertConfig: {
      enableEmailAlerts: true,
      enableSMSAlerts: false,
      alertRecipients: ["admin@magnify.ai", "security@magnify.ai"],
      alertTypes: ["login_failed", "suspicious_activity", "ip_blocked"],
      alertThresholds: {
        failedLoginAttempts: 10,
        suspiciousActivity: 5,
        dataExfiltration: 3,
      },
    },
  };

  // 模拟IP白名单数据
  const mockIPWhitelist: IPWhitelistItem[] = [
    {
      id: "1",
      ip: "192.168.1.0/24",
      description: "办公网络",
      createdAt: "2024-01-01T00:00:00Z",
      createdBy: "admin",
      status: "active",
    },
    {
      id: "2",
      ip: "10.0.0.100",
      description: "管理员专用IP",
      createdAt: "2024-01-02T00:00:00Z",
      createdBy: "admin",
      status: "active",
    },
    {
      id: "3",
      ip: "203.0.113.0/24",
      description: "外部合作伙伴",
      createdAt: "2024-01-03T00:00:00Z",
      createdBy: "security",
      status: "inactive",
    },
  ];

  // 模拟安全事件数据
  const mockSecurityEvents: SecurityEvent[] = [
    {
      id: "1",
      type: "login_failed",
      description: "用户 admin 连续登录失败 5 次",
      severity: "high",
      timestamp: "2024-01-15T10:30:00Z",
      user: "admin",
      ip: "192.168.1.100",
      status: "investigating",
    },
    {
      id: "2",
      type: "suspicious_activity",
      description: "检测到异常数据访问模式",
      severity: "medium",
      timestamp: "2024-01-15T09:15:00Z",
      user: "user01",
      ip: "203.0.113.50",
      status: "new",
    },
    {
      id: "3",
      type: "ip_blocked",
      description: "IP 地址被自动阻止",
      severity: "low",
      timestamp: "2024-01-15T08:45:00Z",
      ip: "198.51.100.25",
      status: "resolved",
    },
  ];

  // 严重程度配置
  const severityConfig = {
    low: { label: "低", color: "blue" },
    medium: { label: "中", color: "orange" },
    high: { label: "高", color: "red" },
    critical: { label: "严重", color: "purple" },
  };

  // 事件类型配置
  const eventTypeConfig = {
    login_failed: { label: "登录失败", icon: <CloseCircleOutlined /> },
    suspicious_activity: { label: "可疑活动", icon: <WarningOutlined /> },
    ip_blocked: { label: "IP阻止", icon: <Shield /> },
    password_changed: { label: "密码变更", icon: <LockOutlined /> },
  };

  // 状态配置
  const statusConfig = {
    new: { label: "新事件", color: "red" },
    investigating: { label: "调查中", color: "orange" },
    resolved: { label: "已解决", color: "green" },
  };

  // IP白名单表格列
  const ipColumns: ColumnsType<IPWhitelistItem> = [
    {
      title: "IP地址/网段",
      dataIndex: "ip",
      key: "ip",
      width: 150,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Badge
          status={status === "active" ? "success" : "default"}
          text={status === "active" ? "启用" : "禁用"}
        />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "创建者",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 100,
    },
    {
      title: "操作",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditIP(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个IP吗？"
            onConfirm={() => handleDeleteIP(record.id)}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 安全事件表格列
  const eventColumns: ColumnsType<SecurityEvent> = [
    {
      title: "事件类型",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Space>
          {eventTypeConfig[type as keyof typeof eventTypeConfig]?.icon}
          <span>{eventTypeConfig[type as keyof typeof eventTypeConfig]?.label}</span>
        </Space>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "严重程度",
      dataIndex: "severity",
      key: "severity",
      width: 100,
      render: (severity: string) => (
        <Tag color={severityConfig[severity as keyof typeof severityConfig]?.color}>
          {severityConfig[severity as keyof typeof severityConfig]?.label}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        // 修复第361行的Badge组件
        <Badge
          status={statusConfig[status as keyof typeof statusConfig]?.color as "success" | "processing" | "error" | "default" | "warning"}
          text={statusConfig[status as keyof typeof statusConfig]?.label}
        />
      ),
    },
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 150,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "操作",
      key: "actions",
      width: 100,
      render: (_, _record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="标记已解决">
            <Button type="text" icon={<CheckCircleOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 加载配置
  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      form.setFieldsValue(mockSecurityConfig);
      setIpWhitelist(mockIPWhitelist);
      setSecurityEvents(mockSecurityEvents);
    } catch (_error) {
      message.error("加载配置失败");
    } finally {
      setLoading(false);
    }
  }, [form]);

  // 保存配置
  const handleSave = async (_values: SecurityConfig) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("安全配置保存成功");
    } catch (_error) {
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 添加IP
  const handleAddIP = () => {
    setEditingIP(null);
    ipForm.resetFields();
    setIpModalVisible(true);
  };

  // 编辑IP
  const handleEditIP = (ip: IPWhitelistItem) => {
    setEditingIP(ip);
    ipForm.setFieldsValue(ip);
    setIpModalVisible(true);
  };

  // 删除IP
  const handleDeleteIP = (id: string) => {
    setIpWhitelist(prev => prev.filter(item => item.id !== id));
    message.success("IP删除成功");
  };

  // 保存IP
  const handleSaveIP = async (values: Omit<IPWhitelistItem, "id" | "createdAt" | "createdBy" | "status">) => {
    try {
      if (editingIP) {
        // 编辑
        setIpWhitelist(prev => prev.map(item =>
          item.id === editingIP.id ? { ...item, ...values } : item,
        ));
        message.success("IP更新成功");
      } else {
        // 新增
        const newIP: IPWhitelistItem = {
          id: Date.now().toString(),
          ...values,
          createdAt: new Date().toISOString(),
          createdBy: "admin",
          status: "active",
        };
        setIpWhitelist(prev => [...prev, newIP]);
        message.success("IP添加成功");
      }
      setIpModalVisible(false);
    } catch (_error) {
      message.error("操作失败");
    }
  };

  // 测试安全策略
  const handleTestSecurity = () => {
    Modal.info({
      title: "安全策略测试",
      content: "正在测试当前安全策略配置...",
      onOk: () => {
        message.success("安全策略测试通过");
      },
    });
  };

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <div>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h2 style={{ margin: 0 }}>🔒 安全设置</h2>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadConfig}>
              重新加载
            </Button>
            <Button icon={<ShieldCheck />} onClick={handleTestSecurity}>
              测试策略
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>
              保存设置
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 安全概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="安全评分"
              value={85}
              suffix="分"
              valueStyle={{ color: "#52c41a" }}
              prefix={<SafetyCertificateOutlined />}
            />
            <Progress percent={85} strokeColor="#52c41a" showInfo={false} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="活跃威胁"
              value={3}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="阻止攻击"
              value={127}
              valueStyle={{ color: "#1890ff" }}
              prefix={<Shield />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="白名单IP"
              value={ipWhitelist.filter(ip => ip.status === "active").length}
              valueStyle={{ color: "#722ed1" }}
              prefix={<GlobalOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={mockSecurityConfig}
      >
        <Row gutter={16}>
          {/* 密码策略 */}
          <Col xs={24} lg={12}>
            <Card title={<span><LockOutlined /> 密码策略</span>} style={{ marginBottom: 16 }}>
              <Alert
                message="密码策略将应用于所有新用户和密码重置"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["passwordPolicy", "minLength"]}
                    label="最小长度"
                    rules={[{ required: true, message: "请设置最小长度" }]}
                  >
                    <InputNumber min={6} max={32} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["passwordPolicy", "maxLength"]}
                    label="最大长度"
                    rules={[{ required: true, message: "请设置最大长度" }]}
                  >
                    <InputNumber min={8} max={128} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["passwordPolicy", "expirationDays"]}
                    label="过期天数"
                  >
                    <InputNumber min={0} max={365} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["passwordPolicy", "historyCount"]}
                    label="历史密码数"
                  >
                    <InputNumber min={0} max={10} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">复杂度要求</Divider>
              <Space direction="vertical">
                <Form.Item
                  name={["passwordPolicy", "requireUppercase"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>必须包含大写字母</Checkbox>
                </Form.Item>
                <Form.Item
                  name={["passwordPolicy", "requireLowercase"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>必须包含小写字母</Checkbox>
                </Form.Item>
                <Form.Item
                  name={["passwordPolicy", "requireNumbers"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>必须包含数字</Checkbox>
                </Form.Item>
                <Form.Item
                  name={["passwordPolicy", "requireSpecialChars"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>必须包含特殊字符</Checkbox>
                </Form.Item>
                <Form.Item
                  name={["passwordPolicy", "forbidCommonPasswords"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>禁止常见密码</Checkbox>
                </Form.Item>
              </Space>
            </Card>
          </Col>

          {/* 登录限制 */}
          <Col xs={24} lg={12}>
            <Card title={<span><UserOutlined /> 登录限制</span>} style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["loginRestrictions", "maxFailedAttempts"]}
                    label="最大失败次数"
                  >
                    <InputNumber min={1} max={10} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["loginRestrictions", "lockoutDuration"]}
                    label="锁定时长(分钟)"
                  >
                    <InputNumber min={1} max={1440} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["loginRestrictions", "sessionTimeout"]}
                    label="会话超时(分钟)"
                  >
                    <InputNumber min={5} max={480} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["loginRestrictions", "maxConcurrentSessions"]}
                    label="最大并发会话"
                  >
                    <InputNumber min={1} max={10} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left">会话控制</Divider>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Form.Item
                  name={["loginRestrictions", "allowMultipleDevices"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>允许多设备登录</Checkbox>
                </Form.Item>
                <Form.Item
                  name={["loginRestrictions", "forceLogoutOnPasswordChange"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>密码变更时强制退出</Checkbox>
                </Form.Item>

                <Form.Item
                  name={["loginRestrictions", "restrictedHours", "enabled"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>启用时间限制</Checkbox>
                </Form.Item>

                <Row gutter={8}>
                  <Col span={12}>
                    <Form.Item
                      name={["loginRestrictions", "restrictedHours", "startTime"]}
                      label="禁止开始时间"
                    >
                      <TimePicker format="HH:mm" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["loginRestrictions", "restrictedHours", "endTime"]}
                      label="禁止结束时间"
                    >
                      <TimePicker format="HH:mm" style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* IP白名单 */}
        <Row gutter={16}>
          <Col xs={24}>
            <Card
              title={<span><GlobalOutlined /> IP白名单管理</span>}
              extra={
                <Space>
                  <Form.Item
                    name={["ipWhitelist", "enabled"]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                  </Form.Item>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddIP}>
                    添加IP
                  </Button>
                </Space>
              }
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["ipWhitelist", "blockUnknownIPs"]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox>阻止未知IP访问</Checkbox>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name={["ipWhitelist", "autoBlockSuspiciousIPs"]}
                    valuePropName="checked"
                    noStyle
                  >
                    <Checkbox>自动阻止可疑IP</Checkbox>
                  </Form.Item>
                </Col>
              </Row>

              <Table
                columns={ipColumns}
                dataSource={ipWhitelist}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                }}
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
        </Row>

        {/* 告警配置 */}
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title={<span><BellOutlined /> 告警配置</span>} style={{ marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Form.Item
                  name={["alertConfig", "enableEmailAlerts"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>启用邮件告警</Checkbox>
                </Form.Item>
                <Form.Item
                  name={["alertConfig", "enableSMSAlerts"]}
                  valuePropName="checked"
                  noStyle
                >
                  <Checkbox>启用短信告警</Checkbox>
                </Form.Item>
              </Space>

              <Form.Item
                name={["alertConfig", "alertRecipients"]}
                label="告警接收人"
              >
                <Select
                  mode="tags"
                  placeholder="输入邮箱地址"
                  style={{ width: "100%" }}
                >
                  <Option value="admin@magnify.ai">admin@magnify.ai</Option>
                  <Option value="security@magnify.ai">security@magnify.ai</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name={["alertConfig", "alertTypes"]}
                label="告警类型"
              >
                <Checkbox.Group>
                  <Space direction="vertical">
                    <Checkbox value="login_failed">登录失败</Checkbox>
                    <Checkbox value="suspicious_activity">可疑活动</Checkbox>
                    <Checkbox value="ip_blocked">IP阻止</Checkbox>
                    <Checkbox value="password_changed">密码变更</Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title={<span><SettingOutlined /> 告警阈值</span>} style={{ marginBottom: 16 }}>
              <Form.Item
                name={["alertConfig", "alertThresholds", "failedLoginAttempts"]}
                label="登录失败次数阈值"
              >
                <InputNumber min={1} max={100} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name={["alertConfig", "alertThresholds", "suspiciousActivity"]}
                label="可疑活动次数阈值"
              >
                <InputNumber min={1} max={50} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name={["alertConfig", "alertThresholds", "dataExfiltration"]}
                label="数据泄露次数阈值"
              >
                <InputNumber min={1} max={10} style={{ width: "100%" }} />
              </Form.Item>

              <Alert
                message="阈值说明"
                description="当检测到的安全事件超过设定阈值时，系统将自动发送告警通知。"
                type="info"
                showIcon
              />
            </Card>
          </Col>
        </Row>
      </Form>

      {/* 安全事件监控 */}
      <Card title={<span><AuditOutlined /> 最近安全事件</span>}>
        <Table
          columns={eventColumns}
          dataSource={securityEvents}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* IP白名单模态框 */}
      <Modal
        title={editingIP ? "编辑IP白名单" : "添加IP白名单"}
        open={ipModalVisible}
        onCancel={() => setIpModalVisible(false)}
        footer={null}
      >
        <Form
          form={ipForm}
          layout="vertical"
          onFinish={handleSaveIP}
        >
          <Form.Item
            name="ip"
            label="IP地址/网段"
            rules={[
              { required: true, message: "请输入IP地址或网段" },
              { pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:[0-9]|[1-2][0-9]|3[0-2]))?$/, message: "请输入有效的IP地址或网段" },
            ]}
          >
            <Input placeholder="例如: 192.168.1.100 或 192.168.1.0/24" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "请输入描述" }]}
          >
            <TextArea rows={3} placeholder="请输入IP用途描述" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue="active"
          >
            <Radio.Group>
              <Radio value="active">启用</Radio>
              <Radio value="inactive">禁用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingIP ? "更新" : "添加"}
              </Button>
              <Button onClick={() => setIpModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SecuritySettingsPage;
