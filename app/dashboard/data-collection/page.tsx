"use client";

import {
  AntiCrawlMonitor,
  CollectionTask,
  DataCollectionDashboard,
  DataSource,
  IpRotationSystem,
} from "@/types/dashboard/tender";
import {
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  GlobalOutlined,
  LineChartOutlined,
  MonitorOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SafetyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Space,
  Statistic,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
  theme,
} from "antd";
import { ShieldAlert } from "lucide-react";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

// 统计卡片配置
const getStatisticCards = (dashboard: DataCollectionDashboard) => [
  {
    title: "数据源总览",
    items: [
      {
        label: "总数据源",
        value: dashboard.totalDataSources,
        icon: <DatabaseOutlined />,
        color: "#1890ff",
      },
      {
        label: "活跃数据源",
        value: dashboard.activeDataSources,
        icon: <CheckCircleOutlined />,
        color: "#52c41a",
      },
    ],
  },
  {
    title: "采集性能",
    items: [
      {
        label: "今日请求",
        value: dashboard.totalRequests.toLocaleString(),
        icon: <ApiOutlined />,
        color: "#722ed1",
      },
      {
        label: "成功率",
        value: `${(dashboard.successRate * 100).toFixed(1)}%`,
        icon: <LineChartOutlined />,
        color: dashboard.successRate > 0.8 ? "#52c41a" : "#ff4d4f",
      },
    ],
  },
  {
    title: "系统状态",
    items: [
      {
        label: "活跃任务",
        value: dashboard.activeTasks,
        icon: <ThunderboltOutlined />,
        color: "#fa8c16",
      },
      {
        label: "今日采集",
        value: dashboard.dataCollectedToday.toLocaleString(),
        icon: <CloudServerOutlined />,
        color: "#13c2c2",
      },
    ],
  },
];

