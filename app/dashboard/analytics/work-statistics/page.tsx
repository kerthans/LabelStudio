"use client";
import {
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
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

interface WorkStatistics {
  id: string;
  annotatorName: string;
  department: string;
  tasksAssigned: number;
  tasksCompleted: number;
  tasksInProgress: number;
  totalWorkHours: number;
  avgTaskTime: number;
  qualityScore: number;
  efficiency: number;
  lastActiveDate: string;
  workload: "light" | "normal" | "heavy" | "overload";
}

interface DepartmentStats {
  department: string;
  totalMembers: number;
  totalTasks: number;
  completionRate: number;
  avgQuality: number;
  avgEfficiency: number;
}

const WorkStatisticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [department, setDepartment] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [viewType, setViewType] = useState<string>("individual");

  // 整体统计数据
  const overallStats = {
    totalAnnotators: 24,
    totalTasksCompleted: 1847,
    totalWorkHours: 312.5,
    avgProductivity: 5.9,
    activeToday: 18,
    completionRate: 94.2,
  };

  // 部门统计数据
  const departmentStats: DepartmentStats[] = [
    {
      department: "医学影像",
      totalMembers: 8,
      totalTasks: 654,
      completionRate: 96.2,
      avgQuality: 94.8,
      avgEfficiency: 6.2,
    },
    {
      department: "自然语言",
      totalMembers: 10,
      totalTasks: 892,
      completionRate: 93.1,
      avgQuality: 92.5,
      avgEfficiency: 5.8,
    },
    {
      department: "计算机视觉",
      totalMembers: 6,
      totalTasks: 301,
      completionRate: 91.7,
      avgQuality: 95.3,
      avgEfficiency: 5.5,
    },
  ];

  // 个人工作统计数据
  const workStatistics: WorkStatistics[] = [
    {
      id: "ws_001",
      annotatorName: "张医师",
      department: "医学影像",
      tasksAssigned: 45,
      tasksCompleted: 43,
      tasksInProgress: 2,
      totalWorkHours: 28.5,
      avgTaskTime: 0.66,
      qualityScore: 97.2,
      efficiency: 6.8,
      lastActiveDate: "2024-01-15",
      workload: "normal",
    },
    {
      id: "ws_002",
      annotatorName: "李语言学家",
      department: "自然语言",
      tasksAssigned: 52,
      tasksCompleted: 48,
      tasksInProgress: 4,
      totalWorkHours: 31.2,
      avgTaskTime: 0.65,
      qualityScore: 95.6,
      efficiency: 6.2,
      lastActiveDate: "2024-01-15",
      workload: "heavy",
    },
    {
      id: "ws_003",
      annotatorName: "王工程师",
      department: "计算机视觉",
      tasksAssigned: 38,
      tasksCompleted: 35,
      tasksInProgress: 3,
      totalWorkHours: 24.8,
      avgTaskTime: 0.71,
      qualityScore: 93.1,
      efficiency: 5.9,
      lastActiveDate: "2024-01-14",
      workload: "normal",
    },
  ];

  const getWorkloadColor = (workload: string) => {
    const colors = {
      light: "#52c41a",
      normal: "#1890ff",
      heavy: "#faad14",
      overload: "#ff4d4f",
    };
    return colors[workload as keyof typeof colors] || "#d9d9d9";
  };

  const getWorkloadText = (workload: string) => {
    const texts = {
      light: "轻松",
      normal: "正常",
      heavy: "繁重",
      overload: "超负荷",
    };
    return texts[workload as keyof typeof texts] || "未知";
  };

  const individualColumns: ColumnsType<WorkStatistics> = [
    {
      title: "标注员",
      key: "annotator",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            {record.annotatorName}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.department}</Text>
        </div>
      ),
    },
    {
      title: "任务完成情况",
      key: "taskProgress",
      width: 180,
      render: (_, record) => {
        const completionRate = (record.tasksCompleted / record.tasksAssigned) * 100;
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Text strong>{record.tasksCompleted}</Text>
              <Text type="secondary">/{record.tasksAssigned}</Text>
              <Text style={{ marginLeft: 8, fontSize: 12, color: completionRate >= 90 ? "#52c41a" : "#faad14" }}>
                ({completionRate.toFixed(1)}%)
              </Text>
            </div>
            <Progress
              percent={completionRate}
              size="small"
              strokeColor={completionRate >= 90 ? "#52c41a" : completionRate >= 80 ? "#faad14" : "#ff4d4f"}
            />
          </div>
        );
      },
    },
    {
      title: "工作时长",
      key: "workHours",
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>
            <ClockCircleOutlined style={{ marginRight: 4, color: "#722ed1" }} />
            {record.totalWorkHours}h
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>平均 {record.avgTaskTime}h/项</Text>
        </div>
      ),
    },
    {
      title: "质量评分",
      dataIndex: "qualityScore",
      key: "qualityScore",
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
      title: "效率指标",
      dataIndex: "efficiency",
      key: "efficiency",
      width: 100,
      render: (value) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1890ff" }}>{value}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>项/小时</Text>
        </div>
      ),
    },
    {
      title: "工作负荷",
      dataIndex: "workload",
      key: "workload",
      width: 100,
      render: (workload) => (
        <Tag color={getWorkloadColor(workload)}>
          {getWorkloadText(workload)}
        </Tag>
      ),
    },
    {
      title: "最后活跃",
      dataIndex: "lastActiveDate",
      key: "lastActiveDate",
      width: 120,
      render: (date) => (
        <Text type="secondary">{dayjs(date).format("MM-DD")}</Text>
      ),
    },
  ];

  const departmentColumns: ColumnsType<DepartmentStats> = [
    {
      title: "部门",
      dataIndex: "department",
      key: "department",
      width: 150,
      render: (department) => (
        <div style={{ fontWeight: 600 }}>
          <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          {department}
        </div>
      ),
    },
    {
      title: "团队规模",
      dataIndex: "totalMembers",
      key: "totalMembers",
      width: 100,
      render: (value) => <Text strong>{value}人</Text>,
    },
    {
      title: "任务总量",
      dataIndex: "totalTasks",
      key: "totalTasks",
      width: 100,
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "完成率",
      dataIndex: "completionRate",
      key: "completionRate",
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
      title: "平均质量",
      dataIndex: "avgQuality",
      key: "avgQuality",
      width: 100,
      render: (value) => (
        <Text style={{ color: value >= 95 ? "#52c41a" : value >= 90 ? "#faad14" : "#ff4d4f" }}>
          {value}%
        </Text>
      ),
    },
    {
      title: "平均效率",
      dataIndex: "avgEfficiency",
      key: "avgEfficiency",
      width: 120,
      render: (value) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1890ff" }}>{value}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>项/小时</Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          工作统计分析
        </Title>
        <Text type="secondary">
          全面掌握团队工作状态，优化资源配置和工作效率
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
              value={department}
              onChange={setDepartment}
              style={{ width: 150 }}
              placeholder="选择部门"
            >
              <Select.Option value="all">全部部门</Select.Option>
              <Select.Option value="medical">医学影像</Select.Option>
              <Select.Option value="nlp">自然语言</Select.Option>
              <Select.Option value="cv">计算机视觉</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={viewType}
              onChange={setViewType}
              style={{ width: 120 }}
            >
              <Select.Option value="individual">个人视图</Select.Option>
              <Select.Option value="department">部门视图</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 整体统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="总标注员数"
              value={overallStats.totalAnnotators}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="完成任务数"
              value={overallStats.totalTasksCompleted}
              prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="总工作时长"
              value={overallStats.totalWorkHours}
              prefix={<ClockCircleOutlined style={{ color: "#722ed1" }} />}
              suffix="小时"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="平均生产力"
              value={overallStats.avgProductivity}
              prefix={<BarChartOutlined style={{ color: "#fa8c16" }} />}
              suffix="项/小时"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="今日活跃"
              value={overallStats.activeToday}
              prefix={<UserOutlined style={{ color: "#13c2c2" }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="完成率"
              value={overallStats.completionRate}
              prefix={<LineChartOutlined style={{ color: "#eb2f96" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 工作分布图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>工作量趋势分析</span>
              </Space>
            }
            extra={
              <Select defaultValue="tasks" style={{ width: 100 }}>
                <Select.Option value="tasks">任务数</Select.Option>
                <Select.Option value="hours">工时</Select.Option>
                <Select.Option value="quality">质量</Select.Option>
              </Select>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <LineChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>工作量趋势图表</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>展示团队工作量变化趋势</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>工作负荷分布</span>
              </Space>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <PieChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>负荷分布图</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>轻松、正常、繁重、超负荷</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细统计表格 */}
      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>{viewType === "individual" ? "个人工作统计" : "部门工作统计"}</span>
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary">按效率排序</Text>
            <Tooltip title="数据每小时更新一次">
              <InfoCircleOutlined style={{ color: "#999" }} />
            </Tooltip>
          </Space>
        }
      >
        {viewType === "individual" ? (
          <Table<WorkStatistics>
            columns={individualColumns}
            dataSource={workStatistics}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            size="middle"
          />
        ) : (
          <Table<DepartmentStats>
            columns={departmentColumns}
            dataSource={departmentStats}
            rowKey="department"
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

export default WorkStatisticsPage;
