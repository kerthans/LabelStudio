"use client";
import {
  CloudOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MailOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SaveOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Alert,
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
  Switch,
  Tabs,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface SystemConfig {
  // 基础设置
  systemName: string;
  systemLogo: string;
  systemDescription: string;
  timezone: string;
  language: string;
  dateFormat: string;

  // 安全设置
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expirationDays: number;
  };

  // 双因子认证
  twoFactorAuth: {
    enabled: boolean;
    method: "sms" | "email" | "app";
    mandatory: boolean;
  };

  // 会话设置
  sessionConfig: {
    timeout: number;
    maxConcurrentSessions: number;
    rememberMeDuration: number;
  };

  // 邮件设置
  emailConfig: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };

  // 备份设置
  backupConfig: {
    autoBackup: boolean;
    backupInterval: number;
    retentionDays: number;
    backupLocation: string;
  };
}

const SettingsPage: React.FC = () => {
  const [_loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [form] = Form.useForm();
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // 模拟系统配置数据
  const mockConfig: SystemConfig = {
    systemName: "Magnify AI 招标分析系统",
    systemLogo: "",
    systemDescription: "智能招标分析与管理平台",
    timezone: "Asia/Shanghai",
    language: "zh-CN",
    dateFormat: "YYYY-MM-DD",
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      expirationDays: 90,
    },
    twoFactorAuth: {
      enabled: true,
      method: "app",
      mandatory: false,
    },
    sessionConfig: {
      timeout: 30,
      maxConcurrentSessions: 3,
      rememberMeDuration: 7,
    },
    emailConfig: {
      smtpHost: "smtp.magnify.ai",
      smtpPort: 587,
      smtpUser: "system@magnify.ai",
      smtpPassword: "********",
      fromEmail: "noreply@magnify.ai",
      fromName: "Magnify AI System",
    },
    backupConfig: {
      autoBackup: true,
      backupInterval: 24,
      retentionDays: 30,
      backupLocation: "/backup/magnify-ai",
    },
  };

  // 时区选项
  const timezoneOptions = [
    { label: "北京时间 (UTC+8)", value: "Asia/Shanghai" },
    { label: "东京时间 (UTC+9)", value: "Asia/Tokyo" },
    { label: "纽约时间 (UTC-5)", value: "America/New_York" },
    { label: "伦敦时间 (UTC+0)", value: "Europe/London" },
  ];

  // 语言选项
  const languageOptions = [
    { label: "简体中文", value: "zh-CN" },
    { label: "English", value: "en-US" },
    { label: "日本語", value: "ja-JP" },
  ];

  // 日期格式选项
  const dateFormatOptions = [
    { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
  ];

  // 加载配置
  const loadConfig = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      form.setFieldsValue(mockConfig);
    } catch (_error) {
      message.error("加载配置失败");
    } finally {
      setLoading(false);
    }
  };

  // 保存配置
  const handleSave = async (_values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("配置保存成功");
    } catch (_error) {
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 测试邮件配置
  const handleTestEmail = async () => {
    try {
      message.loading("正在发送测试邮件...", 2);
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success("测试邮件发送成功");
    } catch (_error) {
      message.error("邮件发送失败");
    }
  };

  // 执行备份
  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          message.success("系统备份完成");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // 重置系统
  const handleReset = () => {
    setResetModalVisible(true);
  };

  // 确认重置
  const confirmReset = async () => {
    try {
      message.loading("正在重置系统...", 3);
      await new Promise(resolve => setTimeout(resolve, 3000));
      message.success("系统重置完成");
      setResetModalVisible(false);
    } catch (_error) {
      message.error("重置失败");
    }
  };

  // Logo上传配置
  const logoUploadProps: UploadProps = {
    name: "logo",
    listType: "picture-card",
    showUploadList: false,
    beforeUpload: () => false,
  };

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <div>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h2 style={{ margin: 0 }}>⚙️ 系统设置</h2>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadConfig}>
              重新加载
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()}>
              保存设置
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 设置内容 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={mockConfig}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* 基础设置 */}
            <TabPane tab={<span><SettingOutlined />基础设置</span>} key="basic">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="systemName"
                    label="系统名称"
                    rules={[{ required: true, message: "请输入系统名称" }]}
                  >
                    <Input placeholder="请输入系统名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="systemLogo" label="系统Logo">
                    <Upload {...logoUploadProps}>
                      <Button icon={<UploadOutlined />}>上传Logo</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="systemDescription" label="系统描述">
                    <TextArea rows={3} placeholder="请输入系统描述" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="timezone" label="时区设置">
                    <Select placeholder="选择时区">
                      {timezoneOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="language" label="默认语言">
                    <Select placeholder="选择语言">
                      {languageOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="dateFormat" label="日期格式">
                    <Select placeholder="选择日期格式">
                      {dateFormatOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            {/* 安全策略 */}
            <TabPane tab={<span><SafetyCertificateOutlined />安全策略</span>} key="security">
              <Alert
                message="安全提醒"
                description="修改安全策略将影响所有用户，请谨慎操作。"
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Card title="密码策略" style={{ marginBottom: 16 }}>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["passwordPolicy", "minLength"]}
                      label="最小长度"
                      rules={[{ required: true, message: "请设置密码最小长度" }]}
                    >
                      <InputNumber min={6} max={20} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["passwordPolicy", "expirationDays"]}
                      label="过期天数"
                    >
                      <InputNumber min={0} max={365} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label="密码复杂度要求">
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
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="会话管理">
                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={["sessionConfig", "timeout"]}
                      label="会话超时(分钟)"
                    >
                      <InputNumber min={5} max={480} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={["sessionConfig", "maxConcurrentSessions"]}
                      label="最大并发会话"
                    >
                      <InputNumber min={1} max={10} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name={["sessionConfig", "rememberMeDuration"]}
                      label="记住我时长(天)"
                    >
                      <InputNumber min={1} max={30} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* 双因子认证 */}
            <TabPane tab={<span><SafetyOutlined />双因子认证</span>} key="2fa">
              <Card>
                <Row gutter={24}>
                  <Col xs={24}>
                    <Form.Item
                      name={["twoFactorAuth", "enabled"]}
                      label="启用双因子认证"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["twoFactorAuth", "method"]}
                      label="认证方式"
                    >
                      <Radio.Group>
                        <Radio value="sms">短信验证</Radio>
                        <Radio value="email">邮箱验证</Radio>
                        <Radio value="app">认证应用</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["twoFactorAuth", "mandatory"]}
                      label="强制启用"
                      valuePropName="checked"
                    >
                      <Switch
                        checkedChildren="强制"
                        unCheckedChildren="可选"
                        size="small"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Alert
                  message="提示"
                  description="启用强制双因子认证后，所有用户必须设置双因子认证才能登录系统。"
                  type="info"
                  showIcon
                />
              </Card>
            </TabPane>

            {/* 邮件配置 */}
            <TabPane tab={<span><MailOutlined />邮件配置</span>} key="email">
              <Card>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["emailConfig", "smtpHost"]}
                      label="SMTP服务器"
                      rules={[{ required: true, message: "请输入SMTP服务器" }]}
                    >
                      <Input placeholder="smtp.example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["emailConfig", "smtpPort"]}
                      label="SMTP端口"
                      rules={[{ required: true, message: "请输入SMTP端口" }]}
                    >
                      <InputNumber min={1} max={65535} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["emailConfig", "smtpUser"]}
                      label="SMTP用户名"
                      rules={[{ required: true, message: "请输入SMTP用户名" }]}
                    >
                      <Input placeholder="username@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["emailConfig", "smtpPassword"]}
                      label="SMTP密码"
                      rules={[{ required: true, message: "请输入SMTP密码" }]}
                    >
                      <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["emailConfig", "fromEmail"]}
                      label="发件人邮箱"
                      rules={[
                        { required: true, message: "请输入发件人邮箱" },
                        { type: "email", message: "请输入有效的邮箱地址" },
                      ]}
                    >
                      <Input placeholder="noreply@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={["emailConfig", "fromName"]}
                      label="发件人名称"
                    >
                      <Input placeholder="System Notification" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Button type="primary" onClick={handleTestEmail}>
                      发送测试邮件
                    </Button>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            {/* 备份与恢复 */}
            <TabPane tab={<span><DatabaseOutlined />备份恢复</span>} key="backup">
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Card title="自动备份设置">
                    <Form.Item
                      name={["backupConfig", "autoBackup"]}
                      label="启用自动备份"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                    </Form.Item>
                    <Form.Item
                      name={["backupConfig", "backupInterval"]}
                      label="备份间隔(小时)"
                    >
                      <InputNumber min={1} max={168} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      name={["backupConfig", "retentionDays"]}
                      label="保留天数"
                    >
                      <InputNumber min={1} max={365} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      name={["backupConfig", "backupLocation"]}
                      label="备份位置"
                    >
                      <Input placeholder="/backup/path" />
                    </Form.Item>
                  </Card>
                </Col>

                <Col xs={24} lg={12}>
                  <Card title="手动操作">
                    <Space direction="vertical" style={{ width: "100%" }} size="middle">
                      <div>
                        <Button
                          type="primary"
                          icon={<CloudOutlined />}
                          onClick={handleBackup}
                          loading={isBackingUp}
                          block
                        >
                          立即备份
                        </Button>
                        {isBackingUp && (
                          <Progress
                            percent={backupProgress}
                            size="small"
                            style={{ marginTop: 8 }}
                          />
                        )}
                      </div>

                      <Button icon={<DownloadOutlined />} block>
                        下载备份文件
                      </Button>

                      <Button icon={<UploadOutlined />} block>
                        上传恢复文件
                      </Button>

                      <Divider />

                      <Alert
                        message="危险操作"
                        description="以下操作将影响整个系统，请谨慎使用。"
                        type="error"
                        showIcon
                      />

                      <Popconfirm
                        title="确定要重置系统吗？"
                        description="此操作将清除所有数据，不可恢复！"
                        onConfirm={handleReset}
                        okText="确定"
                        cancelText="取消"
                        okType="danger"
                      >
                        <Button danger icon={<DeleteOutlined />} block>
                          重置系统
                        </Button>
                      </Popconfirm>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
      </Card>

      {/* 重置确认模态框 */}
      <Modal
        title="系统重置确认"
        open={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setResetModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" danger onClick={confirmReset}>
            确认重置
          </Button>,
        ]}
      >
        <Alert
          message="警告"
          description="系统重置将清除所有数据，包括用户、项目、配置等，此操作不可恢复！请确认您已经做好了数据备份。"
          type="error"
          showIcon
        />
        <div style={{ marginTop: 16 }}>
          <p>重置后系统将恢复到初始状态，您需要重新配置所有设置。</p>
          <p>请在下方输入 <strong>RESET</strong> 确认操作：</p>
          <Input placeholder="请输入 RESET 确认" />
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