const DataCollectionPage: React.FC = () => {
  const { token } = theme.useToken();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [ipSystems, setIpSystems] = useState<IpRotationSystem[]>([]);
  const [antiCrawlMonitors, setAntiCrawlMonitors] = useState<AntiCrawlMonitor[]>([]);
  const [dashboard, setDashboard] = useState<DataCollectionDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setLoading(true);

    // ... existing code ...
    const mockDataSources: DataSource[] = [
      {
        id: "ds-1",
        name: "中国政府采购网",
        domain: "ccgp.gov.cn",
        url: "http://www.ccgp.gov.cn",
        type: "tender",
        status: "active",
        lastCollectionTime: "2024-01-16 14:30:00",
        nextCollectionTime: "2024-01-16 15:30:00",
        collectionInterval: 60,
        requestCount: 145,
        dailyRequestLimit: 200,
        successRate: 0.92,
        errorCount: 12,
        ipRotationEnabled: true,
        currentIp: "192.168.1.100",
        availableIps: ["192.168.1.100", "192.168.1.101", "192.168.1.102"],
        antiCrawlDetected: false,
        configuration: {
          headers: { "User-Agent": "Mozilla/5.0..." },
          cookies: {},
          userAgents: [],
          requestDelay: 2000,
          retryCount: 3,
          timeout: 30000,
          proxyEnabled: true,
          proxyList: [],
          selectors: {},
          filters: [],
        },
        statistics: {
          totalRequests: 2450,
          successfulRequests: 2254,
          failedRequests: 196,
          averageResponseTime: 1250,
          dataCollected: 1890,
          lastWeekTrend: [120, 135, 142, 158, 145, 167, 145],
          errorTypes: { "timeout": 89, "blocked": 67, "network": 40 },
        },
      },
      {
        id: "ds-2",
        name: "全国公共资源交易平台",
        domain: "ggzy.gov.cn",
        url: "http://deal.ggzy.gov.cn",
        type: "tender",
        status: "active",
        lastCollectionTime: "2024-01-16 14:25:00",
        nextCollectionTime: "2024-01-16 15:25:00",
        collectionInterval: 60,
        requestCount: 178,
        dailyRequestLimit: 200,
        successRate: 0.88,
        errorCount: 21,
        ipRotationEnabled: true,
        currentIp: "192.168.1.101",
        availableIps: ["192.168.1.100", "192.168.1.101", "192.168.1.102"],
        antiCrawlDetected: true,
        lastError: "检测到反爬虫机制",
        configuration: {
          headers: {},
          cookies: {},
          userAgents: [],
          requestDelay: 3000,
          retryCount: 3,
          timeout: 30000,
          proxyEnabled: true,
          proxyList: [],
          selectors: {},
          filters: [],
        },
        statistics: {
          totalRequests: 3200,
          successfulRequests: 2816,
          failedRequests: 384,
          averageResponseTime: 1580,
          dataCollected: 2340,
          lastWeekTrend: [145, 167, 189, 178, 156, 198, 178],
          errorTypes: { "blocked": 234, "timeout": 89, "network": 61 },
        },
      },
      {
        id: "ds-3",
        name: "企查查",
        domain: "qcc.com",
        url: "https://www.qcc.com",
        type: "company",
        status: "error",
        lastCollectionTime: "2024-01-16 13:45:00",
        nextCollectionTime: "2024-01-16 16:45:00",
        collectionInterval: 180,
        requestCount: 89,
        dailyRequestLimit: 200,
        successRate: 0.45,
        errorCount: 49,
        ipRotationEnabled: true,
        currentIp: "192.168.1.102",
        availableIps: ["192.168.1.100", "192.168.1.101", "192.168.1.102"],
        antiCrawlDetected: true,
        lastError: "IP被封禁",
        configuration: {
          headers: {},
          cookies: {},
          userAgents: [],
          requestDelay: 5000,
          retryCount: 5,
          timeout: 30000,
          proxyEnabled: true,
          proxyList: [],
          selectors: {},
          filters: [],
        },
        statistics: {
          totalRequests: 1200,
          successfulRequests: 540,
          failedRequests: 660,
          averageResponseTime: 2340,
          dataCollected: 450,
          lastWeekTrend: [67, 45, 23, 12, 34, 56, 89],
          errorTypes: { "blocked": 456, "timeout": 123, "network": 81 },
        },
      },
    ];

    const mockTasks: CollectionTask[] = [
      {
        id: "task-1",
        dataSourceId: "ds-1",
        dataSourceName: "中国政府采购网",
        status: "running",
        startTime: "2024-01-16 14:30:00",
        progress: 65,
        itemsCollected: 130,
        itemsTotal: 200,
        currentUrl: "http://www.ccgp.gov.cn/cggg/dfgg/gkzb/",
        logs: [],
      },
      {
        id: "task-2",
        dataSourceId: "ds-2",
        dataSourceName: "全国公共资源交易平台",
        status: "completed",
        startTime: "2024-01-16 13:00:00",
        endTime: "2024-01-16 14:25:00",
        progress: 100,
        itemsCollected: 245,
        itemsTotal: 245,
        logs: [],
      },
    ];

    const mockIpSystems: IpRotationSystem[] = [
      {
        id: "ip-sys-1",
        name: "主IP池",
        provider: "阿里云",
        totalIps: 50,
        activeIps: 47,
        bannedIps: 3,
        rotationStrategy: "smart",
        rotationInterval: 30,
        healthCheckEnabled: true,
        lastHealthCheck: "2024-01-16 14:30:00",
        status: "active",
      },
    ];

    const mockAntiCrawlMonitors: AntiCrawlMonitor[] = [
      {
        id: "acm-1",
        domain: "ggzy.gov.cn",
        detectionMethods: ["验证码", "IP限制", "请求频率检测"],
        riskLevel: "high",
        lastDetectionTime: "2024-01-16 14:20:00",
        detectionCount: 5,
        countermeasures: ["IP轮换", "降低请求频率", "模拟人工操作"],
        bypassSuccess: false,
        notes: "该站点反爬虫机制较强，建议降低采集频率",
      },
      {
        id: "acm-2",
        domain: "qcc.com",
        detectionMethods: ["IP封禁", "设备指纹检测"],
        riskLevel: "critical",
        lastDetectionTime: "2024-01-16 13:45:00",
        detectionCount: 12,
        countermeasures: ["更换IP池", "模拟真实浏览器"],
        bypassSuccess: false,
        notes: "IP已被永久封禁，需要更换IP池",
      },
    ];

    const mockDashboard: DataCollectionDashboard = {
      totalDataSources: 10,
      activeDataSources: 7,
      totalRequests: 6850,
      successRate: 0.82,
      averageResponseTime: 1560,
      dataCollectedToday: 4680,
      activeTasks: 2,
      errorAlerts: 5,
      ipRotationStatus: "warning",
      antiCrawlAlerts: 2,
    };

    setTimeout(() => {
      setDataSources(mockDataSources);
      setTasks(mockTasks);
      setIpSystems(mockIpSystems);
      setAntiCrawlMonitors(mockAntiCrawlMonitors);
      setDashboard(mockDashboard);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string): "success" | "error" | "default" | "warning" | "processing" => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "default";
      case "error": return "error";
      case "maintenance": return "warning";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    const iconStyle = { fontSize: "14px" };
    switch (status) {
      case "active": return <CheckCircleOutlined style={{ ...iconStyle, color: token.colorSuccess }} />;
      case "inactive": return <PauseCircleOutlined style={{ ...iconStyle, color: token.colorTextTertiary }} />;
      case "error": return <ExclamationCircleOutlined style={{ ...iconStyle, color: token.colorError }} />;
      case "maintenance": return <ClockCircleOutlined style={{ ...iconStyle, color: token.colorWarning }} />;
      default: return <QuestionCircleOutlined style={iconStyle} />;
    }
  };

  const handleStartCollection = (dataSourceId: string) => {
    message.success("开始采集数据");
    setDataSources(prev => prev.map(ds =>
      ds.id === dataSourceId ? { ...ds, status: "active" } : ds,
    ));
  };

  const handleStopCollection = (dataSourceId: string) => {
    message.success("停止采集数据");
    setDataSources(prev => prev.map(ds =>
      ds.id === dataSourceId ? { ...ds, status: "inactive" } : ds,
    ));
  };

  const handleConfigDataSource = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setConfigModalVisible(true);
  };

  const dataSourceColumns = [
    {
      title: "数据源信息",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record: DataSource) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: "12px" }}>{record.domain}</Text>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 80,
      render: (type: string) => {
        const typeMap = {
          tender: { text: "招标", color: "blue" },
          qualification: { text: "资质", color: "green" },
          company: { text: "企业", color: "orange" },
          news: { text: "新闻", color: "purple" },
          other: { text: "其他", color: "default" },
        };
        const typeInfo = typeMap[type as keyof typeof typeMap] || { text: type, color: "default" };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: "运行状态",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string, record: DataSource) => (
        <Space direction="vertical" size={2}>
          <Flex align="center" gap={6}>
            {getStatusIcon(status)}
            <Badge
              status={getStatusColor(status)}
              text={
                status === "active" ? "运行中" :
                  status === "inactive" ? "已停止" :
                    status === "error" ? "错误" : "维护中"
              }
            />
          </Flex>
          {record.antiCrawlDetected && (
            <Flex align="center" gap={4}>
              <ShieldAlert size={12} style={{ color: token.colorError }} />
              <Text type="danger" style={{ fontSize: "11px" }}>反爬虫检测</Text>
            </Flex>
          )}
        </Space>
      ),
    },
    {
      title: "请求统计",
      dataIndex: "requestCount",
      key: "requestCount",
      width: 120,
      render: (count: number, record: DataSource) => {
        const percentage = (count / record.dailyRequestLimit) * 100;
        return (
          <div>
            <div style={{ marginBottom: 4, fontSize: "12px" }}>
              {count.toLocaleString()}/{record.dailyRequestLimit.toLocaleString()}
            </div>
            <Progress
              percent={percentage}
              size="small"
              status={percentage >= 90 ? "exception" : percentage >= 70 ? "active" : "normal"}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: "成功率",
      dataIndex: "successRate",
      key: "successRate",
      width: 100,
      render: (rate: number) => {
        const percentage = rate * 100;
        return (
          <div>
            <div style={{ marginBottom: 4, fontSize: "12px", fontWeight: 500 }}>
              {percentage.toFixed(1)}%
            </div>
            <Progress
              percent={percentage}
              size="small"
              status={percentage < 80 ? "exception" : percentage < 90 ? "active" : "success"}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: "IP信息",
      dataIndex: "currentIp",
      key: "currentIp",
      width: 140,
      render: (ip: string, record: DataSource) => (
        <div>
          <div style={{ fontSize: "12px", fontFamily: "monospace", marginBottom: 4 }}>{ip}</div>
          {record.ipRotationEnabled && (
            <Tag className="small-tag" color="processing">IP轮换</Tag>
          )}
        </div>
      ),
    },
    {
      title: "最后采集时间",
      dataIndex: "lastCollectionTime",
      key: "lastCollectionTime",
      width: 140,
      render: (time: string) => (
        <Text style={{ fontSize: "12px" }}>{time}</Text>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 180,
      fixed: "right" as const,
      render: (_: unknown, record: DataSource) => (
        <Space size="small">
          {record.status === "active" ? (
            <Button
              size="small"
              icon={<PauseCircleOutlined />}
              onClick={() => handleStopCollection(record.id)}
            >
              停止
            </Button>
          ) : (
            <Button
              size="small"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartCollection(record.id)}
            >
              启动
            </Button>
          )}
          <Button
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleConfigDataSource(record)}
          >
            配置
          </Button>
          <Button size="small" icon={<EyeOutlined />}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  const taskColumns = [
    {
      title: "任务ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string) => (
        <Text code style={{ fontSize: "12px" }}>{id}</Text>
      ),
    },
    {
      title: "数据源",
      dataIndex: "dataSourceName",
      key: "dataSourceName",
      width: 180,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { text: "等待中", status: "default" as const },
          running: { text: "运行中", status: "processing" as const },
          completed: { text: "已完成", status: "success" as const },
          failed: { text: "失败", status: "error" as const },
          cancelled: { text: "已取消", status: "warning" as const },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return <Badge status={statusInfo.status} text={statusInfo.text} />;
      },
    },
    {
      title: "进度",
      dataIndex: "progress",
      key: "progress",
      width: 150,
      render: (progress: number, record: CollectionTask) => (
        <div>
          <Progress percent={progress} size="small" />
          <Text type="secondary" style={{ fontSize: "11px" }}>
            {record.itemsCollected.toLocaleString()}/{record.itemsTotal.toLocaleString()}
          </Text>
        </div>
      ),
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      width: 140,
      render: (time: string) => (
        <Text style={{ fontSize: "12px" }}>{time}</Text>
      ),
    },
    {
      title: "当前URL",
      dataIndex: "currentUrl",
      key: "currentUrl",
      render: (url: string) => url ? (
        <Tooltip title={url}>
          <Text ellipsis style={{ maxWidth: 300, fontSize: "12px" }}>{url}</Text>
        </Tooltip>
      ) : (
        <Text type="secondary">-</Text>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", backgroundColor: token.colorBgLayout, minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0, marginBottom: "8px" }}>数据采集管理</Title>
        <Text type="secondary">实时监控和管理数据源采集状态，确保数据采集的稳定性和效率</Text>
      </div>

      {/* 统计概览 */}
      {dashboard && (
        <div style={{ marginBottom: "24px" }}>
          <Row gutter={[16, 16]}>
            {getStatisticCards(dashboard).map((cardGroup, groupIndex) => (
              <Col xs={24} sm={12} lg={8} key={groupIndex}>
                <Card
                  title={cardGroup.title}
                  size="small"
                  style={{ height: "100%" }}
                  headStyle={{
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    paddingBottom: "12px",
                  }}
                >
                  <Row gutter={[0, 12]}>
                    {cardGroup.items.map((item, itemIndex) => (
                      <Col span={24} key={itemIndex}>
                        <Flex justify="space-between" align="center">
                          <Flex align="center" gap={8}>
                            <div style={{ color: item.color, fontSize: "16px" }}>
                              {item.icon}
                            </div>
                            <Text type="secondary" style={{ fontSize: "13px" }}>
                              {item.label}
                            </Text>
                          </Flex>
                          <Text strong style={{ fontSize: "16px", color: item.color }}>
                            {item.value}
                          </Text>
                        </Flex>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* 系统警告 */}
      {dashboard && (dashboard.errorAlerts > 0 || dashboard.antiCrawlAlerts > 0) && (
        <Alert
          message="系统状态警告"
          description={
            <Space direction="vertical" size={4}>
              {dashboard.errorAlerts > 0 && (
                <Text>检测到 {dashboard.errorAlerts} 个数据源异常，请及时处理</Text>
              )}
              {dashboard.antiCrawlAlerts > 0 && (
                <Text>发现 {dashboard.antiCrawlAlerts} 个反爬虫警告，建议调整采集策略</Text>
              )}
              {dashboard.ipRotationStatus !== "healthy" && (
                <Text>IP轮换系统状态异常，请检查IP池配置</Text>
              )}
            </Space>
          }
          type="warning"
          showIcon
          style={{ marginBottom: "24px" }}
          action={
            <Button size="small" type="link">
              查看详情
            </Button>
          }
        />
      )}

      {/* 主要内容区域 */}
      <Card
        style={{
          borderRadius: token.borderRadius,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          tabBarStyle={{ marginBottom: "24px" }}
          items={[
            {
              key: "overview",
              label: (
                <Space>
                  <MonitorOutlined />
                  数据源监控
                </Space>
              ),
              children: (
                <div>
                  <div style={{ marginBottom: "16px" }}>
                    <Space>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={loadData}
                        loading={loading}
                      >
                        刷新数据
                      </Button>
                      <Button type="primary" icon={<PlayCircleOutlined />}>
                        批量启动
                      </Button>
                      <Button icon={<PauseCircleOutlined />}>
                        批量停止
                      </Button>
                    </Space>
                  </div>

                  <Table
                    columns={dataSourceColumns}
                    dataSource={dataSources}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1200 }}
                    pagination={{
                      total: dataSources.length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total) => `共 ${total} 个数据源`,
                      size: "small",
                    }}
                    size="small"
                  />
                </div>
              ),
            },
            {
              key: "tasks",
              label: (
                <Space>
                  <ThunderboltOutlined />
                  采集任务
                </Space>
              ),
              children: (
                <Table
                  columns={taskColumns}
                  dataSource={tasks}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total: tasks.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 个任务`,
                    size: "small",
                  }}
                  size="small"
                />
              ),
            },
            {
              key: "ip-rotation",
              label: (
                <Space>
                  <GlobalOutlined />
                  IP轮换系统
                </Space>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {ipSystems.map(system => (
                    <Col xs={24} lg={12} key={system.id}>
                      <Card
                        title={
                          <Flex justify="space-between" align="center">
                            <Text strong>{system.name}</Text>
                            <Tag color={system.status === "active" ? "success" : "error"}>
                              {system.status === "active" ? "正常运行" : "异常状态"}
                            </Tag>
                          </Flex>
                        }
                        size="small"
                      >
                        <Row gutter={[16, 12]}>
                          <Col span={8}>
                            <Statistic
                              title="总IP数"
                              value={system.totalIps}
                              valueStyle={{ fontSize: "20px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic
                              title="可用IP"
                              value={system.activeIps}
                              valueStyle={{ color: token.colorSuccess, fontSize: "20px" }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic
                              title="被封IP"
                              value={system.bannedIps}
                              valueStyle={{ color: token.colorError, fontSize: "20px" }}
                            />
                          </Col>
                        </Row>
                        <Divider style={{ margin: "16px 0" }} />
                        <Space direction="vertical" size={8} style={{ width: "100%" }}>
                          <Flex justify="space-between">
                            <Text type="secondary">轮换策略</Text>
                            <Text strong>{system.rotationStrategy}</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text type="secondary">轮换间隔</Text>
                            <Text strong>{system.rotationInterval}分钟</Text>
                          </Flex>
                          <Flex justify="space-between">
                            <Text type="secondary">最后检查</Text>
                            <Text>{system.lastHealthCheck}</Text>
                          </Flex>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: "anti-crawl",
              label: (
                <Space>
                  <SafetyOutlined />
                  反爬监控
                </Space>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {antiCrawlMonitors.map(monitor => (
                    <Col xs={24} lg={12} key={monitor.id}>
                      <Card
                        title={
                          <Flex justify="space-between" align="center">
                            <Text strong>{monitor.domain}</Text>
                            <Tag color={
                              monitor.riskLevel === "low" ? "success" :
                                monitor.riskLevel === "medium" ? "warning" :
                                  monitor.riskLevel === "high" ? "error" : "purple"
                            }>
                              {
                                monitor.riskLevel === "low" ? "低风险" :
                                  monitor.riskLevel === "medium" ? "中风险" :
                                    monitor.riskLevel === "high" ? "高风险" : "严重风险"
                              }
                            </Tag>
                          </Flex>
                        }
                        size="small"
                      >
                        <Space direction="vertical" size={12} style={{ width: "100%" }}>
                          <div>
                            <Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>检测方法</Text>
                            <Space wrap>
                              {monitor.detectionMethods.map(method => (
                                <Tag key={method} color="default">{method}</Tag>
                              ))}
                            </Space>
                          </div>

                          <div>
                            <Text type="secondary" style={{ display: "block", marginBottom: "8px" }}>应对措施</Text>
                            <Space wrap>
                              {monitor.countermeasures.map(measure => (
                                <Tag key={measure} color="processing">{measure}</Tag>
                              ))}
                            </Space>
                          </div>

                          <Row gutter={16}>
                            <Col span={12}>
                              <Flex justify="space-between">
                                <Text type="secondary">检测次数</Text>
                                <Text strong>{monitor.detectionCount}</Text>
                              </Flex>
                            </Col>
                            <Col span={12}>
                              <Flex justify="space-between">
                                <Text type="secondary">绕过成功</Text>
                                <Tag color={monitor.bypassSuccess ? "success" : "error"}>
                                  {monitor.bypassSuccess ? "是" : "否"}
                                </Tag>
                              </Flex>
                            </Col>
                          </Row>

                          <Flex justify="space-between">
                            <Text type="secondary">最后检测</Text>
                            <Text>{monitor.lastDetectionTime}</Text>
                          </Flex>

                          {monitor.notes && (
                            <Alert
                              message={monitor.notes}
                              type="info"
                              className="small-tag"
                              showIcon
                            />
                          )}
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ),
            },
          ]}
        />
      </Card>

      {/* 配置模态框 */}
      <Modal
        title="数据源配置"
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setConfigModalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary">
            保存配置
          </Button>,
        ]}
      >
        {selectedDataSource && (
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="采集间隔（分钟）">
                  <InputNumber
                    value={selectedDataSource.collectionInterval}
                    min={1}
                    max={1440}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="每日请求限制">
                  <InputNumber
                    value={selectedDataSource.dailyRequestLimit}
                    min={1}
                    max={10000}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="请求延迟（毫秒）">
                  <InputNumber
                    value={selectedDataSource.configuration.requestDelay}
                    min={100}
                    max={60000}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="重试次数">
                  <InputNumber
                    value={selectedDataSource.configuration.retryCount}
                    min={0}
                    max={10}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="启用IP轮换">
                  <Switch checked={selectedDataSource.ipRotationEnabled} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="启用代理">
                  <Switch checked={selectedDataSource.configuration.proxyEnabled} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="User-Agent">
              <Input.TextArea
                value={selectedDataSource.configuration.headers["User-Agent"]}
                rows={3}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default DataCollectionPage;
