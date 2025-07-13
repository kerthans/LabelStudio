"use client";
import type {
  AnnotationProgress,
  AnnotationTaskType,
} from "@/types/dashboard/annotation";
import {
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LineChartOutlined,
  ReloadOutlined,
  RiseOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

const { Title, Text } = Typography;

const TaskProgress: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<
    AnnotationTaskType | "all"
  >("all");

  // Mock 进度数据
  const mockProgress: AnnotationProgress[] = [
    {
      taskId: "task-001",
      taskTitle: "医疗影像肺结节检测标注",
      type: "object_detection",
      totalItems: 1200,
      completedItems: 780,
      reviewedItems: 650,
      approvedItems: 620,
      rejectedItems: 30,
      progress: 65,
      qualityScore: 96.8,
      estimatedCompletion: "2024-01-20",
      dailyProgress: [
        { date: "2024-01-10", completed: 120, quality: 95.2 },
        { date: "2024-01-11", completed: 135, quality: 96.8 },
        { date: "2024-01-12", completed: 142, quality: 97.1 },
        { date: "2024-01-13", completed: 128, quality: 96.5 },
        { date: "2024-01-14", completed: 155, quality: 97.3 },
      ],
    },
    {
      taskId: "task-002",
      taskTitle: "用户评论情感分析标注",
      type: "sentiment_analysis",
      totalItems: 5000,
      completedItems: 2250,
      reviewedItems: 2100,
      approvedItems: 2000,
      rejectedItems: 100,
      progress: 45,
      qualityScore: 94.2,
      estimatedCompletion: "2024-01-25",
      dailyProgress: [
        { date: "2024-01-10", completed: 450, quality: 93.8 },
        { date: "2024-01-11", completed: 480, quality: 94.2 },
        { date: "2024-01-12", completed: 465, quality: 94.5 },
        { date: "2024-01-13", completed: 420, quality: 93.9 },
        { date: "2024-01-14", completed: 435, quality: 94.8 },
      ],
    },
    {
      taskId: "task-003",
      taskTitle: "自动驾驶场景目标检测",
      type: "object_detection",
      totalItems: 800,
      completedItems: 800,
      reviewedItems: 800,
      approvedItems: 754,
      rejectedItems: 46,
      progress: 100,
      qualityScore: 94.2,
      estimatedCompletion: "已完成",
      dailyProgress: [
        { date: "2024-01-05", completed: 160, quality: 93.5 },
        { date: "2024-01-06", completed: 155, quality: 94.1 },
        { date: "2024-01-07", completed: 165, quality: 94.8 },
        { date: "2024-01-08", completed: 158, quality: 93.9 },
        { date: "2024-01-09", completed: 162, quality: 94.5 },
      ],
    },
  ];

  const getTypeText = (type: AnnotationTaskType) => {
    const texts = {
      image_classification: "图像分类",
      object_detection: "目标检测",
      text_classification: "文本分类",
      ner: "命名实体识别",
      sentiment_analysis: "情感分析",
      speech_recognition: "语音识别",
      video_annotation: "视频标注",
    };
    return texts[type];
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "#52c41a";
    if (progress >= 70) return "#1890ff";
    if (progress >= 50) return "#faad14";
    return "#ff4d4f";
  };

  const columns: ColumnsType<AnnotationProgress> = [
    {
      title: "任务信息",
      key: "taskInfo",
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>
              {record.taskTitle}
            </Text>
          </div>
          <Tag color="blue" style={{ fontSize: 11 }}>
            {getTypeText(record.type)}
          </Tag>
        </div>
      ),
    },
    {
      title: "总体进度",
      key: "overallProgress",
      width: 200,
      render: (_, record) => (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 12 }}>
              {record.completedItems}/{record.totalItems}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: 600 }}>
              {record.progress}%
            </Text>
          </div>
          <Progress
            percent={record.progress}
            size="small"
            showInfo={false}
            strokeColor={getProgressColor(record.progress)}
          />
        </div>
      ),
    },
    {
      title: "审核进度",
      key: "reviewProgress",
      width: 150,
      render: (_, record) => {
        const reviewProgress = Math.round(
          (record.reviewedItems / record.completedItems) * 100,
        );
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>
                {record.reviewedItems}/{record.completedItems}
              </Text>
            </div>
            <Progress
              percent={reviewProgress}
              size="small"
              showInfo={false}
              strokeColor="#722ed1"
            />
          </div>
        );
      },
    },
    {
      title: "通过率",
      key: "approvalRate",
      width: 100,
      render: (_, record) => {
        const approvalRate = Math.round(
          (record.approvedItems / record.reviewedItems) * 100,
        );
        return (
          <div style={{ textAlign: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: approvalRate >= 95 ? "#52c41a" : approvalRate >= 90 ? "#1890ff" : "#faad14",
              }}
            >
              {approvalRate}%
            </Text>
          </div>
        );
      },
    },
    {
      title: "质量评分",
      dataIndex: "qualityScore",
      key: "qualityScore",
      width: 100,
      render: (score: number) => (
        <div style={{ textAlign: "center" }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: score >= 95 ? "#52c41a" : score >= 90 ? "#1890ff" : "#faad14",
            }}
          >
            {score}%
          </Text>
        </div>
      ),
    },
    {
      title: "预计完成",
      dataIndex: "estimatedCompletion",
      key: "estimatedCompletion",
      width: 120,
      render: (date: string) => (
        <div>
          <CalendarOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          <Text style={{ fontSize: 12 }}>{date}</Text>
        </div>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewProgress(record.taskId)}
        />
      ),
    },
  ];

  const handleViewProgress = (_taskId: string) => {
    message.info("查看详细进度");
  };

  // 计算总体统计
  const filteredData =
    selectedTaskType === "all"
      ? mockProgress
      : mockProgress.filter((item) => item.type === selectedTaskType);

  const totalTasks = filteredData.length;
  const completedTasks = filteredData.filter((item) => item.progress === 100).length;
  const totalItems = filteredData.reduce((sum, item) => sum + item.totalItems, 0);
  const completedItems = filteredData.reduce(
    (sum, item) => sum + item.completedItems,
    0,
  );
  const averageQuality =
    filteredData.reduce((sum, item) => sum + item.qualityScore, 0) / totalTasks;
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 16 }}>
          进度跟踪
        </Title>
        <Row gutter={16} align="middle">
          <Col>
            <Text>任务类型：</Text>
            <Select
              value={selectedTaskType}
              onChange={setSelectedTaskType}
              style={{ width: 150, marginLeft: 8 }}
              options={[
                { label: "全部类型", value: "all" },
                { label: "图像分类", value: "image_classification" },
                { label: "目标检测", value: "object_detection" },
                { label: "文本分类", value: "text_classification" },
                { label: "情感分析", value: "sentiment_analysis" },
                { label: "语音识别", value: "speech_recognition" },
              ]}
            />
          </Col>
          <Col flex="auto" />
          <Col>
            <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
              刷新数据
            </Button>
          </Col>
        </Row>
      </div>

      {/* 总体统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="任务总数"
              value={totalTasks}
              suffix="个"
              prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成任务"
              value={completedTasks}
              suffix={`/ ${totalTasks}`}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总体进度"
              value={overallProgress}
              suffix="%"
              prefix={<RiseOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均质量"
              value={averageQuality}
              precision={1}
              suffix="%"
              prefix={<BarChartOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 进度趋势图表 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>每日完成趋势</span>
              </Space>
            }
          >
            <div
              style={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fafafa",
                borderRadius: 8,
                border: "1px dashed #d9d9d9",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <LineChartOutlined
                  style={{
                    fontSize: 32,
                    color: "#d9d9d9",
                    marginBottom: 8,
                  }}
                />
                <div>
                  <Text type="secondary">每日完成数量趋势图</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>质量评分趋势</span>
              </Space>
            }
          >
            <div
              style={{
                height: 200,
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
                    fontSize: 32,
                    color: "#d9d9d9",
                    marginBottom: 8,
                  }}
                />
                <div>
                  <Text type="secondary">质量评分变化趋势图</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细进度表格 */}
      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            <span>任务进度详情</span>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="taskId"
          loading={loading}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default TaskProgress;
