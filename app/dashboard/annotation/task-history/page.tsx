"use client";
import type {
  AnnotationHistory,
  AnnotationTaskType,
} from "@/types/dashboard/annotation";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  SearchOutlined,
  StarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
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
const { Search } = Input;
const { RangePicker } = DatePicker;

const TaskHistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [taskType, setTaskType] = useState<AnnotationTaskType | undefined>();

  // Mock 历史数据
  const mockHistory: AnnotationHistory[] = [
    {
      id: "history-001",
      taskId: "task-001",
      taskTitle: "医疗影像肺结节检测标注",
      type: "object_detection",
      completedAt: "2024-01-14 16:30:00",
      duration: 180,
      itemsCompleted: 150,
      qualityScore: 96.8,
      feedback: "标注质量优秀，边界框精确度高",
      reviewer: "质量审核员A",
    },
    {
      id: "history-002",
      taskId: "task-002",
      taskTitle: "用户评论情感分析标注",
      type: "sentiment_analysis",
      completedAt: "2024-01-12 14:20:00",
      duration: 120,
      itemsCompleted: 500,
      qualityScore: 94.2,
      feedback: "分类准确，但部分边界情况需要注意",
      reviewer: "质量审核员B",
    },
    {
      id: "history-003",
      taskId: "task-003",
      taskTitle: "商品图像分类标注",
      type: "image_classification",
      completedAt: "2024-01-10 11:45:00",
      duration: 90,
      itemsCompleted: 300,
      qualityScore: 98.5,
      feedback: "标注质量极佳，分类准确度很高",
      reviewer: "质量审核员A",
    },
    {
      id: "history-004",
      taskId: "task-004",
      taskTitle: "新闻文本分类标注",
      type: "text_classification",
      completedAt: "2024-01-08 09:15:00",
      duration: 150,
      itemsCompleted: 400,
      qualityScore: 92.1,
      feedback: "整体质量良好，个别分类需要改进",
      reviewer: "质量审核员C",
    },
    {
      id: "history-005",
      taskId: "task-005",
      taskTitle: "语音识别文本校对",
      type: "speech_recognition",
      completedAt: "2024-01-05 17:30:00",
      duration: 200,
      itemsCompleted: 250,
      qualityScore: 95.7,
      feedback: "校对仔细，错误率低",
      reviewer: "质量审核员B",
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

  const getQualityLevel = (score: number) => {
    if (score >= 95) return { level: "优秀", color: "#52c41a" };
    if (score >= 90) return { level: "良好", color: "#1890ff" };
    if (score >= 80) return { level: "合格", color: "#faad14" };
    return { level: "待改进", color: "#ff4d4f" };
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
  };

  const columns: ColumnsType<AnnotationHistory> = [
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
      title: "完成时间",
      dataIndex: "completedAt",
      key: "completedAt",
      width: 150,
      render: (time: string) => (
        <div>
          <CalendarOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          <Text style={{ fontSize: 12 }}>{time}</Text>
        </div>
      ),
    },
    {
      title: "完成数量",
      dataIndex: "itemsCompleted",
      key: "itemsCompleted",
      width: 100,
      render: (count: number) => (
        <div style={{ textAlign: "center" }}>
          <Text strong style={{ color: "#1890ff" }}>
            {count}
          </Text>
          <div style={{ fontSize: 11, color: "#666" }}>条</div>
        </div>
      ),
    },
    {
      title: "耗时",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      render: (duration: number) => (
        <div>
          <ClockCircleOutlined style={{ marginRight: 4, color: "#faad14" }} />
          <Text style={{ fontSize: 12 }}>{formatDuration(duration)}</Text>
        </div>
      ),
    },
    {
      title: "质量评分",
      dataIndex: "qualityScore",
      key: "qualityScore",
      width: 120,
      render: (score: number) => {
        const { level, color } = getQualityLevel(score);
        return (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color }}>
              {score}%
            </div>
            <Tag color={color} style={{ fontSize: 10, margin: 0 }}>
              {level}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "审核员",
      dataIndex: "reviewer",
      key: "reviewer",
      width: 120,
      render: (reviewer: string) => (
        <Text style={{ fontSize: 12 }}>{reviewer}</Text>
      ),
    },
    {
      title: "反馈",
      dataIndex: "feedback",
      key: "feedback",
      width: 200,
      render: (feedback?: string) => (
        <Text
          style={{ fontSize: 12 }}
          ellipsis={{ tooltip: feedback }}
        >
          {feedback || "暂无反馈"}
        </Text>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.id)}
          />
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadReport(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleViewDetails = (_historyId: string) => {
    message.info("查看详细报告");
  };

  const handleDownloadReport = (_historyId: string) => {
    message.success("报告下载中...");
  };

  // 计算统计数据
  const totalCompleted = mockHistory.reduce(
    (sum, item) => sum + item.itemsCompleted,
    0,
  );
  const totalDuration = mockHistory.reduce(
    (sum, item) => sum + item.duration,
    0,
  );
  const averageQuality =
    mockHistory.reduce((sum, item) => sum + item.qualityScore, 0) /
    mockHistory.length;
  const averageSpeed = totalCompleted / (totalDuration / 60); // 每小时完成数量

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面标题 */}
      <Title level={4} style={{ margin: 0, marginBottom: 24 }}>
        历史任务
      </Title>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计完成任务"
              value={mockHistory.length}
              suffix="个"
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="累计标注数量"
              value={totalCompleted}
              suffix="条"
              prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均质量评分"
              value={averageQuality}
              precision={1}
              suffix="%"
              prefix={<StarOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均标注速度"
              value={averageSpeed}
              precision={1}
              suffix="条/小时"
              prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选和搜索 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space>
              <Search
                placeholder="搜索任务标题"
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="任务类型"
                style={{ width: 150 }}
                allowClear
                value={taskType}
                onChange={setTaskType}
                options={[
                  { label: "图像分类", value: "image_classification" },
                  { label: "目标检测", value: "object_detection" },
                  { label: "文本分类", value: "text_classification" },
                  { label: "情感分析", value: "sentiment_analysis" },
                  { label: "语音识别", value: "speech_recognition" },
                ]}
              />
              <RangePicker
                placeholder={["开始时间", "结束时间"]}
                style={{ width: 240 }}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => setLoading(true)}>刷新</Button>
              <Button type="primary" icon={<DownloadOutlined />}>
                导出报告
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 历史记录表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockHistory}
          rowKey="id"
          loading={loading}
          pagination={{
            total: mockHistory.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default TaskHistory;
