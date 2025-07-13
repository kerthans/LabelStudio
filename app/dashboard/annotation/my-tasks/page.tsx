"use client";
import type {
  AnnotationTask,
  AnnotationTaskStatus,
  AnnotationTaskType,
  TaskPriority,
} from "@/types/dashboard/annotation";
import {
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
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
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

type BadgeStatus = "success" | "processing" | "error" | "warning" | "default";
const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;
const MyTasks: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // Mock 数据
  const mockTasks: AnnotationTask[] = [
    {
      id: "task-001",
      title: "医疗影像肺结节检测标注",
      description: "对胸部CT影像中的肺结节进行精确标注和分类",
      type: "object_detection",
      status: "in_progress",
      priority: "high",
      assignee: "张小明",
      assigneeId: "user-001",
      creator: "项目管理员",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      deadline: "2024-01-20",
      progress: 65,
      totalItems: 1200,
      completedItems: 780,
      qualityScore: 96.8,
      tags: ["医疗", "影像", "检测"],
      dataset: {
        id: "dataset-001",
        name: "胸部CT影像数据集",
        size: 1200,
      },
      instructions: "请仔细标注每个肺结节的位置和类型",
      estimatedTime: 40,
    },
    {
      id: "task-002",
      title: "用户评论情感分析标注",
      description: "对电商平台用户评论进行情感倾向标注",
      type: "sentiment_analysis",
      status: "pending",
      priority: "medium",
      assignee: "张小明",
      assigneeId: "user-001",
      creator: "数据科学团队",
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
      deadline: "2024-01-25",
      progress: 0,
      totalItems: 5000,
      completedItems: 0,
      tags: ["文本", "情感", "电商"],
      dataset: {
        id: "dataset-002",
        name: "电商评论数据集",
        size: 5000,
      },
      instructions: "将评论分为正面、负面、中性三类",
      estimatedTime: 25,
    },
    {
      id: "task-003",
      title: "自动驾驶场景目标检测",
      description: "标注道路场景中的车辆、行人、交通标志等目标",
      type: "object_detection",
      status: "review",
      priority: "high",
      assignee: "张小明",
      assigneeId: "user-001",
      creator: "AI研发部",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-14",
      deadline: "2024-01-18",
      progress: 100,
      totalItems: 800,
      completedItems: 800,
      qualityScore: 94.2,
      tags: ["自动驾驶", "检测", "道路"],
      dataset: {
        id: "dataset-003",
        name: "道路场景数据集",
        size: 800,
      },
      instructions: "精确标注所有可见目标的边界框",
      estimatedTime: 32,
    },
  ];
  const getStatusColor = (status: AnnotationTaskStatus): BadgeStatus => {
    const colors = {
      pending: "default" as const,
      in_progress: "processing" as const,
      completed: "success" as const,
      paused: "warning" as const,
      cancelled: "error" as const,
      review: "default" as const, // 注意：Badge 组件没有 "purple" 状态，使用 "default"
    };
    return colors[status];
  };

  const getStatusText = (status: AnnotationTaskStatus) => {
    const texts = {
      pending: "待开始",
      in_progress: "进行中",
      completed: "已完成",
      paused: "已暂停",
      cancelled: "已取消",
      review: "待审核",
    };
    return texts[status];
  };

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      low: "blue",
      medium: "orange",
      high: "red",
      urgent: "magenta",
    };
    return colors[priority];
  };

  const getPriorityText = (priority: TaskPriority) => {
    const texts = {
      low: "低",
      medium: "中",
      high: "高",
      urgent: "紧急",
    };
    return texts[priority];
  };

  const getTypeText = (type: AnnotationTaskType) => {
    const texts = {
      image_classification: "图像分类",
      object_detection: "目标检测",
      text_classification: "文本分类",
      ner: "命名实体识别",
      sentiment_analysis: "情感分析",
      speech_recognition: "语音识别",
      video_annotation: "视频标注",
    };
    return texts[type];
  };

  const columns: ColumnsType<AnnotationTask> = [
    {
      title: "任务信息",
      key: "taskInfo",
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>
              {record.title}
            </Text>
          </div>
          <div style={{ marginBottom: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Text>
          </div>
          <Space size={4}>
            <Tag color="blue" style={{ fontSize: 11 }}>
              {getTypeText(record.type)}
            </Tag>
            {record.tags.map((tag) => (
              <Tag key={tag} style={{ fontSize: 11 }}>
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: AnnotationTaskStatus) => (
        <Badge
          status={getStatusColor(status)}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (priority: TaskPriority) => (
        <Tag color={getPriorityColor(priority)}>{getPriorityText(priority)}</Tag>
      ),
    },
    {
      title: "进度",
      key: "progress",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text style={{ fontSize: 12 }}>
              {record.completedItems}/{record.totalItems}
            </Text>
            <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
              {record.progress}%
            </Text>
          </div>
          <Progress
            percent={record.progress}
            size="small"
            showInfo={false}
            strokeColor={
              record.progress >= 80
                ? "#52c41a"
                : record.progress >= 50
                  ? "#1890ff"
                  : "#faad14"
            }
          />
        </div>
      ),
    },
    {
      title: "质量评分",
      dataIndex: "qualityScore",
      key: "qualityScore",
      width: 100,
      render: (score?: number) =>
        score ? (
          <div style={{ textAlign: "center" }}>
            <Text
              style={{
                color: score >= 95 ? "#52c41a" : score >= 90 ? "#1890ff" : "#faad14",
                fontWeight: 600,
              }}
            >
              {score}%
            </Text>
          </div>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "截止时间",
      dataIndex: "deadline",
      key: "deadline",
      width: 120,
      render: (deadline: string) => (
        <div>
          <CalendarOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          <Text style={{ fontSize: 12 }}>{deadline}</Text>
        </div>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          {record.status === "pending" && (
            <Tooltip title="开始标注">
              <Button
                type="primary"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStartTask(record.id)}
              />
            </Tooltip>
          )}
          {record.status === "in_progress" && (
            <Tooltip title="继续标注">
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleContinueTask(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="查看详情">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewTask(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleStartTask = (_taskId: string) => {
    message.success("任务已开始");
  };

  const handleContinueTask = (_taskId: string) => {
    message.success("继续标注任务");
  };

  const handleViewTask = (_taskId: string) => {
    message.info("查看任务详情");
  };

  const handleBatchAction = (action: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择任务");
      return;
    }
    message.success(`批量${action}操作已执行`);
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys as string[]);
    },
  };

  const filterMenu = (
    <div style={{ padding: 16, width: 300 }}>
      <Space direction="vertical" style={{ width: "100%" }} size={12}>
        <div>
          <Text strong style={{ fontSize: 12 }}>
            任务状态
          </Text>
          <Select
            mode="multiple"
            placeholder="选择状态"
            style={{ width: "100%", marginTop: 4 }}
            options={[
              { label: "待开始", value: "pending" },
              { label: "进行中", value: "in_progress" },
              { label: "已完成", value: "completed" },
              { label: "待审核", value: "review" },
              { label: "已暂停", value: "paused" },
            ]}
          />
        </div>
        <div>
          <Text strong style={{ fontSize: 12 }}>
            任务类型
          </Text>
          <Select
            mode="multiple"
            placeholder="选择类型"
            style={{ width: "100%", marginTop: 4 }}
            options={[
              { label: "图像分类", value: "image_classification" },
              { label: "目标检测", value: "object_detection" },
              { label: "文本分类", value: "text_classification" },
              { label: "情感分析", value: "sentiment_analysis" },
            ]}
          />
        </div>
        <div>
          <Text strong style={{ fontSize: 12 }}>
            优先级
          </Text>
          <Select
            mode="multiple"
            placeholder="选择优先级"
            style={{ width: "100%", marginTop: 4 }}
            options={[
              { label: "低", value: "low" },
              { label: "中", value: "medium" },
              { label: "高", value: "high" },
              { label: "紧急", value: "urgent" },
            ]}
          />
        </div>
        <div>
          <Text strong style={{ fontSize: 12 }}>
            截止时间
          </Text>
          <RangePicker style={{ width: "100%", marginTop: 4 }} />
        </div>
        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button size="small">重置</Button>
          <Button type="primary" size="small">
            应用
          </Button>
        </Space>
      </Space>
    </div>
  );

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面标题和统计 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 16 }}>
          我的标注任务
        </Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: "#1890ff" }}>
                  {mockTasks.length}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>总任务数</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: "#52c41a" }}>
                  {mockTasks.filter((t) => t.status === "in_progress").length}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>进行中</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: "#722ed1" }}>
                  {mockTasks.filter((t) => t.status === "review").length}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>待审核</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: "#fa8c16" }}>
                  {Math.round(
                    mockTasks.reduce((acc, task) => acc + task.progress, 0) /
                    mockTasks.length,
                  )}%
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>平均进度</div>
              </div>
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
                placeholder="搜索任务标题或描述"
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Dropdown overlay={filterMenu} trigger={["click"]} placement="bottomLeft">
                <Button icon={<FilterOutlined />}>筛选</Button>
              </Dropdown>
            </Space>
          </Col>
          <Col>
            <Space>
              {selectedRowKeys.length > 0 && (
                <>
                  <Text type="secondary">
                    已选择 {selectedRowKeys.length} 项
                  </Text>
                  <Button
                    size="small"
                    onClick={() => handleBatchAction("暂停")}
                  >
                    批量暂停
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleBatchAction("标记收藏")}
                  >
                    批量收藏
                  </Button>
                </>
              )}
              <Button
                icon={<ReloadOutlined />}
                onClick={() => setLoading(true)}
              >
                刷新
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                申请新任务
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 任务列表 */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={mockTasks}
          rowKey="id"
          loading={loading}
          pagination={{
            total: mockTasks.length,
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

export default MyTasks;
