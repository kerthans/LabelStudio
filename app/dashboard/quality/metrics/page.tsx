"use client";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  CalendarOutlined,
  DownloadOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
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
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface AnnotatorPerformance {
  id: string;
  name: string;
  tasksCompleted: number;
  avgAccuracy: number;
  avgConsistency: number;
  avgSpeed: number;
  qualityTrend: "up" | "down" | "stable";
  level: "expert" | "senior" | "intermediate" | "junior";
}

const QualityMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [metricType, setMetricType] = useState<string>("accuracy");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 核心质量指标
  const coreMetrics = {
    overallAccuracy: { value: 94.2, change: 2.1, trend: "up" },
    avgConsistency: { value: 91.8, change: -0.5, trend: "down" },
    completenessRate: { value: 97.5, change: 1.3, trend: "up" },
    efficiencyScore: { value: 88.9, change: 3.2, trend: "up" },
  };

  // 标注员表现数据
  const annotatorPerformance: AnnotatorPerformance[] = [
    {
      id: "ann_001",
      name: "张医师",
      tasksCompleted: 156,
      avgAccuracy: 97.2,
      avgConsistency: 94.8,
      avgSpeed: 12.5,
      qualityTrend: "up",
      level: "expert",
    },
    {
      id: "ann_002",
      name: "李语言学家",
      tasksCompleted: 134,
      avgAccuracy: 95.6,
      avgConsistency: 92.3,
      avgSpeed: 15.2,
      qualityTrend: "stable",
      level: "senior",
    },
    {
      id: "ann_003",
      name: "王工程师",
      tasksCompleted: 98,
      avgAccuracy: 93.1,
      avgConsistency: 89.7,
      avgSpeed: 18.9,
      qualityTrend: "down",
      level: "intermediate",
    },
  ];

  const getLevelColor = (level: string) => {
    const colors = {
      expert: "#722ed1",
      senior: "#1890ff",
      intermediate: "#52c41a",
      junior: "#faad14",
    };
    return colors[level as keyof typeof colors] || "#d9d9d9";
  };

  const getLevelText = (level: string) => {
    const texts = {
      expert: "专家",
      senior: "高级",
      intermediate: "中级",
      junior: "初级",
    };
    return texts[level as keyof typeof texts] || "未知";
  };

  const getTrendIcon = (trend: string, _change: number) => {
    if (trend === "up") {
      return <ArrowUpOutlined style={{ color: "#52c41a" }} />;
    } else if (trend === "down") {
      return <ArrowDownOutlined style={{ color: "#ff4d4f" }} />;
    }
    return null;
  };

  const columns: ColumnsType<AnnotatorPerformance> = [
    {
      title: "标注员",
      key: "annotator",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{record.name}</div>
          <Tag color={getLevelColor(record.level)} style={{ fontSize: 11 }}>
            {getLevelText(record.level)}
          </Tag>
        </div>
      ),
    },
    {
      title: "完成任务",
      dataIndex: "tasksCompleted",
      key: "tasksCompleted",
      width: 100,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "准确率",
      dataIndex: "avgAccuracy",
      key: "avgAccuracy",
      width: 120,
      render: (value) => (
        <div>
          <Progress
            percent={value}
            size="small"
            strokeColor={value >= 95 ? "#52c41a" : value >= 90 ? "#faad14" : "#ff4d4f"}
          />
          <Text style={{ fontSize: 12 }}>{value}%</Text>
        </div>
      ),
    },
    {
      title: "一致性",
      dataIndex: "avgConsistency",
      key: "avgConsistency",
      width: 120,
      render: (value) => (
        <div>
          <Progress
            percent={value}
            size="small"
            strokeColor={value >= 95 ? "#52c41a" : value >= 90 ? "#faad14" : "#ff4d4f"}
          />
          <Text style={{ fontSize: 12 }}>{value}%</Text>
        </div>
      ),
    },
    {
      title: "效率 (项/小时)",
      dataIndex: "avgSpeed",
      key: "avgSpeed",
      width: 120,
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: "趋势",
      dataIndex: "qualityTrend",
      key: "qualityTrend",
      width: 80,
      render: (trend) => {
        const icons = {
          up: <ArrowUpOutlined style={{ color: "#52c41a" }} />,
          down: <ArrowDownOutlined style={{ color: "#ff4d4f" }} />,
          stable: <span style={{ color: "#1890ff" }}>—</span>,
        };
        return icons[trend as keyof typeof icons];
      },
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          质量指标分析
        </Title>
        <Text type="secondary">
          深度分析标注质量趋势，为质量改进提供数据支撑
        </Text>
      </div>

      {/* 时间筛选和操作 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
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
          <Col xs={24} sm={12} md={8}>
            <Select
              value={metricType}
              onChange={setMetricType}
              style={{ width: 150 }}
              placeholder="选择指标类型"
            >
              <Select.Option value="accuracy">准确性分析</Select.Option>
              <Select.Option value="consistency">一致性分析</Select.Option>
              <Select.Option value="efficiency">效率分析</Select.Option>
              <Select.Option value="comprehensive">综合分析</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 核心指标概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
                  整体准确率
                  <Tooltip title="所有标注任务的平均准确率">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: "#999" }} />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#1890ff", marginBottom: 4 }}>
                  {coreMetrics.overallAccuracy.value}%
                </div>
                <div style={{ fontSize: 12, color: coreMetrics.overallAccuracy.trend === "up" ? "#52c41a" : "#ff4d4f" }}>
                  {getTrendIcon(coreMetrics.overallAccuracy.trend, coreMetrics.overallAccuracy.change)}
                  <span style={{ marginLeft: 4 }}>较昨日 {coreMetrics.overallAccuracy.change > 0 ? "+" : ""}{coreMetrics.overallAccuracy.change}%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
                  平均一致性
                  <Tooltip title="标注员之间的一致性程度">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: "#999" }} />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#52c41a", marginBottom: 4 }}>
                  {coreMetrics.avgConsistency.value}%
                </div>
                <div style={{ fontSize: 12, color: coreMetrics.avgConsistency.trend === "up" ? "#52c41a" : "#ff4d4f" }}>
                  {getTrendIcon(coreMetrics.avgConsistency.trend, coreMetrics.avgConsistency.change)}
                  <span style={{ marginLeft: 4 }}>较昨日 {coreMetrics.avgConsistency.change > 0 ? "+" : ""}{coreMetrics.avgConsistency.change}%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
                  完整性评分
                  <Tooltip title="标注任务的完整性程度">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: "#999" }} />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#722ed1", marginBottom: 4 }}>
                  {coreMetrics.completenessRate.value}%
                </div>
                <div style={{ fontSize: 12, color: coreMetrics.completenessRate.trend === "up" ? "#52c41a" : "#ff4d4f" }}>
                  {getTrendIcon(coreMetrics.completenessRate.trend, coreMetrics.completenessRate.change)}
                  <span style={{ marginLeft: 4 }}>较昨日 {coreMetrics.completenessRate.change > 0 ? "+" : ""}{coreMetrics.completenessRate.change}%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>
                  效率评分
                  <Tooltip title="标注效率的综合评估">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: "#999" }} />
                  </Tooltip>
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, color: "#fa8c16", marginBottom: 4 }}>
                  {coreMetrics.efficiencyScore.value}%
                </div>
                <div style={{ fontSize: 12, color: coreMetrics.efficiencyScore.trend === "up" ? "#52c41a" : "#ff4d4f" }}>
                  {getTrendIcon(coreMetrics.efficiencyScore.trend, coreMetrics.efficiencyScore.change)}
                  <span style={{ marginLeft: 4 }}>较昨日 {coreMetrics.efficiencyScore.change > 0 ? "+" : ""}{coreMetrics.efficiencyScore.change}%</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 质量趋势图表 */}
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
              <Select value={metricType} onChange={setMetricType} style={{ width: 120 }}>
                <Select.Option value="accuracy">准确率</Select.Option>
                <Select.Option value="consistency">一致性</Select.Option>
                <Select.Option value="completeness">完整性</Select.Option>
                <Select.Option value="efficiency">效率</Select.Option>
              </Select>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <LineChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>质量趋势图表</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>展示{metricType === "accuracy" ? "准确率" : metricType === "consistency" ? "一致性" : metricType === "completeness" ? "完整性" : "效率"}变化趋势</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>质量分布</span>
              </Space>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <PieChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>质量等级分布</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>优秀、良好、合格、待改进</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 标注员表现排行 */}
      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>标注员表现分析</span>
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary">按质量评分排序</Text>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={annotatorPerformance}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default QualityMetrics;
