"use client";
import type { EvaluationCriteria } from "@/types/dashboard/tender";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ImportOutlined,
  PlusOutlined,
  StarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";

const { Option } = Select;
const { TextArea, Search } = Input;
const { Title, Text } = Typography;

// 扩展模板相关类型
interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  criteria: EvaluationCriteria[];
  totalWeight: number;
  status: "active" | "inactive" | "draft";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isDefault: boolean;
}

interface TemplateUsageRecord {
  id: string;
  templateId: string;
  projectName: string;
  projectId: string;
  usedBy: string;
  usedAt: string;
  status: "completed" | "in-progress" | "cancelled";
}

const EvaluationTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [usageRecords, setUsageRecords] = useState<TemplateUsageRecord[]>([]);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [criteriaModalVisible, setCriteriaModalVisible] = useState(false);
  const [usageDrawerVisible, setUsageDrawerVisible] = useState(false);
  const [templateDetailVisible, setTemplateDetailVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EvaluationTemplate | null>(null);
  const [editingCriteria, setEditingCriteria] = useState<EvaluationCriteria | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [form] = Form.useForm();
  const [criteriaForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟模板数据
  const mockTemplates: EvaluationTemplate[] = [
    {
      id: "1",
      name: "建设工程评标模板",
      description: "适用于建设工程项目的标准评标模板，包含技术方案、商务报价、企业资质等核心评分维度",
      category: "建设工程",
      criteria: [
        {
          id: "1",
          name: "技术方案",
          description: "技术方案的完整性和可行性",
          weight: 40,
          maxScore: 100,
          subCriteria: [
            { id: "1-1", name: "技术先进性", description: "技术方案的先进程度", weight: 50, maxScore: 50 },
            { id: "1-2", name: "可行性分析", description: "方案实施的可行性", weight: 50, maxScore: 50 },
          ],
        },
        {
          id: "2",
          name: "商务报价",
          description: "投标报价的合理性",
          weight: 30,
          maxScore: 100,
        },
        {
          id: "3",
          name: "企业资质",
          description: "企业资质和业绩",
          weight: 20,
          maxScore: 100,
        },
        {
          id: "4",
          name: "项目管理",
          description: "项目管理能力和经验",
          weight: 10,
          maxScore: 100,
        },
      ],
      totalWeight: 100,
      status: "active",
      createdBy: "系统管理员",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-10",
      usageCount: 25,
      isDefault: true,
    },
    {
      id: "2",
      name: "IT项目评标模板",
      description: "适用于信息技术项目的评标模板，重点关注技术架构、功能实现和系统安全性",
      category: "信息技术",
      criteria: [
        {
          id: "5",
          name: "技术架构",
          description: "系统技术架构设计",
          weight: 35,
          maxScore: 100,
        },
        {
          id: "6",
          name: "功能实现",
          description: "功能需求实现程度",
          weight: 25,
          maxScore: 100,
        },
        {
          id: "7",
          name: "安全性",
          description: "系统安全性设计",
          weight: 20,
          maxScore: 100,
        },
        {
          id: "8",
          name: "商务报价",
          description: "项目报价合理性",
          weight: 20,
          maxScore: 100,
        },
      ],
      totalWeight: 100,
      status: "active",
      createdBy: "张经理",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-12",
      usageCount: 12,
      isDefault: false,
    },
    {
      id: "3",
      name: "采购项目评标模板",
      description: "适用于设备采购项目的评标模板，综合考虑产品质量、价格竞争力和服务保障",
      category: "设备采购",
      criteria: [
        {
          id: "9",
          name: "产品质量",
          description: "产品质量和性能指标",
          weight: 40,
          maxScore: 100,
        },
        {
          id: "10",
          name: "价格因素",
          description: "产品价格竞争力",
          weight: 35,
          maxScore: 100,
        },
        {
          id: "11",
          name: "服务保障",
          description: "售后服务和技术支持",
          weight: 25,
          maxScore: 100,
        },
      ],
      totalWeight: 100,
      status: "draft",
      createdBy: "李主管",
      createdAt: "2024-01-08",
      updatedAt: "2024-01-08",
      usageCount: 0,
      isDefault: false,
    },
  ];

  // 模拟使用记录数据
  const mockUsageRecords: TemplateUsageRecord[] = [
    {
      id: "1",
      templateId: "1",
      projectName: "市政道路建设项目",
      projectId: "proj001",
      usedBy: "张专家",
      usedAt: "2024-01-15 09:30",
      status: "completed",
    },
    {
      id: "2",
      templateId: "1",
      projectName: "办公楼装修工程",
      projectId: "proj002",
      usedBy: "李专家",
      usedAt: "2024-01-14 14:20",
      status: "in-progress",
    },
    {
      id: "3",
      templateId: "2",
      projectName: "企业管理系统开发",
      projectId: "proj003",
      usedBy: "王专家",
      usedAt: "2024-01-13 16:45",
      status: "completed",
    },
  ];

  useEffect(() => {
    setTemplates(mockTemplates);
    setUsageRecords(mockUsageRecords);
  }, []);

  // 过滤模板数据
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !filterCategory || template.category === filterCategory;
    const matchesStatus = !filterStatus || template.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 统计数据
  const stats = {
    total: templates.length,
    active: templates.filter(t => t.status === "active").length,
    draft: templates.filter(t => t.status === "draft").length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
  };

  const templateColumns = [
    {
      title: "模板信息",
      dataIndex: "name",
      key: "name",
      width: 300,
      render: (text: string, record: EvaluationTemplate) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>{text}</Text>
            {record.isDefault && (
              <Tag color="blue" className="small-tag" style={{ marginLeft: 8 }}>
                <StarOutlined style={{ marginRight: 2 }} />
                默认模板
              </Tag>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.4 }}>
            {record.description}
          </Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="geekblue" className="small-tag">{record.category}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "评分配置",
      key: "criteriaInfo",
      width: 150,
      render: (_: any, record: EvaluationTemplate) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong>{record.criteria.length}</Text>
            <Text type="secondary" style={{ marginLeft: 4 }}>项标准</Text>
          </div>
          <Progress
            percent={record.totalWeight}
            size="small"
            strokeColor={record.totalWeight === 100 ? "#52c41a" : "#faad14"}
            format={() => `${record.totalWeight}%`}
          />
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const statusConfig = {
          active: { color: "success", text: "已启用", icon: <CheckCircleOutlined /> },
          inactive: { color: "error", text: "已停用", icon: <ExclamationCircleOutlined /> },
          draft: { color: "warning", text: "草稿", icon: <FileTextOutlined /> },
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
      title: "使用情况",
      key: "usage",
      width: 120,
      render: (_: any, record: EvaluationTemplate) => (
        <div style={{ textAlign: "center" }}>
          <div>
            <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
              {record.usageCount}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>次使用</Text>
        </div>
      ),
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
      render: (date: string, record: EvaluationTemplate) => (
        <div>
          <div>{date}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.createdBy}
          </Text>
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right" as const,
      render: (_: any, record: EvaluationTemplate) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewTemplate(record)}
            />
          </Tooltip>
          <Tooltip title="编辑模板">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditTemplate(record)}
            />
          </Tooltip>
          <Tooltip title="复制模板">
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => handleCopyTemplate(record)}
            />
          </Tooltip>
          <Tooltip title="使用记录">
            <Button
              type="text"
              icon={<HistoryOutlined />}
              size="small"
              onClick={() => handleViewUsage(record)}
            />
          </Tooltip>
          {!record.isDefault && (
            <Popconfirm
              title="确定要删除这个模板吗？"
              description="删除后将无法恢复，请谨慎操作。"
              onConfirm={() => handleDeleteTemplate(record.id)}
              okText="确定删除"
              cancelText="取消"
              okType="danger"
            >
              <Tooltip title="删除模板">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const criteriaColumns = [
    {
      title: "标准名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: EvaluationCriteria) => (
        <div>
          <Text strong>{text}</Text>
          {record.description && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.description}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "权重配置",
      key: "weightInfo",
      width: 120,
      render: (_: any, record: EvaluationCriteria) => (
        <div style={{ textAlign: "center" }}>
          <div>
            <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
              {record.weight}%
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>满分 {record.maxScore}</Text>
        </div>
      ),
    },
    {
      title: "子标准",
      key: "subCriteria",
      width: 100,
      render: (_: any, record: EvaluationCriteria) => (
        record.subCriteria && record.subCriteria.length > 0 ? (
          <Tag color="blue" icon={<TeamOutlined />}>
            {record.subCriteria.length} 项
          </Tag>
        ) : (
          <Text type="secondary">无</Text>
        )
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_: any, record: EvaluationCriteria) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCriteria(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCriteria(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setTemplateModalVisible(true);
    form.resetFields();
  };

  const handleEditTemplate = (template: EvaluationTemplate) => {
    setSelectedTemplate(template);
    setTemplateModalVisible(true);
    form.setFieldsValue(template);
  };

  const handleViewTemplate = (template: EvaluationTemplate) => {
    setSelectedTemplate(template);
    setTemplateDetailVisible(true);
  };

  const handleCopyTemplate = (template: EvaluationTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} - 副本`,
      isDefault: false,
      usageCount: 0,
      status: "draft" as const,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setTemplates(prev => [...prev, newTemplate]);
    message.success("模板复制成功！");
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    message.success("模板删除成功！");
  };

  const handleViewUsage = (template: EvaluationTemplate) => {
    setSelectedTemplate(template);
    setUsageDrawerVisible(true);
  };

  const handleSaveTemplate = async (values: any) => {
    setLoading(true);
    try {
      if (selectedTemplate) {
        // 编辑模板
        setTemplates(prev => prev.map(t =>
          t.id === selectedTemplate.id ? { ...t, ...values, updatedAt: new Date().toISOString().split("T")[0] } : t,
        ));
        message.success("模板更新成功！");
      } else {
        // 新增模板
        const newTemplate: EvaluationTemplate = {
          ...values,
          id: Date.now().toString(),
          criteria: [],
          totalWeight: 0,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
          usageCount: 0,
        };
        setTemplates(prev => [...prev, newTemplate]);
        message.success("模板创建成功！");
      }
      setTemplateModalVisible(false);
    } catch (_error) {
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCriteria = () => {
    setEditingCriteria(null);
    setCriteriaModalVisible(true);
    criteriaForm.resetFields();
  };

  const handleEditCriteria = (criteria: EvaluationCriteria) => {
    setEditingCriteria(criteria);
    setCriteriaModalVisible(true);
    criteriaForm.setFieldsValue(criteria);
  };

  const handleDeleteCriteria = (criteriaId: string) => {
    if (selectedTemplate) {
      const updatedCriteria = selectedTemplate.criteria.filter(c => c.id !== criteriaId);
      const updatedTemplate = {
        ...selectedTemplate,
        criteria: updatedCriteria,
        totalWeight: updatedCriteria.reduce((sum, c) => sum + c.weight, 0),
      };
      setSelectedTemplate(updatedTemplate);
      setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
      message.success("评分标准删除成功！");
    }
  };

  const handleSaveCriteria = async (values: any) => {
    try {
      if (selectedTemplate) {
        let updatedCriteria;
        if (editingCriteria) {
          // 编辑标准
          updatedCriteria = selectedTemplate.criteria.map(c =>
            c.id === editingCriteria.id ? { ...c, ...values } : c,
          );
        } else {
          // 新增标准
          const newCriteria: EvaluationCriteria = {
            ...values,
            id: Date.now().toString(),
          };
          updatedCriteria = [...selectedTemplate.criteria, newCriteria];
        }

        const updatedTemplate = {
          ...selectedTemplate,
          criteria: updatedCriteria,
          totalWeight: updatedCriteria.reduce((sum, c) => sum + c.weight, 0),
        };

        setSelectedTemplate(updatedTemplate);
        setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
        message.success("评分标准保存成功！");
        setCriteriaModalVisible(false);
      }
    } catch (_error) {
      message.error("保存失败，请重试");
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#262626" }}>
          评分模板管理
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          创建和管理评标模板，提升评标工作效率和标准化程度
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="模板总数"
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="启用模板"
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="草稿模板"
              value={stats.draft}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="总使用次数"
              value={stats.totalUsage}
              prefix={<TeamOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ color: "#1890ff" }} />
            <span>模板列表</span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ImportOutlined />}>导入模板</Button>
            <Button icon={<ExportOutlined />}>导出模板</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTemplate}>
              新建模板
            </Button>
          </Space>
        }
        bodyStyle={{ padding: 0 }}
      >
        {/* 搜索和筛选区域 */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0" }}>
          <Row gutter={16} align="middle">
            <Col flex="auto">
              <Search
                placeholder="搜索模板名称或描述"
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: 400 }}
              />
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder="选择分类"
                  allowClear
                  value={filterCategory}
                  onChange={setFilterCategory}
                  style={{ width: 120 }}
                >
                  <Option value="建设工程">建设工程</Option>
                  <Option value="信息技术">信息技术</Option>
                  <Option value="设备采购">设备采购</Option>
                  <Option value="服务采购">服务采购</Option>
                </Select>
                <Select
                  placeholder="选择状态"
                  allowClear
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 100 }}
                >
                  <Option value="active">已启用</Option>
                  <Option value="inactive">已停用</Option>
                  <Option value="draft">草稿</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 表格区域 */}
        <Table
          columns={templateColumns}
          dataSource={filteredTemplates}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
            size: "default",
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无模板数据"
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTemplate}>
                  创建第一个模板
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* 模板详情模态框 */}
      <Modal
        title={
          <Space>
            <EyeOutlined style={{ color: "#1890ff" }} />
            <span>模板详情</span>
          </Space>
        }
        open={templateDetailVisible}
        onCancel={() => setTemplateDetailVisible(false)}
        footer={[
          <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => {
            setTemplateDetailVisible(false);
            handleEditTemplate(selectedTemplate!);
          }}>
            编辑模板
          </Button>,
          <Button key="close" onClick={() => setTemplateDetailVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedTemplate && (
          <div>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="模板名称">{selectedTemplate.name}</Descriptions.Item>
              <Descriptions.Item label="模板分类">
                <Tag color="geekblue">{selectedTemplate.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="模板状态">
                <Tag color={selectedTemplate.status === "active" ? "success" : selectedTemplate.status === "draft" ? "warning" : "error"}>
                  {selectedTemplate.status === "active" ? "已启用" : selectedTemplate.status === "draft" ? "草稿" : "已停用"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="使用次数">
                <Badge count={selectedTemplate.usageCount} style={{ backgroundColor: "#52c41a" }} />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedTemplate.createdAt}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{selectedTemplate.updatedAt}</Descriptions.Item>
              <Descriptions.Item label="创建人">{selectedTemplate.createdBy}</Descriptions.Item>
              <Descriptions.Item label="权重总计">
                <Text strong style={{ color: selectedTemplate.totalWeight === 100 ? "#52c41a" : "#faad14" }}>
                  {selectedTemplate.totalWeight}%
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="模板描述" span={2}>
                {selectedTemplate.description}
              </Descriptions.Item>
            </Descriptions>

            <Divider>评分标准配置</Divider>
            <Table
              columns={criteriaColumns.filter(col => col.key !== "action")}
              dataSource={selectedTemplate.criteria}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </div>
        )}
      </Modal>

      {/* 模板编辑模态框 */}
      <Modal
        title={
          <Space>
            {selectedTemplate ? <EditOutlined style={{ color: "#1890ff" }} /> : <PlusOutlined style={{ color: "#1890ff" }} />}
            <span>{selectedTemplate ? "编辑模板" : "新建模板"}</span>
          </Space>
        }
        open={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveTemplate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true, message: "请输入模板名称" }]}
              >
                <Input placeholder="请输入模板名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="模板分类"
                rules={[{ required: true, message: "请选择模板分类" }]}
              >
                <Select placeholder="选择分类">
                  <Option value="建设工程">建设工程</Option>
                  <Option value="信息技术">信息技术</Option>
                  <Option value="设备采购">设备采购</Option>
                  <Option value="服务采购">服务采购</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="模板描述"
            rules={[{ required: true, message: "请输入模板描述" }]}
          >
            <TextArea rows={3} placeholder="请输入模板描述，建议说明适用场景和特点" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="模板状态"
                rules={[{ required: true, message: "请选择模板状态" }]}
              >
                <Select placeholder="选择状态">
                  <Option value="active">启用</Option>
                  <Option value="inactive">停用</Option>
                  <Option value="draft">草稿</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isDefault"
                label="设为默认模板"
                valuePropName="checked"
                extra="默认模板将在创建新项目时自动选择"
              >
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Col>
          </Row>

          {/* 评分标准配置 */}
          {selectedTemplate && (
            <div>
              <Divider>评分标准配置</Divider>
              <div style={{ marginBottom: 16 }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddCriteria}>
                        添加评分标准
                      </Button>
                      <Text type="secondary">
                        当前权重总计：
                        <Text strong style={{ color: selectedTemplate.totalWeight === 100 ? "#52c41a" : "#faad14" }}>
                          {selectedTemplate.totalWeight}%
                        </Text>
                      </Text>
                    </Space>
                  </Col>
                  {selectedTemplate.totalWeight !== 100 && (
                    <Col>
                      <Alert
                        message="权重配置提醒"
                        description="评分标准权重总和应为100%"
                        type="warning"
                        showIcon
                        className="small-alert"
                      />
                    </Col>
                  )}
                </Row>
              </div>

              <Table
                columns={criteriaColumns}
                dataSource={selectedTemplate.criteria}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="暂无评分标准"
                    >
                      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddCriteria}>
                        添加第一个评分标准
                      </Button>
                    </Empty>
                  ),
                }}
              />
            </div>
          )}

          <Divider />
          <Row justify="end">
            <Space>
              <Button onClick={() => setTemplateModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {selectedTemplate ? "更新模板" : "创建模板"}
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>

      {/* 评分标准编辑模态框 */}
      <Modal
        title={
          <Space>
            {editingCriteria ? <EditOutlined style={{ color: "#1890ff" }} /> : <PlusOutlined style={{ color: "#1890ff" }} />}
            <span>{editingCriteria ? "编辑评分标准" : "添加评分标准"}</span>
          </Space>
        }
        open={criteriaModalVisible}
        onCancel={() => setCriteriaModalVisible(false)}
        onOk={() => criteriaForm.submit()}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={criteriaForm} layout="vertical" onFinish={handleSaveCriteria}>
          <Form.Item
            name="name"
            label="标准名称"
            rules={[{ required: true, message: "请输入标准名称" }]}
          >
            <Input placeholder="请输入评分标准名称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="权重(%)"
                rules={[{ required: true, message: "请输入权重" }]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxScore"
                label="满分"
                rules={[{ required: true, message: "请输入满分" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="标准描述"
            rules={[{ required: true, message: "请输入标准描述" }]}
          >
            <TextArea rows={3} placeholder="请输入评分标准的详细描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 使用记录抽屉 */}
      <Drawer
        title={
          <Space>
            <HistoryOutlined style={{ color: "#1890ff" }} />
            <span>使用记录 - {selectedTemplate?.name}</span>
          </Space>
        }
        open={usageDrawerVisible}
        onClose={() => setUsageDrawerVisible(false)}
        width={600}
      >
        <List
          dataSource={usageRecords.filter(record => record.templateId === selectedTemplate?.id)}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{item.projectName}</Text>
                    <Tag color={item.status === "completed" ? "success" : item.status === "in-progress" ? "processing" : "error"}>
                      {item.status === "completed" ? "已完成" : item.status === "in-progress" ? "进行中" : "已取消"}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <div>使用人：{item.usedBy}</div>
                    <div>使用时间：{item.usedAt}</div>
                    <div>项目编号：{item.projectId}</div>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无使用记录"
              />
            ),
          }}
        />
      </Drawer>
    </div>
  );
};

export default EvaluationTemplatesPage;
