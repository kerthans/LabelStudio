"use client";

import type {
  ChangelogEntry,
  ContactInfo,
  LicenseInfo,
  SystemInfo,
  TechStack,
  TechnicalSupport,
  VersionInfo,
} from "@/types/dashboard/about";
import {
  BugOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  List,
  Modal,
  Row,
  Space,
  Tag,
  Timeline,
  Typography,
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;

// 模拟数据
const mockSystemInfo: SystemInfo = {
  name: "Magnify AI 招投标智能分析系统",
  version: "2.1.3",
  buildNumber: "20241201.1",
  releaseDate: "2024-12-01",
  environment: "production",
  description: "基于人工智能的招投标文件分析与评估系统，提供智能化的标书分析、风险评估和决策支持服务。",
};

const mockVersionInfo: VersionInfo = {
  current: "2.1.3",
  latest: "2.2.0",
  updateAvailable: true,
  releaseNotes: "新增AI智能评分功能，优化用户界面，修复已知问题。",
  downloadUrl: "/downloads/magnify-ai-v2.2.0.zip",
};

const mockChangelog: ChangelogEntry[] = [
  {
    id: "1",
    version: "2.1.3",
    releaseDate: "2024-12-01",
    type: "patch",
    title: "性能优化与问题修复",
    description: "本次更新主要针对系统性能进行优化，修复了用户反馈的问题。",
    features: [],
    bugFixes: [
      "修复文件上传偶尔失败的问题",
      "解决大文件处理时的内存泄漏",
      "修复导出报告格式错误",
    ],
    improvements: [
      "优化AI分析算法性能",
      "提升页面加载速度",
      "改进用户体验",
    ],
  },
  {
    id: "2",
    version: "2.1.0",
    releaseDate: "2024-11-15",
    type: "minor",
    title: "新增智能评分功能",
    description: "引入全新的AI智能评分系统，提供更准确的标书评估。",
    features: [
      "新增AI智能评分模块",
      "支持自定义评分标准",
      "增加评分报告导出功能",
      "新增批量处理功能",
    ],
    bugFixes: [
      "修复权限管理问题",
      "解决数据同步延迟",
    ],
    improvements: [
      "优化用户界面设计",
      "提升系统稳定性",
    ],
  },
];

const mockTechStack: TechStack[] = [
  {
    category: "前端技术",
    technologies: [
      { name: "React", version: "18.2.0", description: "用户界面构建库" },
      { name: "Next.js", version: "14.0.0", description: "React 全栈框架" },
      { name: "Ant Design", version: "5.12.0", description: "UI 组件库" },
      { name: "TypeScript", version: "5.0.0", description: "类型安全的 JavaScript" },
    ],
  },
  {
    category: "后端技术",
    technologies: [
      { name: "Node.js", version: "20.0.0", description: "JavaScript 运行时" },
      { name: "Express", version: "4.18.0", description: "Web 应用框架" },
      { name: "MongoDB", version: "7.0.0", description: "NoSQL 数据库" },
      { name: "Redis", version: "7.2.0", description: "内存数据库" },
    ],
  },
  {
    category: "AI/ML 技术",
    technologies: [
      { name: "TensorFlow", version: "2.14.0", description: "机器学习框架" },
      { name: "OpenAI GPT", version: "4.0", description: "大语言模型" },
      { name: "Python", version: "3.11.0", description: "AI 算法开发语言" },
    ],
  },
];

const mockSupport: TechnicalSupport = {
  email: "support@magnify-ai.com",
  phone: "+86 400-123-4567",
  workingHours: "工作日 9:00-18:00",
  timezone: "GMT+8 (北京时间)",
  responseTime: "24小时内响应",
  supportLevel: "premium",
};

const mockContact: ContactInfo = {
  company: "Magnify AI 科技有限公司",
  address: "北京市朝阳区科技园区创新大厦 A 座 15 层",
  phone: "+86 010-8888-9999",
  email: "contact@magnify-ai.com",
  website: "https://www.magnify-ai.com",
  socialMedia: [
    { platform: "微信", url: "weixin://magnify-ai", icon: "wechat" },
    { platform: "微博", url: "https://weibo.com/magnify-ai", icon: "weibo" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/magnify-ai", icon: "linkedin" },
  ],
};

const mockLicense: LicenseInfo = {
  type: "企业版许可证",
  holder: "Magnify AI 科技有限公司",
  validFrom: "2024-01-01",
  validTo: "2025-12-31",
  features: [
    "无限用户数",
    "AI 智能分析",
    "高级报告功能",
    "24/7 技术支持",
    "数据备份服务",
    "API 接口访问",
  ],
};

// 快速帮助组件
const QuickHelpCard = ({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: () => void;
}) => (
  <Card
    hoverable
    size="small"
    onClick={action}
    style={{ textAlign: "center", cursor: "pointer" }}
    bodyStyle={{ padding: "20px 16px" }}
  >
    <div style={{ fontSize: "32px", color: "#1890ff", marginBottom: 12 }}>
      {icon}
    </div>
    <Title level={5} style={{ marginBottom: 8 }}>{title}</Title>
    <Text type="secondary" style={{ fontSize: "12px" }}>
      {description}
    </Text>
  </Card>
);

export default function AboutPage() {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [changelogVisible, setChangelogVisible] = useState(false);
  const [techStackVisible, setTechStackVisible] = useState(false);

  const handleDownloadUpdate = () => {
    if (mockVersionInfo.downloadUrl) {
      window.open(mockVersionInfo.downloadUrl, "_blank");
    }
  };

  const handleContactSupport = () => {
    window.open(`mailto:${mockSupport.email}?subject=技术支持请求`, "_blank");
  };

  const handleCallSupport = () => {
    window.open(`tel:${mockSupport.phone}`, "_blank");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>关于系统</Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          了解系统信息、获取技术支持和查看更新内容
        </Text>
      </div>

      {/* 系统状态提醒 */}
      {mockVersionInfo.updateAvailable && (
        <Alert
          message="系统更新提醒"
          description={`发现新版本 ${mockVersionInfo.latest}，建议及时更新以获得最佳体验。`}
          type="info"
          showIcon
          action={
            <Button size="small" type="primary" onClick={() => setUpdateModalVisible(true)}>
              查看更新
            </Button>
          }
          style={{ marginBottom: 24 }}
          closable
        />
      )}

      <Row gutter={[24, 24]}>
        {/* 系统信息 */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <InfoCircleOutlined style={{ color: "#1890ff" }} />
                <span>系统信息</span>
              </Space>
            }
            style={{ height: "100%" }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: "100%" }} size={16}>
                  <div>
                    <Text strong style={{ fontSize: "16px" }}>{mockSystemInfo.name}</Text>
                    <br />
                    <Text type="secondary">{mockSystemInfo.description}</Text>
                  </div>

                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="当前版本">
                      <Space>
                        <Tag color="blue" style={{ fontSize: "12px" }}>
                          v{mockSystemInfo.version}
                        </Tag>
                        {mockVersionInfo.updateAvailable && (
                          <Badge status="processing" text="有新版本" />
                        )}
                      </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="发布日期">
                      {mockSystemInfo.releaseDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="运行环境">
                      <Tag color={mockSystemInfo.environment === "production" ? "green" : "orange"}>
                        <CheckCircleOutlined style={{ marginRight: 4 }} />
                        {mockSystemInfo.environment === "production" ? "生产环境" : "测试环境"}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Space>
              </Col>

              <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: "100%" }} size={12}>
                  <Button
                    type="primary"
                    icon={<ClockCircleOutlined />}
                    onClick={() => setChangelogVisible(true)}
                    block
                  >
                    查看更新日志
                  </Button>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => setTechStackVisible(true)}
                    block
                  >
                    技术架构
                  </Button>
                  <Button
                    icon={<FileTextOutlined />}
                    block
                  >
                    用户手册
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 快速帮助 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <CustomerServiceOutlined style={{ color: "#1890ff" }} />
                <span>需要帮助？</span>
              </Space>
            }
            style={{ height: "100%" }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={12}>
                <QuickHelpCard
                  icon={<PhoneOutlined />}
                  title="电话支持"
                  description="工作日 9:00-18:00"
                  action={handleCallSupport}
                />
              </Col>
              <Col xs={12}>
                <QuickHelpCard
                  icon={<MailOutlined />}
                  title="邮件支持"
                  description="24小时内响应"
                  action={handleContactSupport}
                />
              </Col>
              <Col xs={12}>
                <QuickHelpCard
                  icon={<QuestionCircleOutlined />}
                  title="在线帮助"
                  description="常见问题解答"
                  action={() => { }}
                />
              </Col>
              <Col xs={12}>
                <QuickHelpCard
                  icon={<TeamOutlined />}
                  title="远程协助"
                  description="专业技术支持"
                  action={() => { }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 联系信息 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <GlobalOutlined style={{ color: "#1890ff" }} />
                <span>联系我们</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Flex justify="space-between" align="center">
                <Text strong>技术支持</Text>
                <Space>
                  <Button
                    type="link"
                    size="small"
                    icon={<PhoneOutlined />}
                    href={`tel:${mockSupport.phone}`}
                  >
                    {mockSupport.phone}
                  </Button>
                </Space>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text strong>支持邮箱</Text>
                <Button
                  type="link"
                  size="small"
                  icon={<MailOutlined />}
                  href={`mailto:${mockSupport.email}`}
                >
                  {mockSupport.email}
                </Button>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text strong>工作时间</Text>
                <Text type="secondary">{mockSupport.workingHours}</Text>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text strong>响应时间</Text>
                <Tag color="green">{mockSupport.responseTime}</Tag>
              </Flex>

              <Divider style={{ margin: "12px 0" }} />

              <div>
                <Text strong style={{ display: "block", marginBottom: 8 }}>公司信息</Text>
                <Text type="secondary" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                  {mockContact.company}<br />
                  {mockContact.address}<br />
                  官网：<a href={mockContact.website} target="_blank" rel="noopener noreferrer">
                    {mockContact.website}
                  </a>
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* 许可证信息 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
                <span>许可证信息</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <Flex justify="space-between" align="center">
                <Text strong>许可证类型</Text>
                <Tag color="gold">{mockLicense.type}</Tag>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text strong>有效期至</Text>
                <Text>{mockLicense.validTo}</Text>
              </Flex>

              <div>
                <Text strong style={{ display: "block", marginBottom: 8 }}>授权功能</Text>
                <Row gutter={[8, 8]}>
                  {mockLicense.features.slice(0, 4).map((feature, index) => (
                    <Col xs={12} key={index}>
                      <Text style={{ fontSize: "12px" }}>
                        <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 4 }} />
                        {feature}
                      </Text>
                    </Col>
                  ))}
                </Row>
                {mockLicense.features.length > 4 && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    +{mockLicense.features.length - 4} 项更多功能
                  </Text>
                )}
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 更新提示模态框 */}
      <Modal
        title={
          <Space>
            <RocketOutlined style={{ color: "#1890ff" }} />
            <span>系统更新</span>
          </Space>
        }
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUpdateModalVisible(false)}>
            稍后更新
          </Button>,
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownloadUpdate}>
            立即下载
          </Button>,
        ]}
        width={600}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Alert
            message="发现新版本"
            description={`当前版本：${mockVersionInfo.current} → 最新版本：${mockVersionInfo.latest}`}
            type="info"
            showIcon
          />

          <div>
            <Text strong style={{ display: "block", marginBottom: 8 }}>更新内容：</Text>
            <Paragraph style={{ background: "#f5f5f5", padding: "12px", borderRadius: "6px" }}>
              {mockVersionInfo.releaseNotes}
            </Paragraph>
          </div>

          <Alert
            message="更新提醒"
            description="建议在非工作时间进行更新，更新过程中系统将暂时不可用。"
            type="warning"
            showIcon
          />
        </Space>
      </Modal>

      {/* 更新日志模态框 */}
      <Modal
        title={
          <Space>
            <ClockCircleOutlined style={{ color: "#1890ff" }} />
            <span>更新日志</span>
          </Space>
        }
        open={changelogVisible}
        onCancel={() => setChangelogVisible(false)}
        footer={null}
        width={800}
      >
        <Timeline>
          {mockChangelog.map((entry) => (
            <Timeline.Item
              key={entry.id}
              color={entry.type === "major" ? "red" : entry.type === "minor" ? "blue" : "green"}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={8}>
                <Flex justify="space-between" align="center">
                  <Space>
                    <Text strong>{entry.title}</Text>
                    <Tag color={entry.type === "major" ? "red" : entry.type === "minor" ? "blue" : "green"}>
                      {entry.version}
                    </Tag>
                  </Space>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {entry.releaseDate}
                  </Text>
                </Flex>

                <Text type="secondary">{entry.description}</Text>

                {entry.features.length > 0 && (
                  <div>
                    <Text strong style={{ fontSize: "12px" }}>
                      <StarOutlined style={{ color: "#1890ff", marginRight: 4 }} />
                      新功能
                    </Text>
                    <List
                      size="small"
                      dataSource={entry.features}
                      renderItem={(item) => (
                        <List.Item style={{ padding: "2px 0", border: "none" }}>
                          <Text style={{ fontSize: "12px" }}>• {item}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                )}

                {entry.improvements.length > 0 && (
                  <div>
                    <Text strong style={{ fontSize: "12px" }}>
                      <RocketOutlined style={{ color: "#52c41a", marginRight: 4 }} />
                      改进优化
                    </Text>
                    <List
                      size="small"
                      dataSource={entry.improvements}
                      renderItem={(item) => (
                        <List.Item style={{ padding: "2px 0", border: "none" }}>
                          <Text style={{ fontSize: "12px" }}>• {item}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                )}

                {entry.bugFixes.length > 0 && (
                  <div>
                    <Text strong style={{ fontSize: "12px" }}>
                      <BugOutlined style={{ color: "#fa8c16", marginRight: 4 }} />
                      问题修复
                    </Text>
                    <List
                      size="small"
                      dataSource={entry.bugFixes}
                      renderItem={(item) => (
                        <List.Item style={{ padding: "2px 0", border: "none" }}>
                          <Text style={{ fontSize: "12px" }}>• {item}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                )}
              </Space>
            </Timeline.Item>
          ))}
        </Timeline>
      </Modal>

      {/* 技术栈模态框 */}
      <Modal
        title={
          <Space>
            <DatabaseOutlined style={{ color: "#1890ff" }} />
            <span>技术架构</span>
          </Space>
        }
        open={techStackVisible}
        onCancel={() => setTechStackVisible(false)}
        footer={null}
        width={800}
      >
        <Row gutter={[16, 16]}>
          {mockTechStack.map((stack, index) => (
            <Col xs={24} md={8} key={index}>
              <Card size="small" title={stack.category}>
                <List
                  size="small"
                  dataSource={stack.technologies}
                  renderItem={(tech) => (
                    <List.Item style={{ padding: "8px 0" }}>
                      <List.Item.Meta
                        title={
                          <Text style={{ fontSize: "13px" }}>
                            {tech.name}
                            <Tag className="small-tag" style={{ marginLeft: 4 }}>v{tech.version}</Tag>
                          </Text>
                        }
                        description={
                          <Text type="secondary" style={{ fontSize: "11px" }}>
                            {tech.description}
                          </Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
}
