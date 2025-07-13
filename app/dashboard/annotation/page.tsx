"use client";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

// 任务数据类型定义
interface AnnotationTask {
  id: string;
  title: string;
  type: "图像分类" | "目标检测" | "文本标注" | "语音标注" | "视频标注";
  status: "待开始" | "进行中" | "已完成" | "已暂停" | "已取消";
  priority: "高" | "中" | "低";
  progress: number;
  totalItems: number;
  completedItems: number;
  assignee: string;
  creator: string;
  createTime: string;
  deadline: string;
  description: string;
  tags: string[];
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

const AnnotationPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // 模拟数据
  const taskData: AnnotationTask[] = [
    {
      id: "TASK-001",
      title: "医疗影像肺部结节检测标注",
      type: "图像分类",
      status: "进行中",
      priority: "高",
      progress: 78,
      totalItems: 1500,
      completedItems: 1170,
      assignee: "张小明",
      creator: "李医生",
      createTime: "2024-01-10",
      deadline: "2024-01-25",
      description: "对胸部CT影像中的肺部结节进行精确标注和分类",
      tags: ["医疗", "影像", "AI辅助"],
    },
    {
      id: "TASK-002",
      title: "电商用户评论情感分析",
      type: "文本标注",
      status: "进行中",
      priority: "中",
      progress: 45,
      totalItems: 5000,
      completedItems: 2250,
      assignee: "王小红",
      creator: "产品经理",
      createTime: "2024-01-12",
      deadline: "2024-01-30",
      description: "对电商平台用户评论进行情感倾向标注",
      tags: ["NLP", "情感分析", "电商"],
    },
    {
      id: "TASK-003",
      title: "自动驾驶场景目标检测",
      type: "目标检测",
      status: "待开始",
      priority: "高",
      progress: 0,
      totalItems: 3000,
      completedItems: 0,
      assignee: "赵小强",
      creator: "算法工程师",
      createTime: "2024-01-15",
      deadline: "2024-02-15",
      description: "标注自动驾驶场景中的车辆、行人、交通标志等目标",
      tags: ["自动驾驶", "目标检测", "安全"],
    },
    {
      id: "TASK-004",
      title: "多语言语音识别数据标注",
      type: "语音标注",
      status: "已完成",
      priority: "中",
      progress: 100,
      totalItems: 2000,
      completedItems: 2000,
      assignee: "李小美",
      creator: "语音团队",
      createTime: "2024-01-05",
      deadline: "2024-01-20",
      description: "对多语言语音数据进行转录和语言标注",
      tags: ["语音识别", "多语言", "ASR"],
    },
    {
      id: "TASK-005",
      title: "视频行为识别标注项目",
      type: "视频标注",
      status: "已暂停",
      priority: "低",
      progress: 23,
      totalItems: 800,
      completedItems: 184,
      assignee: "陈小龙",
      creator: "视频算法组",
      createTime: "2024-01-08",
      deadline: "2024-02-08",
      description: "标注视频中的人体行为和动作类别",
      tags: ["视频分析", "行为识别", "计算机视觉"],
    },
  ];

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "进行中":
        return "processing";
      case "已完成":
        return "success";
      case "待开始":
        return "default";
      case "已暂停":
        return "warning";
      case "已取消":
        return "error";
      default:
        return "default";
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "red";
      case "中":
        return "orange";
      case "低":
        return "blue";
      default:
        return "default";
    }
  };

  // 获取任务类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "图像分类":
        return "🖼️";
      case "目标检测":
        return "🎯";
      case "文本标注":
        return "📝";
      case "语音标注":
        return "🎵";
      case "视频标注":
        return "🎬";
      default:
        return "📋";
    }
  };

  // 表格列定义
  const columns: ColumnsType<AnnotationTask> = [
    {
      title: "任务信息",
      dataIndex: "title",
      key: "title",
      width: 300,
      render: (text: string, record: AnnotationTask) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>{getTypeIcon(record.type)}</span>
            <Text strong style={{ fontSize: 14 }}>
              {text}
            </Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Text>
          </div>
          <div style={{ marginTop: 8 }}>
            {record.tags.map((tag) => (
              <Tag key={tag} className="small-tag" style={{ marginRight: 4 }}>
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => (
        <Tag color="blue" style={{ fontSize: 12 }}>
          {type}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Badge status={getStatusColor(status)} text={status} />
      ),
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "进度",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (progress: number, record: AnnotationTask) => (
        <div>
          <Progress
            percent={progress}
            size="small"
            strokeColor={
              progress >= 80
                ? "#52c41a"
                : progress >= 50
                  ? "#1890ff"
                  : "#faad14"
            }
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.completedItems}/{record.totalItems}
          </Text>
        </div>
      ),
    },
    {
      title: "负责人",
      dataIndex: "assignee",
      key: "assignee",
      width: 100,
      render: (assignee: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text style={{ fontSize: 12 }}>{assignee}</Text>
        </div>
      ),
    },
    {
      title: "截止时间",
      dataIndex: "deadline",
      key: "deadline",
      width: 100,
      render: (deadline: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {deadline}
        </Text>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_, _record: AnnotationTask) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="编辑任务">
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="任务设置">
            <Button type="text" size="small" icon={<SettingOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 过滤数据
  const filteredData = taskData.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // 统计数据
  const totalTasks = taskData.length;
  const activeTasks = taskData.filter((task) => task.status === "进行中").length;
  const completedTasks = taskData.filter(
    (task) => task.status === "已完成",
  ).length;
  const pendingTasks = taskData.filter(
    (task) => task.status === "待开始",
  ).length;

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>
          标注任务管理
        </Title>
        <Text type="secondary">管理和监控所有数据标注任务的进度和状态</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="总任务数"
            value={totalTasks}
            suffix="个"
            prefix={<EditOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="进行中"
            value={activeTasks}
            suffix="个"
            prefix={<ClockCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="已完成"
            value={completedTasks}
            suffix="个"
            prefix={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="待开始"
            value={pendingTasks}
            suffix="个"
            prefix={<ExclamationCircleOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* 操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索任务名称或描述"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部状态</Option>
              <Option value="待开始">待开始</Option>
              <Option value="进行中">进行中</Option>
              <Option value="已完成">已完成</Option>
              <Option value="已暂停">已暂停</Option>
              <Option value="已取消">已取消</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="类型筛选"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部类型</Option>
              <Option value="图像分类">图像分类</Option>
              <Option value="目标检测">目标检测</Option>
              <Option value="文本标注">文本标注</Option>
              <Option value="语音标注">语音标注</Option>
              <Option value="视频标注">视频标注</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="优先级筛选"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部优先级</Option>
              <Option value="高">高优先级</Option>
              <Option value="中">中优先级</Option>
              <Option value="低">低优先级</Option>
            </Select>
          </Col>
          <Col xs={12} sm={12} md={4}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
                创建任务
              </Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 任务列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default AnnotationPage;
