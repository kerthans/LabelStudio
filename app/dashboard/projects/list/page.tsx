"use client";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  ProjectOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// 项目数据接口
interface ProjectData {
  id: string;
  name: string;
  description: string;
  type: string;
  status: "active" | "completed" | "paused" | "draft";
  progress: number;
  totalTasks: number;
  completedTasks: number;
  assignedAnnotators: number;
  createdDate: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  manager: string;
  qualityScore: number;
}

// 统计卡片组件
const StatisticCard: React.FC<{
  title: string;
  value: number;
  suffix?: string;
  prefix: React.ReactNode;
  color: string;
  loading?: boolean;
}> = ({ title, value, suffix, prefix, color, loading = false }) => (
  <Card
    hoverable
    loading={loading}
    styles={{
      body: {
        padding: "24px",
      },
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: color,
        }}
      >
        {prefix}
      </div>
      <div style={{ flex: 1 }}>
        <Statistic
          title={
            <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>
              {title}
            </Text>
          }
          value={value}
          valueStyle={{
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.2,
            color: color,
          }}
          suffix={suffix}
        />
      </div>
    </div>
  </Card>
);

const ProjectList: React.FC = () => {
  const router = useRouter();
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // 模拟项目数据
  const projectsData: ProjectData[] = [
    {
      id: "proj_001",
      name: "医疗影像分类标注项目",
      description: "针对CT和MRI影像进行病灶检测和分类标注",
      type: "图像分类",
      status: "active",
      progress: 78,
      totalTasks: 5000,
      completedTasks: 3900,
      assignedAnnotators: 12,
      createdDate: "2024-01-10",
      deadline: "2024-02-15",
      priority: "high",
      manager: "张医生",
      qualityScore: 96.8,
    },
    {
      id: "proj_002",
      name: "自然语言情感分析",
      description: "对用户评论和反馈进行情感倾向性标注",
      type: "文本分类",
      status: "active",
      progress: 45,
      totalTasks: 8000,
      completedTasks: 3600,
      assignedAnnotators: 8,
      createdDate: "2024-01-15",
      deadline: "2024-02-20",
      priority: "medium",
      manager: "李工程师",
      qualityScore: 94.2,
    },
    {
      id: "proj_003",
      name: "自动驾驶目标检测",
      description: "道路场景中车辆、行人、交通标志的检测标注",
      type: "目标检测",
      status: "paused",
      progress: 23,
      totalTasks: 12000,
      completedTasks: 2760,
      assignedAnnotators: 15,
      createdDate: "2024-01-08",
      deadline: "2024-03-01",
      priority: "high",
      manager: "王总监",
      qualityScore: 98.1,
    },
    {
      id: "proj_004",
      name: "语音识别数据标注",
      description: "多语言语音数据的转录和语音特征标注",
      type: "语音标注",
      status: "completed",
      progress: 100,
      totalTasks: 3000,
      completedTasks: 3000,
      assignedAnnotators: 6,
      createdDate: "2023-12-01",
      deadline: "2024-01-10",
      priority: "low",
      manager: "赵专家",
      qualityScore: 97.5,
    },
  ];

  // 统计数据
  const statisticsData = [
    {
      title: "总项目数",
      value: projectsData.length,
      suffix: "个",
      prefix: <ProjectOutlined />,
      color: "#1890ff",
    },
    {
      title: "进行中项目",
      value: projectsData.filter((p) => p.status === "active").length,
      suffix: "个",
      prefix: <ClockCircleOutlined />,
      color: "#52c41a",
    },
    {
      title: "已完成项目",
      value: projectsData.filter((p) => p.status === "completed").length,
      suffix: "个",
      prefix: <CheckCircleOutlined />,
      color: "#722ed1",
    },
    {
      title: "参与标注员",
      value: projectsData.reduce((sum, p) => sum + p.assignedAnnotators, 0),
      suffix: "人",
      prefix: <TeamOutlined />,
      color: "#fa8c16",
    },
  ];

  // 获取状态标签
  const getStatusTag = (status: string) => {
    const statusConfig = {
      active: { color: "processing", text: "进行中" },
      completed: { color: "success", text: "已完成" },
      paused: { color: "warning", text: "已暂停" },
      draft: { color: "default", text: "草稿" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 获取优先级标签
  const getPriorityTag = (priority: string) => {
    const priorityConfig = {
      high: { color: "red", text: "高" },
      medium: { color: "orange", text: "中" },
      low: { color: "blue", text: "低" },
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns: ColumnsType<ProjectData> = [
    {
      title: "项目信息",
      key: "project",
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>
              {record.name}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
          <div style={{ marginTop: 8 }}>
            <Space size={4}>
              <Tag color="blue">{record.type}</Tag>
              {getPriorityTag(record.priority)}
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: "进度",
      key: "progress",
      width: 150,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.progress}
            size="small"
            status={record.status === "paused" ? "exception" : "active"}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.completedTasks}/{record.totalTasks} 任务
          </Text>
        </div>
      ),
    },
    {
      title: "质量评分",
      dataIndex: "qualityScore",
      key: "qualityScore",
      width: 100,
      render: (score) => (
        <div style={{ textAlign: "center" }}>
          <Text
            style={{
              color: score >= 95 ? "#52c41a" : score >= 90 ? "#fa8c16" : "#ff4d4f",
              fontWeight: 600,
            }}
          >
            {score}%
          </Text>
        </div>
      ),
    },
    {
      title: "负责人",
      dataIndex: "manager",
      key: "manager",
      width: 100,
    },
    {
      title: "截止日期",
      dataIndex: "deadline",
      key: "deadline",
      width: 120,
      render: (deadline) => {
        const isOverdue = new Date(deadline) < new Date();
        return (
          <Text type={isOverdue ? "danger" : "secondary"}>
            {deadline}
          </Text>
        );
      },
    },
    {
      title: "操作",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewProject(record.id)}
            />
          </Tooltip>
          <Tooltip title="编辑项目">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditProject(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理函数
  const handleViewProject = (projectId: string) => {
    message.info(`查看项目: ${projectId}`);
  };

  const handleEditProject = (projectId: string) => {
    message.info(`编辑项目: ${projectId}`);
  };

  const handleCreateProject = () => {
    router.push("/dashboard/projects/create");
  };

  // 过滤数据
  const filteredData = projectsData.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesType = typeFilter === "all" || project.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div style={{ padding: "24px" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          项目列表
        </Title>
        <Text type="secondary">管理和监控所有数据标注项目</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatisticCard {...stat} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle">
              <Input
                placeholder="搜索项目名称"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
              />
              <Select
                placeholder="项目状态"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部状态</Select.Option>
                <Select.Option value="active">进行中</Select.Option>
                <Select.Option value="completed">已完成</Select.Option>
                <Select.Option value="paused">已暂停</Select.Option>
                <Select.Option value="draft">草稿</Select.Option>
              </Select>
              <Select
                placeholder="项目类型"
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部类型</Select.Option>
                <Select.Option value="图像分类">图像分类</Select.Option>
                <Select.Option value="文本分类">文本分类</Select.Option>
                <Select.Option value="目标检测">目标检测</Select.Option>
                <Select.Option value="语音标注">语音标注</Select.Option>
              </Select>
              <RangePicker placeholder={["开始日期", "结束日期"]} />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateProject}
              >
                创建项目
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 项目表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default ProjectList;
