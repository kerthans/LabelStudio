"use client";
import type {
  Manual,
  ManualCategory,
  ManualSection,
} from "@/types/dashboard/help";
import {
  ArrowLeftOutlined,
  BookOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  MenuOutlined,
  PlayCircleOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Affix,
  Alert,
  Avatar,
  BackTop,
  Button,
  Card,
  Col,
  Drawer,
  Empty,
  Image,
  Input,
  List,
  Row,
  Select,
  Space,
  Steps,
  Tag,
  Tree,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { Search } = Input;

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}

const ManualPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);
  const [selectedSection, setSelectedSection] = useState<ManualSection | null>(null);
  const [tocVisible, setTocVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ManualCategory | undefined>();

  // 模拟数据
  const mockManuals: Manual[] = [
    {
      id: "1",
      title: "系统管理员操作手册",
      description: "详细介绍系统管理员的各项操作流程和注意事项",
      category: "system_overview" as ManualCategory,
      version: "v2.1.0",
      author: "产品团队",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      downloadUrl: "/downloads/admin-manual.pdf",
      isPublished: true,
      sections: [
        {
          id: "1-1",
          title: "系统概述",
          content: "Magnify AI是一个智能化的招标分析平台...",
          order: 1,
          screenshots: ["/images/overview1.png", "/images/overview2.png"],
          steps: [
            {
              id: "1-1-1",
              title: "登录系统",
              description: "使用管理员账号登录系统",
              order: 1,
              screenshot: "/images/login.png",
              tips: ["确保使用HTTPS连接", "建议使用Chrome浏览器"],
              warnings: ["不要在公共电脑上保存密码"],
            },
            {
              id: "1-1-2",
              title: "查看仪表盘",
              description: "登录后查看系统仪表盘概览",
              order: 2,
              screenshot: "/images/dashboard.png",
              tips: ["仪表盘显示系统关键指标", "可以自定义显示内容"],
            },
          ],
        },
        {
          id: "1-2",
          title: "用户管理",
          content: "管理系统用户，包括添加、编辑、删除用户等操作...",
          order: 2,
          screenshots: ["/images/user-list.png", "/images/user-add.png"],
          videoUrl: "/videos/user-management.mp4",
          steps: [
            {
              id: "1-2-1",
              title: "查看用户列表",
              description: "在用户管理页面查看所有用户",
              order: 1,
              screenshot: "/images/user-list.png",
            },
            {
              id: "1-2-2",
              title: "添加新用户",
              description: "点击添加按钮创建新用户",
              order: 2,
              screenshot: "/images/user-add.png",
              tips: ["填写完整的用户信息", "选择合适的用户角色"],
              warnings: ["确保邮箱地址唯一", "密码需符合安全策略"],
            },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "数据采集配置指南",
      description: "详细说明如何配置和管理数据采集任务",
      category: "data_collection" as ManualCategory,
      version: "v1.8.0",
      author: "技术团队",
      createdAt: "2024-01-14T15:30:00Z",
      updatedAt: "2024-01-14T15:30:00Z",
      downloadUrl: "/downloads/data-collection-manual.pdf",
      isPublished: true,
      sections: [
        {
          id: "2-1",
          title: "数据源配置",
          content: "配置各种数据源，包括网站、API、数据库等...",
          order: 1,
          screenshots: ["/images/datasource1.png"],
          steps: [
            {
              id: "2-1-1",
              title: "添加数据源",
              description: "在数据源管理页面添加新的数据源",
              order: 1,
              screenshot: "/images/add-datasource.png",
            },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    loadManuals();
  }, []);

  const loadManuals = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setManuals(mockManuals);
    } catch (error) {
      console.error("加载手册失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectManual = (manual: Manual) => {
    setSelectedManual(manual);
    setSelectedSection(manual.sections[0] || null);
  };

  const handleDownload = (manual: Manual) => {
    if (manual.downloadUrl) {
      window.open(manual.downloadUrl, "_blank");
    }
  };

  const getCategoryText = (category: ManualCategory) => {
    const textMap = {
      system_overview: "系统概述",
      user_management: "用户管理",
      data_collection: "数据采集",
      tender_analysis: "招标分析",
      report_generation: "报告生成",
      system_settings: "系统设置",
    };
    return textMap[category];
  };

  const getCategoryColor = (category: ManualCategory) => {
    const colorMap = {
      system_overview: "blue",
      user_management: "green",
      data_collection: "orange",
      tender_analysis: "purple",
      report_generation: "cyan",
      system_settings: "red",
    };
    return colorMap[category];
  };

  const generateTocData = (manual: Manual): TreeNode[] => {
    return manual.sections.map(section => ({
      title: section.title,
      key: section.id,
      children: section.steps.map(step => ({
        title: step.title,
        key: step.id,
      })),
    }));
  };

  const filteredManuals = manuals.filter(manual => {
    if (selectedCategory && manual.category !== selectedCategory) return false;
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return manual.title.toLowerCase().includes(keyword) ||
        manual.description.toLowerCase().includes(keyword);
    }
    return true;
  });

  // 如果没有选中手册，显示手册列表
  if (!selectedManual) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Title level={2}>操作手册</Title>
          <Text type="secondary">详细的操作指南和说明文档</Text>
        </div>

        {/* 搜索和筛选 */}
        <Card className="mb-6">
          <Row gutter={16}>
            <Col span={12}>
              <Search
                placeholder="搜索手册..."
                allowClear
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onSearch={setSearchKeyword}
              />
            </Col>
            <Col span={8}>
              <Select
                placeholder="选择分类"
                allowClear
                style={{ width: "100%" }}
                value={selectedCategory}
                onChange={setSelectedCategory}
              >
                <Option value="system_overview">系统概述</Option>
                <Option value="user_management">用户管理</Option>
                <Option value="data_collection">数据采集</Option>
                <Option value="tender_analysis">招标分析</Option>
                <Option value="report_generation">报告生成</Option>
                <Option value="system_settings">系统设置</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Button icon={<BookOutlined />} onClick={() => router.back()}>
                返回帮助中心
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 手册列表 */}
        <Row gutter={[24, 24]}>
          {filteredManuals.map((manual) => (
            <Col span={12} key={manual.id}>
              <Card
                hoverable
                actions={[
                  <Button
                    key="view"
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleSelectManual(manual)}
                  >
                    查看
                  </Button>,
                  <Button
                    key="download"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(manual)}
                  >
                    下载PDF
                  </Button>,
                ]}
              >
                <Card.Meta
                  avatar={<Avatar size={64} icon={<BookOutlined />} />}
                  title={
                    <div>
                      <div>{manual.title}</div>
                      <Space className="mt-2">
                        <Tag color={getCategoryColor(manual.category)}>
                          {getCategoryText(manual.category)}
                        </Tag>
                        <Tag>v{manual.version}</Tag>
                      </Space>
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 3 }}>{manual.description}</Paragraph>
                      <div className="mt-4">
                        <Space>
                          <span><UserOutlined /> {manual.author}</span>
                          <span><ClockCircleOutlined /> {new Date(manual.updatedAt).toLocaleDateString()}</span>
                          <span>{manual.sections.length} 个章节</span>
                        </Space>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {filteredManuals.length === 0 && (
          <Empty description="没有找到匹配的操作手册" />
        )}
      </div>
    );
  }

  // 显示选中的手册内容
  return (
    <div className="p-6">
      {/* 头部导航 */}
      <div className="mb-6">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => setSelectedManual(null)}
              >
                返回列表
              </Button>
              <Title level={2} className="mb-0">{selectedManual.title}</Title>
              <Tag color={getCategoryColor(selectedManual.category)}>
                {getCategoryText(selectedManual.category)}
              </Tag>
              <Tag>v{selectedManual.version}</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<MenuOutlined />}
                onClick={() => setTocVisible(true)}
              >
                目录
              </Button>
              <Button icon={<PrinterOutlined />}>
                打印
              </Button>
              <Button icon={<ShareAltOutlined />}>
                分享
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(selectedManual)}
              >
                下载PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={24}>
        {/* 侧边栏章节导航 */}
        <Col span={6}>
          <Affix offsetTop={20}>
            <Card title="章节导航" size="small">
              <List
                size="small"
                dataSource={selectedManual.sections}
                renderItem={(section) => (
                  <List.Item
                    className={`cursor-pointer hover:bg-gray-50 ${selectedSection?.id === section.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedSection(section)}
                  >
                    <List.Item.Meta
                      title={section.title}
                      description={`${section.steps.length} 个步骤`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Affix>
        </Col>

        {/* 主要内容区域 */}
        <Col span={18}>
          {selectedSection ? (
            <Card>
              <div className="mb-6">
                <Title level={3}>{selectedSection.title}</Title>
                <Paragraph>{selectedSection.content}</Paragraph>
              </div>

              {/* 章节截图 */}
              {selectedSection.screenshots && selectedSection.screenshots.length > 0 && (
                <div className="mb-6">
                  <Title level={4}>相关截图</Title>
                  <Row gutter={[16, 16]}>
                    {selectedSection.screenshots.map((screenshot, index) => (
                      <Col span={12} key={index}>
                        <Image
                          src={screenshot}
                          alt={`截图 ${index + 1}`}
                          style={{ width: "100%" }}
                          placeholder
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* 视频教程 */}
              {selectedSection.videoUrl && (
                <div className="mb-6">
                  <Title level={4}>视频教程</Title>
                  <div className="bg-gray-100 p-8 text-center rounded">
                    <PlayCircleOutlined style={{ fontSize: 48, color: "#1890ff" }} />
                    <div className="mt-2">
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => window.open(selectedSection.videoUrl, "_blank")}
                      >
                        播放视频
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 操作步骤 */}
              <div className="mb-6">
                <Title level={4}>操作步骤</Title>
                <Steps direction="vertical" current={-1}>
                  {selectedSection.steps.map((step, index) => (
                    <Step
                      key={step.id}
                      title={step.title}
                      description={
                        <div>
                          <Paragraph>{step.description}</Paragraph>

                          {/* 步骤截图 */}
                          {step.screenshot && (
                            <div className="my-4">
                              <Image
                                src={step.screenshot}
                                alt={step.title}
                                style={{ maxWidth: "100%", maxHeight: 300 }}
                                placeholder
                              />
                            </div>
                          )}

                          {/* 提示信息 */}
                          {step.tips && step.tips.length > 0 && (
                            <Alert
                              message="提示"
                              description={
                                <ul>
                                  {step.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex}>{tip}</li>
                                  ))}
                                </ul>
                              }
                              type="info"
                              icon={<BulbOutlined />}
                              className="my-2"
                            />
                          )}

                          {/* 警告信息 */}
                          {step.warnings && step.warnings.length > 0 && (
                            <Alert
                              message="注意"
                              description={
                                <ul>
                                  {step.warnings.map((warning, warningIndex) => (
                                    <li key={warningIndex}>{warning}</li>
                                  ))}
                                </ul>
                              }
                              type="warning"
                              icon={<WarningOutlined />}
                              className="my-2"
                            />
                          )}
                        </div>
                      }
                    />
                  ))}
                </Steps>
              </div>

              {/* 章节导航 */}
              <div className="text-center">
                <Space>
                  <Button
                    disabled={selectedSection.order === 1}
                    onClick={() => {
                      const prevSection = selectedManual.sections.find(
                        s => s.order === selectedSection.order - 1,
                      );
                      if (prevSection) setSelectedSection(prevSection);
                    }}
                  >
                    上一章节
                  </Button>
                  <Button
                    type="primary"
                    disabled={selectedSection.order === selectedManual.sections.length}
                    onClick={() => {
                      const nextSection = selectedManual.sections.find(
                        s => s.order === selectedSection.order + 1,
                      );
                      if (nextSection) setSelectedSection(nextSection);
                    }}
                  >
                    下一章节
                  </Button>
                </Space>
              </div>
            </Card>
          ) : (
            <Empty description="请选择一个章节" />
          )}
        </Col>
      </Row>

      {/* 目录抽屉 */}
      <Drawer
        title="目录"
        placement="right"
        onClose={() => setTocVisible(false)}
        open={tocVisible}
        width={400}
      >
        <Tree
          treeData={generateTocData(selectedManual)}
          onSelect={(selectedKeys) => {
            const key = selectedKeys[0] as string;
            const section = selectedManual.sections.find(s => s.id === key);
            if (section) {
              setSelectedSection(section);
              setTocVisible(false);
            }
          }}
        />
      </Drawer>

      <BackTop />
    </div>
  );
};

export default ManualPage;
