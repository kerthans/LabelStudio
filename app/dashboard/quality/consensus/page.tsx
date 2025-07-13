"use client";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
  SyncOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Input,
  List,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 一致性检查任务接口
interface ConsensusTask {
  id: string;
  taskName: string;
  taskType: string;
  datasetSize: number;
  annotatorCount: number;
  annotators: string[];
  consensusRate: number;
  conflictCount: number;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  priority: "high" | "medium" | "low";
  agreementThreshold: number;
  currentAgreement: number;
}

// 冲突详情接口
interface ConflictDetail {
  id: string;
  itemId: string;
  itemType: string;
  annotators: {
    name: string;
    label: string;
    confidence: number;
  }[];
  conflictType: "label" | "boundary" | "attribute";
  severity: "high" | "medium" | "low";
  resolvedBy?: string;
  resolution?: string;
  resolvedAt?: string;
}

const QualityConsensus: React.FC = () => {
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<ConsensusTask | null>(null);
  const [conflictDetails, setConflictDetails] = useState<ConflictDetail[]>([]);

  // 模拟一致性检查任务数据
  const [tasks] = useState<ConsensusTask[]>([
    {
      id: "consensus_001",
      taskName: "医疗影像病灶标注一致性检查",
      taskType: "图像分割",
      datasetSize: 1200,
      annotatorCount: 3,
      annotators: ["张医生", "李医生", "王医生"],
      consensusRate: 87.5,
      conflictCount: 45,
      status: "completed",
      createdAt: "2024-01-15 09:00:00",
      completedAt: "2024-01-15 16:30:00",
      priority: "high",
      agreementThreshold: 85,
      currentAgreement: 87.5,
    },
    {
      id: "consensus_002",
      taskName: "文本情感分类一致性验证",
      taskType: "文本分类",
      datasetSize: 2000,
      annotatorCount: 4,
      annotators: ["标注员A", "标注员B", "标注员C", "标注员D"],
      consensusRate: 92.3,
      conflictCount: 23,
      status: "processing",
      createdAt: "2024-01-15 14:00:00",
      priority: "medium",
      agreementThreshold: 90,
      currentAgreement: 92.3,
    },
    {
      id: "consensus_003",
      taskName: "语音转录准确性对比",
      taskType: "语音标注",
      datasetSize: 800,
      annotatorCount: 2,
      annotators: ["转录员1", "转录员2"],
      consensusRate: 78.2,
      conflictCount: 67,
      status: "pending",
      createdAt: "2024-01-16 10:00:00",
      priority: "high",
      agreementThreshold: 85,
      currentAgreement: 78.2,
    },
  ]);

  // 获取状态颜色和文本
  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "orange", text: "待处理", icon: <WarningOutlined /> },
      processing: { color: "blue", text: "检查中", icon: <SyncOutlined spin /> },
      completed: { color: "green", text: "已完成", icon: <CheckCircleOutlined /> },
      failed: { color: "red", text: "检查失败", icon: <CloseCircleOutlined /> },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: { color: "red", text: "高" },
      medium: { color: "orange", text: "中" },
      low: { color: "blue", text: "低" },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  // 开始一致性检查
  const handleStartConsensus = (_task: ConsensusTask) => {
    message.loading("正在启动一致性检查...", 2);
    setTimeout(() => {
      message.success("一致性检查已启动");
    }, 2000);
  };

  // 查看详情
  const handleViewDetails = (task: ConsensusTask) => {
    setCurrentTask(task);
    // 模拟冲突详情数据
    setConflictDetails([
      {
        id: "conflict_001",
        itemId: "img_001",
        itemType: "医疗影像",
        annotators: [
          { name: "张医生", label: "恶性肿瘤", confidence: 0.95 },
          { name: "李医生", label: "良性肿瘤", confidence: 0.88 },
          { name: "王医生", label: "恶性肿瘤", confidence: 0.92 },
        ],
        conflictType: "label",
        severity: "high",
      },
      {
        id: "conflict_002",
        itemId: "img_002",
        itemType: "医疗影像",
        annotators: [
          { name: "张医生", label: "正常", confidence: 0.78 },
          { name: "李医生", label: "异常", confidence: 0.82 },
          { name: "王医生", label: "正常", confidence: 0.85 },
        ],
        conflictType: "label",
        severity: "medium",
        resolvedBy: "专家审核员",
        resolution: "经专家审核确认为正常",
        resolvedAt: "2024-01-15 15:30:00",
      },
    ]);
    setDetailDrawerVisible(true);
  };

  // 表格列配置
  const columns: ColumnsType<ConsensusTask> = [
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
              {record.datasetSize} 条数据
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: "标注员",
      key: "annotators",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <UserOutlined style={{ marginRight: 4 }} />
            <Text strong>{record.annotatorCount} 人</Text>
          </div>
          <div>
            {record.annotators.slice(0, 2).map((name, index) => (
              <Tag key={index} className="small-tag" style={{ marginBottom: 2 }}>
                {name}
              </Tag>
            ))}
            {record.annotators.length > 2 && (
              <Tag className="small-tag" color="default">
                +{record.annotators.length - 2}
              </Tag>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "一致性指标",
      key: "consensus",
      width: 180,
      render: (_, record) => {
        const isAboveThreshold = record.currentAgreement >= record.agreementThreshold;
        return (
          <div>
            <div style={{ marginBottom: 8 }}>
              <Progress
                percent={record.currentAgreement}
                size="small"
                strokeColor={isAboveThreshold ? "#52c41a" : "#faad14"}
                format={(percent) => `${percent}%`}
              />
            </div>
            <Space size={16}>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>阈值</Text>
                <div>{record.agreementThreshold}%</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>冲突</Text>
                <div style={{ color: record.conflictCount > 30 ? "#ff4d4f" : "#666" }}>
                  {record.conflictCount}
                </div>
              </div>
            </Space>
          </div>
        );
      },
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
      },
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (priority) => {
        const config = getPriorityConfig(priority);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
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
      ),
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
            <Tooltip title="开始检查">
              <Button
                size="small"
                icon={<SyncOutlined />}
                onClick={() => handleStartConsensus(record)}
              >
                开始
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
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
          一致性检查
        </Title>
        <Text type="secondary">
          检查多个标注员对同一数据的标注一致性，识别和解决标注冲突
        </Text>
      </div>

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
              <Option value="pending">待处理</Option>
              <Option value="processing">检查中</Option>
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
              <Option value="图像分割">图像分割</Option>
              <Option value="文本分类">文本分类</Option>
              <Option value="语音标注">语音标注</Option>
              <Option value="目标检测">目标检测</Option>
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
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title={`一致性检查详情: ${currentTask?.taskName}`}
        width={800}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {currentTask && (
          <div>
            {/* 基本信息 */}
            <Card title="基本信息" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic title="数据总量" value={currentTask.datasetSize} suffix="条" />
                </Col>
                <Col span={12}>
                  <Statistic title="标注员数量" value={currentTask.annotatorCount} suffix="人" />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="一致性率"
                    value={currentTask.currentAgreement}
                    suffix="%"
                    valueStyle={{
                      color: currentTask.currentAgreement >= currentTask.agreementThreshold ? "#52c41a" : "#faad14",
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="冲突数量"
                    value={currentTask.conflictCount}
                    suffix="个"
                    valueStyle={{ color: currentTask.conflictCount > 30 ? "#ff4d4f" : "#666" }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 标注员列表 */}
            <Card title="参与标注员" style={{ marginBottom: 16 }}>
              <List
                dataSource={currentTask.annotators}
                renderItem={(annotator) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={annotator}
                      description="标注质量: 优秀"
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* 冲突详情 */}
            <Card title="冲突详情">
              <List
                dataSource={conflictDetails}
                renderItem={(conflict) => (
                  <List.Item>
                    <div style={{ width: "100%" }}>
                      <div style={{ marginBottom: 8 }}>
                        <Space>
                          <Text strong>数据项: {conflict.itemId}</Text>
                          <Tag color={conflict.severity === "high" ? "red" : conflict.severity === "medium" ? "orange" : "blue"}>
                            {conflict.severity === "high" ? "高" : conflict.severity === "medium" ? "中" : "低"}严重性
                          </Tag>
                          {conflict.resolvedBy && (
                            <Tag color="green">已解决</Tag>
                          )}
                        </Space>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Text type="secondary">标注冲突:</Text>
                        {conflict.annotators.map((ann, index) => (
                          <div key={index} style={{ marginLeft: 16, marginTop: 4 }}>
                            <Text>{ann.name}: </Text>
                            <Tag>{ann.label}</Tag>
                            <Text type="secondary">(置信度: {(ann.confidence * 100).toFixed(1)}%)</Text>
                          </div>
                        ))}
                      </div>
                      {conflict.resolution && (
                        <div>
                          <Text type="secondary">解决方案: </Text>
                          <Text>{conflict.resolution}</Text>
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              解决人: {conflict.resolvedBy} | 时间: {conflict.resolvedAt}
                            </Text>
                          </div>
                        </div>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default QualityConsensus;
