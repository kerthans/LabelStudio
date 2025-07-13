"use client";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
  RocketOutlined,
  ThunderboltOutlined,
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
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface EfficiencyMetrics {
  id: string;
  annotatorName: string;
  department: string;
  avgTaskTime: number;
  tasksPerHour: number;
  qualityEfficiencyRatio: number;
  timeDistribution: {
    annotation: number;
    review: number;
    correction: number;
    break: number;
  };
  efficiencyTrend: "up" | "down" | "stable";
  efficiencyChange: number;
  bottleneckType: "speed" | "quality" | "focus" | "none";
  improvementPotential: number;
}

interface TaskTypeEfficiency {
  taskType: string;
  avgTime: number;
  standardTime: number;
  efficiencyRate: number;
  difficultyLevel: "easy" | "medium" | "hard" | "expert";
  completionCount: number;
}

const EfficiencyAnalysisPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [analysisType, setAnalysisType] = useState<string>("individual");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [metricFocus, setMetricFocus] = useState<string>("speed");

  // 整体效率指标
  const overallEfficiency = {
    avgTasksPerHour: 5.8,
    avgTaskTime: 10.3,
    efficiencyImprovement: 12.5,
    timeUtilization: 87.2,
    qualityEfficiencyBalance: 92.1,
    bottleneckReduction: 8.3,
  };

  // 个人效率数据
  const efficiencyMetrics: EfficiencyMetrics[] = [
    {
      id: "eff_001",
      annotatorName: "张医师",
      department: "医学影像",
      avgTaskTime: 8.5,
      tasksPerHour: 7.1,
      qualityEfficiencyRatio: 96.8,
      timeDistribution: {
        annotation: 75,
        review: 15,
        correction: 8,
        break: 2,
      },
      efficiencyTrend: "up",
      efficiencyChange: 15.2,
      bottleneckType: "none",
      improvementPotential: 8.5,
    },
    {
      id: "eff_002",
      annotatorName: "李语言学家",
      department: "自然语言",
      avgTaskTime: 12.3,
      tasksPerHour: 4.9,
      qualityEfficiencyRatio: 94.2,
      timeDistribution: {
        annotation: 68,
        review: 20,
        correction: 10,
        break: 2,
      },
      efficiencyTrend: "stable",
      efficiencyChange: 2.1,
      bottleneckType: "quality",
      improvementPotential: 12.3,
    },
    {
      id: "eff_003",
      annotatorName: "王工程师",
      department: "计算机视觉",
      avgTaskTime: 15.8,
      tasksPerHour: 3.8,
      qualityEfficiencyRatio: 89.5,
      timeDistribution: {
        annotation: 60,
        review: 25,
        correction: 13,
        break: 2,
      },
      efficiencyTrend: "down",
      efficiencyChange: -5.7,
      bottleneckType: "speed",
      improvementPotential: 18.9,
    },
  ];

  // 任务类型效率数据
  const taskTypeEfficiency: TaskTypeEfficiency[] = [
    {
      taskType: "图像分类",
      avgTime: 5.2,
      standardTime: 6.0,
      efficiencyRate: 115.4,
      difficultyLevel: "easy",
      completionCount: 1247,
    },
    {
      taskType: "目标检测",
      avgTime: 12.8,
      standardTime: 15.0,
      efficiencyRate: 117.2,
      difficultyLevel: "medium",
      completionCount: 856,
    },
    {
      taskType: "语义分割",
      avgTime: 28.5,
      standardTime: 25.0,
      efficiencyRate: 87.7,
      difficultyLevel: "hard",
      completionCount: 324,
    },
    {
      taskType: "文本标注",
      avgTime: 8.9,
      standardTime: 10.0,
      efficiencyRate: 112.4,
      difficultyLevel: "medium",
      completionCount: 1089,
    },
  ];

  const getBottleneckColor = (type: string) => {
    const colors = {
      speed: "#ff4d4f",
      quality: "#faad14",
      focus: "#722ed1",
      none: "#52c41a",
    };
    return colors[type as keyof typeof colors] || "#d9d9d9";
  };

  const getBottleneckText = (type: string) => {
    const texts = {
      speed: "速度瓶颈",
      quality: "质量瓶颈",
      focus: "专注度",
      none: "无瓶颈",
    };
    return texts[type as keyof typeof texts] || "未知";
  };

  const getDifficultyColor = (level: string) => {
    const colors = {
      easy: "#52c41a",
      medium: "#1890ff",
      hard: "#faad14",
      expert: "#ff4d4f",
    };
    return colors[level as keyof typeof colors] || "#d9d9d9";
  };

  const getDifficultyText = (level: string) => {
    const texts = {
      easy: "简单",
      medium: "中等",
      hard: "困难",
      expert: "专家级",
    };
    return texts[level as keyof typeof texts] || "未知";
  };

  const getTrendIcon = (trend: string, _change: number) => {
    if (trend === "up") {
      return <ArrowUpOutlined style={{ color: "#52c41a" }} />;
    } else if (trend === "down") {
      return <ArrowDownOutlined style={{ color: "#ff4d4f" }} />;
    }
    return <span style={{ color: "#1890ff" }}>—</span>;
  };

  const efficiencyColumns: ColumnsType<EfficiencyMetrics> = [
    {
      title: "标注员",
      key: "annotator",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{record.annotatorName}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.department}</Text>
        </div>
      ),
    },
    {
      title: "效率指标",
      key: "efficiency",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <RocketOutlined style={{ marginRight: 4, color: "#1890ff" }} />
            <Text strong>{record.tasksPerHour}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> 项/小时</Text>
          </div>
          <div>
            <ClockCircleOutlined style={{ marginRight: 4, color: "#722ed1" }} />
            <Text>{record.avgTaskTime}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> 分钟/项</Text>
          </div>
        </div>
      ),
    },
    {
      title: "质效比",
      dataIndex: "qualityEfficiencyRatio",
      key: "qualityEfficiencyRatio",
      width: 120,
      render: (value) => (
        <div>
          <Progress
            type="circle"
            percent={value}
            size={50}
            strokeColor={value >= 95 ? "#52c41a" : value >= 90 ? "#faad14" : "#ff4d4f"}
            format={() => `${value}%`}
          />
        </div>
      ),
    },
    {
      title: "时间分配",
      key: "timeDistribution",
      width: 200,
      render: (_, record) => {
        const { timeDistribution } = record;
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>标注</span>
                <span>{timeDistribution.annotation}%</span>
              </div>
              <Progress
                percent={timeDistribution.annotation}
                size="small"
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>审核</span>
                <span>{timeDistribution.review}%</span>
              </div>
              <Progress
                percent={timeDistribution.review}
                size="small"
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span>修正</span>
                <span>{timeDistribution.correction}%</span>
              </div>
              <Progress
                percent={timeDistribution.correction}
                size="small"
                strokeColor="#faad14"
                showInfo={false}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: "效率趋势",
      key: "trend",
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 4 }}>
            {getTrendIcon(record.efficiencyTrend, record.efficiencyChange)}
          </div>
          <Text
            style={{
              fontSize: 12,
              color: record.efficiencyTrend === "up" ? "#52c41a" : record.efficiencyTrend === "down" ? "#ff4d4f" : "#1890ff",
            }}
          >
            {record.efficiencyChange > 0 ? "+" : ""}{record.efficiencyChange}%
          </Text>
        </div>
      ),
    },
    {
      title: "瓶颈分析",
      key: "bottleneck",
      width: 120,
      render: (_, record) => (
        <div>
          <Tag color={getBottleneckColor(record.bottleneckType)}>
            {getBottleneckText(record.bottleneckType)}
          </Tag>
          <div style={{ marginTop: 4, fontSize: 12 }}>
            <Text type="secondary">提升空间: {record.improvementPotential}%</Text>
          </div>
        </div>
      ),
    },
  ];

  const taskTypeColumns: ColumnsType<TaskTypeEfficiency> = [
    {
      title: "任务类型",
      dataIndex: "taskType",
      key: "taskType",
      width: 120,
      render: (taskType) => (
        <Text strong>{taskType}</Text>
      ),
    },
    {
      title: "难度等级",
      dataIndex: "difficultyLevel",
      key: "difficultyLevel",
      width: 100,
      render: (level) => (
        <Tag color={getDifficultyColor(level)}>
          {getDifficultyText(level)}
        </Tag>
      ),
    },
    {
      title: "平均用时",
      key: "timing",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 2 }}>
            <Text strong>{record.avgTime}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> 分钟</Text>
          </div>
          <div style={{ fontSize: 12 }}>
            <Text type="secondary">标准: {record.standardTime} 分钟</Text>
          </div>
        </div>
      ),
    },
    {
      title: "效率率",
      dataIndex: "efficiencyRate",
      key: "efficiencyRate",
      width: 120,
      render: (value) => (
        <div>
          <Progress
            percent={Math.min(value, 150)}
            size="small"
            strokeColor={value >= 110 ? "#52c41a" : value >= 100 ? "#1890ff" : value >= 90 ? "#faad14" : "#ff4d4f"}
          />
          <Text
            style={{
              fontSize: 12,
              color: value >= 110 ? "#52c41a" : value >= 100 ? "#1890ff" : "#ff4d4f",
            }}
          >
            {value}%
          </Text>
        </div>
      ),
    },
    {
      title: "完成数量",
      dataIndex: "completionCount",
      key: "completionCount",
      width: 100,
      render: (value) => <Text strong>{value}</Text>,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          效率分析中心
        </Title>
        <Text type="secondary">
          深度分析标注效率，识别瓶颈并提供优化建议
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
              value={analysisType}
              onChange={setAnalysisType}
              style={{ width: 150 }}
            >
              <Select.Option value="individual">个人效率</Select.Option>
              <Select.Option value="taskType">任务类型</Select.Option>
              <Select.Option value="department">部门对比</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={metricFocus}
              onChange={setMetricFocus}
              style={{ width: 120 }}
            >
              <Select.Option value="speed">速度分析</Select.Option>
              <Select.Option value="quality">质量分析</Select.Option>
              <Select.Option value="balance">平衡分析</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<DownloadOutlined />}>导出分析</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 效率概览指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="平均效率"
              value={overallEfficiency.avgTasksPerHour}
              prefix={<ThunderboltOutlined style={{ color: "#1890ff" }} />}
              suffix="项/小时"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="平均用时"
              value={overallEfficiency.avgTaskTime}
              prefix={<ClockCircleOutlined style={{ color: "#722ed1" }} />}
              suffix="分钟"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="效率提升"
              value={overallEfficiency.efficiencyImprovement}
              prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="时间利用率"
              value={overallEfficiency.timeUtilization}
              prefix={<PieChartOutlined style={{ color: "#fa8c16" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="质效平衡"
              value={overallEfficiency.qualityEfficiencyBalance}
              prefix={<BarChartOutlined style={{ color: "#13c2c2" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="瓶颈改善"
              value={overallEfficiency.bottleneckReduction}
              prefix={<RocketOutlined style={{ color: "#eb2f96" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 效率趋势图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>效率趋势分析</span>
              </Space>
            }
            extra={
              <Select defaultValue="efficiency" style={{ width: 120 }}>
                <Select.Option value="efficiency">效率趋势</Select.Option>
                <Select.Option value="quality">质量趋势</Select.Option>
                <Select.Option value="balance">平衡趋势</Select.Option>
              </Select>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <LineChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>效率趋势图表</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>展示效率变化趋势和预测</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>瓶颈分布</span>
              </Space>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <PieChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>瓶颈类型分布</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>速度、质量、专注度瓶颈</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细效率分析表格 */}
      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>
              {analysisType === "individual" ? "个人效率分析" :
                analysisType === "taskType" ? "任务类型效率" : "部门效率对比"}
            </span>
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary">按效率排序</Text>
            <Tooltip title="数据实时更新">
              <InfoCircleOutlined style={{ color: "#999" }} />
            </Tooltip>
          </Space>
        }
      >
        {analysisType === "taskType" ? (
          <Table<TaskTypeEfficiency>
            columns={taskTypeColumns}
            dataSource={taskTypeEfficiency}
            rowKey="taskType"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            size="middle"
          />
        ) : (
          <Table<EfficiencyMetrics>
            columns={efficiencyColumns}
            dataSource={efficiencyMetrics}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            size="middle"
          />
        )}
      </Card>
    </div>
  );
};

export default EfficiencyAnalysisPage;
