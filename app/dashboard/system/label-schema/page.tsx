"use client";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  SyncOutlined,
  TagOutlined
} from "@ant-design/icons";
import {
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
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message
} from "antd";
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// 标签配置接口
interface LabelSchema {
  id: string;
  name: string;
  description: string;
  type: "classification" | "detection" | "segmentation" | "ner" | "relation";
  labels: LabelItem[];
  createdAt: string;
  updatedAt: string;
  creator: string;
  status: "active" | "draft" | "archived";
  projectCount: number;
  version: string;
  isDefault: boolean;
}

interface LabelItem {
  id: string;
  name: string;
  color: string;
  description?: string;
  shortcut?: string;
  parentId?: string;
  order: number;
}

const LabelSchemaPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchema, setEditingSchema] = useState<LabelSchema | null>(null);
  const [form] = Form.useForm();

  // 模拟标签配置数据
  const [schemas, setSchemas] = useState<LabelSchema[]>([
    {
      id: "schema_001",
      name: "图像分类标签",
      description: "用于医疗影像分类的标签配置",
      type: "classification",
      labels: [
        { id: "label_001", name: "正常", color: "#52c41a", order: 1 },
        { id: "label_002", name: "异常", color: "#ff4d4f", order: 2 },
        { id: "label_003", name: "疑似", color: "#fa8c16", order: 3 }
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      creator: "张医生",
      status: "active",
      projectCount: 5,
      version: "v1.2",
      isDefault: true
    },
    {
      id: "schema_002",
      name: "目标检测标签",
      description: "自动驾驶场景中的目标检测标签",
      type: "detection",
      labels: [
        { id: "label_004", name: "汽车", color: "#1890ff", order: 1 },
        { id: "label_005", name: "行人", color: "#722ed1", order: 2 },
        { id: "label_006", name: "交通标志", color: "#fa541c", order: 3 },
        { id: "label_007", name: "红绿灯", color: "#13c2c2", order: 4 }
      ],
      createdAt: "2024-01-08",
      updatedAt: "2024-01-14",
      creator: "王工程师",
      status: "active",
      projectCount: 3,
      version: "v2.0",
      isDefault: false
    },
    {
      id: "schema_003",
      name: "情感分析标签",
      description: "文本情感分析的标签配置",
      type: "classification",
      labels: [
        { id: "label_008", name: "积极", color: "#52c41a", order: 1 },
        { id: "label_009", name: "消极", color: "#ff4d4f", order: 2 },
        { id: "label_010", name: "中性", color: "#d9d9d9", order: 3 }
      ],
      createdAt: "2024-01-05",
      updatedAt: "2024-01-12",
      creator: "李分析师",
      status: "draft",
      projectCount: 1,
      version: "v1.0",
      isDefault: false
    }
  ]);

  // 统计数据
  const stats = {
    totalSchemas: schemas.length,
    activeSchemas: schemas.filter(s => s.status === "active").length,
    totalLabels: schemas.reduce((sum, s) => sum + s.labels.length, 0),
    totalProjects: schemas.reduce((sum, s) => sum + s.projectCount, 0)
  };

  // 获取类型标签
  const getTypeTag = (type: string) => {
    const typeConfig = {
      classification: { color: "blue", text: "分类" },
      detection: { color: "green", text: "检测" },
      segmentation: { color: "orange", text: "分割" },
      ner: { color: "purple", text: "命名实体" },
      relation: { color: "cyan", text: "关系抽取" }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || { color: "default", text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    const configs = {
      active: { color: "success", text: "活跃", icon: <CheckCircleOutlined /> },
      draft: { color: "warning", text: "草稿", icon: <SyncOutlined /> },
      archived: { color: "default", text: "已归档", icon: <CloseCircleOutlined /> }
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  // 筛选数据
  const filteredSchemas = schemas.filter(schema => {
    const matchesSearch = schema.name.toLowerCase().includes(searchText.toLowerCase()) ||
      schema.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === "all" || schema.type === typeFilter;
    const matchesStatus = statusFilter === "all" || schema.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 表格列配置
  const columns: ColumnsType<LabelSchema> = [
    {
      title: "标签配置名称",
      dataIndex: "name",
      key: "name",
      width: 280,
      fixed: 'left',
      render: (text, record) => (
        <Space align="start">
          <TagOutlined style={{ color: "#1890ff", marginTop: 4 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ 
              fontWeight: 500, 
              marginBottom: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              <Tooltip title={text}>{text}</Tooltip>
            </div>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: 12,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '16px',
                maxHeight: '32px'
              }}
            >
              <Tooltip title={record.description}>
                {record.description}
              </Tooltip>
            </Text>
            {record.isDefault && (
              <div style={{ marginTop: 4 }}>
                <Badge status="success" text="默认" />
              </div>
            )}
          </div>
        </Space>
      )
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => getTypeTag(type)
    },
    {
      title: "标签数量",
      dataIndex: "labels",
      key: "labelCount",
      width: 100,
      render: (labels) => (
        <Badge count={labels.length} style={{ backgroundColor: "#52c41a" }} />
      )
    },
    {
      title: "标签预览",
      dataIndex: "labels",
      key: "labelPreview",
      width: 200,
      render: (labels) => (
        <Space wrap>
          {labels.slice(0, 3).map((label: LabelItem) => (
            <Tag key={label.id} color={label.color} style={{ margin: 2 }}>
              {label.name}
            </Tag>
          ))}
          {labels.length > 3 && (
            <Tag style={{ margin: 2 }}>+{labels.length - 3}</Tag>
          )}
        </Space>
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Badge
            status={config.color as any}
            text={config.text}
          />
        );
      }
    },
    {
      title: "使用项目",
      dataIndex: "projectCount",
      key: "projectCount",
      width: 100,
      render: (count) => (
        <Text strong style={{ color: count > 0 ? "#1890ff" : "#d9d9d9" }}>
          {count}
        </Text>
      )
    },
    {
      title: "版本",
      dataIndex: "version",
      key: "version",
      width: 80
    },
    {
      title: "创建者",
      dataIndex: "creator",
      key: "creator",
      width: 100
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="复制">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopy(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "export",
                  label: "导出配置",
                  icon: <ExportOutlined />,
                  onClick: () => handleExport(record)
                },
                {
                  key: "delete",
                  label: "删除",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record)
                }
              ]
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<SettingOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  // 处理函数
  const handleView = (schema: LabelSchema) => {
    message.info(`查看标签配置: ${schema.name}`);
  };

  const handleEdit = (schema: LabelSchema) => {
    setEditingSchema(schema);
    form.setFieldsValue(schema);
    setModalVisible(true);
  };

  const handleCopy = (schema: LabelSchema) => {
    const newSchema = {
      ...schema,
      id: `schema_${Date.now()}`,
      name: `${schema.name}_副本`,
      isDefault: false,
      status: "draft" as const,
      projectCount: 0
    };
    setSchemas([...schemas, newSchema]);
    message.success("标签配置已复制");
  };

  const handleExport = (schema: LabelSchema) => {
    message.success(`导出标签配置: ${schema.name}`);
  };

  const handleDelete = (schema: LabelSchema) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除标签配置 "${schema.name}" 吗？`,
      onOk: () => {
        setSchemas(schemas.filter(s => s.id !== schema.id));
        message.success("删除成功");
      }
    });
  };

  const handleCreate = () => {
    setEditingSchema(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleImport = () => {
    message.info("导入标签配置功能开发中");
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingSchema) {
        // 编辑
        setSchemas(schemas.map(s =>
          s.id === editingSchema.id ? { ...s, ...values } : s
        ));
        message.success("更新成功");
      } else {
        // 新建
        const newSchema: LabelSchema = {
          ...values,
          id: `schema_${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          creator: "当前用户",
          projectCount: 0,
          version: "v1.0",
          labels: []
        };
        setSchemas([...schemas, newSchema]);
        message.success("创建成功");
      }
      setModalVisible(false);
    });
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题和统计 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 16 }}>
          <TagOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          标签配置管理
        </Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="总配置数"
                value={stats.totalSchemas}
                prefix={<TagOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="活跃配置"
                value={stats.activeSchemas}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="标签总数"
                value={stats.totalLabels}
                prefix={<TagOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="关联项目"
                value={stats.totalProjects}
                prefix={<SettingOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Search
                placeholder="搜索标签配置名称或描述"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 120 }}
                placeholder="类型筛选"
              >
                <Option value="all">全部类型</Option>
                <Option value="classification">分类</Option>
                <Option value="detection">检测</Option>
                <Option value="segmentation">分割</Option>
                <Option value="ner">命名实体</Option>
                <Option value="relation">关系抽取</Option>
              </Select>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
                placeholder="状态筛选"
              >
                <Option value="all">全部状态</Option>
                <Option value="active">活跃</Option>
                <Option value="draft">草稿</Option>
                <Option value="archived">已归档</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ImportOutlined />}
                onClick={handleImport}
              >
                导入配置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新建标签配置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 标签配置表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredSchemas}
          rowKey="id"
          pagination={{
            total: filteredSchemas.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingSchema ? "编辑标签配置" : "新建标签配置"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: "draft",
            isDefault: false
          }}
        >
          <Form.Item
            name="name"
            label="配置名称"
            rules={[{ required: true, message: "请输入配置名称" }]}
          >
            <Input placeholder="请输入标签配置名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="配置描述"
            rules={[{ required: true, message: "请输入配置描述" }]}
          >
            <TextArea rows={3} placeholder="请输入标签配置的详细描述" />
          </Form.Item>

          <Form.Item
            name="type"
            label="标注类型"
            rules={[{ required: true, message: "请选择标注类型" }]}
          >
            <Select placeholder="请选择标注类型">
              <Option value="classification">图像分类</Option>
              <Option value="detection">目标检测</Option>
              <Option value="segmentation">图像分割</Option>
              <Option value="ner">命名实体识别</Option>
              <Option value="relation">关系抽取</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
              >
                <Select>
                  <Option value="draft">草稿</Option>
                  <Option value="active">活跃</Option>
                  <Option value="archived">已归档</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isDefault"
                label="设为默认"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default LabelSchemaPage;
