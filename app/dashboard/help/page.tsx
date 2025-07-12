"use client";
import type {
  ContactMethod,
  CustomerService,
  FAQ,
  HelpCategory,
  HelpDocument,
  HelpSearchParams,
  HelpStats,
  VideoTutorial,
} from "@/types/dashboard/help";
import {
  BookOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  EyeOutlined,
  FileTextOutlined,
  FireOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  PlayCircleOutlined,
  QqOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Input,
  List,
  Modal,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Search } = Input;

const HelpCenterPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<HelpDocument[]>([]);
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [customerServices, setCustomerServices] = useState<CustomerService[]>([]);
  const [stats, setStats] = useState<HelpStats | null>(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams, setSearchParams] = useState<HelpSearchParams>({
    page: 1,
    pageSize: 10,
  });
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<CustomerService | null>(null);

  // 模拟数据
  const mockDocuments: HelpDocument[] = [
    {
      id: "1",
      title: "系统快速入门指南",
      content: "本指南将帮助您快速了解和使用Magnify AI系统的基本功能...",
      category: "getting_started" as HelpCategory,
      tags: ["入门", "基础", "新手"],
      author: "产品团队",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      viewCount: 1250,
      isPublished: true,
    },
    {
      id: "2",
      title: "用户权限管理详解",
      content: "详细介绍如何管理用户权限，包括角色分配、权限设置等...",
      category: "admin_guide" as HelpCategory,
      tags: ["权限", "管理", "安全"],
      author: "技术团队",
      createdAt: "2024-01-14T15:30:00Z",
      updatedAt: "2024-01-14T15:30:00Z",
      viewCount: 890,
      isPublished: true,
    },
    {
      id: "3",
      title: "API接口使用说明",
      content: "提供完整的API接口文档和使用示例...",
      category: "api_docs" as HelpCategory,
      tags: ["API", "开发", "集成"],
      author: "开发团队",
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T09:15:00Z",
      viewCount: 567,
      isPublished: true,
    },
  ];

  const mockVideos: VideoTutorial[] = [
    {
      id: "1",
      title: "系统概览与基本操作",
      description: "通过视频演示了解系统的整体架构和基本操作流程",
      videoUrl: "https://example.com/video1.mp4",
      thumbnailUrl: "https://example.com/thumb1.jpg",
      duration: 480, // 8分钟
      category: "getting_started" as HelpCategory,
      difficulty: "beginner",
      tags: ["概览", "基础", "操作"],
      author: "培训团队",
      createdAt: "2024-01-15T14:00:00Z",
      viewCount: 2340,
      isPublished: true,
    },
    {
      id: "2",
      title: "数据采集配置教程",
      description: "详细演示如何配置和管理数据采集任务",
      videoUrl: "https://example.com/video2.mp4",
      thumbnailUrl: "https://example.com/thumb2.jpg",
      duration: 720, // 12分钟
      category: "user_guide" as HelpCategory,
      difficulty: "intermediate",
      tags: ["数据采集", "配置", "管理"],
      author: "培训团队",
      createdAt: "2024-01-14T11:30:00Z",
      viewCount: 1890,
      isPublished: true,
    },
  ];

  const mockFAQs: FAQ[] = [
    {
      id: "1",
      question: "如何重置密码？",
      answer: "您可以在登录页面点击\"忘记密码\"链接，输入您的邮箱地址，系统会发送重置密码的邮件到您的邮箱。",
      category: "troubleshooting" as HelpCategory,
      tags: ["密码", "重置", "登录"],
      isPopular: true,
      viewCount: 3450,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "2",
      question: "数据采集失败怎么办？",
      answer: "请检查网络连接、数据源配置和权限设置。如果问题仍然存在，请联系技术支持。",
      category: "troubleshooting" as HelpCategory,
      tags: ["数据采集", "故障", "排查"],
      isPopular: true,
      viewCount: 2890,
      createdAt: "2024-01-09T15:20:00Z",
      updatedAt: "2024-01-09T15:20:00Z",
    },
    {
      id: "3",
      question: "如何导出报告？",
      answer: "在报告页面点击\"导出\"按钮，选择导出格式（PDF、Excel等），系统会生成并下载报告文件。",
      category: "user_guide" as HelpCategory,
      tags: ["报告", "导出", "下载"],
      isPopular: false,
      viewCount: 1234,
      createdAt: "2024-01-08T09:45:00Z",
      updatedAt: "2024-01-08T09:45:00Z",
    },
  ];

  const mockCustomerServices: CustomerService[] = [
    {
      id: "1",
      name: "技术支持-小王",
      avatar: "",
      status: "online",
      department: "技术支持部",
      workingHours: "9:00-18:00",
      contactMethods: [
        { type: "chat", value: "online_chat", isAvailable: true },
        { type: "email", value: "support@magnify.ai", isAvailable: true },
        { type: "phone", value: "400-123-4567", isAvailable: true },
      ],
    },
    {
      id: "2",
      name: "产品咨询-小李",
      avatar: "",
      status: "online",
      department: "产品部",
      workingHours: "9:00-18:00",
      contactMethods: [
        { type: "chat", value: "online_chat", isAvailable: true },
        { type: "email", value: "product@magnify.ai", isAvailable: true },
        { type: "wechat", value: "magnify_product", isAvailable: true },
      ],
    },
    {
      id: "3",
      name: "销售顾问-小张",
      avatar: "",
      status: "busy",
      department: "销售部",
      workingHours: "9:00-21:00",
      contactMethods: [
        { type: "phone", value: "400-123-4568", isAvailable: true },
        { type: "email", value: "sales@magnify.ai", isAvailable: true },
        { type: "qq", value: "123456789", isAvailable: false },
      ],
    },
  ];

  const mockStats: HelpStats = {
    totalDocuments: 45,
    totalVideos: 23,
    totalFAQs: 67,
    totalManuals: 12,
    popularDocuments: mockDocuments.slice(0, 3),
    popularVideos: mockVideos.slice(0, 2),
    popularFAQs: mockFAQs.filter(faq => faq.isPopular),
    recentUpdates: [...mockDocuments, ...mockVideos].slice(0, 5),
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setDocuments(mockDocuments);
      setVideos(mockVideos);
      setFAQs(mockFAQs);
      setCustomerServices(mockCustomerServices);
      setStats(mockStats);
    } catch (error) {
      message.error("加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchParams(prev => ({ ...prev, keyword: value, page: 1 }));
  };

  const handleContactService = (service: CustomerService, method: ContactMethod) => {
    switch (method.type) {
      case "chat":
        setSelectedService(service);
        setChatModalVisible(true);
        break;
      case "email":
        window.open(`mailto:${method.value}`);
        break;
      case "phone":
        message.info(`请拨打电话：${method.value}`);
        break;
      case "wechat":
        message.info(`微信号：${method.value}`);
        break;
      case "qq":
        message.info(`QQ号：${method.value}`);
        break;
    }
  };

  const getContactIcon = (type: ContactMethod["type"]) => {
    const iconMap = {
      chat: <MessageOutlined />,
      email: <MailOutlined />,
      phone: <PhoneOutlined />,
      wechat: <WechatOutlined />,
      qq: <QqOutlined />,
    };
    return iconMap[type];
  };

  const getStatusColor = (status: CustomerService["status"]) => {
    const colorMap = {
      online: "#52c41a",
      offline: "#d9d9d9",
      busy: "#faad14",
    };
    return colorMap[status];
  };

  const getStatusText = (status: CustomerService["status"]) => {
    const textMap = {
      online: "在线",
      offline: "离线",
      busy: "忙碌",
    };
    return textMap[status];
  };

  const getCategoryText = (category: HelpCategory) => {
    const textMap = {
      getting_started: "快速入门",
      user_guide: "用户指南",
      admin_guide: "管理员指南",
      api_docs: "API文档",
      troubleshooting: "故障排除",
      faq: "常见问题",
    };
    return textMap[category];
  };

  const getDifficultyColor = (difficulty: VideoTutorial["difficulty"]) => {
    const colorMap = {
      beginner: "green",
      intermediate: "orange",
      advanced: "red",
    };
    return colorMap[difficulty];
  };

  const getDifficultyText = (difficulty: VideoTutorial["difficulty"]) => {
    const textMap = {
      beginner: "初级",
      intermediate: "中级",
      advanced: "高级",
    };
    return textMap[difficulty];
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!stats) {
    return <div>加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>帮助中心</Title>
        <Text type="secondary">使用说明、视频教程、常见问题和在线客服</Text>
      </div>

      {/* 搜索栏 */}
      <div className="mb-6">
        <Row justify="center">
          <Col span={12}>
            <Search
              placeholder="搜索帮助内容..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
            />
          </Col>
        </Row>
      </div>

      {/* 快捷入口 */}
      <Row gutter={[24, 24]} className="mb-6">
        <Col span={6}>
          <Card
            hoverable
            className="text-center"
            onClick={() => router.push("/dashboard/help/manual")}
          >
            <BookOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            <Title level={4}>操作手册</Title>
            <Text type="secondary">详细的操作指南和说明</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="text-center" onClick={() => setActiveTab("videos")}>
            <PlayCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
            <Title level={4}>视频教程</Title>
            <Text type="secondary">直观的视频演示教程</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="text-center" onClick={() => setActiveTab("faq")}>
            <QuestionCircleOutlined style={{ fontSize: 48, color: "#faad14" }} />
            <Title level={4}>常见问题</Title>
            <Text type="secondary">快速找到问题答案</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="text-center" onClick={() => setActiveTab("support")}>
            <CustomerServiceOutlined style={{ fontSize: 48, color: "#f5222d" }} />
            <Title level={4}>在线客服</Title>
            <Text type="secondary">专业的技术支持服务</Text>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 概览 */}
          <TabPane tab={<span><BookOutlined />概览</span>} key="overview">
            {/* 统计数据 */}
            <Row gutter={[24, 24]} className="mb-6">
              <Col span={6}>
                <Statistic
                  title="帮助文档"
                  value={stats.totalDocuments}
                  prefix={<FileTextOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="视频教程"
                  value={stats.totalVideos}
                  prefix={<VideoCameraOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="常见问题"
                  value={stats.totalFAQs}
                  prefix={<QuestionCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="操作手册"
                  value={stats.totalManuals}
                  prefix={<BookOutlined />}
                />
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              {/* 热门文档 */}
              <Col span={12}>
                <Card title={<span><FireOutlined />热门文档</span>} size="small">
                  <List
                    dataSource={stats.popularDocuments}
                    renderItem={(doc) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <a onClick={() => router.push(`/dashboard/help/document/${doc.id}`)}>
                              {doc.title}
                            </a>
                          }
                          description={
                            <Space>
                              <Tag color="blue">{getCategoryText(doc.category)}</Tag>
                              <span><EyeOutlined /> {doc.viewCount}</span>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* 热门视频 */}
              <Col span={12}>
                <Card title={<span><StarOutlined />热门视频</span>} size="small">
                  <List
                    dataSource={stats.popularVideos}
                    renderItem={(video) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              shape="square"
                              size={64}
                              src={video.thumbnailUrl}
                              icon={<PlayCircleOutlined />}
                            />
                          }
                          title={
                            <a onClick={() => router.push(`/dashboard/help/video/${video.id}`)}>
                              {video.title}
                            </a>
                          }
                          description={
                            <Space>
                              <Tag color={getDifficultyColor(video.difficulty)}>
                                {getDifficultyText(video.difficulty)}
                              </Tag>
                              <span><ClockCircleOutlined /> {formatDuration(video.duration)}</span>
                              <span><EyeOutlined /> {video.viewCount}</span>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 帮助文档 */}
          <TabPane tab={<span><FileTextOutlined />帮助文档</span>} key="documents">
            <div className="mb-4">
              <Button icon={<ReloadOutlined />} onClick={loadData}>
                刷新
              </Button>
            </div>

            <List
              loading={loading}
              dataSource={documents}
              renderItem={(doc) => (
                <List.Item
                  actions={[
                    <Button
                      key="view"
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => router.push(`/dashboard/help/document/${doc.id}`)}
                    >
                      查看
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} />}
                    title={doc.title}
                    description={
                      <div>
                        <Paragraph ellipsis={{ rows: 2 }}>{doc.content}</Paragraph>
                        <Space>
                          <Tag color="blue">{getCategoryText(doc.category)}</Tag>
                          {doc.tags.map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                          <span><UserOutlined /> {doc.author}</span>
                          <span><EyeOutlined /> {doc.viewCount}</span>
                          <span><ClockCircleOutlined /> {new Date(doc.createdAt).toLocaleDateString()}</span>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          {/* 视频教程 */}
          <TabPane tab={<span><PlayCircleOutlined />视频教程</span>} key="videos">
            <div className="mb-4">
              <Button icon={<ReloadOutlined />} onClick={loadData}>
                刷新
              </Button>
            </div>

            <Row gutter={[24, 24]}>
              {videos.map((video) => (
                <Col span={12} key={video.id}>
                  <Card
                    hoverable
                    cover={
                      <div className="relative">
                        <img
                          alt={video.title}
                          src={video.thumbnailUrl}
                          style={{ height: 200, objectFit: "cover" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <PlayCircleOutlined style={{ fontSize: 48, color: "white" }} />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>
                    }
                    actions={[
                      <Button
                        key="play"
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => router.push(`/dashboard/help/video/${video.id}`)}
                      >
                        播放
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={video.title}
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }}>{video.description}</Paragraph>
                          <Space>
                            <Tag color={getDifficultyColor(video.difficulty)}>
                              {getDifficultyText(video.difficulty)}
                            </Tag>
                            <Tag color="blue">{getCategoryText(video.category)}</Tag>
                            <span><EyeOutlined /> {video.viewCount}</span>
                          </Space>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* 常见问题 */}
          <TabPane tab={<span><QuestionCircleOutlined />常见问题</span>} key="faq">
            <div className="mb-4">
              <Alert
                message="常见问题"
                description="这里收集了用户最常遇到的问题和解决方案，您可以快速找到答案。"
                type="info"
                showIcon
              />
            </div>

            <Collapse>
              {faqs.map((faq) => (
                <Panel
                  key={faq.id}
                  header={
                    <div className="flex items-center justify-between">
                      <span>{faq.question}</span>
                      <Space>
                        {faq.isPopular && <Tag color="red">热门</Tag>}
                        <Tag color="blue">{getCategoryText(faq.category)}</Tag>
                        <span className="text-gray-500">
                          <EyeOutlined /> {faq.viewCount}
                        </span>
                      </Space>
                    </div>
                  }
                >
                  <div>
                    <Paragraph>{faq.answer}</Paragraph>
                    <div className="mt-4">
                      <Space>
                        {faq.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                        <span className="text-gray-500">
                          更新时间：{new Date(faq.updatedAt).toLocaleDateString()}
                        </span>
                      </Space>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </TabPane>

          {/* 在线客服 */}
          <TabPane tab={<span><CustomerServiceOutlined />在线客服</span>} key="support">
            <div className="mb-4">
              <Alert
                message="在线客服"
                description="我们的专业客服团队随时为您提供帮助，请选择合适的联系方式。"
                type="success"
                showIcon
              />
            </div>

            <Row gutter={[24, 24]}>
              {customerServices.map((service) => (
                <Col span={8} key={service.id}>
                  <Card>
                    <div className="text-center mb-4">
                      <Badge
                        status={service.status === "online" ? "success" : service.status === "busy" ? "warning" : "default"}
                        dot
                      >
                        <Avatar size={64} icon={<UserOutlined />} src={service.avatar} />
                      </Badge>
                      <div className="mt-2">
                        <Title level={5}>{service.name}</Title>
                        <Text type="secondary">{service.department}</Text>
                        <div>
                          <Tag color={getStatusColor(service.status)}>
                            {getStatusText(service.status)}
                          </Tag>
                        </div>
                        <Text type="secondary" className="text-sm">
                          工作时间：{service.workingHours}
                        </Text>
                      </div>
                    </div>

                    <Divider>联系方式</Divider>

                    <Space direction="vertical" style={{ width: "100%" }}>
                      {service.contactMethods.map((method, index) => (
                        <Button
                          key={index}
                          block
                          icon={getContactIcon(method.type)}
                          disabled={!method.isAvailable || service.status === "offline"}
                          onClick={() => handleContactService(service, method)}
                        >
                          {method.type === "chat" && "在线聊天"}
                          {method.type === "email" && "发送邮件"}
                          {method.type === "phone" && "电话咨询"}
                          {method.type === "wechat" && "微信联系"}
                          {method.type === "qq" && "QQ联系"}
                        </Button>
                      ))}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 在线聊天模态框 */}
      <Modal
        title={`与 ${selectedService?.name} 聊天`}
        open={chatModalVisible}
        onCancel={() => setChatModalVisible(false)}
        footer={null}
        width={600}
        height={500}
      >
        <div className="h-96 flex flex-col">
          <div className="flex-1 border rounded p-4 mb-4 overflow-y-auto bg-gray-50">
            <div className="text-center text-gray-500 py-8">
              聊天功能开发中...
            </div>
          </div>
          <div className="flex">
            <Input.TextArea
              rows={3}
              placeholder="输入您的问题..."
              className="mr-2"
            />
            <Button type="primary" icon={<MessageOutlined />}>
              发送
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HelpCenterPage;
