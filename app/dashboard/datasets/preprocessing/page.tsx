"use client";
import {
  BranchesOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  FunctionOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 预处理任务接口
interface PreprocessingTask {
  id: string;
  name: string;
  type: string;
  status: "pending" | "running" | "completed" | "failed" | "paused";
  progress: number;
  inputDataset: string;
  outputDataset?: string;
  operations: string[];
  createdAt: string;
  completedAt?: string;
  creator: string;
  inputCount: number;
  outputCount?: number;
  errorCount?: number;
}

// 预处理操作接口
interface PreprocessingOperation {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

// 预处理统计接口
interface PreprocessingStats {
  totalTasks: number;
  runningTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalDataProcessed: number;
  avgProcessingTime: number;
}

const DataPreprocessing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [operationDrawerVisible, setOperationDrawerVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PreprocessingTask | null>(null);
  const [taskForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // 模拟统计数据
  const [stats] = useState<PreprocessingStats>({
    totalTasks: 32,
    runningTasks: 8,
    completedTasks: 21,
    failedTasks: 3,
    totalDataProcessed: 89000,
    avgProcessingTime: 45,
  });

  // 模拟预处理任务数据
  const [tasks, setTasks] = useState<PreprocessingTask[]>([
    {
      id: "prep_001",
      name: "图像数据增强处理",
      type: "图像预处理",
      status: "running",
      progress: 68,
      inputDataset: "医疗影像原始数据集",
      outputDataset: "医疗影像增强数据集",
      operations: ["旋转", "缩放", "亮度调整", "噪声添加"],
      createdAt: "2024-01-15 09:30:00",
      creator: "张小明",
      inputCount: 5000,
      outputCount: 3400,
      errorCount: 12,
    },
    {
      id: "prep_002",
      name: "文本数据清洗",
      type: "文本预处理",
      status: "completed",
      progress: 100,
      inputDataset: "用户评论原始数据",
      outputDataset: "用户评论清洗数据",
      operations: ["去除HTML标签", "标点符号规范化", "停用词过滤"],
      createdAt: "2024-01-14 14:20:00",
      completedAt: "2024-01-14 16:45:00",
      creator: "李小红",
      inputCount: 8000,
      outputCount: 7650,
      errorCount: 350,
    },
    {
      id: "prep_003",
      name: "音频特征提取",
      type: "音频预处理",
      status: "failed",
      progress: 25,
      inputDataset: "语音识别训练数据",
      operations: ["降噪", "MFCC提取", "频谱分析"],
      createdAt: "2024-01-15 11:00:00",
      creator: "王小强",
      inputCount: 2000,
      outputCount: 500,
      errorCount: 1500,
    },
  ]);

  // 预处理操作模板
  const [operations] = useState<PreprocessingOperation[]>([
    {
      id: "op_001",
      name: "图像旋转",
      type: "transform",
      category: "图像变换",
      description: "对图像进行随机旋转，增加数据多样性",
      parameters: { angle_range: [-30, 30], probability: 0.5 },
      enabled: true,
    },
    {
      id: "op_002",
      name: "亮度调整",
      type: "enhance",
      category: "图像增强",
      description: "调整图像亮度，模拟不同光照条件",
      parameters: { brightness_range: [0.8, 1.2], probability: 0.3 },
      enabled: true,
    },
    {
      id: "op_003",
      name: "文本清洗",
      type: "clean",
      category: "文本处理",
      description: "去除HTML标签、特殊字符等",
      parameters: { remove_html: true, remove_urls: true, normalize_whitespace: true },
      enabled: true,
    },
    {
      id: "op_004",
      name: "停用词过滤",
      type: "filter",
      category: "文本处理",
      description: "过滤常见停用词，提高文本质量",
      parameters: { language: "chinese", custom_stopwords: [] },
      enabled: false,
    },
  ]);

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "running":
        return "processing";
      case "failed":
        return "error";
      case "paused":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "running":
        return "运行中";
      case "failed":
        return "失败";
      case "paused":
        return "已暂停";
      case "pending":
        return "等待中";
      default:
        return "未知";
    }
  };

  // 获取操作类型图标
  const getOperationIcon = (type: string) => {
    switch (type) {
      case "transform":
        return <BranchesOutlined style={{ color: "#1890ff" }} />;
      case "enhance":
        return <FunctionOutlined style={{ color: "#52c41a" }} />;
      case "clean":
        return <FilterOutlined style={{ color: "#faad14" }} />;
      case "filter":
        return <SearchOutlined style={{ color: "#722ed1" }} />;
      default:
        return <CodeOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  // 处理新建任务
  const handleCreateTask = () => {
    setTaskModalVisible(true);
    taskForm.resetFields();
  };

  // 处理任务确认
  const handleTaskConfirm = async () => {
    try {
      setLoading(true);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("预处理任务已创建，开始执行...");
      setTaskModalVisible(false);
      taskForm.resetFields();
    } catch (_error) {
      message.error("创建任务失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理任务操作
  const handleTaskAction = (taskId: string, action: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    switch (action) {
      case "pause":
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, status: "paused" as any } : t,
        ));
        message.success("任务已暂停");
        break;
      case "resume":
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, status: "running" as any } : t,
        ));
        message.success("任务已恢复");
        break;
      case "stop":
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, status: "failed" as any } : t,
        ));
        message.success("任务已停止");
        break;
      case "retry":
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, status: "running" as any, progress: 0 } : t,
        ));
        message.success("任务已重新开始");
        break;
      default:
        break;
    }
  };

  // 查看任务详情
  const handleViewTask = (task: PreprocessingTask) => {
    setSelectedTask(task);
    setOperationDrawerVisible(true);
  };

  // 任务表格列
  const taskColumns: ColumnsType<PreprocessingTask> = [
    {
      title: "任务信息",
      key: "taskInfo",
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            输入: {record.inputDataset}
          </Text>
          {record.outputDataset && (
            <>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                输出: {record.outputDataset}
              </Text>
            </>
          )}
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Badge
          status={getStatusColor(status) as any}
          text={getStatusText(status)}
        />
      ),
    },
    {
      title: "进度",
      key: "progress",
      width: 150,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.progress}
            size="small"
            status={record.status === "failed" ? "exception" : "active"}
          />
          <Text style={{ fontSize: 12 }}>
            {record.outputCount || 0} / {record.inputCount}
          </Text>
        </div>
      ),
    },
    {
      title: "操作步骤",
      dataIndex: "operations",
      key: "operations",
      width: 200,
      render: (operations: string[]) => (
        <Space size={4} wrap>
          {operations.slice(0, 3).map((op, index) => (
            <Tag key={index} className="small-tag">
              {op}
            </Tag>
          ))}
          {operations.length > 3 && (
            <Tag className="small-tag">+{operations.length - 3}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: "创建者",
      dataIndex: "creator",
      key: "creator",
      width: 100,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewTask(record)}
            />
          </Tooltip>
          {record.status === "running" && (
            <Tooltip title="暂停">
              <Button
                type="text"
                size="small"
                icon={<StopOutlined />}
                onClick={() => handleTaskAction(record.id, "pause")}
              />
            </Tooltip>
          )}
          {record.status === "paused" && (
            <Tooltip title="恢复">
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => handleTaskAction(record.id, "resume")}
              />
            </Tooltip>
          )}
          {record.status === "failed" && (
            <Tooltip title="重试">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => handleTaskAction(record.id, "retry")}
              />
            </Tooltip>
          )}
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleTaskAction(record.id, "delete")}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 过滤任务
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          数据预处理
        </Title>
        <Text type="secondary">
          对原始数据进行清洗、增强和转换，提高数据质量和标注效率
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={stats.totalTasks}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="运行中"
              value={stats.runningTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="处理数据量"
              value={stats.totalDataProcessed}
              suffix="条"
              prefix={<FunctionOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 任务列表 */}
      <Card
        title="预处理任务"
        extra={
          <Space>
            <Input
              placeholder="搜索任务"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部状态</Option>
              <Option value="running">运行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="failed">失败</Option>
              <Option value="paused">已暂停</Option>
              <Option value="pending">等待中</Option>
            </Select>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: 140 }}
            >
              <Option value="all">全部类型</Option>
              <Option value="图像预处理">图像预处理</Option>
              <Option value="文本预处理">文本预处理</Option>
              <Option value="音频预处理">音频预处理</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTask}
            >
              新建任务
            </Button>
          </Space>
        }
      >
        <Table
          columns={taskColumns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 新建任务模态框 */}
      <Modal
        title="新建预处理任务"
        open={taskModalVisible}
        onOk={handleTaskConfirm}
        onCancel={() => setTaskModalVisible(false)}
        confirmLoading={loading}
        width={800}
      >
        <Form
          form={taskForm}
          layout="vertical"
          initialValues={{
            type: "图像预处理",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="任务名称"
                rules={[{ required: true, message: "请输入任务名称" }]}
              >
                <Input placeholder="请输入预处理任务名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="处理类型"
                rules={[{ required: true, message: "请选择处理类型" }]}
              >
                <Select placeholder="选择预处理类型">
                  <Option value="图像预处理">图像预处理</Option>
                  <Option value="文本预处理">文本预处理</Option>
                  <Option value="音频预处理">音频预处理</Option>
                  <Option value="视频预处理">视频预处理</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="inputDataset"
                label="输入数据集"
                rules={[{ required: true, message: "请选择输入数据集" }]}
              >
                <Select placeholder="选择要处理的数据集">
                  <Option value="dataset_001">医疗影像原始数据集</Option>
                  <Option value="dataset_002">用户评论原始数据</Option>
                  <Option value="dataset_003">语音识别训练数据</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="outputDataset"
                label="输出数据集名称"
                rules={[{ required: true, message: "请输入输出数据集名称" }]}
              >
                <Input placeholder="处理后的数据集名称" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="预处理操作">
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {operations.map((operation) => (
                <Card
                  key={operation.id}
                  size="small"
                  style={{ marginBottom: 8 }}
                  bodyStyle={{ padding: 12 }}
                >
                  <Row align="middle">
                    <Col span={2}>
                      <Switch
                        size="small"
                        defaultChecked={operation.enabled}
                      />
                    </Col>
                    <Col span={2}>
                      {getOperationIcon(operation.type)}
                    </Col>
                    <Col span={20}>
                      <div>
                        <Text strong>{operation.name}</Text>
                        <Tag className="small-tag" style={{ marginLeft: 8 }}>
                          {operation.category}
                        </Tag>
                      </div>
                      <Paragraph
                        type="secondary"
                        style={{ fontSize: 12, margin: 0 }}
                      >
                        {operation.description}
                      </Paragraph>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          </Form.Item>

          <Form.Item name="description" label="任务描述">
            <TextArea
              rows={3}
              placeholder="请输入任务描述（可选）"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务详情抽屉 */}
      <Drawer
        title="任务详情"
        placement="right"
        width={600}
        open={operationDrawerVisible}
        onClose={() => setOperationDrawerVisible(false)}
      >
        {selectedTask && (
          <div>
            <Descriptions title="基本信息" bordered size="small">
              <Descriptions.Item label="任务名称" span={3}>
                {selectedTask.name}
              </Descriptions.Item>
              <Descriptions.Item label="处理类型">
                {selectedTask.type}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <Badge
                  status={getStatusColor(selectedTask.status) as any}
                  text={getStatusText(selectedTask.status)}
                />
              </Descriptions.Item>
              <Descriptions.Item label="进度">
                {selectedTask.progress}%
              </Descriptions.Item>
              <Descriptions.Item label="输入数据集" span={3}>
                {selectedTask.inputDataset}
              </Descriptions.Item>
              {selectedTask.outputDataset && (
                <Descriptions.Item label="输出数据集" span={3}>
                  {selectedTask.outputDataset}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="创建时间">
                {selectedTask.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="创建者">
                {selectedTask.creator}
              </Descriptions.Item>
              {selectedTask.completedAt && (
                <Descriptions.Item label="完成时间">
                  {selectedTask.completedAt}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Title level={5}>处理统计</Title>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Statistic
                  title="输入数据"
                  value={selectedTask.inputCount}
                  suffix="条"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="输出数据"
                  value={selectedTask.outputCount || 0}
                  suffix="条"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="错误数据"
                  value={selectedTask.errorCount || 0}
                  suffix="条"
                  valueStyle={{ color: "#ff4d4f" }}
                />
              </Col>
            </Row>

            <Progress
              percent={selectedTask.progress}
              status={selectedTask.status === "failed" ? "exception" : "active"}
            />

            <Divider />

            <Title level={5}>处理操作</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              {selectedTask.operations.map((operation, index) => (
                <Card key={index} size="small">
                  <Space>
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    <Text>{operation}</Text>
                  </Space>
                </Card>
              ))}
            </Space>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default DataPreprocessing;
