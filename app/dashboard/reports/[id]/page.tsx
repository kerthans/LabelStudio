"use client";

import { Report } from "@/types/dashboard/tender";
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudDownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  HistoryOutlined,
  HomeOutlined,
  LineChartOutlined,
  PieChartOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Descriptions,
  Dropdown,
  Form,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
  message,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ReportDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [exportLoading, setExportLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    loadReportDetail();
  }, [reportId]);

  const loadReportDetail = () => {
    setLoading(true);

    // 模拟报告详情数据
    const mockReport: Report = {
      id: reportId,
      title: "2024年第一季度招标项目分析报告",
      type: "tender",
      category: "季度报告",
      description: "包含Q1所有招标项目的详细分析和统计，涵盖项目数量、投标情况、中标分析等多个维度",
      templateId: "template-1",
      templateName: "招标分析模板",
      status: "completed",
      progress: 100,
      fileUrl: "/reports/q1-tender-analysis.pdf",
      fileSize: 2048576,
      format: "pdf",
      createdBy: "张三",
      createdAt: "2024-01-15 09:00:00",
      updatedAt: "2024-01-15 10:30:00",
      generatedAt: "2024-01-15 10:30:00",
      downloadCount: 25,
      isShared: true,
      sharedWith: ["李四", "王五"],
      tags: ["季度", "分析", "招标"],
      projectId: "project-1",
      projectName: "办公楼建设项目",
    };

    setTimeout(() => {
      setReport(mockReport);
      setLoading(false);
    }, 1000);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "success", icon: <CheckCircleOutlined />, text: "已完成" };
      case "generating":
        return { color: "processing", icon: <ClockCircleOutlined />, text: "生成中" };
      case "failed":
        return { color: "error", icon: <ExclamationCircleOutlined />, text: "生成失败" };
      default:
        return { color: "default", icon: <ClockCircleOutlined />, text: "未知状态" };
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
      case "word":
        return <FileWordOutlined style={{ color: "#1890ff" }} />;
      case "excel":
        return <FileExcelOutlined style={{ color: "#52c41a" }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  const handleDownload = async (format?: string) => {
    setExportLoading(true);
    try {
      const downloadFormat = format || report?.format || "pdf";
      // 模拟下载延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success(`${downloadFormat.toUpperCase()} 格式报告下载成功`);
      setExportModalVisible(false);
    } catch (error) {
      message.error("下载失败，请重试");
    } finally {
      setExportLoading(false);
    }
  };

  const handleShare = async (_values: any) => {
    setShareLoading(true);
    try {
      // 模拟分享延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("报告分享成功");
      setShareModalVisible(false);
    } catch (_recorderror) {
      message.error("分享失败，请重试");
    } finally {
      setShareLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("链接已复制到剪贴板");
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "确认删除",
      content: "删除后无法恢复，确定要删除这个报告吗？",
      icon: <ExclamationCircleOutlined />,
      okText: "确认删除",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        message.success("报告已删除");
        router.push("/dashboard/reports");
      },
    });
  };

  const exportMenuItems = [
    {
      key: "pdf",
      label: (
        <Space>
          <FilePdfOutlined style={{ color: "#ff4d4f" }} />
          PDF 格式
        </Space>
      ),
      onClick: () => handleDownload("pdf"),
    },
    {
      key: "word",
      label: (
        <Space>
          <FileWordOutlined style={{ color: "#1890ff" }} />
          Word 格式
        </Space>
      ),
      onClick: () => handleDownload("word"),
    },
    {
      key: "excel",
      label: (
        <Space>
          <FileExcelOutlined style={{ color: "#52c41a" }} />
          Excel 格式
        </Space>
      ),
      onClick: () => handleDownload("excel"),
    },
  ];

  const mockChartData = {
    projectStats: {
      total: 156,
      completed: 142,
      inProgress: 8,
      cancelled: 6,
    },
    bidStats: {
      totalBids: 1250,
      averageBidsPerProject: 8.2,
      successRate: 0.65,
    },
    monthlyTrend: [
      { month: "1月", projects: 45, bids: 380 },
      { month: "2月", projects: 52, bids: 420 },
      { month: "3月", projects: 59, bids: 450 },
    ],
  };

  const mockVersionHistory = [
    {
      version: "v1.3",
      date: "2024-01-15 10:30:00",
      author: "张三",
      changes: "更新了第三章节的数据分析",
      isCurrent: true,
    },
    {
      version: "v1.2",
      date: "2024-01-15 09:45:00",
      author: "张三",
      changes: "修正了图表显示问题",
      isCurrent: false,
    },
    {
      version: "v1.1",
      date: "2024-01-15 09:15:00",
      author: "张三",
      changes: "添加了项目统计图表",
      isCurrent: false,
    },
    {
      version: "v1.0",
      date: "2024-01-15 09:00:00",
      author: "张三",
      changes: "初始版本",
      isCurrent: false,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Skeleton.Button active size="small" className="mb-4" />
          <Card className="mb-6">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
          <Card>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Alert
            message="报告不存在"
            description="请检查报告ID是否正确或联系管理员"
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => router.push("/dashboard/reports")}>
                返回报告列表
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(report.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* 面包屑导航 */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link href="/dashboard">
              <HomeOutlined className="mr-1" />
              首页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/dashboard/reports">
              <FileOutlined className="mr-1" />
              报告管理
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Text type="secondary">报告详情</Text>
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* 报告头部信息 */}
        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1 min-w-0">
              {/* 标题区域 */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 mt-1">
                  {getFormatIcon(report.format)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Title level={2} className="mb-0 text-gray-900">
                      {report.title}
                    </Title>
                    <Badge
                      status={statusConfig.color as any}
                      text={statusConfig.text}
                      className="ml-2"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Tag color="blue">{report.category}</Tag>
                    <Tag color="geekblue">{report.templateName}</Tag>
                    {report.isShared && (
                      <Tag color="green" icon={<TeamOutlined />}>
                        已分享
                      </Tag>
                    )}
                    {report.tags?.map(tag => (
                      <Tag key={tag} color="default">{tag}</Tag>
                    ))}
                  </div>
                  <Paragraph type="secondary" className="mb-0 text-base">
                    {report.description}
                  </Paragraph>
                </div>
              </div>

              {/* 基本信息 */}
              <Descriptions column={{ xs: 1, sm: 2, lg: 4 }} size="small">
                <Descriptions.Item label="创建者">
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {report.createdBy}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  <Space>
                    <CalendarOutlined className="text-gray-400" />
                    {report.createdAt}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="文件大小">
                  <Space>
                    <FileOutlined className="text-gray-400" />
                    {(report.fileSize! / 1024 / 1024).toFixed(2)} MB
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="下载次数">
                  <Space>
                    <CloudDownloadOutlined className="text-gray-400" />
                    {report.downloadCount} 次
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* 操作按钮区域 */}
            <div className="flex-shrink-0">
              <div className="flex flex-col gap-3">
                {/* 主要操作 */}
                <div className="flex gap-2">
                  <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      size="large"
                      loading={exportLoading}
                    >
                      导出报告
                    </Button>
                  </Dropdown>
                  <Button
                    icon={<ShareAltOutlined />}
                    onClick={() => setShareModalVisible(true)}
                    size="large"
                  >
                    分享
                  </Button>
                </div>

                {/* 次要操作 */}
                <div className="flex gap-2">
                  <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                    打印
                  </Button>
                  <Button icon={<CopyOutlined />} onClick={handleCopyLink}>
                    复制链接
                  </Button>
                  <Button icon={<HistoryOutlined />} onClick={() => setVersionModalVisible(true)}>
                    版本历史
                  </Button>
                </div>

                {/* 管理操作 */}
                <div className="flex gap-2">
                  <Button icon={<EditOutlined />} type="dashed">
                    编辑
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={handleDelete}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 报告内容 */}
        <Card className="shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            tabBarStyle={{ marginBottom: 24 }}
          >
            <TabPane
              tab={
                <Space>
                  <FileTextOutlined />
                  报告内容
                </Space>
              }
              key="content"
            >
              <div className="report-content max-w-none">
                <div className="mb-8">
                  <Title level={3} className="text-gray-900 border-b border-gray-200 pb-3 mb-6">
                    项目概述
                  </Title>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                    <Paragraph className="mb-0 text-base leading-relaxed">
                      2024年第一季度，我们共处理了156个招标项目，较去年同期增长15.2%。
                      这些项目涵盖了建筑工程、设备采购、服务外包等多个领域。
                    </Paragraph>
                  </div>
                </div>

                <div className="mb-8">
                  <Title level={4} className="text-gray-800 mb-4">
                    主要统计数据
                  </Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <Statistic
                          title="总项目数"
                          value={mockChartData.projectStats.total}
                          prefix={<FileTextOutlined className="text-blue-500" />}
                          valueStyle={{ color: "#1890ff", fontSize: "24px" }}
                        />
                      </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <Statistic
                          title="已完成"
                          value={mockChartData.projectStats.completed}
                          valueStyle={{ color: "#52c41a", fontSize: "24px" }}
                          prefix={<CheckCircleOutlined className="text-green-500" />}
                        />
                      </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <Statistic
                          title="进行中"
                          value={mockChartData.projectStats.inProgress}
                          valueStyle={{ color: "#1890ff", fontSize: "24px" }}
                          prefix={<ClockCircleOutlined className="text-blue-500" />}
                        />
                      </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Card className="text-center hover:shadow-md transition-shadow">
                        <Statistic
                          title="已取消"
                          value={mockChartData.projectStats.cancelled}
                          valueStyle={{ color: "#ff4d4f", fontSize: "24px" }}
                          prefix={<ExclamationCircleOutlined className="text-red-500" />}
                        />
                      </Card>
                    </Col>
                  </Row>
                </div>

                <div className="mb-8">
                  <Title level={4} className="text-gray-800 mb-4">
                    投标情况分析
                  </Title>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Paragraph className="mb-0 text-base leading-relaxed">
                      本季度共收到投标书{mockChartData.bidStats.totalBids}份，
                      平均每个项目收到{mockChartData.bidStats.averageBidsPerProject}份投标书，
                      中标成功率为{(mockChartData.bidStats.successRate * 100).toFixed(1)}%。
                    </Paragraph>
                  </div>
                </div>

                <div>
                  <Title level={4} className="text-gray-800 mb-4">
                    月度趋势
                  </Title>
                  <Table
                    dataSource={mockChartData.monthlyTrend}
                    columns={[
                      {
                        title: "月份",
                        dataIndex: "month",
                        key: "month",
                        width: 100,
                      },
                      {
                        title: "项目数量",
                        dataIndex: "projects",
                        key: "projects",
                        render: (value) => (
                          <Badge count={value} style={{ backgroundColor: "#52c41a" }} />
                        ),
                      },
                      {
                        title: "投标数量",
                        dataIndex: "bids",
                        key: "bids",
                        render: (value) => (
                          <Badge count={value} style={{ backgroundColor: "#1890ff" }} />
                        ),
                      },
                    ]}
                    pagination={false}
                    size="middle"
                    className="border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </TabPane>

            <TabPane
              tab={
                <Space>
                  <BarChartOutlined />
                  数据图表
                </Space>
              }
              key="charts"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                  <Card
                    title="项目状态分布"
                    extra={<PieChartOutlined className="text-gray-400" />}
                    className="h-full"
                  >
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center text-gray-500">
                        <PieChartOutlined style={{ fontSize: 48 }} className="mb-4" />
                        <div className="text-lg">饼图：项目状态分布</div>
                        <Text type="secondary">图表组件待集成</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title="月度趋势"
                    extra={<LineChartOutlined className="text-gray-400" />}
                    className="h-full"
                  >
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center text-gray-500">
                        <LineChartOutlined style={{ fontSize: 48 }} className="mb-4" />
                        <div className="text-lg">折线图：月度趋势</div>
                        <Text type="secondary">图表组件待集成</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="mt-4">
                <Col span={24}>
                  <Card
                    title="投标统计"
                    extra={<BarChartOutlined className="text-gray-400" />}
                  >
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center text-gray-500">
                        <BarChartOutlined style={{ fontSize: 48 }} className="mb-4" />
                        <div className="text-lg">柱状图：投标统计</div>
                        <Text type="secondary">图表组件待集成</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={
                <Space>
                  <HistoryOutlined />
                  版本管理
                </Space>
              }
              key="versions"
            >
              <div className="max-w-4xl">
                <div className="mb-4">
                  <Text type="secondary">共 {mockVersionHistory.length} 个版本</Text>
                </div>
                <Timeline>
                  {mockVersionHistory.map((version, _index) => (
                    <Timeline.Item
                      key={version.version}
                      color={version.isCurrent ? "green" : "blue"}
                      dot={version.isCurrent ? <CheckCircleOutlined className="text-green-500" /> : undefined}
                    >
                      <Card className="ml-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Title level={5} className="mb-0">
                                {version.version}
                              </Title>
                              {version.isCurrent && (
                                <Tag color="green" icon={<CheckCircleOutlined />}>
                                  当前版本
                                </Tag>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                              <Space>
                                <CalendarOutlined />
                                {version.date}
                              </Space>
                              <Space>
                                <UserOutlined />
                                {version.author}
                              </Space>
                            </div>
                            <Paragraph className="mb-0 text-gray-700">
                              {version.changes}
                            </Paragraph>
                          </div>
                          <div className="ml-4">
                            <Space direction="vertical" size="small">
                              <Button size="small" icon={<EyeOutlined />}>
                                查看
                              </Button>
                              <Button size="small" icon={<DownloadOutlined />}>
                                下载
                              </Button>
                              {!version.isCurrent && (
                                <Button size="small" type="primary">
                                  恢复
                                </Button>
                              )}
                            </Space>
                          </div>
                        </div>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* 导出模态框 */}
        <Modal
          title={
            <Space>
              <DownloadOutlined />
              导出报告
            </Space>
          }
          open={exportModalVisible}
          onCancel={() => setExportModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setExportModalVisible(false)}>
              取消
            </Button>,
            <Button
              key="export"
              type="primary"
              onClick={() => handleDownload()}
              loading={exportLoading}
            >
              开始导出
            </Button>,
          ]}
          width={500}
        >
          <Form layout="vertical" className="mt-4">
            <Form.Item label="导出格式" required>
              <Select defaultValue="pdf" size="large">
                <Option value="pdf">
                  <Space>
                    <FilePdfOutlined style={{ color: "#ff4d4f" }} />
                    PDF 格式
                  </Space>
                </Option>
                <Option value="word">
                  <Space>
                    <FileWordOutlined style={{ color: "#1890ff" }} />
                    Word 格式
                  </Space>
                </Option>
                <Option value="excel">
                  <Space>
                    <FileExcelOutlined style={{ color: "#52c41a" }} />
                    Excel 格式
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item label="导出内容" required>
              <Select
                mode="multiple"
                defaultValue={["content", "charts"]}
                size="large"
                placeholder="请选择要导出的内容"
              >
                <Option value="content">报告内容</Option>
                <Option value="charts">数据图表</Option>
                <Option value="appendix">附录</Option>
                <Option value="metadata">元数据</Option>
              </Select>
            </Form.Item>

            <Alert
              message="导出提示"
              description="导出过程可能需要几分钟时间，请耐心等待。"
              type="info"
              showIcon
              className="mt-4"
            />
          </Form>
        </Modal>

        {/* 分享模态框 */}
        <Modal
          title={
            <Space>
              <ShareAltOutlined />
              分享报告
            </Space>
          }
          open={shareModalVisible}
          onCancel={() => setShareModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setShareModalVisible(false)}>
              取消
            </Button>,
            <Button
              key="share"
              type="primary"
              loading={shareLoading}
              onClick={() => handleShare({})}
            >
              确认分享
            </Button>,
          ]}
          width={600}
        >
          <Form layout="vertical" className="mt-4">
            <Form.Item label="分享给" required>
              <Select
                mode="multiple"
                placeholder="选择用户或输入邮箱地址"
                size="large"
                defaultValue={report.sharedWith}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  { value: "user1", label: "张三" },
                  { value: "user2", label: "李四" },
                  { value: "user3", label: "王五" },
                  { value: "user4", label: "赵六" },
                ]}
              />
            </Form.Item>

            <Form.Item label="访问权限" required>
              <Select defaultValue="view" size="large">
                <Option value="view">
                  <Space>
                    <EyeOutlined />
                    仅查看
                  </Space>
                </Option>
                <Option value="download">
                  <Space>
                    <DownloadOutlined />
                    查看和下载
                  </Space>
                </Option>
                <Option value="edit">
                  <Space>
                    <EditOutlined />
                    查看、下载和编辑
                  </Space>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item label="有效期">
              <Select defaultValue="forever" size="large">
                <Option value="1day">1天</Option>
                <Option value="7days">7天</Option>
                <Option value="30days">30天</Option>
                <Option value="forever">永久</Option>
              </Select>
            </Form.Item>

            <Alert
              message="分享提示"
              description="分享后，被分享人将收到邮件通知，并可通过链接访问报告。"
              type="info"
              showIcon
              className="mt-4"
            />
          </Form>
        </Modal>

        {/* 版本历史模态框 */}
        <Modal
          title={
            <Space>
              <HistoryOutlined />
              版本历史
            </Space>
          }
          open={versionModalVisible}
          onCancel={() => setVersionModalVisible(false)}
          width={900}
          footer={[
            <Button key="close" onClick={() => setVersionModalVisible(false)}>
              关闭
            </Button>,
          ]}
        >
          <div className="mt-4">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <Text type="secondary">
                共 {mockVersionHistory.length} 个版本，当前版本：{mockVersionHistory.find(v => v.isCurrent)?.version}
              </Text>
            </div>
            <Timeline>
              {mockVersionHistory.map((version) => (
                <Timeline.Item
                  key={version.version}
                  color={version.isCurrent ? "green" : "blue"}
                  dot={version.isCurrent ? <CheckCircleOutlined className="text-green-500" /> : undefined}
                >
                  <Card className="ml-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Title level={5} className="mb-0">
                            {version.version}
                          </Title>
                          {version.isCurrent && (
                            <Tag color="green" icon={<CheckCircleOutlined />}>
                              当前版本
                            </Tag>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                          <Space>
                            <CalendarOutlined />
                            {version.date}
                          </Space>
                          <Space>
                            <UserOutlined />
                            {version.author}
                          </Space>
                        </div>
                        <Paragraph className="mb-0 text-gray-700">
                          {version.changes}
                        </Paragraph>
                      </div>
                      <div className="ml-4">
                        <Space>
                          <Button size="small" icon={<EyeOutlined />}>
                            查看
                          </Button>
                          <Button size="small" icon={<DownloadOutlined />}>
                            下载
                          </Button>
                          {!version.isCurrent && (
                            <Button size="small" type="primary">
                              恢复
                            </Button>
                          )}
                        </Space>
                      </div>
                    </div>
                  </Card>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ReportDetailPage;
