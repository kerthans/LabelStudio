"use client";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  List,
  Progress,
  Rate,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ReviewTask {
  id: string;
  taskName: string;
  datasetName: string;
  annotator: {
    name: string;
    avatar: string;
    level: string;
  };
  reviewer?: {
    name: string;
    avatar: string;
  };
  type: "image" | "text" | "audio" | "video";
  category: string;
  totalItems: number;
  reviewedItems: number;
  approvedItems: number;
  rejectedItems: number;
  qualityScore: number;
  priority: "high" | "medium" | "low";
  status: "pending" | "reviewing" | "completed" | "rejected";
  submittedAt: string;
  deadline: string;
  issues: string[];
  notes?: string;
}

const AnnotationsReviewPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // 模拟评审任务数据
  const [reviewTasks] = useState<ReviewTask[]>([
    {
      id: "review_001",
      taskName: "医疗影像病灶标注评审",
      datasetName: "胸部X光片数据集",
      annotator: {
        name: "张小明",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhang",
        level: "高级标注员",
      },
      reviewer: {
        name: "李专家",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=li",
      },
      type: "image",
      category: "医疗影像",
      totalItems: 500,
      reviewedItems: 350,
      approvedItems: 320,
      rejectedItems: 30,
      qualityScore: 4.2,
      priority: "high",
      status: "reviewing",
      submittedAt: "2024-01-15 09:30",
      deadline: "2024-01-18 18:00",
      issues: ["边界不清晰", "标注遗漏"],
      notes: "整体质量良好，部分细节需要改进",
    },
    {
      id: "review_002",
      taskName: "用户评论情感分析评审",
      datasetName: "电商评论数据集",
      annotator: {
        name: "王小红",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=wang",
        level: "中级标注员",
      },
      type: "text",
      category: "文本分析",
      totalItems: 1000,
      reviewedItems: 1000,
      approvedItems: 950,
      rejectedItems: 50,
      qualityScore: 4.5,
      priority: "medium",
      status: "completed",
      submittedAt: "2024-01-14 14:20",
      deadline: "2024-01-17 17:00",
      issues: ["情感倾向判断"],
      notes: "标注质量优秀，一致性很好",
    },
    {
      id: "review_003",
      taskName: "自动驾驶目标检测评审",
      datasetName: "城市道路场景数据集",
      annotator: {
        name: "赵小强",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhao",
        level: "专家标注员",
      },
      type: "image",
      category: "目标检测",
      totalItems: 800,
      reviewedItems: 200,
      approvedItems: 180,
      rejectedItems: 20,
      qualityScore: 4.0,
      priority: "high",
      status: "reviewing",
      submittedAt: "2024-01-15 16:45",
      deadline: "2024-01-19 12:00",
      issues: ["框选精度", "类别错误"],
    },
    {
      id: "review_004",
      taskName: "语音识别标注评审",
      datasetName: "多语言语音数据集",
      annotator: {
        name: "孙小美",
        avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=sun",
        level: "初级标注员",
      },
      type: "audio",
      category: "语音识别",
      totalItems: 300,
      reviewedItems: 0,
      approvedItems: 0,
      rejectedItems: 0,
      qualityScore: 0,
      priority: "low",
      status: "pending",
      submittedAt: "2024-01-15 17:30",
      deadline: "2024-01-20 15:00",
      issues: [],
    },
  ]);

  const statusOptions = [
    { value: "all", label: "全部状态" },
    { value: "pending", label: "待评审" },
    { value: "reviewing", label: "评审中" },
    { value: "completed", label: "已完成" },
    { value: "rejected", label: "已拒绝" },
  ];

  const priorityOptions = [
    { value: "all", label: "全部优先级" },
    { value: "high", label: "高优先级" },
    { value: "medium", label: "中优先级" },
    { value: "low", label: "低优先级" },
  ];

  const typeOptions = [
    { value: "all", label: "全部类型" },
    { value: "image", label: "图像" },
    { value: "text", label: "文本" },
    { value: "audio", label: "音频" },
    { value: "video", label: "视频" },
  ];

  // 筛选任务
  const filteredTasks = reviewTasks.filter(task => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.datasetName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.annotator.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "default";
      case "reviewing": return "processing";
      case "completed": return "success";
      case "rejected": return "error";
      default: return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "待评审";
      case "reviewing": return "评审中";
      case "completed": return "已完成";
      case "rejected": return "已拒绝";
      default: return "未知";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "red";
      case "medium": return "orange";
      case "low": return "blue";
      default: return "default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "高";
      case "medium": return "中";
      case "low": return "低";
      default: return "普通";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <FileTextOutlined style={{ color: "#52c41a" }} />;
      case "text": return <FileTextOutlined style={{ color: "#1890ff" }} />;
      case "audio": return <FileTextOutlined style={{ color: "#722ed1" }} />;
      case "video": return <FileTextOutlined style={{ color: "#fa8c16" }} />;
      default: return <FileTextOutlined />;
    }
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircleOutlined />
              标注评审
            </Title>
            <Text type="secondary">审核标注质量，确保数据准确性和一致性</Text>
          </div>
          <Space>
            <Button icon={<FilterOutlined />}>批量操作</Button>
            <Button type="primary" icon={<EyeOutlined />}>开始评审</Button>
          </Space>
        </div>

        {/* 搜索和筛选 */}
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="搜索任务名称、数据集或标注员"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Col>
          <Col xs={8} sm={4} md={3}>
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
          <Col xs={8} sm={4} md={3}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: "100%" }}
              size="large"
            >
              {priorityOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={4} md={3}>
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
        </Row>
      </div>

      {/* 评审任务列表 */}
      {filteredTasks.length > 0 ? (
        <List
          dataSource={filteredTasks}
          renderItem={(task) => {
            const progress = task.totalItems > 0 ? (task.reviewedItems / task.totalItems) * 100 : 0;
            const approvalRate = task.reviewedItems > 0 ? (task.approvedItems / task.reviewedItems) * 100 : 0;

            return (
              <Card
                style={{ marginBottom: 16 }}
                hoverable
                styles={{
                  body: { padding: "20px 24px" },
                }}
              >
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", fontSize: 24 }}>
                    {getTypeIcon(task.type)}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* 标题行 */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Tag color={getPriorityColor(task.priority)}>
                        {getPriorityText(task.priority)}优先级
                      </Tag>
                      <Tag color={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Tag>
                      <Title level={5} style={{ margin: 0, flex: 1 }}>
                        {task.taskName}
                      </Title>
                      {task.qualityScore > 0 && (
                        <Rate disabled value={task.qualityScore} style={{ fontSize: 14 }} />
                      )}
                    </div>

                    {/* 基本信息 */}
                    <div style={{ marginBottom: 12 }}>
                      <Space split={<Divider type="vertical" />}>
                        <Text type="secondary">
                          <TagOutlined /> {task.category}
                        </Text>
                        <Text type="secondary">
                          数据集: {task.datasetName}
                        </Text>
                        <Text type="secondary">
                          总计: {task.totalItems} 项
                        </Text>
                      </Space>
                    </div>

                    {/* 进度信息 */}
                    <div style={{ marginBottom: 12 }}>
                      <Row gutter={24}>
                        <Col span={12}>
                          <div style={{ marginBottom: 4 }}>
                            <Text type="secondary">评审进度</Text>
                            <Text style={{ float: "right", fontWeight: 500 }}>
                              {task.reviewedItems}/{task.totalItems}
                            </Text>
                          </div>
                          <Progress
                            percent={progress}
                            size="small"
                            showInfo={false}
                            strokeColor={progress === 100 ? "#52c41a" : "#1890ff"}
                          />
                        </Col>
                        {task.reviewedItems > 0 && (
                          <Col span={12}>
                            <div style={{ marginBottom: 4 }}>
                              <Text type="secondary">通过率</Text>
                              <Text style={{ float: "right", fontWeight: 500 }}>
                                {approvalRate.toFixed(1)}%
                              </Text>
                            </div>
                            <Progress
                              percent={approvalRate}
                              size="small"
                              showInfo={false}
                              strokeColor={approvalRate >= 90 ? "#52c41a" : approvalRate >= 70 ? "#faad14" : "#ff4d4f"}
                            />
                          </Col>
                        )}
                      </Row>
                    </div>

                    {/* 问题标签 */}
                    {task.issues.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <Text type="secondary" style={{ marginRight: 8 }}>发现问题:</Text>
                        <Space wrap>
                          {task.issues.map(issue => (
                            <Tag key={issue} color="orange" icon={<ExclamationCircleOutlined />}>
                              {issue}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    )}

                    {/* 备注 */}
                    {task.notes && (
                      <div style={{ marginBottom: 12 }}>
                        <Paragraph
                          ellipsis={{ rows: 1, expandable: true }}
                          style={{ margin: 0, color: "#666", fontStyle: "italic" }}
                        >
                          备注: {task.notes}
                        </Paragraph>
                      </div>
                    )}

                    {/* 底部信息 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Space split={<Divider type="vertical" />}>
                        <Space>
                          <Avatar src={task.annotator.avatar} size={20} />
                          <Text type="secondary">
                            标注员: {task.annotator.name} ({task.annotator.level})
                          </Text>
                        </Space>
                        {task.reviewer && (
                          <Space>
                            <Avatar src={task.reviewer.avatar} size={20} />
                            <Text type="secondary">
                              评审员: {task.reviewer.name}
                            </Text>
                          </Space>
                        )}
                        <Text type="secondary">提交: {task.submittedAt}</Text>
                        <Text type="secondary">截止: {task.deadline}</Text>
                      </Space>

                      <Space>
                        <Button type="text" icon={<EyeOutlined />}>
                          查看详情
                        </Button>
                        {task.status === "pending" && (
                          <Button type="primary" size="small">
                            开始评审
                          </Button>
                        )}
                        {task.status === "reviewing" && (
                          <Button type="primary" size="small">
                            继续评审
                          </Button>
                        )}
                      </Space>
                    </div>
                  </div>
                </div>
              </Card>
            );
          }}
        />
      ) : (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无评审任务"
          >
            <Button type="primary" icon={<EyeOutlined />}>
              查看所有任务
            </Button>
          </Empty>
        </Card>
      )}
    </div>
  );
};

export default AnnotationsReviewPage;
