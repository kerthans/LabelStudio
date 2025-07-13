"use client";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
  WarningOutlined
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 抽样检查任务接口
interface SamplingTask {
  id: string;
  taskName: string;
  taskType: string;
  totalDataSize: number;
  sampleSize: number;
  samplingMethod: "random" | "stratified" | "systematic" | "cluster";
  samplingRate: number;
  qualityScore: number;
  issueCount: number;
  status: "pending" | "sampling" | "reviewing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  reviewer?: string;
  priority: "high" | "medium" | "low";
  confidence: number;
  errorRate: number;
}

// 抽样结果接口
interface SamplingResult {
  id: string;
  itemId: string;
  originalLabel: string;
  reviewLabel: string;
  isCorrect: boolean;
  confidence: number;
  issueType?: string;
  comments?: string;
  reviewer: string;
  reviewTime: string;
}

const QualitySampling: React.FC = () => {
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<SamplingTask | null>(null);
  const [samplingResults, setSamplingResults] = useState<SamplingResult[]>([]);
  const [form] = Form.useForm();

  // 模拟抽样检查任务数据
  const [tasks] = useState<SamplingTask[]>([
    {
      id: "sampling_001",
      taskName: "医疗影像标注质量抽检",
      taskType: "图像分类",
      totalDataSize: 5000,
      sampleSize: 250,
      samplingMethod: "stratified",
      samplingRate: 5.0,
      qualityScore: 94.8,
      issueCount: 13,
      status: "completed",
      createdAt: "2024-01-15 09:00:00",
      completedAt: "2024-01-15 17:30:00",
      reviewer: "质量专家A",
      priority: "high",
      confidence: 95.2,
      errorRate: 5.2
    },
    {
      id: "sampling_002",
      taskName: "文本分类标注抽样验证",
      taskType: "文本分类",
      totalDataSize: 8000,
      sampleSize: 400,
      samplingMethod: "random",
      samplingRate: 5.0,
      qualityScore: 91.5,
      issueCount: 34,
      status: "reviewing",
      createdAt: "2024-01-15 14:00:00",
      reviewer: "质量专家B",
      priority: "medium",
      confidence: 92.8,
      errorRate: 8.5
    },
    {
      id: "sampling_003",
      taskName: "目标检测边界框抽检",
      taskType: "目标检测",
      totalDataSize: 3000,
      sampleSize: 300,
      samplingMethod: "systematic",
      samplingRate: 10.0,
      qualityScore: 0,
      issueCount: 0,
      status: "pending",
      createdAt: "2024-01-16 10:00:00",
      priority: "high",
      confidence: 0,
      errorRate: 0
    }
  ]);

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "orange", text: "待开始", icon: <WarningOutlined /> },
      sampling: { color: "blue", text: "抽样中", icon: <PlayCircleOutlined /> },
      reviewing: { color: "purple", text: "审核中", icon: <EyeOutlined /> },
      completed: { color: "green", text: "已完成", icon: <CheckCircleOutlined /> },
      failed: { color: "red", text: "检查失败", icon: <CloseCircleOutlined /> }
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: { color: "red", text: "高" },
      medium: { color: "orange", text: "中" },
      low: { color: "blue", text: "低" }
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const getSamplingMethodText = (method: string) => {
    const methods = {
      random: "随机抽样",
      stratified: "分层抽样",
      systematic: "系统抽样",
      cluster: "整群抽样"
    };
    return methods[method as keyof typeof methods] || method;
  };

  // 开始抽样检查
  const handleStartSampling = (_task: SamplingTask) => {
    message.loading("正在生成抽样样本...", 2);
    setTimeout(() => {
      message.success("抽样检查已启动，样本已生成");
    }, 2000);
  };

  // 查看详情
  const handleViewDetails = (task: SamplingTask) => {
    setCurrentTask(task);
    // 模拟抽样结果数据
    setSamplingResults([
      {
        id: "result_001",
        itemId: "img_001",
        originalLabel: "恶性肿瘤",
        reviewLabel: "恶性肿瘤",
        isCorrect: true,
        confidence: 0.95,
        reviewer: "质量专家A",
        reviewTime: "2024-01-15 15:30:00"
      },
      {
        id: "result_002",
        itemId: "img_002",
        originalLabel: "良性肿瘤",
        reviewLabel: "恶性肿瘤",
        isCorrect: false,
        confidence: 0.88,
        issueType: "标注错误",
        comments: "边界不清晰，需要重新标注",
        reviewer: "质量专家A",
        reviewTime: "2024-01-15 15:35:00"
      },
      {
        id: "result_003",
        itemId: "img_003",
        originalLabel: "正常",
        reviewLabel: "正常",
        isCorrect: true,
        confidence: 0.92,
        reviewer: "质量专家A",
        reviewTime: "2024-01-15 15:40:00"
      }
    ]);
    setDetailDrawerVisible(true);
  };

  // 配置抽样参数
  const handleConfigSampling = () => {
    setConfigModalVisible(true);
    form.setFieldsValue({
      samplingRate: 5,
      samplingMethod: "random",
      minSampleSize: 100,
      maxSampleSize: 1000
    });
  };

  // 提交抽样配置
  const handleSubmitConfig = async () => {
    try {
      const values = await form.validateFields();
      console.log("抽样配置:", values);
      setConfigModalVisible(false);
      message.success("抽样配置已保存");
    } catch (error) {
      console.error("表单验证失败:", error);
    }
  };

  // 表格列配置
  const columns: ColumnsType<SamplingTask> = [
    {
      title: "任务信息",
      key: "taskInfo",
      width: 280,
      fixed: "left",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.taskName}</div>
          <Space size={4}>
            <Tag color="blue">{record.taskType}</Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.totalDataSize} 条数据
            </Text>
          </Space>
        </div>
      )
    },
    {
      title: "抽样配置",
      key: "sampling",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text strong>{getSamplingMethodText(record.samplingMethod)}</Text>
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            样本量: {record.sampleSize} ({record.samplingRate}%)
          </div>
        </div>
      )
    },
    {
      title: "质量指标",
      key: "quality",
      width: 180,
      render: (_, record) => {
        if (record.status === "pending" || record.status === "sampling") {
          return <Text type="secondary">待检查</Text>;
        }
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <Progress
                percent={record.qualityScore}
                size="small"
                strokeColor={record.qualityScore >= 95 ? "#52c41a" : record.qualityScore >= 85 ? "#faad14" : "#ff4d4f"}
                format={(percent) => `${percent}%`}
              />
            </div>
            <Space size={16}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>错误率</Text>
                <div style={{ color: record.errorRate > 10 ? "#ff4d4f" : "#666" }}>
                  {record.errorRate}%
                </div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>问题</Text>
                <div style={{ color: record.issueCount > 20 ? "#ff4d4f" : "#666" }}>
                  {record.issueCount}
                </div>
              </div>
            </Space>
          </div>
        );
      }
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Badge
            color={config.color}
            text={
              <Space size={4}>
                {config.icon}
                {config.text}
              </Space>
            }
          />
        );
      }
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (priority) => {
        const config = getPriorityConfig(priority);
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: "审核员",
      dataIndex: "reviewer",
      key: "reviewer",
      width: 100,
      render: (reviewer) => reviewer || "-"
    },
    {
      title: "时间",
      key: "time",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>
            创建: {dayjs(record.createdAt).format("MM-DD HH:mm")}
          </div>
          {record.completedAt && (
            <div style={{ fontSize: 12, color: "#52c41a" }}>
              完成: {dayjs(record.completedAt).format("MM-DD HH:mm")}
            </div>
          )}
        </div>
      )
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            >
              详情
            </Button>
          </Tooltip>
          {record.status === "pending" && (
            <Tooltip title="开始抽检">
              <Button
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStartSampling(record)}
              >
                开始
              </Button>
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // 抽样结果表格列
  const resultColumns: ColumnsType<SamplingResult> = [
    {
      title: "数据项",
      dataIndex: "itemId",
      key: "itemId",
      width: 120
    },
    {
      title: "原始标注",
      dataIndex: "originalLabel",
      key: "originalLabel",
      width: 120,
      render: (label) => <Tag color="blue">{label}</Tag>
    },
    {
      title: "审核标注",
      dataIndex: "reviewLabel",
      key: "reviewLabel",
      width: 120,
      render: (label) => <Tag color="green">{label}</Tag>
    },
    {
      title: "结果",
      dataIndex: "isCorrect",
      key: "isCorrect",
      width: 80,
      render: (isCorrect) => (
        <Badge
          color={isCorrect ? "green" : "red"}
          text={isCorrect ? "正确" : "错误"}
        />
      )
    },
    {
      title: "置信度",
      dataIndex: "confidence",
      key: "confidence",
      width: 100,
      render: (confidence) => `${(confidence * 100).toFixed(1)}%`
    },
    {
      title: "问题类型",
      dataIndex: "issueType",
      key: "issueType",
      width: 100,
      render: (type) => type ? <Tag color="orange">{type}</Tag> : "-"
    },
    {
      title: "备注",
      dataIndex: "comments",
      key: "comments",
      width: 200,
      render: (comments) => comments || "-"
    }
  ];

  // 筛选数据
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.taskName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.taskType === typeFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          抽样检查
        </Title>
        <Text type="secondary">
          通过科学的抽样方法对标注数据进行质量检查，评估整体标注质量
        </Text>
      </div>

      {/* 抽样方法说明 */}
      <Alert
        message="抽样方法说明"
        description={
          <div>
            <Text strong>随机抽样:</Text> 从总体中随机选择样本，适用于数据分布均匀的情况<br />
            <Text strong>分层抽样:</Text> 按数据类别分层后再抽样，确保各类别都有代表性<br />
            <Text strong>系统抽样:</Text> 按固定间隔抽取样本，适用于大规模数据集<br />
            <Text strong>整群抽样:</Text> 将数据分组后随机选择整个组，适用于数据有自然分组的情况
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 筛选和操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="搜索任务名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待开始</Option>
              <Option value="sampling">抽样中</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="completed">已完成</Option>
              <Option value="failed">检查失败</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="类型"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部类型</Option>
              <Option value="图像分类">图像分类</Option>
              <Option value="文本分类">文本分类</Option>
              <Option value="目标检测">目标检测</Option>
              <Option value="语音标注">语音标注</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4} lg={3}>
            <Select
              placeholder="优先级"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部优先级</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                type="primary"
                icon={<SettingOutlined />}
                onClick={handleConfigSampling}
              >
                抽样配置
              </Button>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 任务列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredTasks.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title={`抽样检查详情: ${currentTask?.taskName}`}
        width={1000}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentTask && (
          <div>
            {/* 基本信息 */}
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic title="总数据量" value={currentTask.totalDataSize} suffix="条" />
                </Col>
                <Col span={8}>
                  <Statistic title="抽样数量" value={currentTask.sampleSize} suffix="条" />
                </Col>
                <Col span={8}>
                  <Statistic title="抽样比例" value={currentTask.samplingRate} suffix="%" />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="质量评分"
                    value={currentTask.qualityScore || 0}
                    suffix="%"
                    valueStyle={{
                      color: currentTask.qualityScore >= 95 ? "#52c41a" :
                        currentTask.qualityScore >= 85 ? "#faad14" : "#ff4d4f"
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="错误率"
                    value={currentTask.errorRate || 0}
                    suffix="%"
                    valueStyle={{ color: currentTask.errorRate > 10 ? "#ff4d4f" : "#666" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="置信度"
                    value={currentTask.confidence || 0}
                    suffix="%"
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 抽样结果 */}
            <Card title="抽样结果">
              {currentTask.status === "completed" ? (
                <Table
                  columns={resultColumns}
                  dataSource={samplingResults}
                  rowKey="id"
                  size="small"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false
                  }}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
                  <Text>抽样检查尚未完成，暂无结果数据</Text>
                </div>
              )}
            </Card>
          </div>
        )}
      </Drawer>

      {/* 抽样配置模态框 */}
      <Modal
        title="抽样配置"
        open={configModalVisible}
        onOk={handleSubmitConfig}
        onCancel={() => setConfigModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="抽样比例"
                name="samplingRate"
                rules={[{ required: true, message: "请输入抽样比例" }]}
              >
                <InputNumber
                  min={1}
                  max={50}
                  suffix="%"
                  style={{ width: "100%" }}
                  placeholder="建议5-10%"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="抽样方法"
                name="samplingMethod"
                rules={[{ required: true, message: "请选择抽样方法" }]}
              >
                <Select placeholder="选择抽样方法">
                  <Option value="random">随机抽样</Option>
                  <Option value="stratified">分层抽样</Option>
                  <Option value="systematic">系统抽样</Option>
                  <Option value="cluster">整群抽样</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="最小样本量"
                name="minSampleSize"
                rules={[{ required: true, message: "请输入最小样本量" }]}
              >
                <InputNumber
                  min={50}
                  max={1000}
                  style={{ width: "100%" }}
                  placeholder="建议不少于100"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="最大样本量"
                name="maxSampleSize"
                rules={[{ required: true, message: "请输入最大样本量" }]}
              >
                <InputNumber
                  min={100}
                  max={5000}
                  style={{ width: "100%" }}
                  placeholder="建议不超过1000"
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Alert
            message="抽样建议"
            description="为确保抽样结果的可靠性，建议抽样比例控制在5-10%之间，样本量不少于100条。对于重要任务，可适当提高抽样比例。"
            type="info"
            showIcon
          />
        </Form>
      </Modal>
    </div>
  );
};

export default QualitySampling;
