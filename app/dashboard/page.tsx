"use client";
import type { StatisticCardData } from "@/types/dashboard/dashboard";
import {
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  RiseOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import DashboardLoading from "./loading";

const { Text } = Typography;

// 统计卡片组件
const StatisticCard: React.FC<{
  data: StatisticCardData;
  loading?: boolean;
}> = ({ data, loading = false }) => (
  <Card
    hoverable
    loading={loading}
    styles={{
      body: {
        padding: "24px",
      },
    }}
    className="statistic-card"
  >
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: `${data.valueStyle?.color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          color: data.valueStyle?.color,
        }}
      >
        {data.prefix}
      </div>
      <div style={{ flex: 1 }}>
        <Statistic
          title={
            <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}>
              {data.title}
            </Text>
          }
          value={data.value}
          valueStyle={{
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.2,
            ...data.valueStyle,
          }}
          suffix={data.suffix}
          {...(data.precision !== undefined && { precision: data.precision })}
        />
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const [isLoading, _setIsLoading] = useState<boolean>(false);
  const [loadingKey, _setLoadingKey] = useState<number>(0);

  // 核心统计数据 - 数据标注平台
  const statisticData: StatisticCardData[] = [
    {
      title: "活跃标注任务",
      value: 156,
      valueStyle: { color: "#1890ff" },
      suffix: "个",
      prefix: <PlayCircleOutlined />,
    },
    {
      title: "今日完成标注",
      value: 2847,
      valueStyle: { color: "#52c41a" },
      suffix: "条",
      prefix: <CheckCircleOutlined />,
    },
    {
      title: "标注质量评分",
      value: 94.2,
      precision: 1,
      valueStyle: { color: "#722ed1" },
      suffix: "%",
      prefix: <AuditOutlined />,
    },
    {
      title: "活跃标注员",
      value: 89,
      valueStyle: { color: "#fa8c16" },
      suffix: "人",
      prefix: <TeamOutlined />,
    },
  ];

  // 快捷操作
  const quickActions = [
    {
      title: "创建标注任务",
      icon: <PlusOutlined />,
      type: "primary" as const,
      description: "创建新的数据标注任务",
      color: "#1890ff",
    },
    {
      title: "上传数据集",
      icon: <DatabaseOutlined />,
      type: "default" as const,
      description: "上传待标注的数据集",
      color: "#52c41a",
    },
    {
      title: "质量检查",
      icon: <AuditOutlined />,
      type: "default" as const,
      description: "检查标注质量和一致性",
      color: "#722ed1",
    },
    {
      title: "导出结果",
      icon: <FileTextOutlined />,
      type: "default" as const,
      description: "导出已完成的标注数据",
      color: "#fa8c16",
    },
  ];

  // 待处理任务
  const pendingTasks = [
    {
      id: 1,
      title: "图像分类标注 - 医疗影像数据集",
      priority: "high",
      deadline: "2024-01-15",
      type: "图像分类",
      progress: 78,
      assignee: "标注团队A",
      status: "进行中",
    },
    {
      id: 2,
      title: "文本情感分析 - 用户评论数据",
      priority: "medium",
      deadline: "2024-01-18",
      type: "文本分类",
      progress: 45,
      assignee: "标注团队B",
      status: "进行中",
    },
    {
      id: 3,
      title: "目标检测 - 自动驾驶场景",
      priority: "high",
      deadline: "2024-01-20",
      type: "目标检测",
      progress: 23,
      assignee: "标注团队C",
      status: "待开始",
    },
    {
      id: 4,
      title: "语音识别 - 多语言语料库",
      priority: "low",
      deadline: "2024-01-25",
      type: "语音标注",
      progress: 89,
      assignee: "标注团队D",
      status: "即将完成",
    },
  ];

  // 标注员工作状态
  const annotatorStatus = [
    {
      name: "张小明",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
      status: "online",
      todayCompleted: 156,
      accuracy: 96.8,
      currentTask: "医疗影像分类",
      level: "高级标注员",
    },
    {
      name: "李小红",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
      status: "online",
      todayCompleted: 134,
      accuracy: 94.2,
      currentTask: "文本情感分析",
      level: "中级标注员",
    },
    {
      name: "王小强",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
      status: "busy",
      todayCompleted: 89,
      accuracy: 98.1,
      currentTask: "目标检测标注",
      level: "专家标注员",
    },
    {
      name: "赵小美",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4",
      status: "offline",
      todayCompleted: 67,
      accuracy: 92.5,
      currentTask: "暂无任务",
      level: "初级标注员",
    },
  ];

  // 系统动态
  const systemActivities = [
    {
      id: 1,
      action: "任务完成",
      content: "医疗影像分类任务第3批次标注完成",
      time: "3分钟前",
      type: "success",
      user: "张小明",
    },
    {
      id: 2,
      action: "质量检查",
      content: "文本情感分析任务质量检查通过",
      time: "15分钟前",
      type: "info",
      user: "系统自动",
    },
    {
      id: 3,
      action: "任务分配",
      content: "新的目标检测任务已分配给标注团队C",
      time: "32分钟前",
      type: "info",
      user: "项目管理员",
    },
    {
      id: 4,
      action: "质量预警",
      content: "语音标注任务检测到质量异常，需要复核",
      time: "1小时前",
      type: "warning",
      user: "质量监控系统",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "blue";
      default:
        return "default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return "普通";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#52c41a";
      case "busy":
        return "#faad14";
      case "offline":
        return "#d9d9d9";
      default:
        return "#d9d9d9";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "warning":
        return <WarningOutlined style={{ color: "#faad14" }} />;
      case "info":
        return <FileTextOutlined style={{ color: "#1890ff" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#d9d9d9" }} />;
    }
  };

  if (isLoading) {
    return <DashboardLoading key={loadingKey} />;
  }

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 核心统计指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatisticCard data={stat} />
          </Col>
        ))}
      </Row>

      {/* 主要功能区域 */}
      <Row gutter={[16, 16]}>
        {/* 数据趋势分析 */}
        <Col xs={24} xl={16}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>标注进度趋势</span>
              </Space>
            }
            extra={
              <Space>
                <Button size="small">今日</Button>
                <Button size="small">本周</Button>
                <Button size="small" type="primary">
                  本月
                </Button>
                <Button size="small">本年</Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
            styles={{
              body: {
                padding: "24px",
              },
            }}
          >
            <div
              style={{
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
                borderRadius: 8,
                border: "1px dashed #d9d9d9",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <BarChartOutlined
                  style={{
                    fontSize: 48,
                    color: "#d9d9d9",
                    marginBottom: 16,
                  }}
                />
                <div>
                  <Text type="secondary" style={{ fontSize: "16px" }}>
                    标注数量与质量趋势图表
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    图表组件集成中...
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* 快捷操作面板 */}
        <Col xs={24} xl={8}>
          <Card
            title={
              <Space>
                <RiseOutlined />
                <span>快捷操作</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
            styles={{
              body: {
                padding: "24px",
              },
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size={16}>
              {quickActions.map((action, index) => (
                <Tooltip key={index} title={action.description} placement="left">
                  <Button
                    type={action.type}
                    block
                    size="large"
                    icon={
                      <span style={{ color: action.color }}>{action.icon}</span>
                    }
                    style={{
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingLeft: 16,
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {action.title}
                  </Button>
                </Tooltip>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 详细信息区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 待处理任务 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>待处理任务</span>
                <Badge
                  count={pendingTasks.filter((task) => task.status !== "即将完成").length}
                  style={{ backgroundColor: "#1890ff" }}
                />
              </Space>
            }
            extra={
              <Button type="link" size="small">
                查看全部
              </Button>
            }
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <List
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0", border: "none" }}>
                  <List.Item.Meta
                    avatar={
                      <Tag color={getPriorityColor(item.priority)}>
                        {getPriorityText(item.priority)}
                      </Tag>
                    }
                    title={
                      <div>
                        <Text strong style={{ fontSize: "14px" }}>
                          {item.title}
                        </Text>
                        <br />
                        <Space size={4} style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {item.type}
                          </Text>
                          <Divider type="vertical" style={{ margin: "0 4px" }} />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {item.assignee}
                          </Text>
                        </Space>
                      </div>
                    }
                    description={
                      <div style={{ marginTop: 8 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            进度
                          </Text>
                          <Text style={{ fontSize: "12px", fontWeight: 500 }}>
                            {item.progress}%
                          </Text>
                        </div>
                        <Progress
                          percent={item.progress}
                          size="small"
                          showInfo={false}
                          strokeColor={
                            item.progress >= 80
                              ? "#52c41a"
                              : item.progress >= 50
                                ? "#1890ff"
                                : "#faad14"
                          }
                        />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          截止: {item.deadline}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 标注员状态 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>标注员状态</span>
              </Space>
            }
            extra={
              <Button type="link" size="small">
                管理团队
              </Button>
            }
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <List
              dataSource={annotatorStatus}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0", border: "none" }}>
                  <List.Item.Meta
                    avatar={
                      <Badge
                        dot
                        color={getStatusColor(item.status)}
                        offset={[-2, 32]}
                      >
                        <Avatar src={item.avatar} size={40} />
                      </Badge>
                    }
                    title={
                      <div>
                        <Space>
                          <Text strong style={{ fontSize: "14px" }}>
                            {item.name}
                          </Text>
                          <Tag
                            color={
                              item.level === "专家标注员"
                                ? "gold"
                                : item.level === "高级标注员"
                                  ? "blue"
                                  : item.level === "中级标注员"
                                    ? "green"
                                    : "default"
                            }
                            style={{ fontSize: "11px" }}
                          >
                            {item.level}
                          </Tag>
                        </Space>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {item.currentTask}
                        </Text>
                      </div>
                    }
                    description={
                      <Space split={<Divider type="vertical" />}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          今日: {item.todayCompleted}条
                        </Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          准确率: {item.accuracy}%
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 系统动态 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <ExclamationCircleOutlined />
                <span>系统动态</span>
              </Space>
            }
            extra={
              <Button type="link" size="small">
                查看更多
              </Button>
            }
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <List
              dataSource={systemActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0", border: "none" }}>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={
                      <div>
                        <Text strong style={{ fontSize: "14px" }}>
                          {item.action}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text style={{ fontSize: "13px" }}>
                          {item.content}
                        </Text>
                        <br />
                        <Space
                          split={<Divider type="vertical" />}
                          style={{ marginTop: 4 }}
                        >
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {item.time}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {item.user}
                          </Text>
                        </Space>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
