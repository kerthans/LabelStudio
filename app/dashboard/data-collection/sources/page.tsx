"use client";

import { DataSource } from "@/types/dashboard/tender";
import {
  ApiOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  WarningOutlined,
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
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Table,
  Tag,
  Typography,
  message,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

// 统计卡片配置
const getStatisticCards = (dataSources: DataSource[]) => {
  const activeCount = dataSources.filter(ds => ds.status === "active").length;
  const errorCount = dataSources.filter(ds => ds.status === "error").length;
  const avgSuccessRate = dataSources.length > 0
    ? dataSources.reduce((sum, ds) => sum + ds.successRate, 0) / dataSources.length
    : 0;
  const totalRequests = dataSources.reduce((sum, ds) => sum + ds.requestCount, 0);

  return [
    {
      title: "数据源概览",
      items: [
        {
          label: "总数据源",
          value: dataSources.length,
          icon: <DatabaseOutlined />,
          color: "#1890ff",
        },
        {
          label: "运行中",
          value: activeCount,
          icon: <CheckCircleOutlined />,
          color: "#52c41a",
        },
      ],
    },
    {
      title: "运行状态",
      items: [
        {
          label: "错误数量",
          value: errorCount,
          icon: <ExclamationCircleOutlined />,
          color: errorCount > 0 ? "#ff4d4f" : "#52c41a",
        },
        {
          label: "今日请求",
          value: totalRequests.toLocaleString(),
          icon: <ApiOutlined />,
          color: "#722ed1",
        },
      ],
    },
    {
      title: "性能指标",
      items: [
        {
          label: "平均成功率",
          value: `${(avgSuccessRate * 100).toFixed(1)}%`,
          icon: <LineChartOutlined />,
          color: avgSuccessRate > 0.8 ? "#52c41a" : "#ff4d4f",
        },
        {
          label: "健康度",
          value: `${Math.round((activeCount / Math.max(dataSources.length, 1)) * 100)}%`,
          icon: <ThunderboltOutlined />,
          color: "#fa8c16",
        },
      ],
    },
  ];
};

const DataSourceManagement: React.FC = () => {
  const { token } = theme.useToken();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [form] = Form.useForm();
  const [testForm] = Form.useForm();
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // 预设的10个数据源配置
  const presetDataSources: Partial<DataSource>[] = [
    {
      name: "中国政府采购网",
      domain: "ccgp.gov.cn",
      url: "http://www.ccgp.gov.cn",
      type: "tender",
      collectionInterval: 60,
      dailyRequestLimit: 200,
    },
    {
      name: "全国公共资源交易平台",
      domain: "ggzy.gov.cn",
      url: "http://deal.ggzy.gov.cn",
      type: "tender",
      collectionInterval: 60,
      dailyRequestLimit: 150,
    },
    {
      name: "中国招标投标公共服务平台",
      domain: "cebpubservice.com",
      url: "http://www.cebpubservice.com",
      type: "tender",
      collectionInterval: 90,
      dailyRequestLimit: 100,
    },
    {
      name: "企查查",
      domain: "qcc.com",
      url: "https://www.qcc.com",
      type: "company",
      collectionInterval: 180,
      dailyRequestLimit: 50,
    },
    {
      name: "天眼查",
      domain: "tianyancha.com",
      url: "https://www.tianyancha.com",
      type: "company",
      collectionInterval: 180,
      dailyRequestLimit: 50,
    },
    {
      name: "爱企查",
      domain: "aiqicha.baidu.com",
      url: "https://aiqicha.baidu.com",
      type: "company",
      collectionInterval: 120,
      dailyRequestLimit: 80,
    },
    {
      name: "国家企业信用信息公示系统",
      domain: "gsxt.gov.cn",
      url: "http://www.gsxt.gov.cn",
      type: "qualification",
      collectionInterval: 240,
      dailyRequestLimit: 30,
    },
    {
      name: "建筑市场监管公共服务平台",
      domain: "jzsc.mohurd.gov.cn",
      url: "https://jzsc.mohurd.gov.cn",
      type: "qualification",
      collectionInterval: 120,
      dailyRequestLimit: 60,
    },
    {
      name: "中国建设工程招标网",
      domain: "chinabidding.com.cn",
      url: "http://www.chinabidding.com.cn",
      type: "tender",
      collectionInterval: 60,
      dailyRequestLimit: 120,
    },
    {
      name: "比地招标网",
      domain: "bidizb.com",
      url: "https://www.bidizb.com",
      type: "tender",
      collectionInterval: 90,
      dailyRequestLimit: 100,
    },
  ];

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = () => {
    setLoading(true);

    // 模拟加载数据源
    const mockDataSources: DataSource[] = presetDataSources.map((preset, index) => ({
      id: `ds-${index + 1}`,
      name: preset.name!,
      domain: preset.domain!,
      url: preset.url!,
      type: preset.type!,
      status: Math.random() > 0.3 ? "active" : Math.random() > 0.5 ? "inactive" : "error",
      lastCollectionTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      nextCollectionTime: new Date(Date.now() + Math.random() * 3600000).toISOString(),
      collectionInterval: preset.collectionInterval!,
      requestCount: Math.floor(Math.random() * preset.dailyRequestLimit!),
      dailyRequestLimit: preset.dailyRequestLimit!,
      successRate: 0.7 + Math.random() * 0.3,
      errorCount: Math.floor(Math.random() * 20),
      ipRotationEnabled: Math.random() > 0.5,
      currentIp: `192.168.1.${100 + index}`,
      availableIps: [`192.168.1.${100 + index}`, `192.168.1.${101 + index}`],
      antiCrawlDetected: Math.random() > 0.7,
      configuration: {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; DataCollector/1.0)" },
        cookies: {},
        userAgents: [],
        requestDelay: 2000 + Math.random() * 3000,
        retryCount: 3,
        timeout: 30000,
        proxyEnabled: true,
        proxyList: [],
        selectors: {},
        filters: [],
      },
      statistics: {
        totalRequests: Math.floor(Math.random() * 5000),
        successfulRequests: Math.floor(Math.random() * 4000),
        failedRequests: Math.floor(Math.random() * 1000),
        averageResponseTime: 1000 + Math.random() * 2000,
        dataCollected: Math.floor(Math.random() * 3000),
        lastWeekTrend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 200)),
        errorTypes: {
          "timeout": Math.floor(Math.random() * 100),
          "blocked": Math.floor(Math.random() * 150),
          "network": Math.floor(Math.random() * 50),
        },
      },
    }));

    setTimeout(() => {
      setDataSources(mockDataSources);
      setLoading(false);
    }, 1000);
  };

  const handleAddDataSource = () => {
    setSelectedDataSource(null);
    form.resetFields();
    setCurrentStep(0);
    setModalVisible(true);
  };

  const handleEditDataSource = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    form.setFieldsValue({
      name: dataSource.name,
      domain: dataSource.domain,
      url: dataSource.url,
      type: dataSource.type,
      collectionInterval: dataSource.collectionInterval,
      dailyRequestLimit: dataSource.dailyRequestLimit,
      ipRotationEnabled: dataSource.ipRotationEnabled,
      requestDelay: dataSource.configuration.requestDelay,
      retryCount: dataSource.configuration.retryCount,
      timeout: dataSource.configuration.timeout,
    });
    setCurrentStep(0);
    setModalVisible(true);
  };

  const handleDeleteDataSource = (id: string) => {
    Modal.confirm({
      title: "确认删除数据源",
      content: "删除后将无法恢复，确定要删除这个数据源吗？",
      okText: "确认删除",
      cancelText: "取消",
      okType: "danger",
      onOk: () => {
        setDataSources(prev => prev.filter(ds => ds.id !== id));
        message.success("数据源删除成功");
      },
    });
  };

  const handleTestConnection = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    testForm.setFieldsValue({
      url: dataSource.url,
      timeout: dataSource.configuration.timeout,
    });
    setTestResult(null);
    setTestModalVisible(true);
  };

  const runConnectionTest = async () => {
    setTestLoading(true);

    // 模拟连接测试
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setTestResult({
        success,
        responseTime: Math.floor(Math.random() * 3000),
        statusCode: success ? 200 : 500,
        message: success ? "连接测试成功" : "连接失败：请求超时或被服务器拒绝",
        headers: success ? {
          "content-type": "text/html; charset=utf-8",
          "server": "nginx/1.18.0",
          "cache-control": "no-cache",
        } : null,
      });
      setTestLoading(false);
    }, 2000);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setDataSources(prev => prev.map(ds =>
      ds.id === id ? { ...ds, status: newStatus } : ds,
    ));
    message.success(`数据源已${newStatus === "active" ? "启动" : "停止"}`);
  };

  const handleBatchOperation = (operation: "start" | "stop") => {
    const targetStatus = operation === "start" ? "inactive" : "active";
    const newStatus = operation === "start" ? "active" : "inactive";
    const count = dataSources.filter(ds => ds.status === targetStatus).length;

    if (count === 0) {
      message.info(`没有可${operation === "start" ? "启动" : "停止"}的数据源`);
      return;
    }

    Modal.confirm({
      title: `批量${operation === "start" ? "启动" : "停止"}数据源`,
      content: `确定要${operation === "start" ? "启动" : "停止"} ${count} 个数据源吗？`,
      onOk: () => {
        setDataSources(prev => prev.map(ds =>
          ds.status === targetStatus ? { ...ds, status: newStatus } : ds,
        ));
        message.success(`已${operation === "start" ? "启动" : "停止"} ${count} 个数据源`);
      },
    });
  };

  const handleSaveDataSource = async (values: any) => {
    try {
      if (selectedDataSource) {
        // 编辑
        setDataSources(prev => prev.map(ds =>
          ds.id === selectedDataSource.id
            ? {
              ...ds,
              ...values,
              configuration: {
                ...ds.configuration,
                requestDelay: values.requestDelay,
                retryCount: values.retryCount,
                timeout: values.timeout,
              },
            }
            : ds,
        ));
        message.success("数据源配置更新成功");
      } else {
        // 新增
        const newDataSource: DataSource = {
          id: `ds-${Date.now()}`,
          ...values,
          status: "inactive",
          lastCollectionTime: new Date().toISOString(),
          nextCollectionTime: new Date(Date.now() + values.collectionInterval * 60000).toISOString(),
          requestCount: 0,
          successRate: 0,
          errorCount: 0,
          currentIp: "192.168.1.100",
          availableIps: ["192.168.1.100"],
          antiCrawlDetected: false,
          configuration: {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; DataCollector/1.0)" },
            cookies: {},
            userAgents: [],
            requestDelay: values.requestDelay || 2000,
            retryCount: values.retryCount || 3,
            timeout: values.timeout || 30000,
            proxyEnabled: true,
            proxyList: [],
            selectors: {},
            filters: [],
          },
          statistics: {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            dataCollected: 0,
            lastWeekTrend: [0, 0, 0, 0, 0, 0, 0],
            errorTypes: {},
          },
        };
        setDataSources(prev => [...prev, newDataSource]);
        message.success("数据源添加成功");
      }
      setModalVisible(false);
    } catch (_error) {
      message.error("保存失败，请检查配置信息");
    }
  };

  const getStatusColor = (status: string) => {
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
      case "maintenance": return <WarningOutlined style={{ ...iconStyle, color: token.colorWarning }} />;
      default: return <InfoCircleOutlined style={iconStyle} />;
    }
  };

  const columns = [
    {
      title: "数据源信息",
      dataIndex: "name",
      key: "name",
      width: 220,
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
      width: 100,
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
              status={getStatusColor(status) as any}
              text={
                status === "active" ? "运行中" :
                  status === "inactive" ? "已停止" :
                    status === "error" ? "错误" : "维护中"
              }
            />
          </Flex>
          {record.antiCrawlDetected && (
            <Flex align="center" gap={4}>
              <SafetyOutlined style={{ fontSize: "12px", color: token.colorError }} />
              <Text type="danger" style={{ fontSize: "11px" }}>反爬虫检测</Text>
            </Flex>
          )}
        </Space>
      ),
    },
    {
      title: "请求统计",
      key: "requests",
      width: 140,
      render: (_: any, record: DataSource) => {
        const percentage = (record.requestCount / record.dailyRequestLimit) * 100;
        return (
          <div>
            <div style={{ marginBottom: 4, fontSize: "12px" }}>
              {record.requestCount.toLocaleString()}/{record.dailyRequestLimit.toLocaleString()}
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
      width: 120,
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
      title: "采集间隔",
      dataIndex: "collectionInterval",
      key: "collectionInterval",
      width: 100,
      render: (interval: number) => (
        <Text style={{ fontSize: "12px" }}>{interval}分钟</Text>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 220,
      fixed: "right" as const,
      render: (_: any, record: DataSource) => (
        <Space size="small">
          <Button
            size="small"
            type={record.status === "active" ? "default" : "primary"}
            icon={record.status === "active" ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleStatus(record.id, record.status)}
          >
            {record.status === "active" ? "停止" : "启动"}
          </Button>
          <Button
            size="small"
            icon={<ExperimentOutlined />}
            onClick={() => handleTestConnection(record)}
          >
            测试
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditDataSource(record)}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDataSource(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const statisticCards = getStatisticCards(dataSources);

  return (
    <div style={{ padding: "24px", backgroundColor: token.colorBgLayout, minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0, marginBottom: "8px" }}>数据源管理</Title>
        <Text type="secondary">管理和配置数据采集源，支持多种类型的数据源配置和监控</Text>
      </div>

      {/* 统计概览 */}
      <div style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]}>
          {statisticCards.map((cardGroup, groupIndex) => (
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

      {/* 系统警告 */}
      {dataSources.filter(ds => ds.status === "error").length > 0 && (
        <Alert
          message="系统状态警告"
          description={`检测到 ${dataSources.filter(ds => ds.status === "error").length} 个数据源异常，请及时处理以确保数据采集正常运行`}
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

      {/* 操作按钮 */}
      <Card style={{ marginBottom: "16px" }}>
        <Flex justify="space-between" align="center">
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddDataSource}
            >
              添加数据源
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadDataSources}
              loading={loading}
            >
              刷新数据
            </Button>
          </Space>
          <Space>
            <Button
              icon={<PlayCircleOutlined />}
              onClick={() => handleBatchOperation("start")}
            >
              批量启动
            </Button>
            <Button
              icon={<PauseCircleOutlined />}
              onClick={() => handleBatchOperation("stop")}
            >
              批量停止
            </Button>
          </Space>
        </Flex>
      </Card>

      {/* 数据源列表 */}
      <Card
        style={{
          borderRadius: token.borderRadius,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <Table
          columns={columns}
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
      </Card>

      {/* 配置表单模态框 */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <DatabaseOutlined />
            {selectedDataSource ? "编辑数据源" : "添加数据源"}
          </Flex>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <div style={{ marginBottom: "24px" }}>
          <Steps current={currentStep} size="small">
            <Step title="基本信息" />
            <Step title="采集配置" />
            <Step title="高级设置" />
          </Steps>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveDataSource}
        >
          {currentStep === 0 && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="数据源名称"
                    rules={[{ required: true, message: "请输入数据源名称" }]}
                  >
                    <Input placeholder="请输入数据源名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="domain"
                    label="域名"
                    rules={[{ required: true, message: "请输入域名" }]}
                  >
                    <Input placeholder="example.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="url"
                label="URL地址"
                rules={[{ required: true, message: "请输入URL地址" }]}
              >
                <Input placeholder="https://example.com" />
              </Form.Item>

              <Form.Item
                name="type"
                label="数据源类型"
                rules={[{ required: true, message: "请选择数据源类型" }]}
              >
                <Select placeholder="请选择类型">
                  <Option value="tender">招标信息</Option>
                  <Option value="qualification">资质信息</Option>
                  <Option value="company">企业信息</Option>
                  <Option value="news">新闻资讯</Option>
                  <Option value="other">其他类型</Option>
                </Select>
              </Form.Item>
            </>
          )}

          {currentStep === 1 && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="collectionInterval"
                    label="采集间隔（分钟）"
                    rules={[{ required: true, message: "请输入采集间隔" }]}
                  >
                    <InputNumber
                      min={1}
                      max={1440}
                      placeholder="60"
                      style={{ width: "100%" }}
                      addonAfter="分钟"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dailyRequestLimit"
                    label="日请求限制"
                    rules={[{ required: true, message: "请输入日请求限制" }]}
                  >
                    <InputNumber
                      min={1}
                      placeholder="200"
                      style={{ width: "100%" }}
                      addonAfter="次/天"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="requestDelay"
                    label="请求延迟（毫秒）"
                  >
                    <InputNumber
                      min={0}
                      placeholder="2000"
                      style={{ width: "100%" }}
                      addonAfter="毫秒"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="retryCount"
                    label="重试次数"
                  >
                    <InputNumber
                      min={0}
                      max={10}
                      placeholder="3"
                      style={{ width: "100%" }}
                      addonAfter="次"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {currentStep === 2 && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="timeout"
                    label="超时时间（毫秒）"
                  >
                    <InputNumber
                      min={1000}
                      max={300000}
                      placeholder="30000"
                      style={{ width: "100%" }}
                      addonAfter="毫秒"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="ipRotationEnabled"
                    label="启用IP轮换"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Divider />

          <Flex justify="space-between">
            <Space>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  上一步
                </Button>
              )}
            </Space>
            <Space>
              {currentStep < 2 ? (
                <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                  下一步
                </Button>
              ) : (
                <>
                  <Button onClick={() => setModalVisible(false)}>
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {selectedDataSource ? "更新配置" : "添加数据源"}
                  </Button>
                </>
              )}
            </Space>
          </Flex>
        </Form>
      </Modal>

      {/* 连接测试模态框 */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <ExperimentOutlined />
            连接测试
          </Flex>
        }
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTestModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="test"
            type="primary"
            loading={testLoading}
            onClick={runConnectionTest}
          >
            开始测试
          </Button>,
        ]}
        width={600}
      >
        {selectedDataSource && (
          <div>
            <Descriptions
              title="测试目标"
              size="small"
              column={1}
              style={{ marginBottom: "16px" }}
            >
              <Descriptions.Item label="数据源">{selectedDataSource.name}</Descriptions.Item>
              <Descriptions.Item label="URL">{selectedDataSource.url}</Descriptions.Item>
              <Descriptions.Item label="域名">{selectedDataSource.domain}</Descriptions.Item>
            </Descriptions>

            {testResult && (
              <Alert
                message={testResult.success ? "连接测试成功" : "连接测试失败"}
                description={
                  <div>
                    <p><strong>状态码：</strong>{testResult.statusCode}</p>
                    <p><strong>响应时间：</strong>{testResult.responseTime}ms</p>
                    <p><strong>详细信息：</strong>{testResult.message}</p>
                    {testResult.headers && (
                      <div>
                        <p><strong>响应头：</strong></p>
                        <pre style={{ fontSize: "12px", background: "#f5f5f5", padding: "8px", borderRadius: "4px" }}>
                          {JSON.stringify(testResult.headers, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                }
                type={testResult.success ? "success" : "error"}
                showIcon
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DataSourceManagement;
