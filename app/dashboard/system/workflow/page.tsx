"use client";
import {
  BranchesOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  ImportOutlined,
  NodeIndexOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  SyncOutlined
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
  Timeline,
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

// 工作流配置接口
interface WorkflowConfig {
  id: string;
  name: string;
  description: string;
  type: "annotation" | "review" | "quality" | "export";
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  creator: string;
  status: "active" | "draft" | "paused" | "archived";
  projectCount: number;
  version: string;
  isDefault: boolean;
  executionCount: number;
  successRate: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: "annotation" | "review" | "quality_check" | "approval" | "export";
  order: number;
  assigneeType: "auto" | "manual" | "role";
  assigneeConfig: any;
  conditions: any;
  timeLimit?: number;
  isRequired: boolean;
}

const WorkflowPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowConfig | null>(null);
  const [form] = Form.useForm();

  // 模拟工作流配置数据
  const [workflows, setWorkflows] = useState<WorkflowConfig[]>([
    {
      id: "workflow_001",
      name: "标准标注工作流",
      description: "包含标注、审核、质检的完整工作流程",
      type: "annotation",
      steps: [
        {
          id: "step_001",
          name: "数据标注",
          type: "annotation",
          order: 1,
          assigneeType: "auto",
          assigneeConfig: { role: "annotator" },
          conditions: {},
          timeLimit: 480,
          isRequired: true
        },
        {
          id: "step_002",
          name: "标注审核",
          type: "review",
          order: 2,
          assigneeType: "role",
          assigneeConfig: { role: "reviewer" },
          conditions: { accuracy: ">= 0.9" },
          timeLimit: 240,
          isRequired: true
        },
        {
          id: "step_003",
          name: "质量检查",
          type: "quality_check",
          order: 3,
          assigneeType: "auto",
          assigneeConfig: { algorithm: "consensus" },
          conditions: { confidence: ">= 0.95" },
          isRequired: false
        }
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      creator: "系统管理员",
      status: "active",
      projectCount: 8,
      version: "v2.1",
      isDefault: true,
      executionCount: 1250,
      successRate: 94.5
    },
    {
      id: "workflow_002",
      name: "快速标注工作流",
      description: "简化的标注流程，适用于简单任务",
      type: "annotation",
      steps: [
        {
          id: "step_004",
          name: "快速标注",
          type: "annotation",
          order: 1,
          assigneeType: "auto",
          assigneeConfig: { role: "annotator" },
          conditions: {},
          timeLimit: 240,
          isRequired: true
        },
        {
          id: "step_005",
          name: "自动导出",
          type: "export",
          order: 2,
          assigneeType: "auto",
          assigneeConfig: { format: "json" },
          conditions: { completion: "100%" },
          isRequired: true
        }
      ],
      createdAt: "2024-01-08",
      updatedAt: "2024-01-14",
      creator: "王工程师",
      status: "active",
      projectCount: 3,
      version: "v1.5",
      isDefault: false,
      executionCount: 680,
      successRate: 98.2
    },
    {
      id: "workflow_003",
      name: "质量优先工作流",
      description: "多轮审核确保高质量标注结果",
      type: "quality",
      steps: [
        {
          id: "step_006",
          name: "初次标注",
          type: "annotation",
          order: 1,
          assigneeType: "manual",
          assigneeConfig: {},
          conditions: {},
          timeLimit: 600,
          isRequired: true
        },
        {
          id: "step_007",
          name: "交叉验证",
          type: "review",
          order: 2,
          assigneeType: "auto",
          assigneeConfig: { count: 2 },
          conditions: { agreement: ">= 0.8" },
          timeLimit: 300,
          isRequired: true
        },
        {
          id: "step_008",
          name: "专家审核",
          type: "approval",
          order: 3,
          assigneeType: "role",
          assigneeConfig: { role: "expert" },
          conditions: { conflict: "exists" },
          timeLimit: 480,
          isRequired: true
        }
      ],
      createdAt: "2024-01-05",
      updatedAt: "2024-01-12",
      creator: "李专家",
      status: "draft",
      projectCount: 1,
      version: "v1.0",
      isDefault: false,
      executionCount: 0,
      successRate: 0
    }
  ]);

  // 统计数据
  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.status === "active").length,
    totalExecutions: workflows.reduce((sum, w) => sum + w.executionCount, 0),
    avgSuccessRate: workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length
  };

  // 获取类型标签
  const getTypeTag = (type: string) => {
    const typeConfig = {
      annotation: { color: "blue", text: "标注流程" },
      review: { color: "green", text: "审核流程" },
      quality: { color: "orange", text: "质检流程" },
      export: { color: "purple", text: "导出流程" }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || { color: "default", text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    const configs = {
      active: { color: "success", text: "运行中", icon: <PlayCircleOutlined /> },
      draft: { color: "warning", text: "草稿", icon: <SyncOutlined /> },
      paused: { color: "processing", text: "已暂停", icon: <PauseCircleOutlined /> },
      archived: { color: "default", text: "已归档", icon: <CloseCircleOutlined /> }
    };
    return configs[status as keyof typeof configs] || configs.draft;
  };

  // 获取步骤类型图标
  const getStepIcon = (type: string) => {
    const icons = {
      annotation: <EditOutlined />,
      review: <EyeOutlined />,
      quality_check: <CheckCircleOutlined />,
      approval: <CheckCircleOutlined />,
      export: <ExportOutlined />
    };
    return icons[type as keyof typeof icons] || <SettingOutlined />;
  };

  // 筛选数据
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchText.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === "all" || workflow.type === typeFilter;
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 表格列配置
  const columns: ColumnsType<WorkflowConfig> = [
    {
      title: "工作流名称",
      dataIndex: "name",
      key: "name",
      width: 280,
      fixed: 'left',
      render: (text, record) => (
        <Space align="start">
          <BranchesOutlined style={{ color: "#1890ff", marginTop: 4 }} />
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
      title: "步骤数量",
      dataIndex: "steps",
      key: "stepCount",
      width: 100,
      render: (steps) => (
        <Badge count={steps.length} style={{ backgroundColor: "#52c41a" }} />
      )
    },
    {
      title: "工作流预览",
      dataIndex: "steps",
      key: "stepPreview",
      width: 250,
      render: (steps) => (
        <Timeline style={{ margin: 0 }}>
          {steps.slice(0, 3).map((step: WorkflowStep, index: number) => (
            <Timeline.Item
              key={step.id}
              dot={getStepIcon(step.type)}
              color={index === 0 ? "blue" : "gray"}
            >
              <Text style={{ fontSize: 12 }}>{step.name}</Text>
            </Timeline.Item>
          ))}
          {steps.length > 3 && (
            <Timeline.Item dot={<SettingOutlined />} color="gray">
              <Text style={{ fontSize: 12 }}>+{steps.length - 3} 个步骤</Text>
            </Timeline.Item>
          )}
        </Timeline>
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
      title: "执行次数",
      dataIndex: "executionCount",
      key: "executionCount",
      width: 100,
      render: (count) => (
        <Text style={{ color: "#722ed1" }}>
          {count.toLocaleString()}
        </Text>
      )
    },
    {
      title: "成功率",
      dataIndex: "successRate",
      key: "successRate",
      width: 100,
      render: (rate) => (
        <Text style={{
          color: rate >= 95 ? "#52c41a" : rate >= 85 ? "#fa8c16" : "#ff4d4f"
        }}>
          {rate > 0 ? `${rate.toFixed(1)}%` : "-"}
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
          <Tooltip title={record.status === "active" ? "暂停" : "启动"}>
            <Button
              type="text"
              icon={record.status === "active" ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleStatus(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "copy",
                  label: "复制",
                  icon: <CopyOutlined />,
                  onClick: () => handleCopy(record)
                },
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
  const handleView = (workflow: WorkflowConfig) => {
    message.info(`查看工作流: ${workflow.name}`);
  };

  const handleEdit = (workflow: WorkflowConfig) => {
    setEditingWorkflow(workflow);
    form.setFieldsValue(workflow);
    setModalVisible(true);
  };

  const handleToggleStatus = (workflow: WorkflowConfig) => {
    const newStatus = workflow.status === "active" ? "paused" : "active";
    setWorkflows(workflows.map(w =>
      w.id === workflow.id ? { ...w, status: newStatus } : w
    ));
    message.success(`工作流已${newStatus === "active" ? "启动" : "暂停"}`);
  };

  const handleCopy = (workflow: WorkflowConfig) => {
    const newWorkflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      name: `${workflow.name}_副本`,
      isDefault: false,
      status: "draft" as const,
      projectCount: 0,
      executionCount: 0,
      successRate: 0
    };
    setWorkflows([...workflows, newWorkflow]);
    message.success("工作流已复制");
  };

  const handleExport = (workflow: WorkflowConfig) => {
    message.success(`导出工作流配置: ${workflow.name}`);
  };

  const handleDelete = (workflow: WorkflowConfig) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除工作流 "${workflow.name}" 吗？`,
      onOk: () => {
        setWorkflows(workflows.filter(w => w.id !== workflow.id));
        message.success("删除成功");
      }
    });
  };

  const handleCreate = () => {
    setEditingWorkflow(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleImport = () => {
    message.info("导入工作流配置功能开发中");
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (editingWorkflow) {
        // 编辑
        setWorkflows(workflows.map(w =>
          w.id === editingWorkflow.id ? { ...w, ...values } : w
        ));
        message.success("更新成功");
      } else {
        // 新建
        const newWorkflow: WorkflowConfig = {
          ...values,
          id: `workflow_${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          creator: "当前用户",
          projectCount: 0,
          version: "v1.0",
          steps: [],
          executionCount: 0,
          successRate: 0
        };
        setWorkflows([...workflows, newWorkflow]);
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
          <BranchesOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          工作流配置管理
        </Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="总工作流数"
                value={stats.totalWorkflows}
                prefix={<BranchesOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="运行中"
                value={stats.activeWorkflows}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="总执行次数"
                value={stats.totalExecutions}
                prefix={<NodeIndexOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="平均成功率"
                value={stats.avgSuccessRate.toFixed(1)}
                suffix="%"
                prefix={<CheckCircleOutlined />}
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
                placeholder="搜索工作流名称或描述"
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
                <Option value="annotation">标注流程</Option>
                <Option value="review">审核流程</Option>
                <Option value="quality">质检流程</Option>
                <Option value="export">导出流程</Option>
              </Select>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
                placeholder="状态筛选"
              >
                <Option value="all">全部状态</Option>
                <Option value="active">运行中</Option>
                <Option value="draft">草稿</Option>
                <Option value="paused">已暂停</Option>
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
                新建工作流
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 工作流配置表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredWorkflows}
          rowKey="id"
          pagination={{
            total: filteredWorkflows.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingWorkflow ? "编辑工作流" : "新建工作流"}
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
            label="工作流名称"
            rules={[{ required: true, message: "请输入工作流名称" }]}
          >
            <Input placeholder="请输入工作流名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="工作流描述"
            rules={[{ required: true, message: "请输入工作流描述" }]}
          >
            <TextArea rows={3} placeholder="请输入工作流的详细描述" />
          </Form.Item>

          <Form.Item
            name="type"
            label="工作流类型"
            rules={[{ required: true, message: "请选择工作流类型" }]}
          >
            <Select placeholder="请选择工作流类型">
              <Option value="annotation">标注流程</Option>
              <Option value="review">审核流程</Option>
              <Option value="quality">质检流程</Option>
              <Option value="export">导出流程</Option>
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
                  <Option value="active">运行中</Option>
                  <Option value="paused">已暂停</Option>
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

export default WorkflowPage;
