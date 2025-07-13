"use client";
import {
  AlertOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
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
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

// 任务监控数据接口
interface TaskMonitorData {
  id: string;
  name: string;
  type: string;
  status: "running" | "paused" | "completed" | "error" | "pending";
  progress: number;
  assignee: string;
  startTime: string;
  estimatedCompletion: string;
  priority: "high" | "medium" | "low";
  dataCount: number;
  completedCount: number;
  qualityScore: number;
  errorRate: number;
  avgTimePerItem: number;
  lastActivity: string;
}

// 统计数据接口
interface MonitorStats {
  totalTasks: number;
  runningTasks: number;
  completedTasks: number;
  errorTasks: number;
  avgProgress: number;
  avgQuality: number;
}

const TaskMonitor: React.FC = () => {
  const [loading, _setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 模拟统计数据
  const [stats, setStats] = useState<MonitorStats>({
    totalTasks: 156,
    runningTasks: 89,
    completedTasks: 45,
    errorTasks: 3,
    avgProgress: 67.8,
    avgQuality: 94.2,
  });

  // 模拟任务数据
  const [tasks, setTasks] = useState<TaskMonitorData[]>([
    {
      id: "task_001",
      name: "医疗影像分类标注",
      type: "图像分类",
      status: "running",
      progress: 78,
      assignee: "张小明",
      startTime: "2024-01-10 09:00:00",
      estimatedCompletion: "2024-01-15 18:00:00",
      priority: "high",
      dataCount: 5000,
      completedCount: 3900,
      qualityScore: 96.5,
      errorRate: 2.1,
      avgTimePerItem: 45,
      lastActivity: "2分钟前",
    },
    {
      id: "task_002",
      name: "文本情感分析标注",
      type: "文本分类",
      status: "running",
      progress: 45,
      assignee: "李小红",
      startTime: "2024-01-12 10:30:00",
      estimatedCompletion: "2024-01-18 17:00:00",
      priority: "medium",
      dataCount: 8000,
      completedCount: 3600,
      qualityScore: 92.8,
      errorRate: 3.5,
      avgTimePerItem: 28,
      lastActivity: "5分钟前",
    },
    {
      id: "task_003",
      name: "目标检测边界框标注",
      type: "目标检测",
      status: "paused",
      progress: 23,
      assignee: "王小强",
      startTime: "2024-01-11 14:00:00",
      estimatedCompletion: "2024-01-20 16:00:00",
      priority: "high",
      dataCount: 3000,
      completedCount: 690,
      qualityScore: 89.2,
      errorRate: 5.8,
      avgTimePerItem: 120,
      lastActivity: "1小时前",
    },
    {
      id: "task_004",
      name: "语音转录标注",
      type: "语音标注",
      status: "completed",
      progress: 100,
      assignee: "赵小美",
      startTime: "2024-01-08 08:00:00",
      estimatedCompletion: "2024-01-12 18:00:00",
      priority: "medium",
      dataCount: 2000,
      completedCount: 2000,
      qualityScore: 98.1,
      errorRate: 1.2,
      avgTimePerItem: 180,
      lastActivity: "已完成",
    },
    {
      id: "task_005",
      name: "视频动作识别标注",
      type: "视频标注",
      status: "error",
      progress: 12,
      assignee: "陈小刚",
      startTime: "2024-01-13 11:00:00",
      estimatedCompletion: "2024-01-25 15:00:00",
      priority: "low",
      dataCount: 1500,
      completedCount: 180,
      qualityScore: 85.6,
      errorRate: 12.3,
      avgTimePerItem: 300,
      lastActivity: "系统错误",
    },
  ]);

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "processing";
      case "paused":
        return "warning";
      case "completed":
        return "success";
      case "error":
        return "error";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "进行中";
      case "paused":
        return "已暂停";
      case "completed":
        return "已完成";
      case "error":
        return "错误";
      case "pending":
        return "待开始";
      default:
        return "未知";
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "blue";
      default:
        return "default";
    }
  };

  // 获取优先级文本
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "未知";
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("数据已刷新");
    } catch (_error) {
      message.error("刷新失败");
    } finally {
      setRefreshing(false);
    }
  };

  // 查看任务详情
  const handleViewTask = (taskId: string) => {
    message.info(`查看任务详情: ${taskId}`);
  };

  // 暂停/恢复任务
  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "running" ? "paused" : "running";
    const action = newStatus === "running" ? "恢复" : "暂停";

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus as any } : task,
      ),
    );

    message.success(`任务已${action}`);
  };

  // 停止任务
  const handleStopTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: "paused" as any } : task,
      ),
    );
    message.success("任务已停止");
  };

  // 表格列配置
  const columns: ColumnsType<TaskMonitorData> = [
    {
      title: "任务名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: "left",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.id}
          </Text>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: "进度",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (progress, record) => (
        <div>
          <Progress
            percent={progress}
            size="small"
            status={record.status === "error" ? "exception" : "active"}
          />
          <Text style={{ fontSize: 12 }}>
            {record.completedCount}/{record.dataCount}
          </Text>
        </div>
      ),
    },
    {
      title: "负责人",
      dataIndex: "assignee",
      key: "assignee",
      width: 100,
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: "质量评分",
      dataIndex: "qualityScore",
      key: "qualityScore",
      width: 100,
      render: (score) => (
        <Text style={{ color: score >= 95 ? "#52c41a" : score >= 90 ? "#faad14" : "#ff4d4f" }}>
          {score}%
        </Text>
      ),
    },
    {
      title: "错误率",
      dataIndex: "errorRate",
      key: "errorRate",
      width: 80,
      render: (rate) => (
        <Text style={{ color: rate <= 3 ? "#52c41a" : rate <= 5 ? "#faad14" : "#ff4d4f" }}>
          {rate}%
        </Text>
      ),
    },
    {
      title: "平均用时",
      dataIndex: "avgTimePerItem",
      key: "avgTimePerItem",
      width: 100,
      render: (time) => `${time}s`,
    },
    {
      title: "最后活动",
      dataIndex: "lastActivity",
      key: "lastActivity",
      width: 120,
      render: (activity, record) => (
        <Text
          type={record.status === "error" ? "danger" : "secondary"}
          style={{ fontSize: 12 }}
        >
          {activity}
        </Text>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewTask(record.id)}
            />
          </Tooltip>
          {record.status === "running" ? (
            <Tooltip title="暂停任务">
              <Button
                type="text"
                size="small"
                icon={<StopOutlined />}
                onClick={() => handleToggleTask(record.id, record.status)}
              />
            </Tooltip>
          ) : record.status === "paused" ? (
            <Tooltip title="恢复任务">
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleToggleTask(record.id, record.status)}
              />
            </Tooltip>
          ) : null}
          {record.status !== "completed" && (
            <Tooltip title="停止任务">
              <Button
                type="text"
                size="small"
                danger
                icon={<StopOutlined />}
                onClick={() => handleStopTask(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 筛选后的数据
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchText.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // 自动刷新
  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟实时数据更新
      setStats(prev => ({
        ...prev,
        avgProgress: Math.min(100, prev.avgProgress + Math.random() * 0.5),
      }));
    }, 30000); // 30秒刷新一次

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          任务监控
        </Title>
        <Text type="secondary">
          实时监控所有标注任务的执行状态和进度
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={stats.totalTasks}
              prefix={<SyncOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="进行中"
              value={stats.runningTasks}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="异常任务"
              value={stats.errorTasks}
              prefix={<AlertOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 平均指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="平均进度" size="small">
            <Progress
              percent={Math.round(stats.avgProgress)}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="平均质量评分" size="small">
            <Progress
              percent={Math.round(stats.avgQuality)}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选和操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="搜索任务名称或负责人"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部状态</Option>
              <Option value="running">进行中</Option>
              <Option value="paused">已暂停</Option>
              <Option value="completed">已完成</Option>
              <Option value="error">错误</Option>
              <Option value="pending">待开始</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="类型"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部类型</Option>
              <Option value="图像分类">图像分类</Option>
              <Option value="文本分类">文本分类</Option>
              <Option value="目标检测">目标检测</Option>
              <Option value="语音标注">语音标注</Option>
              <Option value="视频标注">视频标注</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="优先级"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部优先级</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              style={{ width: "100%" }}
              placeholder={["开始日期", "结束日期"]}
            />
          </Col>
          <Col xs={24} sm={12} md={4} lg={3}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                loading={refreshing}
                onClick={handleRefresh}
              >
                刷新
              </Button>
              <Dropdown
                menu={{
                  items: [
                    { key: "export", label: "导出数据" },
                    { key: "settings", label: "监控设置" },
                  ],
                }}
              >
                <Button icon={<FilterOutlined />}>更多</Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 任务列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredTasks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          rowClassName={(record) => {
            if (record.status === "error") return "error-row";
            if (record.status === "running") return "running-row";
            return "";
          }}
        />
      </Card>

      {/* 自定义样式 */}
      <style jsx global>{`
        .error-row {
          background-color: #fff2f0 !important;
        }
        .running-row {
          background-color: #f6ffed !important;
        }
        .ant-table-tbody > tr:hover.error-row > td {
          background-color: #ffebe6 !important;
        }
        .ant-table-tbody > tr:hover.running-row > td {
          background-color: #f0f9e6 !important;
        }
      `}</style>
    </div>
  );
};

export default TaskMonitor;
