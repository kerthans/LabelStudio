"use client";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  HistoryOutlined,
  MessageOutlined,
  ReloadOutlined,
  SearchOutlined,
  WarningOutlined
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Input,
  Modal,
  Progress,
  Rate,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

// 审核任务数据接口
interface ReviewTaskData {
  id: string;
  taskName: string;
  taskType: string;
  annotator: string;
  submitTime: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "approved" | "rejected" | "reviewing";
  itemCount: number;
  completedCount: number;
  qualityScore: number;
  estimatedReviewTime: number;
  reviewer?: string;
  reviewTime?: string;
  comments?: string;
  issues: number;
  accuracy: number;
}

// 审核统计数据接口
interface ReviewStats {
  totalTasks: number;
  pendingTasks: number;
  approvedTasks: number;
  rejectedTasks: number;
  avgQualityScore: number;
  avgReviewTime: number;
}

const TaskReview: React.FC = () => {
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [reviewDrawerVisible, setReviewDrawerVisible] = useState(false);
  const [currentReviewTask, setCurrentReviewTask] = useState<ReviewTaskData | null>(null);
  const [batchReviewModalVisible, setBatchReviewModalVisible] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // 模拟审核统计数据
  const [stats] = useState<ReviewStats>({
    totalTasks: 89,
    pendingTasks: 34,
    approvedTasks: 42,
    rejectedTasks: 13,
    avgQualityScore: 92.5,
    avgReviewTime: 25,
  });

  // 模拟审核任务数据
  const [tasks, setTasks] = useState<ReviewTaskData[]>([
    {
      id: "review_001",
      taskName: "医疗影像分类标注批次A",
      taskType: "图像分类",
      annotator: "张小明",
      submitTime: "2024-01-15 14:30:00",
      priority: "high",
      status: "pending",
      itemCount: 500,
      completedCount: 500,
      qualityScore: 94.5,
      estimatedReviewTime: 30,
      issues: 12,
      accuracy: 96.2,
    },
    {
      id: "review_002",
      taskName: "文本情感分析标注批次B",
      taskType: "文本分类",
      annotator: "李小红",
      submitTime: "2024-01-15 16:45:00",
      priority: "medium",
      status: "reviewing",
      itemCount: 800,
      completedCount: 800,
      qualityScore: 91.8,
      estimatedReviewTime: 45,
      reviewer: "王审核员",
      issues: 28,
      accuracy: 93.5,
    },
    {
      id: "review_003",
      taskName: "目标检测边界框标注",
      taskType: "目标检测",
      annotator: "王小强",
      submitTime: "2024-01-14 11:20:00",
      priority: "high",
      status: "approved",
      itemCount: 300,
      completedCount: 300,
      qualityScore: 97.2,
      estimatedReviewTime: 60,
      reviewer: "李审核员",
      reviewTime: "2024-01-15 09:30:00",
      comments: "标注质量优秀，边界框精确，符合标准要求。",
      issues: 3,
      accuracy: 98.9,
    },
    {
      id: "review_004",
      taskName: "语音转录标注验证",
      taskType: "语音标注",
      annotator: "赵小美",
      submitTime: "2024-01-14 09:15:00",
      priority: "low",
      status: "rejected",
      itemCount: 200,
      completedCount: 200,
      qualityScore: 78.5,
      estimatedReviewTime: 40,
      reviewer: "张审核员",
      reviewTime: "2024-01-14 17:45:00",
      comments: "转录准确率不达标，存在多处错误，需要重新标注。",
      issues: 45,
      accuracy: 82.1,
    },
    {
      id: "review_005",
      taskName: "视频动作识别标注",
      taskType: "视频标注",
      annotator: "陈小刚",
      submitTime: "2024-01-15 10:00:00",
      priority: "medium",
      status: "pending",
      itemCount: 150,
      completedCount: 150,
      qualityScore: 89.3,
      estimatedReviewTime: 90,
      issues: 18,
      accuracy: 91.2,
    },
  ]);

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "reviewing":
        return "blue";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待审核";
      case "reviewing":
        return "审核中";
      case "approved":
        return "已通过";
      case "rejected":
        return "已拒绝";
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

  // 开始审核
  const handleStartReview = (task: ReviewTaskData) => {
    setCurrentReviewTask(task);
    setReviewDrawerVisible(true);

    // 更新任务状态为审核中
    setTasks(prev =>
      prev.map(t =>
        t.id === task.id ? { ...t, status: "reviewing", reviewer: "当前用户" } : t
      )
    );
  };

  // 提交审核结果
  const handleSubmitReview = (taskId: string, approved: boolean) => {
    const newStatus = approved ? "approved" : "rejected";

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
            ...task,
            status: newStatus,
            reviewTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            comments: reviewComment,
          }
          : task
      )
    );

    setReviewDrawerVisible(false);
    setReviewComment("");
    setReviewRating(5);

    message.success(`任务已${approved ? "通过" : "拒绝"}审核`);
  };

  // 批量审核
  const handleBatchReview = (approved: boolean) => {
    const action = approved ? "通过" : "拒绝";
    const newStatus = approved ? "approved" : "rejected";

    setTasks(prev =>
      prev.map(task =>
        selectedRowKeys.includes(task.id)
          ? {
            ...task,
            status: newStatus,
            reviewTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            comments: reviewComment,
            reviewer: "当前用户",
          }
          : task
      )
    );

    setBatchReviewModalVisible(false);
    setSelectedRowKeys([]);
    setReviewComment("");

    message.success(`已${action} ${selectedRowKeys.length} 个任务`);
  };

  // 查看审核历史
  const handleViewHistory = (taskId: string) => {
    message.info(`查看任务 ${taskId} 的审核历史`);
  };

  // 表格列配置
  const columns: ColumnsType<ReviewTaskData> = [
    {
      title: "任务名称",
      dataIndex: "taskName",
      key: "taskName",
      width: 200,
      fixed: "left",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            标注员: {record.annotator}
          </Text>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "taskType",
      key: "taskType",
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
          color={getStatusColor(status)}
          text={getStatusText(status)}
        />
      ),
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
      title: "数据量",
      dataIndex: "itemCount",
      key: "itemCount",
      width: 100,
      render: (count, record) => (
        <div>
          <Text strong>{count}</Text>
          <div style={{ fontSize: 12, color: "#666" }}>
            完成: {record.completedCount}
          </div>
        </div>
      ),
    },
    {
      title: "质量评分",
      dataIndex: "qualityScore",
      key: "qualityScore",
      width: 120,
      render: (score, record) => (
        <div>
          <Progress
            percent={score}
            size="small"
            strokeColor={score >= 95 ? "#52c41a" : score >= 85 ? "#faad14" : "#ff4d4f"}
          />
          <div style={{ fontSize: 12, marginTop: 4 }}>
            <Text>准确率: {record.accuracy}%</Text>
          </div>
        </div>
      ),
    },
    {
      title: "问题数量",
      dataIndex: "issues",
      key: "issues",
      width: 80,
      render: (issues) => (
        <Text style={{ color: issues > 20 ? "#ff4d4f" : issues > 10 ? "#faad14" : "#52c41a" }}>
          {issues}
        </Text>
      ),
    },
    {
      title: "预计用时",
      dataIndex: "estimatedReviewTime",
      key: "estimatedReviewTime",
      width: 100,
      render: (time) => `${time}分钟`,
    },
    {
      title: "提交时间",
      dataIndex: "submitTime",
      key: "submitTime",
      width: 150,
      render: (time) => (
        <div>
          <div>{dayjs(time).format("MM-DD HH:mm")}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(time).format('YYYY-MM-DD HH:mm:ss')}
          </Text>
        </div>
      ),
    },
    {
      title: "审核员",
      dataIndex: "reviewer",
      key: "reviewer",
      width: 100,
      render: (reviewer) => reviewer || "-",
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {record.status === "pending" && (
            <Tooltip title="开始审核">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleStartReview(record)}
              >
                审核
              </Button>
            </Tooltip>
          )}
          {record.status === "reviewing" && (
            <Tooltip title="继续审核">
              <Button
                type="default"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleStartReview(record)}
              >
                继续
              </Button>
            </Tooltip>
          )}
          <Tooltip title="查看历史">
            <Button
              type="text"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleViewHistory(record.id)}
            />
          </Tooltip>
          {record.comments && (
            <Tooltip title={record.comments}>
              <Button
                type="text"
                size="small"
                icon={<MessageOutlined />}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // 筛选后的数据
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      task.annotator.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.taskType === typeFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: ReviewTaskData) => ({
      disabled: record.status === "approved" || record.status === "rejected",
    }),
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          任务审核
        </Title>
        <Text type="secondary">
          审核标注任务的质量，确保数据标注的准确性和一致性
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={stats.totalTasks}
              prefix={<SearchOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核"
              value={stats.pendingTasks}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已通过"
              value={stats.approvedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已拒绝"
              value={stats.rejectedTasks}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 平均指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="平均质量评分" size="small">
            <Progress
              percent={Math.round(stats.avgQualityScore)}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="平均审核用时" size="small">
            <Statistic
              value={stats.avgReviewTime}
              suffix="分钟"
              valueStyle={{ fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选和操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="搜索任务名称或标注员"
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
              <Option value="pending">待审核</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
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
            <Space>
              <Button
                type="primary"
                disabled={selectedRowKeys.length === 0}
                onClick={() => setBatchReviewModalVisible(true)}
              >
                批量审核 ({selectedRowKeys.length})
              </Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
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
          rowSelection={rowSelection}
          scroll={{ x: 1400 }}
          pagination={{
            total: filteredTasks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          rowClassName={(record) => {
            if (record.status === "rejected") return "rejected-row";
            if (record.status === "approved") return "approved-row";
            if (record.status === "reviewing") return "reviewing-row";
            return "";
          }}
        />
      </Card>

      {/* 审核详情抽屉 */}
      <Drawer
        title={`审核任务: ${currentReviewTask?.taskName}`}
        width={800}
        open={reviewDrawerVisible}
        onClose={() => setReviewDrawerVisible(false)}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => currentReviewTask && handleSubmitReview(currentReviewTask.id, true)}
            >
              通过
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => currentReviewTask && handleSubmitReview(currentReviewTask.id, false)}
            >
              拒绝
            </Button>
          </Space>
        }
      >
        {currentReviewTask && (
          <div>
            {/* 任务基本信息 */}
            <Card title="任务信息" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>标注员:</Text> {currentReviewTask.annotator}
                </Col>
                <Col span={12}>
                  <Text strong>任务类型:</Text> {currentReviewTask.taskType}
                </Col>
                <Col span={12}>
                  <Text strong>数据量:</Text> {currentReviewTask.itemCount}
                </Col>
                <Col span={12}>
                  <Text strong>完成量:</Text> {currentReviewTask.completedCount}
                </Col>
                <Col span={12}>
                  <Text strong>质量评分:</Text> {currentReviewTask.qualityScore}%
                </Col>
                <Col span={12}>
                  <Text strong>准确率:</Text> {currentReviewTask.accuracy}%
                </Col>
                <Col span={12}>
                  <Text strong>问题数量:</Text> {currentReviewTask.issues}
                </Col>
                <Col span={12}>
                  <Text strong>提交时间:</Text> {currentReviewTask.submitTime}
                </Col>
              </Row>
            </Card>

            {/* 质量评估 */}
            <Card title="质量评估" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>整体评分:</Text>
                <Rate
                  value={reviewRating}
                  onChange={setReviewRating}
                  style={{ marginLeft: 8 }}
                />
              </div>
              <div>
                <Text strong>审核意见:</Text>
                <TextArea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="请输入审核意见和建议..."
                  style={{ marginTop: 8 }}
                />
              </div>
            </Card>

            {/* 样本预览 */}
            <Card title="样本预览">
              <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                <Text>样本数据预览功能开发中...</Text>
              </div>
            </Card>
          </div>
        )}
      </Drawer>

      {/* 批量审核模态框 */}
      <Modal
        title="批量审核"
        open={batchReviewModalVisible}
        onCancel={() => setBatchReviewModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBatchReviewModalVisible(false)}>
            取消
          </Button>,
          <Button
            key="reject"
            danger
            onClick={() => handleBatchReview(false)}
          >
            批量拒绝
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => handleBatchReview(true)}
          >
            批量通过
          </Button>,
        ]}
      >
        <div>
          <Paragraph>
            您选择了 <Text strong>{selectedRowKeys.length}</Text> 个任务进行批量审核。
          </Paragraph>
          <div style={{ marginBottom: 16 }}>
            <Text strong>批量审核意见:</Text>
            <TextArea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="请输入批量审核的统一意见..."
              style={{ marginTop: 8 }}
            />
          </div>
        </div>
      </Modal>

      {/* 自定义样式 */}
      <style jsx global>{`
        .approved-row {
          background-color: #f6ffed !important;
        }
        .rejected-row {
          background-color: #fff2f0 !important;
        }
        .reviewing-row {
          background-color: #e6f7ff !important;
        }
        .ant-table-tbody > tr:hover.approved-row > td {
          background-color: #f0f9e6 !important;
        }
        .ant-table-tbody > tr:hover.rejected-row > td {
          background-color: #ffebe6 !important;
        }
        .ant-table-tbody > tr:hover.reviewing-row > td {
          background-color: #d9f2ff !important;
        }
      `}</style>
    </div>
  );
};

export default TaskReview;
