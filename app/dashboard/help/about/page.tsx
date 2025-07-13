"use client";
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  ExperimentOutlined,
  GithubOutlined,
  GlobalOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  RocketOutlined,
  SafetyOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Timeline,
  Typography,
} from "antd";
import React from "react";

const { Title, Text, Paragraph } = Typography;

interface SystemInfo {
  version: string;
  buildDate: string;
  environment: string;
  database: string;
  server: string;
  uptime: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "stable" | "beta" | "experimental";
}

const AboutPage: React.FC = () => {
  // 系统信息
  const systemInfo: SystemInfo = {
    version: "v2.1.3",
    buildDate: "2024-01-15",
    environment: "生产环境",
    database: "PostgreSQL 14.2",
    server: "Node.js 18.17.0",
    uptime: "99.9%",
  };

  // 团队成员
  const teamMembers: TeamMember[] = [
    {
      name: "张明",
      role: "产品经理",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=zhang",
      description: "负责产品规划和用户体验设计",
    },
    {
      name: "李华",
      role: "技术总监",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=li",
      description: "负责技术架构和系统开发",
    },
    {
      name: "王芳",
      role: "UI/UX设计师",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=wang",
      description: "负责界面设计和交互体验",
    },
    {
      name: "陈强",
      role: "算法工程师",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=chen",
      description: "负责AI算法和智能标注功能",
    },
  ];

  // 核心功能
  const coreFeatures: Feature[] = [
    {
      title: "智能标注",
      description: "基于AI的智能辅助标注，提高标注效率",
      icon: <ExperimentOutlined style={{ color: "#1890ff" }} />,
      status: "stable",
    },
    {
      title: "质量控制",
      description: "多层次质量检查和评估体系",
      icon: <SafetyOutlined style={{ color: "#52c41a" }} />,
      status: "stable",
    },
    {
      title: "协作管理",
      description: "团队协作和任务分配管理",
      icon: <TeamOutlined style={{ color: "#722ed1" }} />,
      status: "stable",
    },
    {
      title: "数据分析",
      description: "标注数据统计和可视化分析",
      icon: <DatabaseOutlined style={{ color: "#fa8c16" }} />,
      status: "beta",
    },
    {
      title: "API集成",
      description: "开放API接口，支持第三方集成",
      icon: <CodeOutlined style={{ color: "#13c2c2" }} />,
      status: "experimental",
    },
    {
      title: "云端部署",
      description: "支持云端部署和弹性扩展",
      icon: <CloudServerOutlined style={{ color: "#eb2f96" }} />,
      status: "beta",
    },
  ];

  // 版本历史
  const versionHistory = [
    {
      version: "v2.1.3",
      date: "2024-01-15",
      changes: ["修复批量操作bug", "优化性能", "新增快捷键支持"],
    },
    {
      version: "v2.1.0",
      date: "2024-01-01",
      changes: ["新增智能标注功能", "重构用户界面", "增强安全性"],
    },
    {
      version: "v2.0.5",
      date: "2023-12-15",
      changes: ["修复数据导出问题", "优化加载速度", "更新文档"],
    },
    {
      version: "v2.0.0",
      date: "2023-12-01",
      changes: ["全新架构重构", "支持多种标注类型", "新增协作功能"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable": return "green";
      case "beta": return "orange";
      case "experimental": return "red";
      default: return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "stable": return "稳定版";
      case "beta": return "测试版";
      case "experimental": return "实验版";
      default: return "未知";
    }
  };

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <InfoCircleOutlined />
          关于系统
        </Title>
        <Text type="secondary">了解标注平台的详细信息和团队介绍</Text>
      </div>

      <Row gutter={[16, 16]}>
        {/* 系统概览 */}
        <Col xs={24} lg={12}>
          <Card title={<><AppstoreOutlined style={{ marginRight: 8 }} />系统概览</>}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🏷️</div>
              <Title level={4} style={{ margin: 0 }}>智能标注平台</Title>
              <Text type="secondary">专业的数据标注和管理解决方案</Text>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label="当前版本">
                <Tag color="blue">{systemInfo.version}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="构建日期">{systemInfo.buildDate}</Descriptions.Item>
              <Descriptions.Item label="运行环境">{systemInfo.environment}</Descriptions.Item>
              <Descriptions.Item label="数据库">{systemInfo.database}</Descriptions.Item>
              <Descriptions.Item label="服务器">{systemInfo.server}</Descriptions.Item>
              <Descriptions.Item label="系统稳定性">
                <Progress percent={99.9} size="small" status="active" />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 核心功能 */}
        <Col xs={24} lg={12}>
          <Card title={<><RocketOutlined style={{ marginRight: 8 }} />核心功能</>}>
            <List
              dataSource={coreFeatures}
              renderItem={(feature) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={feature.icon}
                    title={
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {feature.title}
                        <Tag color={getStatusColor(feature.status)} className="small-tag">
                          {getStatusText(feature.status)}
                        </Tag>
                      </div>
                    }
                    description={feature.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 团队介绍 */}
        <Col xs={24}>
          <Card title={<><TeamOutlined style={{ marginRight: 8 }} />开发团队</>}>
            <Row gutter={[16, 16]}>
              {teamMembers.map((member, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <Card size="small" style={{ textAlign: "center" }}>
                    <Avatar src={member.avatar} size={64} style={{ marginBottom: 12 }} />
                    <Title level={5} style={{ margin: "8px 0 4px" }}>{member.name}</Title>
                    <Tag color="blue" style={{ marginBottom: 8 }}>{member.role}</Tag>
                    <Paragraph style={{ fontSize: 12, color: "#666", margin: 0 }}>
                      {member.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 版本历史 */}
        <Col xs={24} lg={12}>
          <Card title={<><TrophyOutlined style={{ marginRight: 8 }} />版本历史</>}>
            <Timeline
              items={versionHistory.map((version) => ({
                children: (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Tag color="blue">{version.version}</Tag>
                      <Text type="secondary" style={{ fontSize: 12 }}>{version.date}</Text>
                    </div>
                    <List
                      size="small"
                      dataSource={version.changes}
                      renderItem={(change) => (
                        <List.Item style={{ padding: "4px 0", border: "none" }}>
                          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                          <Text style={{ fontSize: 12 }}>{change}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        {/* 联系信息 */}
        <Col xs={24} lg={12}>
          <Card title={<><CustomerServiceOutlined style={{ marginRight: 8 }} />联系我们</>}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MailOutlined style={{ color: "#1890ff" }} />
                <Text>邮箱：support@labelstudio.com</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PhoneOutlined style={{ color: "#52c41a" }} />
                <Text>电话：400-123-4567</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GlobalOutlined style={{ color: "#722ed1" }} />
                <Text>官网：www.labelstudio.com</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GithubOutlined style={{ color: "#000" }} />
                <Text>GitHub：github.com/labelstudio</Text>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <EnvironmentOutlined style={{ color: "#fa8c16" }} />
                <Text>地址：北京市朝阳区科技园区</Text>
              </div>
            </Space>

            <Divider />

            <div style={{ textAlign: "center" }}>
              <Space>
                <HeartOutlined style={{ color: "#ff4d4f" }} />
                <Text type="secondary">感谢您使用我们的产品</Text>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutPage;
