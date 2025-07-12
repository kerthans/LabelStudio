"use client";
import type { TenderProject, TenderProjectFilter } from "@/types/dashboard/tender";
import {
  BuildOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DollarOutlined,
  DownloadOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  ImportOutlined,
  LaptopOutlined,
  MoreOutlined,
  PlusOutlined,
  ProjectOutlined,
  ReloadOutlined,
  SettingOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const TenderProjectsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState<TenderProjectFilter>({});
  const [projects, setProjects] = useState<TenderProject[]>([]);
  const [_viewMode, _setViewMode] = useState<"table" | "card">("table");
  const [refreshing, setRefreshing] = useState(false);

  // 统计数据
  const [statistics, setStatistics] = useState({
    total: 0,
    published: 0,
    bidding: 0,
    evaluation: 0,
    completed: 0,
    totalBudget: 0,
  });

  // 模拟数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData: TenderProject[] = [
        {
          id: "1",
          title: "某市政府办公楼建设项目",
          projectNumber: "TN2024001",
          status: "bidding",
          publishDate: "2024-01-10",
          deadline: "2024-01-25",
          budget: 5000000,
          category: "建筑工程",
          description: "新建办公楼项目，总建筑面积约8000平方米，包含地下停车场、办公区域、会议室等功能区域。",
          attachments: [
            { id: "1", name: "招标文件.pdf", url: "", size: 2048000, type: "pdf", uploadDate: "2024-01-10" },
            { id: "2", name: "技术规格书.docx", url: "", size: 1024000, type: "docx", uploadDate: "2024-01-10" },
          ],
          bidCount: 12,
          createdAt: "2024-01-10",
          updatedAt: "2024-01-12",
        },
        {
          id: "2",
          title: "IT设备采购项目",
          projectNumber: "TN2024002",
          status: "published",
          publishDate: "2024-01-12",
          deadline: "2024-01-28",
          budget: 800000,
          category: "设备采购",
          description: "采购服务器、网络设备、存储设备等IT基础设施设备，用于数据中心建设。",
          attachments: [
            { id: "3", name: "设备清单.xlsx", url: "", size: 512000, type: "xlsx", uploadDate: "2024-01-12" },
          ],
          bidCount: 5,
          createdAt: "2024-01-12",
          updatedAt: "2024-01-12",
        },
        {
          id: "3",
          title: "学校食堂设备采购",
          projectNumber: "TN2024004",
          status: "completed",
          publishDate: "2024-01-05",
          deadline: "2024-01-18",
          budget: 300000,
          category: "设备采购",
          description: "学校食堂厨房设备采购，包含炉灶、冰箱、消毒柜等设备。",
          attachments: [],
          bidCount: 6,
          createdAt: "2024-01-05",
          updatedAt: "2024-01-19",
        },
        {
          id: "4",
          title: "园林绿化工程",
          projectNumber: "TN2024005",
          status: "draft",
          publishDate: "2024-01-15",
          deadline: "2024-02-01",
          budget: 1200000,
          category: "园林工程",
          description: "城市公园绿化改造工程，包含植物种植、景观设计、灌溉系统等。",
          attachments: [],
          bidCount: 0,
          createdAt: "2024-01-15",
          updatedAt: "2024-01-15",
        },
      ];

      setProjects(mockData);

      const stats = {
        total: mockData.length,
        published: mockData.filter(p => p.status === "published").length,
        bidding: mockData.filter(p => p.status === "bidding").length,
        evaluation: mockData.filter(p => p.status === "evaluation").length,
        completed: mockData.filter(p => p.status === "completed").length,
        totalBudget: mockData.reduce((sum, p) => sum + p.budget, 0),
      };
      setStatistics(stats);
    } catch (_error) {
      message.error("数据加载失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    message.success("数据已刷新");
  };

  const statusConfig = {
    draft: { color: "default", label: "草稿", icon: <EditOutlined /> },
    published: { color: "blue", label: "已发布", icon: <FileTextOutlined /> },
    bidding: { color: "orange", label: "投标中", icon: <ClockCircleOutlined /> },
    evaluation: { color: "purple", label: "评标中", icon: <ExclamationCircleOutlined /> },
    completed: { color: "green", label: "已完成", icon: <CheckCircleOutlined /> },
    cancelled: { color: "red", label: "已取消", icon: <CloseOutlined /> },
  };

  const categoryConfig = {
    "建筑工程": { color: "blue", icon: <BuildOutlined /> },
    "设备采购": { color: "green", icon: <LaptopOutlined /> },
    "服务采购": { color: "orange", icon: <ToolOutlined /> },
    "园林工程": { color: "cyan", icon: <EnvironmentOutlined /> },
  };

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "error", text: "已截止" };
    if (diffDays <= 3) return { status: "warning", text: `${diffDays}天后截止` };
    if (diffDays <= 7) return { status: "processing", text: `${diffDays}天后截止` };
    return { status: "default", text: `${diffDays}天后截止` };
  };

  const columns: ColumnsType<TenderProject> = [
    {
      title: "项目信息",
      key: "projectInfo",
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <Text strong style={{ fontSize: "14px" }}>{record.title}</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Tag color="blue" className="small-tag">{record.projectNumber}</Tag>
            <Tag
              color={categoryConfig[record.category as keyof typeof categoryConfig]?.color || "default"}
              className="small-tag"
              icon={categoryConfig[record.category as keyof typeof categoryConfig]?.icon}
            >
              {record.category}
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.description.length > 50 ? `${record.description.substring(0, 50)}...` : record.description}
          </Text>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: keyof typeof statusConfig) => {
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "预算金额",
      dataIndex: "budget",
      key: "budget",
      width: 120,
      render: (budget: number) => (
        <div>
          <Text strong>{(budget / 10000).toFixed(1)}万元</Text>
        </div>
      ),
    },
    {
      title: "投标情况",
      key: "bidInfo",
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <div>
            <Badge count={record.bidCount} style={{ backgroundColor: "#52c41a" }} />
            <Text style={{ marginLeft: 8 }}>家投标</Text>
          </div>
        </div>
      ),
    },
    {
      title: "时间信息",
      key: "timeInfo",
      width: 150,
      render: (_, record) => {
        const deadlineStatus = getDeadlineStatus(record.deadline);
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>发布: {record.publishDate}</Text>
            </div>
            <div>
              <Badge status={deadlineStatus.status as "success" | "processing" | "error" | "default" | "warning"} />
              <Text style={{ fontSize: "12px" }}>{deadlineStatus.text}</Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/dashboard/tender-projects/${record.id}`)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: "编辑项目",
                  icon: <EditOutlined />,
                },
                {
                  key: "copy",
                  label: "复制项目",
                  icon: <FileTextOutlined />,
                },
                {
                  type: "divider",
                },
                {
                  key: "delete",
                  label: "删除项目",
                  icon: <DeleteOutlined />,
                  danger: true,
                },
              ],
            }}
          >
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setFilters({ ...filters, keyword: value });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除选中的 ${selectedRowKeys.length} 个项目吗？此操作不可恢复。`,
      icon: <ExclamationCircleOutlined />,
      okText: "确认删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () => {
        message.success("删除成功");
        setSelectedRowKeys([]);
      },
    });
  };

  const handleExport = () => {
    message.success("导出功能开发中...");
  };

  const handleImport = () => {
    message.success("导入功能开发中...");
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ padding: "0 0 24px 0" }}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="项目总数"
              value={statistics.total}
              prefix={<ProjectOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="投标中项目"
              value={statistics.bidding}
              prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="已完成项目"
              value={statistics.completed}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="总预算金额"
              value={statistics.totalBudget / 10000}
              precision={1}
              suffix="万元"
              prefix={<DollarOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Card>
        {/* 页面标题和操作区 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>招标项目管理</Title>
              <Text type="secondary">管理和跟踪所有招标项目的进展情况</Text>
            </div>
            <Space>
              <Tooltip title="刷新数据">
                <Button
                  icon={<ReloadOutlined />}
                  loading={refreshing}
                  onClick={handleRefresh}
                />
              </Tooltip>
              <Button icon={<ImportOutlined />} onClick={handleImport}>
                导入
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
              <Button type="primary" icon={<PlusOutlined />}>
                新建项目
              </Button>
            </Space>
          </div>
        </div>

        {/* 筛选区域 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8} lg={6}>
            <Input.Search
              placeholder="搜索项目名称或编号"
              allowClear
              onSearch={handleSearch}
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="项目状态"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <Option value="published">已发布</Option>
              <Option value="bidding">投标中</Option>
              <Option value="evaluation">评标中</Option>
              <Option value="completed">已完成</Option>
              <Option value="draft">草稿</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="项目类别"
              allowClear
              style={{ width: "100%" }}
              onChange={(value) => setFilters({ ...filters, category: value })}
            >
              <Option value="建筑工程">🏗️ 建筑工程</Option>
              <Option value="设备采购">💻 设备采购</Option>
              <Option value="服务采购">🛠️ 服务采购</Option>
              <Option value="市政工程">🛣️ 市政工程</Option>
              <Option value="园林工程">🌳 园林工程</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <RangePicker
              placeholder={["开始日期", "结束日期"]}
              style={{ width: "100%" }}
              onChange={(dates) => {
                if (dates) {
                  setFilters({
                    ...filters,
                    dateRange: [dates[0]?.format("YYYY-MM-DD") || "", dates[1]?.format("YYYY-MM-DD") || ""],
                  });
                } else {
                  setFilters({ ...filters, dateRange: undefined });
                }
              }}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
              <Button icon={<SettingOutlined />}>
                列设置
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 批量操作区域 */}
        {selectedRowKeys.length > 0 && (
          <Alert
            message={
              <Space>
                <span>已选择 <Text strong>{selectedRowKeys.length}</Text> 个项目</span>
                <Divider type="vertical" />
                <Button size="small" type="link" onClick={handleBatchDelete}>
                  批量删除
                </Button>
                <Button size="small" type="link" icon={<DownloadOutlined />} onClick={handleExport}>
                  批量导出
                </Button>
                <Button size="small" type="link" onClick={() => setSelectedRowKeys([])}>
                  取消选择
                </Button>
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
          pagination={{
            total: projects.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span>
                第 <Text strong>{range[0]}-{range[1]}</Text> 条/共 <Text strong>{total}</Text> 条
              </span>
            ),
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default TenderProjectsPage;
