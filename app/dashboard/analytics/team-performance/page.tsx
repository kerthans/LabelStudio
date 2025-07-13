"use client";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CrownOutlined,
  DownloadOutlined,
  FilterOutlined,
  FireOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  PieChartOutlined,
  RocketOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Avatar,
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

interface TeamMemberPerformance {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  position: string;
  tasksCompleted: number;
  qualityScore: number;
  efficiency: number;
  workHours: number;
  contributionScore: number;
  improvementRate: number;
  rank: number;
  badges: string[];
  performanceTrend: "up" | "down" | "stable";
  monthlyTarget: number;
  targetCompletion: number;
}

interface DepartmentPerformance {
  id: string;
  department: string;
  teamLead: string;
  memberCount: number;
  totalTasks: number;
  avgQuality: number;
  avgEfficiency: number;
  teamScore: number;
  rank: number;
  improvement: number;
  collaboration: number;
}

const TeamPerformancePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [viewType, setViewType] = useState<string>("individual");
  const [department, setDepartment] = useState<string>("all");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 团队整体绩效数据
  const teamOverallMetrics = {
    totalMembers: 24,
    avgPerformanceScore: 87.3,
    topPerformers: 6,
    improvingMembers: 18,
    teamProductivity: 142.8,
    collaborationIndex: 91.5
  };

  // 个人绩效数据
  const memberPerformance: TeamMemberPerformance[] = [
    {
      id: "tm_001",
      name: "张医师",
      avatar: "/avatars/zhang.jpg",
      department: "医学影像",
      position: "高级标注员",
      tasksCompleted: 156,
      qualityScore: 97.2,
      efficiency: 8.5,
      workHours: 168,
      contributionScore: 94.8,
      improvementRate: 15.2,
      rank: 1,
      badges: ["质量之星", "效率达人", "月度MVP"],
      performanceTrend: "up",
      monthlyTarget: 150,
      targetCompletion: 104
    },
    {
      id: "tm_002",
      name: "李语言学家",
      avatar: "/avatars/li.jpg",
      department: "自然语言",
      position: "资深标注员",
      tasksCompleted: 134,
      qualityScore: 95.6,
      efficiency: 7.2,
      workHours: 162,
      contributionScore: 91.3,
      improvementRate: 8.7,
      rank: 2,
      badges: ["一致性专家", "团队协作"],
      performanceTrend: "stable",
      monthlyTarget: 140,
      targetCompletion: 95.7
    },
    {
      id: "tm_003",
      name: "王工程师",
      avatar: "/avatars/wang.jpg",
      department: "计算机视觉",
      position: "标注员",
      tasksCompleted: 98,
      qualityScore: 93.1,
      efficiency: 6.1,
      workHours: 155,
      contributionScore: 85.7,
      improvementRate: -2.3,
      rank: 8,
      badges: ["新人进步"],
      performanceTrend: "down",
      monthlyTarget: 120,
      targetCompletion: 81.7
    }
  ];

  // 部门绩效数据
  const departmentPerformance: DepartmentPerformance[] = [
    {
      id: "dept_001",
      department: "医学影像",
      teamLead: "张主任",
      memberCount: 8,
      totalTasks: 1247,
      avgQuality: 96.2,
      avgEfficiency: 7.8,
      teamScore: 94.5,
      rank: 1,
      improvement: 12.3,
      collaboration: 92.8
    },
    {
      id: "dept_002",
      department: "自然语言",
      teamLead: "李经理",
      memberCount: 10,
      totalTasks: 1589,
      avgQuality: 94.1,
      avgEfficiency: 6.9,
      teamScore: 91.7,
      rank: 2,
      improvement: 8.9,
      collaboration: 89.4
    },
    {
      id: "dept_003",
      department: "计算机视觉",
      teamLead: "王总监",
      memberCount: 6,
      totalTasks: 892,
      avgQuality: 92.8,
      avgEfficiency: 6.2,
      teamScore: 87.3,
      rank: 3,
      improvement: 5.6,
      collaboration: 85.7
    }
  ];

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      "质量之星": "#722ed1",
      "效率达人": "#1890ff",
      "月度MVP": "#fa8c16",
      "一致性专家": "#52c41a",
      "团队协作": "#13c2c2",
      "新人进步": "#eb2f96"
    };
    return colors[badge] || "#d9d9d9";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <CrownOutlined style={{ color: "#faad14" }} />;
    if (rank === 2) return <TrophyOutlined style={{ color: "#d9d9d9" }} />;
    if (rank === 3) return <StarOutlined style={{ color: "#fa8c16" }} />;
    return <span style={{ color: "#999" }}>#{rank}</span>;
  };

  const getTrendIcon = (trend: string, _rate: number) => {
    if (trend === "up") {
      return <ArrowUpOutlined style={{ color: "#52c41a" }} />;
    } else if (trend === "down") {
      return <ArrowDownOutlined style={{ color: "#ff4d4f" }} />;
    }
    return <span style={{ color: "#1890ff" }}>—</span>;
  };

  const memberColumns: ColumnsType<TeamMemberPerformance> = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      render: (rank) => (
        <div style={{ textAlign: "center", fontSize: 18 }}>
          {getRankIcon(rank)}
        </div>
      )
    },
    {
      title: "成员信息",
      key: "memberInfo",
      width: 200,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            size={40}
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ marginRight: 12 }}
          />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 2 }}>{record.position}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.department}</Text>
          </div>
        </div>
      )
    },
    {
      title: "绩效指标",
      key: "performance",
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>质量评分</Text>
              <Text strong>{record.qualityScore}%</Text>
            </div>
            <Progress
              percent={record.qualityScore}
              size="small"
              strokeColor={record.qualityScore >= 95 ? "#52c41a" : record.qualityScore >= 90 ? "#faad14" : "#ff4d4f"}
              showInfo={false}
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>贡献度</Text>
              <Text strong>{record.contributionScore}%</Text>
            </div>
            <Progress
              percent={record.contributionScore}
              size="small"
              strokeColor="#1890ff"
              showInfo={false}
            />
          </div>
        </div>
      )
    },
    {
      title: "工作量",
      key: "workload",
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <RocketOutlined style={{ marginRight: 4, color: "#1890ff" }} />
            <Text strong>{record.tasksCompleted}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> 任务</Text>
          </div>
          <div style={{ marginBottom: 4 }}>
            <ThunderboltOutlined style={{ marginRight: 4, color: "#722ed1" }} />
            <Text>{record.efficiency}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> 项/小时</Text>
          </div>
          <div>
            <ClockCircleOutlined style={{ marginRight: 4, color: "#fa8c16" }} />
            <Text>{record.workHours}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> 小时</Text>
          </div>
        </div>
      )
    },
    {
      title: "目标达成",
      key: "targetCompletion",
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <Progress
            type="circle"
            percent={record.targetCompletion}
            size={60}
            strokeColor={record.targetCompletion >= 100 ? "#52c41a" : record.targetCompletion >= 80 ? "#faad14" : "#ff4d4f"}
            format={() => `${record.targetCompletion}%`}
          />
          <div style={{ marginTop: 4, fontSize: 12 }}>
            <Text type="secondary">{record.tasksCompleted}/{record.monthlyTarget}</Text>
          </div>
        </div>
      )
    },
    {
      title: "成长趋势",
      key: "growth",
      width: 120,
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 4 }}>
            {getTrendIcon(record.performanceTrend, record.improvementRate)}
          </div>
          <Text
            style={{
              fontSize: 12,
              color: record.improvementRate > 0 ? "#52c41a" : record.improvementRate < 0 ? "#ff4d4f" : "#1890ff"
            }}
          >
            {record.improvementRate > 0 ? "+" : ""}{record.improvementRate}%
          </Text>
        </div>
      )
    },
    {
      title: "荣誉徽章",
      key: "badges",
      width: 200,
      render: (_, record) => (
        <div>
          {record.badges.map((badge, index) => (
            <Tag key={index} color={getBadgeColor(badge)} style={{ marginBottom: 4 }}>
              {badge}
            </Tag>
          ))}
        </div>
      )
    }
  ];

  const departmentColumns: ColumnsType<DepartmentPerformance> = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      render: (rank) => (
        <div style={{ textAlign: "center", fontSize: 18 }}>
          {getRankIcon(rank)}
        </div>
      )
    },
    {
      title: "部门信息",
      key: "departmentInfo",
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
            {record.department}
          </div>
          <div style={{ marginBottom: 2 }}>
            <Text type="secondary">负责人: {record.teamLead}</Text>
          </div>
          <div>
            <Text type="secondary">团队规模: {record.memberCount}人</Text>
          </div>
        </div>
      )
    },
    {
      title: "团队评分",
      dataIndex: "teamScore",
      key: "teamScore",
      width: 120,
      render: (score) => (
        <div style={{ textAlign: "center" }}>
          <Progress
            type="circle"
            percent={score}
            size={60}
            strokeColor={score >= 90 ? "#52c41a" : score >= 80 ? "#faad14" : "#ff4d4f"}
            format={() => `${score}%`}
          />
        </div>
      )
    },
    {
      title: "工作量统计",
      key: "workStats",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong>{record.totalTasks}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}> 总任务</Text>
          </div>
          <div style={{ marginBottom: 4 }}>
            <Text>平均质量: </Text>
            <Text strong style={{ color: record.avgQuality >= 95 ? "#52c41a" : "#faad14" }}>
              {record.avgQuality}%
            </Text>
          </div>
          <div>
            <Text>平均效率: </Text>
            <Text strong>{record.avgEfficiency} 项/小时</Text>
          </div>
        </div>
      )
    },
    {
      title: "团队协作",
      dataIndex: "collaboration",
      key: "collaboration",
      width: 120,
      render: (value) => (
        <div>
          <Progress
            percent={value}
            size="small"
            strokeColor={value >= 90 ? "#52c41a" : value >= 80 ? "#faad14" : "#ff4d4f"}
          />
          <Text style={{ fontSize: 12 }}>{value}%</Text>
        </div>
      )
    },
    {
      title: "改进幅度",
      dataIndex: "improvement",
      key: "improvement",
      width: 100,
      render: (value) => (
        <div style={{ textAlign: "center" }}>
          <ArrowUpOutlined style={{ color: "#52c41a", marginRight: 4 }} />
          <Text strong style={{ color: "#52c41a" }}>+{value}%</Text>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          团队绩效管理
        </Title>
        <Text type="secondary">
          全面评估团队成员表现，激发团队潜能和协作效率
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
              value={viewType}
              onChange={setViewType}
              style={{ width: 120 }}
            >
              <Select.Option value="individual">个人绩效</Select.Option>
              <Select.Option value="department">部门绩效</Select.Option>
              <Select.Option value="comparison">对比分析</Select.Option>
            </Select>
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
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<DownloadOutlined />}>导出报告</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 团队整体指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="团队成员"
              value={teamOverallMetrics.totalMembers}
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="平均绩效"
              value={teamOverallMetrics.avgPerformanceScore}
              prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="优秀成员"
              value={teamOverallMetrics.topPerformers}
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="进步成员"
              value={teamOverallMetrics.improvingMembers}
              prefix={<FireOutlined style={{ color: "#722ed1" }} />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="团队生产力"
              value={teamOverallMetrics.teamProductivity}
              prefix={<RocketOutlined style={{ color: "#fa8c16" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card>
            <Statistic
              title="协作指数"
              value={teamOverallMetrics.collaborationIndex}
              prefix={<TeamOutlined style={{ color: "#13c2c2" }} />}
              suffix="%"
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* 绩效趋势图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>绩效趋势分析</span>
              </Space>
            }
            extra={
              <Select defaultValue="overall" style={{ width: 120 }}>
                <Select.Option value="overall">综合绩效</Select.Option>
                <Select.Option value="quality">质量指标</Select.Option>
                <Select.Option value="efficiency">效率指标</Select.Option>
                <Select.Option value="collaboration">协作指标</Select.Option>
              </Select>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <LineChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>绩效趋势图表</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>展示团队绩效变化趋势</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>绩效分布</span>
              </Space>
            }
          >
            <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
              <div style={{ textAlign: "center" }}>
                <PieChartOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>绩效等级分布</div>
                <div style={{ fontSize: 12, marginTop: 8 }}>优秀、良好、合格、待提升</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 绩效排行榜 */}
      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>{viewType === "individual" ? "个人绩效排行榜" : "部门绩效排行榜"}</span>
          </Space>
        }
        extra={
          <Space>
            <Text type="secondary">按综合评分排序</Text>
            <Tooltip title="数据每日更新">
              <InfoCircleOutlined style={{ color: "#999" }} />
            </Tooltip>
          </Space>
        }
      >
        {viewType === "individual" ? (
          <Table<TeamMemberPerformance>
            columns={memberColumns}
            dataSource={memberPerformance}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            size="middle"
          />
        ) : (
          <Table<DepartmentPerformance>
            columns={departmentColumns}
            dataSource={departmentPerformance}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`
            }}
            size="middle"
          />
        )}
      </Card>
    </div>
  );
};

export default TeamPerformancePage;
