"use client";

import type {
  FeedbackPriority,
  FeedbackQueryParams,
  FeedbackRecord,
  FeedbackStatus,
  FeedbackType,
} from "@/types/dashboard/feedback";
import {
  BugOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  DislikeOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SendOutlined,
  StarOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 反馈类型配置
const feedbackTypeConfig = {
  bug_report: { label: "问题报告", color: "#ff4d4f", icon: <BugOutlined />, description: "报告系统错误或异常" },
  feature_request: { label: "功能建议", color: "#1890ff", icon: <BulbOutlined />, description: "建议新功能或改进" },
  improvement: { label: "体验优化", color: "#52c41a", icon: <StarOutlined />, description: "用户体验改进建议" },
  question: { label: "使用咨询", color: "#722ed1", icon: <QuestionCircleOutlined />, description: "使用过程中的疑问" },
  other: { label: "其他反馈", color: "#8c8c8c", icon: <MessageOutlined />, description: "其他类型的反馈" },
};

// 优先级配置
const priorityConfig = {
  low: { label: "一般", color: "#d9d9d9", level: 1 },
  medium: { label: "重要", color: "#1890ff", level: 2 },
  high: { label: "紧急", color: "#fa8c16", level: 3 },
  urgent: { label: "非常紧急", color: "#ff4d4f", level: 4 },
};

// 状态配置
const statusConfig = {
  pending: { label: "待处理", color: "#faad14", icon: <ClockCircleOutlined />, description: "已提交，等待处理" },
  in_progress: { label: "处理中", color: "#1890ff", icon: <ClockCircleOutlined />, description: "正在处理中" },
  resolved: { label: "已解决", color: "#52c41a", icon: <CheckCircleOutlined />, description: "问题已解决" },
  closed: { label: "已关闭", color: "#8c8c8c", icon: <CloseCircleOutlined />, description: "反馈已关闭" },
  rejected: { label: "已拒绝", color: "#ff4d4f", icon: <CloseCircleOutlined />, description: "反馈被拒绝" },
};

// 模拟数据
const mockFeedbackList: FeedbackRecord[] = [
  {
    id: "1",
    type: "bug_report" as FeedbackType,
    priority: "high" as FeedbackPriority,
    status: "in_progress" as FeedbackStatus,
    title: "文件上传功能异常",
    description: "在上传大文件时系统会卡死，无法正常完成上传操作。",
    submittedBy: {
      id: "1",
      name: "张三",
      email: "zhangsan@example.com",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
    },
    submittedAt: "2024-12-01 10:30:00",
    updatedAt: "2024-12-01 14:20:00",
    assignedTo: {
      id: "2",
      name: "李工程师",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
    },
    attachments: [
      {
        id: "1",
        name: "error-screenshot.png",
        size: 1024000,
        type: "image/png",
        url: "/uploads/error-screenshot.png",
        uploadTime: "2024-12-01 10:30:00",
      },
    ],
    responses: [
      {
        id: "1",
        content: "我们已经收到您的反馈，正在调查这个问题。",
        author: {
          id: "2",
          name: "李工程师",
          role: "developer",
          avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
        },
        createdAt: "2024-12-01 14:20:00",
        isInternal: false,
      },
    ],
    tags: ["文件上传", "性能问题"],
    votes: {
      upvotes: 5,
      downvotes: 0,
      userVote: "up",
    },
  },
  {
    id: "2",
    type: "feature_request" as FeedbackType,
    priority: "medium" as FeedbackPriority,
    status: "pending" as FeedbackStatus,
    title: "希望增加批量导出功能",
    description: "建议在报告页面增加批量导出功能，可以一次性导出多个报告。",
    submittedBy: {
      id: "3",
      name: "王五",
      email: "wangwu@example.com",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
    },
    submittedAt: "2024-11-30 16:45:00",
    updatedAt: "2024-11-30 16:45:00",
    attachments: [],
    responses: [],
    tags: ["功能增强", "用户体验"],
    votes: {
      upvotes: 8,
      downvotes: 1,
      userVote: undefined,
    },
  },
];

// 快速反馈类型组件
const QuickFeedbackTypes = ({ onSelect }: { onSelect: (type: string) => void }) => (
  <Row gutter={[16, 16]}>
    {Object.entries(feedbackTypeConfig).map(([key, config]) => (
      <Col xs={12} sm={8} md={6} lg={4} key={key}>
        <Card
          hoverable
          size="small"
          onClick={() => onSelect(key)}
          style={{
            textAlign: "center",
            borderColor: config.color,
            cursor: "pointer",
          }}
          bodyStyle={{ padding: "16px 8px" }}
        >
          <div style={{ color: config.color, fontSize: "24px", marginBottom: 8 }}>
            {config.icon}
          </div>
          <Text strong style={{ fontSize: "12px" }}>{config.label}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "10px" }}>
            {config.description}
          </Text>
        </Card>
      </Col>
    ))}
  </Row>
);

