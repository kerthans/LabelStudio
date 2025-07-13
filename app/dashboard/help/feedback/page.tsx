"use client";
import {
  BugOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  StarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Rate,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Feedback {
  id: string;
  title: string;
  content: string;
  type: "bug" | "feature" | "improvement" | "question" | "praise";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "processing" | "resolved" | "closed";
  rating?: number;
  attachments?: string[];
  createdAt: string;
  updatedAt?: string;
  response?: string;
  responder?: string;
  tags?: string[];
}

interface FeedbackStats {
  total: number;
  pending: number;
  processing: number;
  resolved: number;
  avgRating: number;
  responseTime: number;
}

const FeedbackPage: React.FC = () => {
  const [form] = Form.useForm();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // 模拟反馈数据
  const [feedbacks] = useState<Feedback[]>([
    {
      id: "fb_001",
      title: "标注工具响应速度慢",
      content: "在进行图像标注时，工具响应速度较慢，特别是在处理大尺寸图片时，希望能够优化性能。",
      type: "bug",
      priority: "high",
      status: "processing",
      rating: 3,
      createdAt: "2024-01-15 14:30",
      updatedAt: "2024-01-15 16:20",
      response: "感谢您的反馈，我们已经识别到这个问题，正在优化图像处理算法，预计下周发布修复版本。",
      responder: "技术支持团队",
      tags: ["性能", "图像标注"],
    },
    {
      id: "fb_002",
      title: "建议增加快捷键功能",
      content: "希望能够增加更多的快捷键操作，比如快速切换标注类别、撤销重做等，提高标注效率。",
      type: "feature",
      priority: "medium",
      status: "resolved",
      rating: 4,
      createdAt: "2024-01-14 10:15",
      updatedAt: "2024-01-15 09:30",
      response: "您的建议很棒！我们已经在最新版本中添加了快捷键功能，请查看帮助文档了解详细使用方法。",
      responder: "产品经理",
      tags: ["快捷键", "效率"],
    },
    {
      id: "fb_003",
      title: "界面设计很棒",
      content: "新版本的界面设计非常简洁美观，用户体验有了很大提升，为设计团队点赞！",
      type: "praise",
      priority: "low",
      status: "resolved",
      rating: 5,
      createdAt: "2024-01-13 16:45",
      updatedAt: "2024-01-14 08:20",
      response: "非常感谢您的认可！我们会继续努力提供更好的用户体验。",
      responder: "设计团队",
      tags: ["界面设计", "用户体验"],
    },
    {
      id: "fb_004",
      title: "数据导出格式问题",
      content: "导出的标注数据格式与文档描述不一致，希望能够修正或更新文档说明。",
      type: "bug",
      priority: "medium",
      status: "pending",
      rating: 2,
      createdAt: "2024-01-12 11:30",
      tags: ["数据导出", "文档"],
    },
  ]);

  // 统计数据
  const stats: FeedbackStats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === "pending").length,
    processing: feedbacks.filter(f => f.status === "processing").length,
    resolved: feedbacks.filter(f => f.status === "resolved").length,
    avgRating: feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.filter(f => f.rating).length,
    responseTime: 24, // 平均响应时间（小时）
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug": return <BugOutlined style={{ color: "#ff4d4f" }} />;
      case "feature": return <BulbOutlined style={{ color: "#1890ff" }} />;
      case "improvement": return <StarOutlined style={{ color: "#faad14" }} />;
      case "question": return <QuestionCircleOutlined style={{ color: "#722ed1" }} />;
      case "praise": return <HeartOutlined style={{ color: "#52c41a" }} />;
      default: return <CommentOutlined />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "bug": return "Bug反馈";
      case "feature": return "功能建议";
      case "improvement": return "改进建议";
      case "question": return "使用问题";
      case "praise": return "表扬建议";
      default: return "其他";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug": return "red";
      case "feature": return "blue";
      case "improvement": return "orange";
      case "question": return "purple";
      case "praise": return "green";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <ClockCircleOutlined style={{ color: "#faad14" }} />;
      case "processing": return <ExclamationCircleOutlined style={{ color: "#1890ff" }} />;
      case "resolved": return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "closed": return <CheckCircleOutlined style={{ color: "#8c8c8c" }} />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "待处理";
      case "processing": return "处理中";
      case "resolved": return "已解决";
      case "closed": return "已关闭";
      default: return "未知";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "orange";
      case "processing": return "blue";
      case "resolved": return "green";
      case "closed": return "default";
      default: return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "red";
      case "high": return "orange";
      case "medium": return "blue";
      case "low": return "default";
      default: return "default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent": return "紧急";
      case "high": return "重要";
      case "medium": return "普通";
      case "low": return "一般";
      default: return "普通";
    }
  };

  // 筛选反馈
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const typeMatch = filterType === "all" || feedback.type === filterType;
    const statusMatch = filterStatus === "all" || feedback.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const handleSubmitFeedback = async () => {
    try {
      const values = await form.validateFields();
      console.log("提交反馈:", values);
      message.success("反馈提交成功，我们会尽快处理！");
      setShowFeedbackModal(false);
      form.resetFields();
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    showUploadList: true,
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("文件大小不能超过 10MB!");
        return false;
      }
      return false; // 阻止自动上传
    },
  };

  const typeOptions = [
    { value: "all", label: "全部类型" },
    { value: "bug", label: "Bug反馈" },
    { value: "feature", label: "功能建议" },
    { value: "improvement", label: "改进建议" },
    { value: "question", label: "使用问题" },
    { value: "praise", label: "表扬建议" },
  ];

  const statusOptions = [
    { value: "all", label: "全部状态" },
    { value: "pending", label: "待处理" },
    { value: "processing", label: "处理中" },
    { value: "resolved", label: "已解决" },
    { value: "closed", label: "已关闭" },
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <MessageOutlined />
              意见反馈
            </Title>
            <Text type="secondary">您的意见是我们改进的动力，欢迎提出宝贵建议</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowFeedbackModal(true)}>
            提交反馈
          </Button>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}>
                  {stats.total}
                </div>
                <div style={{ color: "#666", marginTop: 4 }}>总反馈数</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: "bold", color: "#faad14" }}>
                  {stats.pending}
                </div>
                <div style={{ color: "#666", marginTop: 4 }}>待处理</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: "bold", color: "#52c41a" }}>
                  {stats.resolved}
                </div>
                <div style={{ color: "#666", marginTop: 4 }}>已解决</div>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stats-card">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: "bold", color: "#722ed1" }}>
                  {stats.avgRating.toFixed(1)}
                </div>
                <div style={{ color: "#666", marginTop: 4 }}>平均评分</div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 筛选器 */}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col xs={12} sm={8} md={6}>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: "100%" }}
              placeholder="选择反馈类型"
            >
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: "100%" }}
              placeholder="选择处理状态"
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      {/* 反馈列表 */}
      <Card title="我的反馈记录">
        <List
          itemLayout="vertical"
          dataSource={filteredFeedbacks}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          renderItem={(feedback) => (
            <List.Item
              key={feedback.id}
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                marginBottom: 16,
                padding: 16,
              }}
              actions={[
                <Button
                  key="view"
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => setSelectedFeedback(feedback)}
                >
                  查看详情
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={getTypeIcon(feedback.type)}
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: "bold" }}>{feedback.title}</span>
                    <Tag color={getTypeColor(feedback.type)}>
                      {getTypeText(feedback.type)}
                    </Tag>
                    <Tag color={getStatusColor(feedback.status)}>
                      {getStatusIcon(feedback.status)}
                      {getStatusText(feedback.status)}
                    </Tag>
                    <Tag color={getPriorityColor(feedback.priority)}>
                      {getPriorityText(feedback.priority)}
                    </Tag>
                    {feedback.rating && (
                      <Rate disabled value={feedback.rating} style={{ fontSize: 14 }} />
                    )}
                  </div>
                }
                description={
                  <div>
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: true }}
                      style={{ margin: "8px 0" }}
                    >
                      {feedback.content}
                    </Paragraph>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Space size="small">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          提交时间: {feedback.createdAt}
                        </Text>
                        {feedback.updatedAt && (
                          <>
                            <Divider type="vertical" />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              更新时间: {feedback.updatedAt}
                            </Text>
                          </>
                        )}
                      </Space>
                      {feedback.tags && (
                        <Space size={4}>
                          {feedback.tags.map(tag => (
                            <Tag key={tag} className="small-tag">{tag}</Tag>
                          ))}
                        </Space>
                      )}
                    </div>
                    {feedback.response && (
                      <div style={{
                        marginTop: 12,
                        padding: 12,
                        backgroundColor: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        borderRadius: 6,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <Avatar size={20} style={{ backgroundColor: "#52c41a" }}>
                            {feedback.responder?.charAt(0)}
                          </Avatar>
                          <Text strong style={{ fontSize: 12 }}>{feedback.responder}</Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>回复:</Text>
                        </div>
                        <Text style={{ fontSize: 13 }}>{feedback.response}</Text>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 提交反馈弹窗 */}
      <Modal
        title="提交反馈"
        open={showFeedbackModal}
        onCancel={() => {
          setShowFeedbackModal(false);
          form.resetFields();
        }}
        onOk={handleSubmitFeedback}
        width={700}
        okText="提交反馈"
        cancelText="取消"
        okButtonProps={{ icon: <SendOutlined /> }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="反馈类型"
                rules={[{ required: true, message: "请选择反馈类型" }]}
              >
                <Select placeholder="请选择反馈类型">
                  <Option value="bug">Bug反馈</Option>
                  <Option value="feature">功能建议</Option>
                  <Option value="improvement">改进建议</Option>
                  <Option value="question">使用问题</Option>
                  <Option value="praise">表扬建议</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: "请选择优先级" }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="low">一般</Option>
                  <Option value="medium">普通</Option>
                  <Option value="high">重要</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="title"
            label="反馈标题"
            rules={[{ required: true, message: "请输入反馈标题" }]}
          >
            <Input placeholder="请简要描述您的反馈" maxLength={100} showCount />
          </Form.Item>
          <Form.Item
            name="content"
            label="详细描述"
            rules={[{ required: true, message: "请输入详细描述" }]}
          >
            <TextArea
              rows={6}
              placeholder="请详细描述您遇到的问题或建议，包括操作步骤、期望结果等"
              maxLength={1000}
              showCount
            />
          </Form.Item>
          <Form.Item name="rating" label="满意度评分">
            <Rate allowHalf />
          </Form.Item>
          <Form.Item name="attachments" label="附件上传">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
            <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
              支持图片、文档等格式，单个文件不超过10MB
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 反馈详情弹窗 */}
      <Modal
        title="反馈详情"
        open={!!selectedFeedback}
        onCancel={() => setSelectedFeedback(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedFeedback(null)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {selectedFeedback && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>{selectedFeedback.title}</Title>
              <Space>
                <Tag color={getTypeColor(selectedFeedback.type)}>
                  {getTypeIcon(selectedFeedback.type)}
                  {getTypeText(selectedFeedback.type)}
                </Tag>
                <Tag color={getStatusColor(selectedFeedback.status)}>
                  {getStatusIcon(selectedFeedback.status)}
                  {getStatusText(selectedFeedback.status)}
                </Tag>
                <Tag color={getPriorityColor(selectedFeedback.priority)}>
                  {getPriorityText(selectedFeedback.priority)}
                </Tag>
              </Space>
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Title level={5}>反馈内容</Title>
              <Paragraph>{selectedFeedback.content}</Paragraph>
            </div>

            {selectedFeedback.rating && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>满意度评分</Title>
                <Rate disabled value={selectedFeedback.rating} />
              </div>
            )}

            {selectedFeedback.tags && selectedFeedback.tags.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>标签</Title>
                <Space>
                  {selectedFeedback.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <Title level={5}>时间信息</Title>
              <div>提交时间: {selectedFeedback.createdAt}</div>
              {selectedFeedback.updatedAt && (
                <div>更新时间: {selectedFeedback.updatedAt}</div>
              )}
            </div>

            {selectedFeedback.response && (
              <div>
                <Title level={5}>官方回复</Title>
                <div style={{
                  padding: 16,
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Avatar size={24} style={{ backgroundColor: "#52c41a" }}>
                      {selectedFeedback.responder?.charAt(0)}
                    </Avatar>
                    <Text strong>{selectedFeedback.responder}</Text>
                  </div>
                  <Paragraph>{selectedFeedback.response}</Paragraph>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackPage;
