"use client";
import {
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Input,
  Progress,
  Rate,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface QualityReviewItem {
  id: string;
  taskName: string;
  taskType: string;
  annotator: string;
  submitTime: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "pending" | "reviewing" | "approved" | "rejected" | "disputed";
  itemCount: number;
  qualityScore: number;
  accuracy: number;
  consistency: number;
  completeness: number;
  reviewer?: string;
  reviewTime?: string;
  comments?: string;
  issues: {
    critical: number;
    major: number;
    minor: number;
  };
  estimatedTime: number;
  actualTime?: number;
}

interface QualityMetrics {
  totalSubmissions: number;
  pendingReview: number;
  avgQualityScore: number;
  avgReviewTime: number;
  approvalRate: number;
  criticalIssues: number;
}

const QualityReview: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [reviewDrawerVisible, setReviewDrawerVisible] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState<QualityReviewItem | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  // 质量指标数据
  const metrics: QualityMetrics = {
    totalSubmissions: 247,
    pendingReview: 34,
    avgQualityScore: 92.8,
    avgReviewTime: 18,
    approvalRate: 87.3,
    criticalIssues: 5
  };

  // 审核数据
  const [reviewItems] = useState<QualityReviewItem[]>([
    {
      id: "qr_001",
      taskName: "医疗影像病灶标注",
      taskType: "图像分割",
      annotator: "张医师",
      submitTime: "2024-01-15 14:30:00",
      priority: "urgent",
      status: "pending",
      itemCount: 150,
      qualityScore: 94.5,
      accuracy: 96.2,
      consistency: 92.8,
      completeness: 98.0,
      issues: { critical: 2, major: 5, minor: 8 },
      estimatedTime: 45
    },
    {
      id: "qr_002",
      taskName: "自然语言情感分析",
      taskType: "文本分类",
      annotator: "李语言学家",
      submitTime: "2024-01-15 16:45:00",
      priority: "high",
      status: "reviewing",
      itemCount: 800,
      qualityScore: 91.8,
      accuracy: 93.5,
      consistency: 89.2,
      completeness: 95.5,
      reviewer: "王审核员",
      issues: { critical: 0, major: 12, minor: 28 },
      estimatedTime: 60,
      actualTime: 35
    }
  ]);

  const getPriorityConfig = (priority: string) => {
    const configs = {
      urgent: { color: "#ff4d4f", text: "紧急", bgColor: "#fff2f0" },
      high: { color: "#fa8c16", text: "高", bgColor: "#fff7e6" },
      medium: { color: "#1890ff", text: "中", bgColor: "#e6f7ff" },
      low: { color: "#52c41a", text: "低", bgColor: "#f6ffed" }
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "orange", text: "待审核" },
      reviewing: { color: "blue", text: "审核中" },
      approved: { color: "green", text: "已通过" },
      rejected: { color: "red", text: "已拒绝" },
      disputed: { color: "purple", text: "有争议" }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const handleStartReview = (item: QualityReviewItem) => {
    setCurrentReviewItem(item);
    setReviewDrawerVisible(true);
  };

  const handleSubmitReview = (approved: boolean) => {
    if (!currentReviewItem) return;

    const action = approved ? "通过" : "拒绝";
    message.success(`质量审核${action}成功`);
    setReviewDrawerVisible(false);
    setReviewComment("");
    setReviewRating(5);
  };

  const columns: ColumnsType<QualityReviewItem> = [
    {
      title: "任务信息",
      key: "taskInfo",
      width: 280,
      fixed: "left",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>
            {record.taskName}
          </div>
          <Space size={4} wrap>
            <Tag color="blue" style={{ fontSize: 11 }}>{record.taskType}</Tag>
            <Tag
              color={getPriorityConfig(record.priority).color}
              style={{ fontSize: 11 }}
            >
              {getPriorityConfig(record.priority).text}
            </Tag>
          </Space>
          <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
            <UserOutlined style={{ marginRight: 4 }} />
            {record.annotator} · {record.itemCount}项
          </div>
        </div>
      )
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Badge color={config.color} text={config.text} />;
      }
    },
    {
      title: "质量评估",
      key: "quality",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: "#666" }}>综合评分</Text>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Progress
                percent={record.qualityScore}
                size="small"
                strokeColor={record.qualityScore >= 95 ? "#52c41a" : record.qualityScore >= 85 ? "#faad14" : "#ff4d4f"}
                style={{ flex: 1 }}
              />
              <Text style={{ fontSize: 12, fontWeight: 500 }}>{record.qualityScore}%</Text>
            </div>
          </div>
          <Space size={12}>
            <Tooltip title="准确性">
              <Text style={{ fontSize: 11, color: "#666" }}>准确 {record.accuracy}%</Text>
            </Tooltip>
            <Tooltip title="一致性">
              <Text style={{ fontSize: 11, color: "#666" }}>一致 {record.consistency}%</Text>
            </Tooltip>
          </Space>
        </div>
      )
    },
    {
      title: "问题统计",
      key: "issues",
      width: 120,
      render: (_, record) => (
        <div>
          {record.issues.critical > 0 && (
            <div style={{ color: "#ff4d4f", fontSize: 12 }}>
              严重: {record.issues.critical}
            </div>
          )}
          {record.issues.major > 0 && (
            <div style={{ color: "#fa8c16", fontSize: 12 }}>
              重要: {record.issues.major}
            </div>
          )}
          <div style={{ color: "#1890ff", fontSize: 12 }}>
            轻微: {record.issues.minor}
          </div>
        </div>
      )
    },
    {
      title: "时间信息",
      key: "timeInfo",
      width: 140,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>
            <ClockCircleOutlined style={{ marginRight: 4, color: "#666" }} />
            提交: {dayjs(record.submitTime).format("MM-DD HH:mm")}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            预计: {record.estimatedTime}分钟
            {record.actualTime && ` / 实际: ${record.actualTime}分钟`}
          </div>
        </div>
      )
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          {(record.status === "pending" || record.status === "reviewing") && (
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleStartReview(record)}
            >
              审核
            </Button>
          )}
          <Button
            type="text"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => message.info("查看详情")}
          />
        </Space>
      )
    }
  ];

  const filteredItems = reviewItems.filter(item => {
    const matchesSearch = item.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.annotator.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          质量审核中心
        </Title>
        <Text type="secondary">
          专业的标注质量审核流程，确保数据标注的准确性、一致性和完整性
        </Text>
      </div>

      {/* 关键指标概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#fa8c16", marginBottom: 4 }}>
              {metrics.pendingReview}
            </div>
            <div style={{ color: "#666", fontSize: 13 }}>待审核任务</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>共 {metrics.totalSubmissions} 项提交</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#52c41a", marginBottom: 4 }}>
              {metrics.approvalRate}%
            </div>
            <div style={{ color: "#666", fontSize: 13 }}>通过率</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>平均质量 {metrics.avgQualityScore}%</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: "#ff4d4f", marginBottom: 4 }}>
              {metrics.criticalIssues}
            </div>
            <div style={{ color: "#666", fontSize: 13 }}>严重问题</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>需优先处理</div>
          </Card>
        </Col>
      </Row>

      {/* 筛选和操作区 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索任务名称或标注员"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
              placeholder="状态筛选"
            >
              <Select.Option value="all">全部状态</Select.Option>
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="reviewing">审核中</Select.Option>
              <Select.Option value="approved">已通过</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: "100%" }}
              placeholder="优先级"
            >
              <Select.Option value="all">全部优先级</Select.Option>
              <Select.Option value="urgent">紧急</Select.Option>
              <Select.Option value="high">高</Select.Option>
              <Select.Option value="medium">中</Select.Option>
              <Select.Option value="low">低</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>刷新</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 审核列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredItems}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredItems.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 审核详情抽屉 */}
      <Drawer
        title="质量审核详情"
        width={900}
        open={reviewDrawerVisible}
        onClose={() => setReviewDrawerVisible(false)}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleSubmitReview(true)}
            >
              通过审核
            </Button>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleSubmitReview(false)}
            >
              拒绝审核
            </Button>
          </Space>
        }
      >
        {currentReviewItem && (
          <Tabs defaultActiveKey="overview">
            <TabPane tab="概览" key="overview">
              <Card title="任务基本信息" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>任务名称:</Text> {currentReviewItem.taskName}
                  </Col>
                  <Col span={12}>
                    <Text strong>标注员:</Text> {currentReviewItem.annotator}
                  </Col>
                  <Col span={12}>
                    <Text strong>任务类型:</Text> {currentReviewItem.taskType}
                  </Col>
                  <Col span={12}>
                    <Text strong>数据量:</Text> {currentReviewItem.itemCount} 项
                  </Col>
                  <Col span={12}>
                    <Text strong>提交时间:</Text> {currentReviewItem.submitTime}
                  </Col>
                  <Col span={12}>
                    <Text strong>预计用时:</Text> {currentReviewItem.estimatedTime} 分钟
                  </Col>
                </Row>
              </Card>

              <Card title="质量评估" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: "#1890ff" }}>
                        {currentReviewItem.accuracy}%
                      </div>
                      <div style={{ color: "#666" }}>准确性</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: "#52c41a" }}>
                        {currentReviewItem.consistency}%
                      </div>
                      <div style={{ color: "#666" }}>一致性</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: "#722ed1" }}>
                        {currentReviewItem.completeness}%
                      </div>
                      <div style={{ color: "#666" }}>完整性</div>
                    </div>
                  </Col>
                </Row>
              </Card>

              <Card title="审核评价">
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
                    placeholder="请输入详细的审核意见和改进建议..."
                    style={{ marginTop: 8 }}
                  />
                </div>
              </Card>
            </TabPane>

            <TabPane tab="问题详情" key="issues">
              <Card title="问题分析">
                <Timeline>
                  <Timeline.Item color="red">
                    <Text strong>严重问题 ({currentReviewItem.issues.critical})</Text>
                    <div style={{ marginTop: 8, color: "#666" }}>
                      影响数据质量的关键问题，需要立即修正
                    </div>
                  </Timeline.Item>
                  <Timeline.Item color="orange">
                    <Text strong>重要问题 ({currentReviewItem.issues.major})</Text>
                    <div style={{ marginTop: 8, color: "#666" }}>
                      可能影响模型训练效果的问题
                    </div>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <Text strong>轻微问题 ({currentReviewItem.issues.minor})</Text>
                    <div style={{ marginTop: 8, color: "#666" }}>
                      标注规范性问题，建议优化
                    </div>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </TabPane>

            <TabPane tab="样本预览" key="samples">
              <Card title="标注样本">
                <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
                  <BarChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <div>样本预览功能开发中...</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>将展示标注样本和质量检查结果</div>
                </div>
              </Card>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default QualityReview;