export default function FeedbackPage() {
  const [form] = Form.useForm();
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRecord | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<Partial<FeedbackQueryParams>>({
    page: 1,
    pageSize: 10,
  });
  const [selectedType, setSelectedType] = useState<string>("");

  // 提交反馈
  const handleSubmitFeedback = async (values: any) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("反馈提交成功！我们会尽快处理您的反馈。");
      setFeedbackModalVisible(false);
      form.resetFields();
      setFileList([]);
      setSelectedType("");
    } catch (error) {
      message.error("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 查看反馈详情
  const handleViewDetail = (record: FeedbackRecord) => {
    setSelectedFeedback(record);
    setDetailDrawerVisible(true);
  };

  // 快速选择反馈类型
  const handleQuickSelect = (type: string) => {
    setSelectedType(type);
    setFeedbackModalVisible(true);
    form.setFieldsValue({ type });
  };

  // 文件上传配置
  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileList(newFileList);
    },
    beforeUpload: () => false,
    multiple: true,
    accept: ".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt",
    maxCount: 5,
  };

  // 表格列配置
  const columns: ColumnsType<FeedbackRecord> = [
    {
      title: "反馈内容",
      key: "content",
      render: (_, record) => (
        <Space direction="vertical" size={4} style={{ width: "100%" }}>
          <Flex justify="space-between" align="center">
            <Text strong style={{ fontSize: "14px" }}>{record.title}</Text>
            <Space size={4}>
              <Tag color={feedbackTypeConfig[record.type as keyof typeof feedbackTypeConfig].color} className="small-tag">
                {feedbackTypeConfig[record.type as keyof typeof feedbackTypeConfig].icon}
                <span style={{ marginLeft: 4 }}>{feedbackTypeConfig[record.type as keyof typeof feedbackTypeConfig].label}</span>
              </Tag>
              <Tag color={priorityConfig[record.priority].color} className="small-tag">
                {priorityConfig[record.priority].label}
              </Tag>
            </Space>
          </Flex>
          <Text type="secondary" style={{ fontSize: "12px" }} ellipsis>
            {record.description}
          </Text>
          <Flex justify="space-between" align="center">
            <Space size={4}>
              <Avatar size={16} src={record.submittedBy.avatar} />
              <Text type="secondary" style={{ fontSize: "12px" }}>{record.submittedBy.name}</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>•</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>{record.submittedAt}</Text>
            </Space>
            <Space size={8}>
              <Space size={4}>
                <LikeOutlined style={{ fontSize: "12px", color: "#52c41a" }} />
                <Text style={{ fontSize: "12px" }}>{record.votes.upvotes}</Text>
              </Space>
              {record.responses.length > 0 && (
                <Space size={4}>
                  <CommentOutlined style={{ fontSize: "12px", color: "#1890ff" }} />
                  <Text style={{ fontSize: "12px" }}>{record.responses.length}</Text>
                </Space>
              )}
            </Space>
          </Flex>
        </Space>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: FeedbackStatus) => {
        const config = statusConfig[status];
        return (
          <Tooltip title={config.description}>
            <Tag color={config.color} icon={config.icon}>
              {config.label}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button type="text" size="small" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>意见反馈</Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          您的反馈对我们很重要，帮助我们持续改进产品体验
        </Text>
      </div>

      {/* 快速反馈入口 */}
      <Card
        title={
          <Space>
            <MessageOutlined style={{ color: "#1890ff" }} />
            <span>快速反馈</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
        bodyStyle={{ padding: "20px" }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>选择反馈类型，快速提交您的意见：</Text>
        </div>
        <QuickFeedbackTypes onSelect={handleQuickSelect} />
        <Divider style={{ margin: "20px 0" }} />
        <Flex justify="center">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setFeedbackModalVisible(true)}
            style={{ minWidth: "160px" }}
          >
            提交详细反馈
          </Button>
        </Flex>
      </Card>

      {/* 我的反馈列表 */}
      <Card
        title={
          <Space>
            <FileTextOutlined style={{ color: "#1890ff" }} />
            <span>我的反馈</span>
            <Badge count={mockFeedbackList.filter(item => item.status === "pending").length} />
          </Space>
        }
        extra={
          <Space>
            <Button icon={<FilterOutlined />} size="small">筛选</Button>
            <Button icon={<ExportOutlined />} size="small">导出</Button>
          </Space>
        }
      >
        {/* 搜索筛选 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="搜索反馈内容"
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={5}>
            <Select placeholder="反馈类型" allowClear style={{ width: "100%" }}>
              {Object.entries(feedbackTypeConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  <Space>
                    {config.icon}
                    {config.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={5}>
            <Select placeholder="状态" allowClear style={{ width: "100%" }}>
              {Object.entries(statusConfig).map(([key, config]) => (
                <Option key={key} value={key}>
                  <Space>
                    {config.icon}
                    {config.label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker placeholder={["开始日期", "结束日期"]} style={{ width: "100%" }} />
          </Col>
        </Row>

        {mockFeedbackList.length > 0 ? (
          <Table
            columns={columns}
            dataSource={mockFeedbackList}
            rowKey="id"
            pagination={{
              current: queryParams.page,
              pageSize: queryParams.pageSize,
              total: mockFeedbackList.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              size: "small",
            }}
            size="small"
          />
        ) : (
          <Empty
            description="暂无反馈记录"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => setFeedbackModalVisible(true)}>
              提交第一个反馈
            </Button>
          </Empty>
        )}
      </Card>

      {/* 提交反馈模态框 */}
      <Modal
        title={
          <Space>
            <SendOutlined style={{ color: "#1890ff" }} />
            <span>提交反馈</span>
          </Space>
        }
        open={feedbackModalVisible}
        onCancel={() => {
          setFeedbackModalVisible(false);
          setSelectedType("");
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Alert
          message="感谢您的反馈"
          description="您的意见对我们很重要，我们会认真对待每一条反馈并及时回复。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitFeedback}
          initialValues={{ type: selectedType }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="type"
                label="反馈类型"
                rules={[{ required: true, message: "请选择反馈类型" }]}
              >
                <Select placeholder="请选择反馈类型" size="large">
                  {Object.entries(feedbackTypeConfig).map(([key, config]) => (
                    <Option key={key} value={key}>
                      <Space>
                        {config.icon}
                        <div>
                          <div>{config.label}</div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {config.description}
                          </Text>
                        </div>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: "请选择优先级" }]}
              >
                <Select placeholder="请选择优先级" size="large">
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <Option key={key} value={key}>
                      <Tag color={config.color}>{config.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="反馈标题"
            rules={[{ required: true, message: "请输入反馈标题" }]}
          >
            <Input
              placeholder="请简要描述您的反馈"
              size="large"
              maxLength={100}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="详细描述"
            rules={[{ required: true, message: "请输入详细描述" }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述您遇到的问题或建议，包括具体的操作步骤、期望结果等"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item name="stepsToReproduce" label="重现步骤（可选）">
            <TextArea
              rows={3}
              placeholder="如果是问题报告，请描述重现步骤"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item label="附件（可选）">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} size="large">
                上传附件
              </Button>
            </Upload>
            <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
              支持图片、文档等格式，单个文件不超过 10MB，最多 5 个文件
            </Text>
          </Form.Item>

          <Form.Item name="contactEmail" label="联系邮箱（可选）">
            <Input
              placeholder="如需回复，请留下您的邮箱"
              size="large"
              type="email"
            />
          </Form.Item>

          <Form.Item name="allowContact" valuePropName="checked">
            <Checkbox>允许我们就此反馈与您联系</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
            <Flex justify="space-between">
              <Button
                size="large"
                onClick={() => {
                  setFeedbackModalVisible(false);
                  setSelectedType("");
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SendOutlined />}
                size="large"
                style={{ minWidth: "120px" }}
              >
                提交反馈
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>

      {/* 反馈详情抽屉 */}
      <Drawer
        title={
          <Space>
            <EyeOutlined style={{ color: "#1890ff" }} />
            <span>反馈详情</span>
          </Space>
        }
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedFeedback && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            {/* 基本信息 */}
            <Card size="small" title="基本信息">
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <div>
                  <Text strong>标题：</Text>
                  <Text>{selectedFeedback.title}</Text>
                </div>
                <Flex justify="space-between">
                  <Space>
                    <Text strong>类型：</Text>
                    <Tag color={feedbackTypeConfig[selectedFeedback.type as keyof typeof feedbackTypeConfig].color}>
                      {feedbackTypeConfig[selectedFeedback.type as keyof typeof feedbackTypeConfig].icon}
                      <span style={{ marginLeft: 4 }}>
                        {feedbackTypeConfig[selectedFeedback.type as keyof typeof feedbackTypeConfig].label}
                      </span>
                    </Tag>
                  </Space>
                  <Space>
                    <Text strong>优先级：</Text>
                    <Tag color={priorityConfig[selectedFeedback.priority].color}>
                      {priorityConfig[selectedFeedback.priority].label}
                    </Tag>
                  </Space>
                </Flex>
                <div>
                  <Text strong>状态：</Text>
                  <Tag color={statusConfig[selectedFeedback.status].color}>
                    {statusConfig[selectedFeedback.status].icon}
                    <span style={{ marginLeft: 4 }}>
                      {statusConfig[selectedFeedback.status].label}
                    </span>
                  </Tag>
                </div>
                <Flex justify="space-between">
                  <div>
                    <Text strong>提交人：</Text>
                    <Space>
                      <Avatar size="small" src={selectedFeedback.submittedBy.avatar} />
                      <Text>{selectedFeedback.submittedBy.name}</Text>
                    </Space>
                  </div>
                  <div>
                    <Text strong>提交时间：</Text>
                    <Text>{selectedFeedback.submittedAt}</Text>
                  </div>
                </Flex>
              </Space>
            </Card>

            {/* 详细描述 */}
            <Card size="small" title="详细描述">
              <Paragraph style={{ marginBottom: 0 }}>{selectedFeedback.description}</Paragraph>
            </Card>

            {/* 附件 */}
            {selectedFeedback.attachments.length > 0 && (
              <Card size="small" title="附件">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {selectedFeedback.attachments.map((attachment) => (
                    <Flex key={attachment.id} justify="space-between" align="center">
                      <Space>
                        <FileTextOutlined />
                        <div>
                          <Text>{attachment.name}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {(attachment.size / 1024).toFixed(1)} KB • {attachment.uploadTime}
                          </Text>
                        </div>
                      </Space>
                      <Button type="link" size="small">下载</Button>
                    </Flex>
                  ))}
                </Space>
              </Card>
            )}

            {/* 处理记录 */}
            {selectedFeedback.responses.length > 0 && (
              <Card size="small" title="处理记录">
                <Timeline>
                  {selectedFeedback.responses.map((response) => (
                    <Timeline.Item key={response.id}>
                      <Space direction="vertical" size={8}>
                        <Flex justify="space-between" align="center">
                          <Space>
                            <Avatar size="small" src={response.author.avatar} />
                            <Text strong>{response.author.name}</Text>
                            <Tag className="small-tag">{response.author.role}</Tag>
                          </Space>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {response.createdAt}
                          </Text>
                        </Flex>
                        <Paragraph style={{ marginBottom: 0, marginLeft: 24 }}>
                          {response.content}
                        </Paragraph>
                      </Space>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            )}

            {/* 用户互动 */}
            <Card size="small" title="用户互动">
              <Flex justify="space-between" align="center">
                <Space size={16}>
                  <Space>
                    <LikeOutlined style={{ color: "#52c41a" }} />
                    <Text>{selectedFeedback.votes.upvotes} 赞同</Text>
                  </Space>
                  <Space>
                    <DislikeOutlined style={{ color: "#ff4d4f" }} />
                    <Text>{selectedFeedback.votes.downvotes} 反对</Text>
                  </Space>
                </Space>
                {selectedFeedback.votes.userVote && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    您已{selectedFeedback.votes.userVote === "up" ? "赞同" : "反对"}
                  </Text>
                )}
              </Flex>
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
}
