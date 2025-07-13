"use client";
import {
  AuditOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
  RiseOutlined,
  StarOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import {
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
  Timeline,
  Typography
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface PerformanceData {
  period: string;
  tasksCompleted: number;
  qualityScore: number;
  efficiency: number;
  accuracy: number;
  speed: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface TaskRecord {
  id: string;
  taskName: string;
  taskType: string;
  completedAt: string;
  duration: number;
  qualityScore: number;
  status: 'completed' | 'reviewed' | 'approved';
}

const PersonalPerformancePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);

  // 模拟绩效数据
  const [performanceData] = useState<PerformanceData[]>([
    {
      period: "2024-01",
      tasksCompleted: 156,
      qualityScore: 96.8,
      efficiency: 94.2,
      accuracy: 98.1,
      speed: 92.5
    },
    {
      period: "2023-12",
      tasksCompleted: 142,
      qualityScore: 95.2,
      efficiency: 91.8,
      accuracy: 97.3,
      speed: 89.7
    },
    {
      period: "2023-11",
      tasksCompleted: 138,
      qualityScore: 94.6,
      efficiency: 90.1,
      accuracy: 96.8,
      speed: 88.2
    }
  ]);

  // 成就数据
  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "质量专家",
      description: "连续30天质量评分超过95%",
      icon: <StarOutlined />,
      date: "2024-01-10",
      level: "gold"
    },
    {
      id: "2",
      title: "效率之星",
      description: "单日完成任务数量超过20个",
      icon: <FireOutlined />,
      date: "2024-01-05",
      level: "silver"
    },
    {
      id: "3",
      title: "标注达人",
      description: "累计完成1000个标注任务",
      icon: <TrophyOutlined />,
      date: "2023-12-20",
      level: "platinum"
    }
  ]);

  // 任务记录
  const [taskRecords] = useState<TaskRecord[]>([
    {
      id: "task_001",
      taskName: "医疗影像分类-胸部X光",
      taskType: "图像分类",
      completedAt: "2024-01-15 14:30",
      duration: 45,
      qualityScore: 98.5,
      status: "approved"
    },
    {
      id: "task_002",
      taskName: "文本情感分析-用户评论",
      taskType: "文本分类",
      completedAt: "2024-01-15 13:20",
      duration: 32,
      qualityScore: 96.2,
      status: "reviewed"
    },
    {
      id: "task_003",
      taskName: "目标检测-交通场景",
      taskType: "目标检测",
      completedAt: "2024-01-15 11:45",
      duration: 67,
      qualityScore: 94.8,
      status: "completed"
    }
  ]);

  const currentData = performanceData[0];

  const getAchievementColor = (level: string) => {
    switch (level) {
      case 'platinum': return '#e6f7ff';
      case 'gold': return '#fff7e6';
      case 'silver': return '#f6f6f6';
      case 'bronze': return '#fff2e8';
      default: return '#f0f0f0';
    }
  };

  const getAchievementBorderColor = (level: string) => {
    switch (level) {
      case 'platinum': return '#1890ff';
      case 'gold': return '#faad14';
      case 'silver': return '#8c8c8c';
      case 'bronze': return '#fa8c16';
      default: return '#d9d9d9';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'reviewed': return 'processing';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '已通过';
      case 'reviewed': return '审核中';
      case 'completed': return '已完成';
      default: return '未知';
    }
  };

  const taskColumns: ColumnsType<TaskRecord> = [
    {
      title: '任务信息',
      key: 'taskInfo',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.taskName}</div>
          <Tag color="blue">{record.taskType}</Tag>
        </div>
      ),
    },
    {
      title: '完成时间',
      dataIndex: 'completedAt',
      key: 'completedAt',
      render: (time) => (
        <Text type="secondary">{time}</Text>
      ),
    },
    {
      title: '用时',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <Text>{duration} 分钟</Text>
      ),
    },
    {
      title: '质量评分',
      dataIndex: 'qualityScore',
      key: 'qualityScore',
      render: (score) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Progress
            type="circle"
            size={40}
            percent={score}
            format={() => `${score}%`}
            strokeColor={score >= 95 ? '#52c41a' : score >= 90 ? '#faad14' : '#ff4d4f'}
          />
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <BarChartOutlined />
              个人绩效
            </Title>
            <Text type="secondary">查看您的工作表现和成长轨迹</Text>
          </div>
          <Space>
            <Select
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="week">近一周</Option>
              <Option value="month">近一月</Option>
              <Option value="quarter">近三月</Option>
              <Option value="year">近一年</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                }
              }}
              suffixIcon={<CalendarOutlined />}
            />
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* 核心指标 */}
        <Col xs={24}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card className="performance-metric-card">
                <Statistic
                  title="完成任务"
                  value={currentData.tasksCompleted}
                  suffix="个"
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="performance-metric-card">
                <Statistic
                  title="质量评分"
                  value={currentData.qualityScore}
                  suffix="%"
                  precision={1}
                  prefix={<StarOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="performance-metric-card">
                <Statistic
                  title="工作效率"
                  value={currentData.efficiency}
                  suffix="%"
                  precision={1}
                  prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card className="performance-metric-card">
                <Statistic
                  title="准确率"
                  value={currentData.accuracy}
                  suffix="%"
                  precision={1}
                  prefix={<AuditOutlined style={{ color: '#722ed1' }} />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* 绩效趋势 */}
        <Col xs={24} lg={16}>
          <Card title="绩效趋势" className="performance-chart-card">
            <div style={{ padding: '20px 0' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="dashboard"
                      percent={currentData.qualityScore}
                      format={(percent) => `${percent}%`}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                      size={120}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text strong>质量评分</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="dashboard"
                      percent={currentData.efficiency}
                      format={(percent) => `${percent}%`}
                      strokeColor={{
                        '0%': '#faad14',
                        '100%': '#52c41a',
                      }}
                      size={120}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text strong>工作效率</Text>
                    </div>
                  </div>
                </Col>
              </Row>

              <div style={{ marginTop: 24 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                        {currentData.speed}%
                      </div>
                      <div style={{ color: '#666' }}>标注速度</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                        {currentData.accuracy}%
                      </div>
                      <div style={{ color: '#666' }}>准确率</div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                        {currentData.tasksCompleted}
                      </div>
                      <div style={{ color: '#666' }}>完成任务</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </Col>

        {/* 成就徽章 */}
        <Col xs={24} lg={8}>
          <Card title="成就徽章" className="achievement-card">
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    backgroundColor: getAchievementColor(achievement.level),
                    border: `1px solid ${getAchievementBorderColor(achievement.level)}`
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: getAchievementBorderColor(achievement.level),
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      marginRight: 12
                    }}
                  >
                    {achievement.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>
                      {achievement.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>
                      {achievement.description}
                    </div>
                    <div style={{ fontSize: 11, color: '#999' }}>
                      {achievement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* 最近任务记录 */}
        <Col xs={24}>
          <Card title="最近任务记录" className="task-records-card">
            <Table
              columns={taskColumns}
              dataSource={taskRecords}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showQuickJumper: false,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
              size="middle"
            />
          </Card>
        </Col>

        {/* 工作时间线 */}
        <Col xs={24}>
          <Card title="工作时间线" className="timeline-card">
            <Timeline
              items={[
                {
                  dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />,
                  children: (
                    <div>
                      <div style={{ fontWeight: 500 }}>完成医疗影像分类任务</div>
                      <div style={{ color: '#666', fontSize: 12 }}>2024-01-15 14:30 · 质量评分: 98.5%</div>
                    </div>
                  ),
                },
                {
                  dot: <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />,
                  children: (
                    <div>
                      <div style={{ fontWeight: 500 }}>获得"质量专家"成就</div>
                      <div style={{ color: '#666', fontSize: 12 }}>2024-01-10 09:00 · 连续30天质量评分超过95%</div>
                    </div>
                  ),
                },
                {
                  dot: <StarOutlined style={{ fontSize: '16px', color: '#faad14' }} />,
                  children: (
                    <div>
                      <div style={{ fontWeight: 500 }}>月度绩效评估</div>
                      <div style={{ color: '#666', fontSize: 12 }}>2024-01-01 · 综合评分: A+</div>
                    </div>
                  ),
                },
                {
                  dot: <TrophyOutlined style={{ fontSize: '16px', color: '#722ed1' }} />,
                  children: (
                    <div>
                      <div style={{ fontWeight: 500 }}>达成1000任务里程碑</div>
                      <div style={{ color: '#666', fontSize: 12 }}>2023-12-20 · 累计完成标注任务1000个</div>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalPerformancePage;
