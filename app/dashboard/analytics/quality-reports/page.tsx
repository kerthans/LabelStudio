"use client";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  TrophyOutlined,
  WarningOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface QualityReport {
  id: string;
  reportTitle: string;
  reportType: "daily" | "weekly" | "monthly" | "custom";
  generatedDate: string;
  coveragePeriod: string;
  overallScore: number;
  totalTasks: number;
  passedTasks: number;
  failedTasks: number;
  avgAccuracy: number;
  avgConsistency: number;
  criticalIssues: number;
  status: "completed" | "pending" | "draft";
  generatedBy: string;
}

interface QualityIssue {
  id: string;
  issueType: "accuracy" | "consistency" | "completeness" | "guideline";
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  affectedTasks: number;
  detectedDate: string;
  assignedTo: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  resolution?: string;
}


const QualityReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [reportType, setReportType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [_selectedReport, setSelectedReport] = useState<string | null>(null);

  // 质量报告概览数据
  const qualityOverview = {
    totalReports: 156,
    completedReports: 142,
    pendingReports: 14,
    avgQualityScore: 92.8,
    criticalIssuesResolved: 23,
    improvementRate: 15.6
  };

  // 质量报告列表数据
  const qualityReports: QualityReport[] = [
    {
      id: "qr_001",
      reportTitle: "2024年1月第3周质量报告",
      reportType: "weekly",
      generatedDate: "2024-01-21",
      coveragePeriod: "2024-01-15 至 2024-01-21",
      overallScore: 94.2,
      totalTasks: 1247,
      passedTasks: 1175,
      failedTasks: 72,
      avgAccuracy: 96.1,
      avgConsistency: 92.3,
      criticalIssues: 3,
      status: "completed",
      generatedBy: "系统自动生成"
    },
    {
      id: "qr_002",
      reportTitle: "医学影像标注质量专项报告",
      reportType: "custom",
      generatedDate: "2024-01-20",
      coveragePeriod: "2024-01-01 至 2024-01-20",
      overallScore: 97.5,
      totalTasks: 856,
      passedTasks: 834,
      failedTasks: 22,
      avgAccuracy: 98.2,
      avgConsistency: 96.8,
      criticalIssues: 1,
      status: "completed",
      generatedBy: "张质量经理"
    },
    {
      id: "qr_003",
      reportTitle: "2024年1月月度质量报告",
      reportType: "monthly",
      generatedDate: "2024-01-19",
      coveragePeriod: "2024-01-01 至 2024-01-31",
      overallScore: 91.7,
      totalTasks: 3421,
      passedTasks: 3138,
      failedTasks: 283,
      avgAccuracy: 93.8,
      avgConsistency: 89.6,
      criticalIssues: 8,
      status: "pending",
      generatedBy: "系统自动生成"
    }
  ];

  // 质量问题数据
  const qualityIssues: QualityIssue[] = [
    {
      id: "qi_001",
      issueType: "accuracy",
      severity: "critical",
      description: "医学影像边界标注精度不足，影响模型训练效果",
      affectedTasks: 45,
      detectedDate: "2024-01-20",
      assignedTo: "张医师",
      status: "in-progress",
      resolution: "正在重新标注相关任务"
    },
    {
      id: "qi_002",
      issueType: "consistency",
      severity: "high",
      description: "不同标注员对同类目标的标注标准不一致",
      affectedTasks: 128,
      detectedDate: "2024-01-19",
      assignedTo: "李质量专员",
      status: "resolved",
      resolution: "已更新标注指南并进行培训"
    },
    {
      id: "qi_003",
      issueType: "completeness",
      severity: "medium",
      description: "部分任务缺少必要的属性标注",
      affectedTasks: 67,
      detectedDate: "2024-01-18",
      assignedTo: "王标注员",
      status: "open"
    }
  ];

  const getReportTypeColor = (type: string) => {
    const colors = {
      daily: "#1890ff",
      weekly: "#52c41a",
      monthly: "#722ed1",
      custom: "#fa8c16"
    };
    return colors[type as keyof typeof colors] || "#d9d9d9";
  };

  const getReportTypeText = (type: string) => {
    const texts = {
      daily: "日报",
      weekly: "周报",
      monthly: "月报",
      custom: "专项"
    };
    return texts[type as keyof typeof texts] || "未知";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "#52c41a",
      pending: "#faad14",
      draft: "#d9d9d9"
    };
    return colors[status as keyof typeof colors] || "#d9d9d9";
  };

  const getStatusText = (status: string) => {
    const texts = {
      completed: "已完成",
      pending: "待处理",
      draft: "草稿"
    };
    return texts[status as keyof typeof texts] || "未知";
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "#ff4d4f",
      high: "#fa8c16",
      medium: "#faad14",
      low: "#52c41a"
    };
    return colors[severity as keyof typeof colors] || "#d9d9d9";
  };

  const getSeverityText = (severity: string) => {
    const texts = {
      critical: "严重",
      high: "高",
      medium: "中",
      low: "低"
    };
    return texts[severity as keyof typeof texts] || "未知";
  };

  const getIssueTypeIcon = (type: string) => {
    const icons = {
      accuracy: <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />,
      consistency: <WarningOutlined style={{ color: "#fa8c16" }} />,
      completeness: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
      guideline: <FileTextOutlined style={{ color: "#722ed1" }} />
    };
    return icons[type as keyof typeof icons] || <InfoCircleOutlined />;
  };

  const reportColumns: ColumnsType<QualityReport> = [
    {
      title: "报告信息",
      key: "reportInfo",
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{record.reportTitle}</div>
          <div style={{ marginBottom: 4 }}>
            <Tag color={getReportTypeColor(record.reportType)}>
              {getReportTypeText(record.reportType)}
            </Tag>
            <Tag color={getStatusColor(record.status)}>
              {getStatusText(record.status)}
            </Tag>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            覆盖期间: {record.coveragePeriod}
          </Text>
        </div>
      )
    },
    {
      title: "质量评分",
      key: "qualityScore",
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <Progress
            type="circle"
            percent={record.overallScore}
            size={60}
            strokeColor={record.overallScore >= 95 ? "#52c41a" : record.overallScore >= 90 ? "#faad14" : "#ff4d4f"}
            format={() => `${record.overallScore}%`}
          />
        </div>
      )
    },
    {
      title: "任务统计",
      key: "taskStats",
      width: 150,
      render: (_, record) => {
        const passRate = (record.passedTasks / record.totalTasks) * 100;
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>总计: {record.totalTasks}</Text>
            </div>
            <div style={{ marginBottom: 4 }}>
              <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 4 }} />
              <Text>通过: {record.passedTasks}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <CloseCircleOutlined style={{ color: "#ff4d4f", marginRight: 4 }} />
              <Text>失败: {record.failedTasks}</Text>
            </div>
            <Progress
              percent={passRate}
              size="small"
              strokeColor="#52c41a"
              format={() => `${passRate.toFixed(1)}%`}
            />
          </div>
        );
      }
    },
    {
      title: "质量指标",
      key: "qualityMetrics",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary">准确率: </Text>
            <Text strong style={{ color: record.avgAccuracy >= 95 ? "#52c41a" : "#faad14" }}>
              {record.avgAccuracy}%
            </Text>
          </div>
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary">一致性: </Text>
            <Text strong style={{ color: record.avgConsistency >= 90 ? "#52c41a" : "#faad14" }}>
              {record.avgConsistency}%
            </Text>
          </div>
          <div>
            <Text type="secondary">严重问题: </Text>
            <Text strong style={{ color: record.criticalIssues === 0 ? "#52c41a" : "#ff4d4f" }}>
              {record.criticalIssues}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: "生成信息",
      key: "generationInfo",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary">生成日期:</Text>
            <br />
            <Text>{dayjs(record.generatedDate).format("YYYY-MM-DD")}</Text>
          </div>
          <div>
            <Text type="secondary">生成者:</Text>
            <br />
            <Text>{record.generatedBy}</Text>
          </div>
        </div>
      )
    },
    {
      title: "操作",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button size="small" type="link" onClick={() => setSelectedReport(record.id)}>
            查看详情
          </Button>
          <Button size="small" type="link" icon={<DownloadOutlined />}>
            下载
          </Button>
          <Button size="small" type="link" icon={<ShareAltOutlined />}>
            分享
          </Button>
        </Space>
      )
    }
  ];

  const issueColumns: ColumnsType<QualityIssue> = [
    {
      title: "问题类型",
      key: "issueType",
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            {getIssueTypeIcon(record.issueType)}
            <span style={{ marginLeft: 8 }}>{record.issueType}</span>
          </div>
          <Tag color={getSeverityColor(record.severity)}>
            {getSeverityText(record.severity)}
          </Tag>
        </div>
      )
    },
    {
      title: "问题描述",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (description) => (
        <Tooltip title={description}>
          <Text ellipsis style={{ maxWidth: 280 }}>{description}</Text>
        </Tooltip>
      )
    },
    {
      title: "影响范围",
      dataIndex: "affectedTasks",
      key: "affectedTasks",
      width: 100,
      render: (count) => (
        <Text strong style={{ color: count > 100 ? "#ff4d4f" : count > 50 ? "#faad14" : "#52c41a" }}>
          {count} 个任务
        </Text>
      )
    },
    {
      title: "负责人",
      dataIndex: "assignedTo",
      key: "assignedTo",
      width: 100
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => {
        const statusConfig = {
          open: { color: "#ff4d4f", text: "待处理" },
          "in-progress": { color: "#faad14", text: "处理中" },
          resolved: { color: "#52c41a", text: "已解决" },
          closed: { color: "#d9d9d9", text: "已关闭" }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: "#d9d9d9", text: "未知" };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: "检测日期",
      dataIndex: "detectedDate",
      key: "detectedDate",
      width: 120,
      render: (date) => dayjs(date).format("MM-DD")
    }
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          质量报告中心
        </Title>
        <Text type="secondary">
          全面的质量分析报告，助力持续改进和决策支持
        </Text>
      </div>

      {/* 筛选控制 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Space>
              <CalendarOutlined />
              <Select
                value={timeRange}
                onChange={setTimeRange}
                style={{ width: 120 }}
              >
                <Select.Option value="7d">近7天</Select.Option>
                <Select.Option value="30d">近30天</Select.Option>
                <Select.Option value="90d">近90天</Select.Option>
                <Select.Option value="custom">自定义</Select.Option>
              </Select>
              {timeRange === "custom" && (
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  style={{ width: 240 }}
                />
              )}
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 150 }}
              placeholder="报告类型"
            >
              <Select.Option value="all">全部类型</Select.Option>
              <Select.Option value="daily">日报</Select.Option>
              <Select.Option value="weekly">周报</Select.Option>
              <Select.Option value="monthly">月报</Select.Option>
              <Select.Option value="custom">专项报告</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<PrinterOutlined />}>打印报告</Button>
              <Button icon={<DownloadOutlined />}>批量下载</Button>
              <Button type="primary" icon={<FileTextOutlined />}>生成报告</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 质量概览统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="总报告数"
              value={qualityOverview.totalReports}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="已完成"
              value={qualityOverview.completedReports}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="待处理"
              value={qualityOverview.pendingReports}
              prefix={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="平均质量分"
              value={qualityOverview.avgQualityScore}
              prefix={<TrophyOutlined style={{ color: "#722ed1" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="问题解决"
              value={qualityOverview.criticalIssuesResolved}
              prefix={<CheckCircleOutlined style={{ color: "#13c2c2" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="改进率"
              value={qualityOverview.improvementRate}
              prefix={<LineChartOutlined style={{ color: "#eb2f96" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 质量趋势和问题分布 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>质量趋势分析</span>
              </Space>
            }
            extra={
              <Select defaultValue="overall" style={{ width: 120 }}>
                <Select.Option value="overall">综合评分</Select.Option>
                <Select.Option value="accuracy">准确率</Select.Option>
                <Select.Option value="consistency">一致性</Select.Option>
                <Select.Option value="completeness">完整性</Select.Option>
              </Select>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <LineChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>质量趋势图表</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>展示质量指标变化趋势</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>问题类型分布</span>
              </Space>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <PieChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>问题分布图</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>准确性、一致性、完整性</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 质量报告列表 */}
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>质量报告列表</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={reportColumns}
          dataSource={qualityReports}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          size="middle"
        />
      </Card>

      {/* 质量问题跟踪 */}
      <Card
        title={
          <Space>
            <WarningOutlined />
            <span>质量问题跟踪</span>
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary">按严重程度排序</Text>
            <Tooltip title="实时更新问题状态">
              <InfoCircleOutlined style={{ color: "#999" }} />
            </Tooltip>
          </Space>
        }
      >
        <Table
          columns={issueColumns}
          dataSource={qualityIssues}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default QualityReportsPage;
