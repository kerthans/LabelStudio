"use client";
import {
  ApiOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;

interface Integration {
  id: string;
  name: string;
  type: "webhook" | "api" | "database" | "storage" | "notification";
  description: string;
  status: "active" | "inactive" | "error";
  endpoint: string;
  apiKey: string;
  secretKey?: string;
  config: IntegrationConfig;
  lastSync: string;
  syncCount: number;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}
interface WebhookConfig {
  timeout: number;
  retryCount: number;
  batchSize: number;
}

interface DatabaseConfig {
  syncInterval: number;
  tableName: string;
  batchSize: number;
}

interface StorageConfig {
  region: string;
  encryption: boolean;
  compressionLevel: number;
}

interface NotificationConfig {
  schedule: string;
  recipients: string[];
  template: string;
}

type IntegrationConfig = WebhookConfig | DatabaseConfig | StorageConfig | NotificationConfig;
const IntegrationsPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [integrationModalVisible, setIntegrationModalVisible] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [_showSecrets, _setShowSecrets] = useState<Record<string, boolean>>({});
  const [form] = Form.useForm();

  // 模拟集成数据
  const [integrations] = useState<Integration[]>([
    {
      id: "int_001",
      name: "标注结果推送",
      type: "webhook",
      description: "将标注完成的数据推送到下游系统",
      status: "active",
      endpoint: "https://api.example.com/webhook/annotations",
      apiKey: "ak_1234567890abcdef",
      secretKey: "sk_abcdef1234567890",
      config: {
        timeout: 30000,
        retryCount: 3,
        batchSize: 100,
      },
      lastSync: "2024-01-15 16:30:25",
      syncCount: 15680,
      errorCount: 12,
      createdAt: "2023-12-01",
      updatedAt: "2024-01-15",
    },
    {
      id: "int_002",
      name: "数据库同步",
      type: "database",
      description: "同步标注数据到企业数据仓库",
      status: "active",
      endpoint: "postgresql://db.company.com:5432/warehouse",
      apiKey: "db_user_annotation",
      secretKey: "db_pass_secure123",
      config: {
        syncInterval: 3600,
        tableName: "annotation_results",
        batchSize: 1000,
      },
      lastSync: "2024-01-15 15:00:00",
      syncCount: 8920,
      errorCount: 3,
      createdAt: "2023-11-15",
      updatedAt: "2024-01-14",
    },
    {
      id: "int_003",
      name: "云存储备份",
      type: "storage",
      description: "自动备份标注数据到云存储",
      status: "error",
      endpoint: "s3://company-backup/annotations/",
      apiKey: "AKIA1234567890ABCDEF",
      secretKey: "abcdef1234567890+ABCDEF/1234567890abcdef",
      config: {
        region: "us-west-2",
        encryption: true,
        compressionLevel: 6,
      },
      lastSync: "2024-01-14 23:45:12",
      syncCount: 12450,
      errorCount: 156,
      createdAt: "2023-10-20",
      updatedAt: "2024-01-14",
    },
    {
      id: "int_004",
      name: "质量报告推送",
      type: "notification",
      description: "定期推送质量报告到管理层邮箱",
      status: "inactive",
      endpoint: "smtp://mail.company.com:587",
      apiKey: "quality_report@company.com",
      secretKey: "email_pass_secure456",
      config: {
        schedule: "0 9 * * 1",
        recipients: ["manager@company.com", "quality@company.com"],
        template: "weekly_quality_report",
      },
      lastSync: "2024-01-08 09:00:00",
      syncCount: 24,
      errorCount: 0,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-08",
    },
  ]);

  const typeOptions = [
    { value: "all", label: "全部类型" },
    { value: "webhook", label: "Webhook" },
    { value: "api", label: "API接口" },
    { value: "database", label: "数据库" },
    { value: "storage", label: "存储服务" },
    { value: "notification", label: "通知服务" },
  ];

  const statusOptions = [
    { value: "all", label: "全部状态" },
    { value: "active", label: "正常" },
    { value: "inactive", label: "停用" },
    { value: "error", label: "异常" },
  ];

  // 筛选集成
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchText.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === "all" || integration.type === typeFilter;
    const matchesStatus = statusFilter === "all" || integration.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "webhook": return <ApiOutlined />;
      case "api": return <SyncOutlined />;
      case "database": return <SettingOutlined />;
      case "storage": return <ReloadOutlined />;
      case "notification": return <CheckCircleOutlined />;
      default: return <SettingOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "webhook": return "blue";
      case "api": return "green";
      case "database": return "purple";
      case "storage": return "orange";
      case "notification": return "cyan";
      default: return "default";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "webhook": return "Webhook";
      case "api": return "API接口";
      case "database": return "数据库";
      case "storage": return "存储服务";
      case "notification": return "通知服务";
      default: return "未知";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "default";
      case "error": return "error";
      default: return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "正常";
      case "inactive": return "停用";
      case "error": return "异常";
      default: return "未知";
    }
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    form.setFieldsValue({
      name: integration.name,
      type: integration.type,
      description: integration.description,
      endpoint: integration.endpoint,
      apiKey: integration.apiKey,
      secretKey: integration.secretKey,
      status: integration.status,
    });
    setIntegrationModalVisible(true);
  };

  const handleDelete = (integration: Integration) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除集成 "${integration.name}" 吗？此操作不可恢复。`,
      onOk: () => {
        message.success(`集成 "${integration.name}" 已删除`);
      },
    });
  };

  const handleTest = (integration: Integration) => {
    setEditingIntegration(integration);
    setTestModalVisible(true);
    // 模拟测试
    setTimeout(() => {
      message.success("连接测试成功");
      setTestModalVisible(false);
    }, 2000);
  };


  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <ApiOutlined />
              集成配置
            </Title>
            <Text type="secondary">管理系统集成配置，连接外部服务和数据源</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingIntegration(null);
            form.resetFields();
            setIntegrationModalVisible(true);
          }}>
            新增集成
          </Button>
        </div>

        {/* 筛选器 */}
        <Row gutter={16}>
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="搜索集成名称或描述"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              size="large"
            >
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4}>
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
        </Row>
      </div>

      {/* 集成列表 */}
      <Row gutter={[16, 16]}>
        {filteredIntegrations.map(integration => (
          <Col xs={24} lg={12} xl={8} key={integration.id}>
            <Card
              hoverable
              styles={{
                body: { padding: "20px" },
              }}
              actions={[
                <Tooltip title="测试连接" key="test">
                  <SyncOutlined onClick={() => handleTest(integration)} />
                </Tooltip>,
                <Tooltip title="编辑配置" key="edit">
                  <EditOutlined onClick={() => handleEdit(integration)} />
                </Tooltip>,
                <Tooltip title="删除集成" key="delete">
                  <DeleteOutlined onClick={() => handleDelete(integration)} />
                </Tooltip>,
              ]}
            >
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: getTypeColor(integration.type) === "blue" ? "#1890ff" :
                        getTypeColor(integration.type) === "green" ? "#52c41a" :
                          getTypeColor(integration.type) === "purple" ? "#722ed1" :
                            getTypeColor(integration.type) === "orange" ? "#fa8c16" : "#13c2c2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 14,
                    }}>
                      {getTypeIcon(integration.type)}
                    </div>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{integration.name}</Title>
                      <Tag color={getTypeColor(integration.type)} className="small-tag">
                        {getTypeText(integration.type)}
                      </Tag>
                    </div>
                  </div>
                  <Badge
                    status={integration.status === "active" ? "success" :
                      integration.status === "error" ? "error" : "default"}
                    text={getStatusText(integration.status)}
                  />
                </div>

                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{ color: "#666", marginBottom: 12, minHeight: 40 }}
                >
                  {integration.description}
                </Paragraph>
              </div>

              <Divider style={{ margin: "12px 0" }} />

              <div style={{ fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text type="secondary">同步次数</Text>
                  <Text strong>{integration.syncCount.toLocaleString()}</Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text type="secondary">错误次数</Text>
                  <Text strong style={{ color: integration.errorCount > 0 ? "#ff4d4f" : "#52c41a" }}>
                    {integration.errorCount}
                  </Text>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text type="secondary">最后同步</Text>
                  <Text>{integration.lastSync}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 集成配置弹窗 */}
      <Modal
        title={editingIntegration ? "编辑集成" : "新增集成"}
        open={integrationModalVisible}
        onCancel={() => setIntegrationModalVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            console.log("Integration values:", values);
            message.success(editingIntegration ? "集成配置已更新" : "集成创建成功");
            setIntegrationModalVisible(false);
          });
        }}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="集成名称" rules={[{ required: true }]}>
                <Input placeholder="请输入集成名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="集成类型" rules={[{ required: true }]}>
                <Select placeholder="请选择集成类型">
                  <Option value="webhook">Webhook</Option>
                  <Option value="api">API接口</Option>
                  <Option value="database">数据库</Option>
                  <Option value="storage">存储服务</Option>
                  <Option value="notification">通知服务</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入集成描述" />
          </Form.Item>
          <Form.Item name="endpoint" label="端点地址" rules={[{ required: true }]}>
            <Input placeholder="请输入端点地址" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="apiKey" label="API密钥" rules={[{ required: true }]}>
                <Input placeholder="请输入API密钥" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="secretKey" label="密钥">
                <Input.Password placeholder="请输入密钥" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select placeholder="请选择状态">
              <Option value="active">启用</Option>
              <Option value="inactive">停用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 测试连接弹窗 */}
      <Modal
        title="测试连接"
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTestModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        {editingIntegration && (
          <div>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="集成名称">{editingIntegration.name}</Descriptions.Item>
              <Descriptions.Item label="类型">{getTypeText(editingIntegration.type)}</Descriptions.Item>
              <Descriptions.Item label="端点">{editingIntegration.endpoint}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={getStatusColor(editingIntegration.status)}>
                  {getStatusText(editingIntegration.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <SyncOutlined spin style={{ fontSize: 24, color: "#1890ff" }} />
              <div style={{ marginTop: 8 }}>正在测试连接...</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IntegrationsPage;
