"use client";
import type { StatisticCardData } from "@/types/dashboard/dashboard";
import {
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  ProjectOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
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

const Dashboard: React.FC = () => {
  const [isLoading, _setIsLoading] = useState<boolean>(false);
  const [loadingKey, _setLoadingKey] = useState<number>(0);

  // 统计数据配置
  const statisticData: StatisticCardData[] = [
    {
      title: "招标项目总数",
      value: 1248,
      valueStyle: { color: "#1890ff" },
      suffix: "个",
      prefix: <ProjectOutlined />,
    },
    {
      title: "今日新增项目",
      value: 23,
      valueStyle: { color: "#52c41a" },
      suffix: "个",
      prefix: <RiseOutlined />,
    },
    {
      title: "标书分析完成",
      value: 892,
      valueStyle: { color: "#722ed1" },
      suffix: "份",
      prefix: <FileSearchOutlined />,
    },
    {
      title: "系统检出率",
      value: 96.8,
      precision: 1,
      valueStyle: { color: "#fa8c16" },
      suffix: "%",
      prefix: <TrophyOutlined />,
    },
  ];

  // 快捷操作数据
  const quickActions = [
    {
      title: "新建招标项目",
      icon: <ProjectOutlined />,
      type: "primary" as const,
      description: "创建新的招标项目",
    },
    {
      title: "标书智能分析",
      icon: <FileTextOutlined />,
      type: "default" as const,
      description: "上传并分析标书文件",
    },
    {
      title: "资质审查",
      icon: <SafetyCertificateOutlined />,
      type: "default" as const,
      description: "企业资质审查验证",
    },
    {
      title: "生成评标报告",
      icon: <BarChartOutlined />,
      type: "default" as const,
      description: "自动生成评标分析报告",
    },
  ];

  // 待办事项数据
  const todoItems = [
    {
      id: 1,
      title: "审核招标项目：某市政道路建设工程",
      priority: "high",
      deadline: "2024-01-15",
      type: "项目审核",
      assignee: "张工程师",
    },
    {
      id: 2,
      title: "完成标书分析：办公楼装修工程",
      priority: "medium",
      deadline: "2024-01-16",
      type: "标书分析",
      assignee: "李分析师",
    },
    {
      id: 3,
      title: "资质审查：建筑施工企业资质",
      priority: "medium",
      deadline: "2024-01-17",
      type: "资质审查",
      assignee: "王审查员",
    },
    {
      id: 4,
      title: "更新项目状态：学校建设项目",
      priority: "low",
      deadline: "2024-01-18",
      type: "状态更新",
      assignee: "赵管理员",
    },
  ];

  // 数据采集状态
  const collectionStatus = [
    {
      name: "全国公共资源交易平台",
      status: "running",
      progress: 92,
      lastUpdate: "2分钟前",
      todayCount: 156,
      totalCount: 12450,
    },
    {
      name: "中国招标投标公共服务平台",
      status: "running",
      progress: 88,
      lastUpdate: "5分钟前",
      todayCount: 89,
      totalCount: 8920,
    },
    {
      name: "建设工程招标网",
      status: "warning",
      progress: 65,
      lastUpdate: "15分钟前",
      todayCount: 23,
      totalCount: 5670,
    },
    {
      name: "政府采购网",
      status: "error",
      progress: 0,
      lastUpdate: "2小时前",
      todayCount: 0,
      totalCount: 3240,
    },
  ];

  // 最新动态数据
  const recentActivities = [
    {
      id: 1,
      action: "新增招标项目",
      content: "某市政道路改造工程招标公告发布",
      time: "5分钟前",
      type: "success",
    },
    {
      id: 2,
      action: "标书分析完成",
      content: "办公楼装修工程标书智能分析已完成",
      time: "12分钟前",
      type: "info",
    },
    {
      id: 3,
      action: "资质审查通过",
      content: "某建筑公司资质审查验证通过",
      time: "25分钟前",
      type: "success",
    },
    {
      id: 4,
      action: "系统预警",
      content: "检测到异常投标行为，请及时处理",
      time: "1小时前",
      type: "warning",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "red";
      case "medium": return "orange";
      case "low": return "blue";
      default: return "default";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high": return "高";
      case "medium": return "中";
      case "low": return "低";
      default: return "普通";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running": return "processing";
      case "warning": return "warning";
      case "error": return "error";
      default: return "default";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "warning": return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
      case "info": return <FileTextOutlined style={{ color: "#1890ff" }} />;
      default: return <ClockCircleOutlined style={{ color: "#d9d9d9" }} />;
    }
  };

  if (isLoading) {
    return <DashboardLoading key={loadingKey} />;
  }

  return (
    <>
      {/* 统计卡片区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={stat.valueStyle}
                suffix={stat.suffix}
                prefix={stat.prefix}
                precision={stat.precision}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        {/* 数据趋势图表 */}
        <Col xs={24} xl={16}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>数据趋势分析</span>
              </Space>
            }
            extra={
              <Space>
                <Button size="small">日</Button>
                <Button size="small">周</Button>
                <Button size="small" type="primary">月</Button>
                <Button size="small">年</Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <div style={{
              height: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fafafa",
              borderRadius: 8,
              border: "1px dashed #d9d9d9",
            }}>
              <div style={{ textAlign: "center" }}>
                <BarChartOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                <div>
                  <Text type="secondary" style={{ fontSize: "16px" }}>项目数量趋势图表</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "14px" }}>图表组件集成中...</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* 快捷操作 */}
        <Col xs={24} xl={8}>
          <Card
            title={
              <Space>
                <SyncOutlined />
                <span>快捷操作</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {quickActions.map((action, index) => (
                <Tooltip key={index} title={action.description} placement="left">
                  <Button
                    type={action.type}
                    block
                    size="large"
                    icon={action.icon}
                  >
                    {action.title}
                  </Button>
                </Tooltip>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 待办事项、采集状态和最新动态 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 待办事项 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>待办事项</span>
                <Badge count={todoItems.length} style={{ backgroundColor: "#52c41a" }} />
              </Space>
            }
            extra={<Button type="link" size="small">查看全部</Button>}
          >
            <List
              dataSource={todoItems}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0" }}>
                  <List.Item.Meta
                    avatar={
                      <Tag color={getPriorityColor(item.priority)}>
                        {getPriorityText(item.priority)}
                      </Tag>
                    }
                    title={
                      <div>
                        <Text strong style={{ fontSize: "14px" }}>{item.title}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>{item.type}</Text>
                      </div>
                    }
                    description={
                      <Space split={<Divider type="vertical" />}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>截止: {item.deadline}</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>负责人: {item.assignee}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 数据采集状态 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <DatabaseOutlined />
                <span>数据采集状态</span>
              </Space>
            }
            extra={<Button type="link" size="small">管理采集源</Button>}
          >
            <List
              dataSource={collectionStatus}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0" }}>
                  <List.Item.Meta
                    avatar={
                      <Badge
                        status={getStatusBadge(item.status)}
                      />
                    }
                    title={
                      <div>
                        <Text strong style={{ fontSize: "14px" }}>{item.name}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Progress
                          percent={item.progress}
                          size="small"
                          status={item.status === "error" ? "exception" : item.status === "warning" ? "active" : "normal"}
                        />
                        <div style={{ marginTop: 4 }}>
                          <Space split={<Divider type="vertical" />}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>今日: {item.todayCount}</Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>总计: {item.totalCount}</Text>
                            <Text type="secondary" style={{ fontSize: "12px" }}>更新: {item.lastUpdate}</Text>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 最新动态 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <AuditOutlined />
                <span>最新动态</span>
              </Space>
            }
            extra={<Button type="link" size="small">查看更多</Button>}
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: "12px 0" }}>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={
                      <div>
                        <Text strong style={{ fontSize: "14px" }}>{item.action}</Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text style={{ fontSize: "13px" }}>{item.content}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>{item.time}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
