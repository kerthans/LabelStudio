"use client";

import { Report, ReportFilter, ReportTemplate } from "@/types/dashboard/tender";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShareAltOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Dropdown,
  Empty,
  Flex,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<ReportFilter>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState("reports");

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setLoading(true);

    const mockReports: Report[] = [
      {
        id: "1",
        title: "2024年第一季度招标项目分析报告",
        type: "tender",
        category: "季度报告",
        description: "包含Q1所有招标项目的详细分析和统计",
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
      },
      {
        id: "2",
        title: "评标专家评分汇总报告",
        type: "evaluation",
        category: "评标报告",
        description: "专家评分结果的详细汇总和分析",
        templateId: "template-2",
        templateName: "评标汇总模板",
        status: "generating",
        progress: 65,
        format: "word",
        createdBy: "李四",
        createdAt: "2024-01-16 14:00:00",
        updatedAt: "2024-01-16 14:30:00",
        downloadCount: 0,
        isShared: false,
        sharedWith: [],
        tags: ["评标", "专家", "汇总"],
        projectId: "project-2",
        projectName: "道路改造工程",
      },
      {
        id: "3",
        title: "供应商资质对比分析",
        type: "qualification",
        category: "资质报告",
        description: "多家供应商资质的详细对比分析",
        status: "failed",
        progress: 0,
        format: "excel",
        createdBy: "王五",
        createdAt: "2024-01-17 11:00:00",
        updatedAt: "2024-01-17 11:15:00",
        downloadCount: 0,
        isShared: false,
        sharedWith: [],
        tags: ["资质", "对比", "供应商"],
      },
    ];

    const mockTemplates: ReportTemplate[] = [
      {
        id: "template-1",
        name: "招标分析模板",
        description: "用于生成招标项目分析报告的标准模板",
        type: "tender",
        category: "分析报告",
        sections: [],
        parameters: [],
        format: "pdf",
        isDefault: true,
        isPublic: true,
        createdBy: "系统管理员",
        createdAt: "2024-01-01 00:00:00",
        updatedAt: "2024-01-01 00:00:00",
        usageCount: 15,
      },
      {
        id: "template-2",
        name: "评标汇总模板",
        description: "专家评分结果汇总报告模板",
        type: "evaluation",
        category: "评标报告",
        sections: [],
        parameters: [],
        format: "word",
        isDefault: true,
        isPublic: true,
        createdBy: "系统管理员",
        createdAt: "2024-01-01 00:00:00",
        updatedAt: "2024-01-01 00:00:00",
        usageCount: 8,
      },
    ];

    setTimeout(() => {
      setReports(mockReports);
      setTemplates(mockTemplates);
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleOutlined className="text-green-500" />;
      case "generating":
        return <SyncOutlined spin className="text-blue-500" />;
      case "failed":
        return <ExclamationCircleOutlined className="text-red-500" />;
      case "scheduled":
        return <ClockCircleOutlined className="text-yellow-500" />;
      default:
        return <FileTextOutlined className="text-gray-400" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FilePdfOutlined className="text-red-500" />;
      case "word":
        return <FileWordOutlined className="text-blue-500" />;
      case "excel":
        return <FileExcelOutlined className="text-green-500" />;
      default:
        return <FileTextOutlined className="text-gray-400" />;
    }
  };

  const handleDownload = (report: Report) => {
    if (report.status === "completed" && report.fileUrl) {
      message.success(`开始下载：${report.title}`);
    } else {
      message.warning("报告尚未生成完成");
    }
  };

  const handleShare = (report: Report) => {
    setSelectedReport(report);
    setShareModalVisible(true);
  };

  const handleDelete = (reportId: string) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除这个报告吗？此操作不可恢复。",
      onOk: () => {
        setReports(reports.filter(r => r.id !== reportId));
        message.success("报告已删除");
      },
    });
  };

  const handleBatchAction = (action: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要操作的报告");
      return;
    }

    switch (action) {
      case "download":
        message.success(`批量下载 ${selectedRowKeys.length} 个报告`);
        break;
      case "delete":
        Modal.confirm({
          title: "批量删除",
          content: `确定要删除选中的 ${selectedRowKeys.length} 个报告吗？`,
          onOk: () => {
            setReports(reports.filter(r => !selectedRowKeys.includes(r.id)));
            setSelectedRowKeys([]);
            message.success("批量删除成功");
          },
        });
        break;
    }
  };

  const batchActionItems = [
    {
      key: "download",
      label: "批量下载",
      icon: <DownloadOutlined />,
    },
    {
      key: "delete",
      label: "批量删除",
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  const columns = [
    {
      title: "报告信息",
      dataIndex: "title",
      key: "title",
      width: "40%",
      render: (text: string, record: Report) => (
        <div className="space-y-1">
          <Flex align="center" gap={8}>
            {getFormatIcon(record.format)}
            <Text strong className="text-gray-900">{text}</Text>
            {record.isShared && <Tag color="blue" className="small-tag">已分享</Tag>}
          </Flex>
          {record.description && (
            <Text type="secondary" className="text-sm block">
              {record.description}
            </Text>
          )}
          {record.tags && record.tags.length > 0 && (
            <div className="flex gap-1 mt-1">
              {record.tags.map(tag => (
                <Tag key={tag} className="text-xs small-tag">{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: "12%",
      render: (type: string) => {
        const typeMap = {
          tender: { text: "招标", color: "blue" },
          evaluation: { text: "评标", color: "green" },
          qualification: { text: "资质", color: "orange" },
          analysis: { text: "分析", color: "purple" },
          custom: { text: "自定义", color: "default" },
        };
        const typeInfo = typeMap[type as keyof typeof typeMap] || { text: type, color: "default" };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status: string, record: Report) => {
        const statusMap = {
          draft: { text: "草稿", color: "default" },
          generating: { text: "生成中", color: "processing" },
          completed: { text: "已完成", color: "success" },
          failed: { text: "失败", color: "error" },
          scheduled: { text: "已计划", color: "warning" },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return (
          <div className="space-y-1">
            <Flex align="center" gap={6}>
              {getStatusIcon(status)}
              <Badge status={statusInfo.color as any} text={statusInfo.text} />
            </Flex>
            {status === "generating" && (
              <Progress
                percent={record.progress}
                size="small"
                className="w-16"
                showInfo={false}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "创建信息",
      key: "createInfo",
      width: "18%",
      render: (_: any, record: Report) => (
        <div className="space-y-1">
          <Text className="text-sm text-gray-900">{record.createdBy}</Text>
          <Text type="secondary" className="text-xs block">
            {record.createdAt}
          </Text>
          {record.downloadCount > 0 && (
            <Text type="secondary" className="text-xs block">
              下载 {record.downloadCount} 次
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: "15%",
      render: (_: any, record: Report) => (
        <Space size={0}>
          <Tooltip title="查看详情">
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="下载">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              size="small"
              disabled={record.status !== "completed"}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          <Tooltip title="分享">
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              size="small"
              disabled={record.status !== "completed"}
              onClick={() => handleShare(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "编辑",
                  icon: <EyeOutlined />,
                },
                {
                  key: "duplicate",
                  label: "复制",
                  icon: <FileTextOutlined />,
                },
                {
                  type: "divider",
                },
                {
                  key: "delete",
                  label: "删除",
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => handleDelete(record.id),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const templateColumns = [
    {
      title: "模板信息",
      dataIndex: "name",
      key: "name",
      width: "40%",
      render: (text: string, record: ReportTemplate) => (
        <div className="space-y-1">
          <Flex align="center" gap={8}>
            {getFormatIcon(record.format)}
            <Text strong className="text-gray-900">{text}</Text>
            {record.isDefault && <Tag color="gold" className="small-tag">默认</Tag>}
            {record.isPublic && <Tag color="green" className="small-tag">公共</Tag>}
          </Flex>
          {record.description && (
            <Text type="secondary" className="text-sm block">
              {record.description}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (type: string) => {
        const typeMap = {
          tender: { text: "招标", color: "blue" },
          evaluation: { text: "评标", color: "green" },
          qualification: { text: "资质", color: "orange" },
          analysis: { text: "分析", color: "purple" },
          custom: { text: "自定义", color: "default" },
        };
        const typeInfo = typeMap[type as keyof typeof typeMap] || { text: type, color: "default" };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: "使用统计",
      key: "usage",
      width: "20%",
      render: (_: any, record: ReportTemplate) => (
        <div className="space-y-1">
          <Text className="text-sm">使用 {record.usageCount} 次</Text>
          <Text type="secondary" className="text-xs block">
            {record.createdAt}
          </Text>
        </div>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: "25%",
      render: (_: any, record: ReportTemplate) => (
        <Space>
          <Link href={`/dashboard/reports/generate?template=${record.id}`}>
            <Button type="primary" size="small">
              使用模板
            </Button>
          </Link>
          <Button type="default" size="small">
            编辑
          </Button>
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <Flex justify="space-between" align="center">
            <div>
              <Title level={3} className="!mb-1">报告中心</Title>
              <Text type="secondary">管理和查看所有生成的报告</Text>
            </div>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadMockData}>
                刷新
              </Button>
              <Link href="/dashboard/reports/generate">
                <Button type="primary" icon={<PlusOutlined />}>
                  生成报告
                </Button>
              </Link>
            </Space>
          </Flex>
        </div>
      </div>

      <div className="p-6">
        <Card className="shadow-sm">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            className="-mt-4"
          >
            <Tabs.TabPane tab="报告列表" key="reports">
              <div className="space-y-4">
                {/* 筛选区域 */}
                <Card size="small" className="bg-gray-50 border-gray-200">
                  <Flex gap={12} wrap="wrap">
                    <Input
                      placeholder="搜索报告名称或描述"
                      prefix={<SearchOutlined className="text-gray-400" />}
                      value={filter.keyword}
                      onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
                      className="w-64"
                      allowClear
                    />
                    <Select
                      placeholder="报告类型"
                      value={filter.type}
                      onChange={(value) => setFilter({ ...filter, type: value })}
                      allowClear
                      className="w-32"
                    >
                      <Option value="tender">招标</Option>
                      <Option value="evaluation">评标</Option>
                      <Option value="qualification">资质</Option>
                      <Option value="analysis">分析</Option>
                      <Option value="custom">自定义</Option>
                    </Select>
                    <Select
                      placeholder="状态"
                      value={filter.status}
                      onChange={(value) => setFilter({ ...filter, status: value })}
                      allowClear
                      className="w-32"
                    >
                      <Option value="completed">已完成</Option>
                      <Option value="generating">生成中</Option>
                      <Option value="failed">失败</Option>
                      <Option value="scheduled">已计划</Option>
                    </Select>
                    <RangePicker
                      onChange={(dates) => {
                        if (dates) {
                          setFilter({
                            ...filter,
                            dateRange: dates ? [dates[0]?.format("YYYY-MM-DD") || "", dates[1]?.format("YYYY-MM-DD") || ""] : ["", ""],
                          });
                        } else {
                          setFilter({ ...filter, dateRange: undefined });
                        }
                      }}
                      className="w-64"
                    />
                  </Flex>
                </Card>

                {/* 批量操作 */}
                {selectedRowKeys.length > 0 && (
                  <Card size="small" className="bg-blue-50 border-blue-200">
                    <Flex justify="space-between" align="center">
                      <Text className="text-blue-700">
                        已选择 {selectedRowKeys.length} 个报告
                      </Text>
                      <Space>
                        <Dropdown
                          menu={{
                            items: batchActionItems,
                            onClick: ({ key }) => handleBatchAction(key),
                          }}
                        >
                          <Button size="small">
                            批量操作 <DownloadOutlined />
                          </Button>
                        </Dropdown>
                        <Button
                          size="small"
                          onClick={() => setSelectedRowKeys([])}
                        >
                          取消选择
                        </Button>
                      </Space>
                    </Flex>
                  </Card>
                )}

                {/* 报告表格 */}
                <Table
                  columns={columns}
                  dataSource={reports}
                  rowKey="id"
                  loading={loading}
                  rowSelection={{
                    selectedRowKeys,
                    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys as string[]),
                  }}
                  pagination={{
                    total: reports.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                    className: "px-2",
                  }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无报告数据"
                      />
                    ),
                  }}
                  className="bg-white"
                />
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab="报告模板" key="templates">
              <div className="space-y-4">
                <Flex justify="space-between" align="center">
                  <Text type="secondary">管理报告生成模板</Text>
                  <Button type="primary" icon={<PlusOutlined />}>
                    新建模板
                  </Button>
                </Flex>

                <Table
                  columns={templateColumns}
                  dataSource={templates}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total: templates.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                  }}
                  locale={{
                    emptyText: (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无模板数据"
                      />
                    ),
                  }}
                  className="bg-white"
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>

      {/* 分享模态框 */}
      <Modal
        title="分享报告"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setShareModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            确认分享
          </Button>,
        ]}
        width={520}
      >
        {selectedReport && (
          <Form layout="vertical" className="mt-4">
            <Form.Item label="报告名称">
              <Input value={selectedReport.title} disabled />
            </Form.Item>
            <Form.Item label="分享给">
              <Select
                mode="multiple"
                placeholder="选择用户或输入邮箱"
                style={{ width: "100%" }}
              >
                <Option value="user1">张三</Option>
                <Option value="user2">李四</Option>
                <Option value="user3">王五</Option>
              </Select>
            </Form.Item>
            <Form.Item label="权限">
              <Select defaultValue="view" style={{ width: "100%" }}>
                <Option value="view">仅查看</Option>
                <Option value="download">查看和下载</Option>
                <Option value="edit">查看、下载和编辑</Option>
              </Select>
            </Form.Item>
            <Form.Item label="过期时间">
              <DatePicker style={{ width: "100%" }} placeholder="选择过期时间" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ReportsPage;
