"use client";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Input,
  List,
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
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;

// 任务数据类型
interface TaskData {
  id: string;
  name: string;
  type: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "assigned" | "in_progress" | "completed";
  dataCount: number;
  completedCount: number;
  assignedTo: string[];
  deadline: string;
  estimatedHours: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
}

// 标注员数据类型
interface AnnotatorData {
  id: string;
  name: string;
  avatar: string;
  level: string;
  skills: string[];
  currentTasks: number;
  maxTasks: number;
  efficiency: number;
  accuracy: number;
  status: "online" | "busy" | "offline";
  workload: number;
}

const TaskAssign: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedAnnotators, setSelectedAnnotators] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  // 模拟任务数据
  const tasks: TaskData[] = [
    {
      id: "task_001",
      name: "医疗影像分类标注",
      type: "图像分类",
      priority: "high",
      status: "pending",
      dataCount: 5000,
      completedCount: 0,
      assignedTo: [],
      deadline: "2024-01-20",
      estimatedHours: 120,
      difficulty: "medium",
      createdAt: "2024-01-10",
    },
    {
      id: "task_002",
      name: "用户评论情感分析",
      type: "文本分类",
      priority: "medium",
      status: "assigned",
      dataCount: 3000,
      completedCount: 450,
      assignedTo: ["user1", "user2"],
      deadline: "2024-01-25",
      estimatedHours: 80,
      difficulty: "easy",
      createdAt: "2024-01-08",
    },
    {
      id: "task_003",
      name: "自动驾驶场景目标检测",
      type: "目标检测",
      priority: "high",
      status: "in_progress",
      dataCount: 2000,
      completedCount: 800,
      assignedTo: ["user3", "user4"],
      deadline: "2024-01-30",
      estimatedHours: 200,
      difficulty: "hard",
      createdAt: "2024-01-05",
    },
  ];

  // 模拟标注员数据
  const annotators: AnnotatorData[] = [
    {
      id: "user1",
      name: "张小明",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
      level: "高级标注员",
      skills: ["图像分类", "目标检测"],
      currentTasks: 2,
      maxTasks: 5,
      efficiency: 95,
      accuracy: 96.8,
      status: "online",
      workload: 40,
    },
    {
      id: "user2",
      name: "李小红",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
      level: "中级标注员",
      skills: ["文本分类", "情感分析"],
      currentTasks: 1,
      maxTasks: 4,
      efficiency: 88,
      accuracy: 94.2,
      status: "online",
      workload: 25,
    },
    {
      id: "user3",
      name: "王小强",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
      level: "专家标注员",
      skills: ["目标检测", "语音标注", "视频标注"],
      currentTasks: 3,
      maxTasks: 6,
      efficiency: 92,
      accuracy: 98.1,
      status: "busy",
      workload: 50,
    },
    {
      id: "user4",
      name: "赵小美",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4",
      level: "初级标注员",
      skills: ["图像分类", "文本分类"],
      currentTasks: 1,
      maxTasks: 3,
      efficiency: 78,
      accuracy: 92.5,
      status: "online",
      workload: 33,
    },
  ];

  // 获取优先级颜色
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

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "assigned":
        return "processing";
      case "in_progress":
        return "warning";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "green";
      case "medium":
        return "orange";
      case "hard":
        return "red";
      default:
        return "default";
    }
  };

  // 任务表格列配置
  const taskColumns: ColumnsType<TaskData> = [
    {
      title: "任务信息",
      key: "taskInfo",
      width: 300,
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 14 }}>
            {record.name}
          </Text>
          <br />
          <Space size={4} style={{ marginTop: 4 }}>
            <Tag color="blue" className="small-tag">
              {record.type}
            </Tag>
            <Tag color={getPriorityColor(record.priority)} className="small-tag">
              {record.priority === "high" ? "高优先级" : record.priority === "medium" ? "中优先级" : "低优先级"}
            </Tag>
            <Tag color={getDifficultyColor(record.difficulty)} className="small-tag">
              {record.difficulty === "easy" ? "简单" : record.difficulty === "medium" ? "中等" : "困难"}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: "进度",
      key: "progress",
      width: 200,
      render: (_, record) => {
        const progress = Math.round((record.completedCount / record.dataCount) * 100);
        return (
          <div>
            <Progress
              percent={progress}
              size="small"
              status={progress === 100 ? "success" : "active"}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.completedCount} / {record.dataCount}
            </Text>
          </div>
        );
      },
    },
    {
      title: "分配状态",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const statusMap = {
          pending: "待分配",
          assigned: "已分配",
          in_progress: "进行中",
          completed: "已完成",
        };
        return (
          <Badge
            status={getStatusColor(status) as any}
            text={statusMap[status as keyof typeof statusMap]}
          />
        );
      },
    },
    {
      title: "分配人员",
      key: "assignedTo",
      width: 150,
      render: (_, record) => (
        <div>
          {record.assignedTo.length > 0 ? (
            <Avatar.Group maxCount={3} size="small">
              {record.assignedTo.map((userId) => {
                const user = annotators.find((a) => a.id === userId);
                return (
                  <Tooltip key={userId} title={user?.name}>
                    <Avatar src={user?.avatar} size="small" />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          ) : (
            <Text type="secondary">未分配</Text>
          )}
        </div>
      ),
    },
    {
      title: "截止时间",
      dataIndex: "deadline",
      key: "deadline",
      width: 120,
      render: (deadline: string) => {
        const isOverdue = new Date(deadline) < new Date();
        return isOverdue ? (
          <Text type="danger">{deadline}</Text>
        ) : (
          <Text>{deadline}</Text>
        );
      },
    },
    {
      title: "预估工时",
      dataIndex: "estimatedHours",
      key: "estimatedHours",
      width: 100,
      render: (hours: number) => `${hours}h`,
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
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewTask(record.id)}
            />
          </Tooltip>
          <Tooltip title="分配任务">
            <Button
              type="text"
              icon={<TeamOutlined />}
              size="small"
              onClick={() => handleAssignTask(record.id)}
              disabled={record.status === "completed"}
            />
          </Tooltip>
          <Tooltip title="任务设置">
            <Button
              type="text"
              icon={<SettingOutlined />}
              size="small"
              onClick={() => handleTaskSettings(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 处理查看任务
  const handleViewTask = (taskId: string) => {
    message.info(`查看任务: ${taskId}`);
  };

  // 处理分配任务
  const handleAssignTask = (taskId: string) => {
    setSelectedTasks([taskId]);
    setAssignModalVisible(true);
  };

  // 处理任务设置
  const handleTaskSettings = (taskId: string) => {
    message.info(`任务设置: ${taskId}`);
  };

  // 处理批量分配
  const handleBatchAssign = () => {
    if (selectedTasks.length === 0) {
      message.warning("请先选择要分配的任务");
      return;
    }
    setAssignModalVisible(true);
  };

  // 处理分配确认
  const handleAssignConfirm = async () => {
    if (selectedAnnotators.length === 0) {
      message.warning("请选择标注人员");
      return;
    }

    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success(`成功分配 ${selectedTasks.length} 个任务给 ${selectedAnnotators.length} 位标注员`);
      setAssignModalVisible(false);
      setSelectedTasks([]);
      setSelectedAnnotators([]);
    } catch (_error) {
      message.error("分配失败");
    } finally {
      setLoading(false);
    }
  };

  // 智能推荐分配
  const handleSmartAssign = () => {
    message.info("正在进行智能分配推荐...");
    // 这里可以实现智能分配逻辑
  };

  // 过滤任务
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesSearch = task.name.toLowerCase().includes(searchText.toLowerCase()) ||
      task.type.toLowerCase().includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // 统计数据
  const statistics = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    assigned: tasks.filter((t) => t.status === "assigned").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          任务分配管理
        </Title>
        <Text type="secondary">
          管理和分配数据标注任务，优化团队工作负载
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总任务数"
              value={statistics.total}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="待分配"
              value={statistics.pending}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="进行中"
              value={statistics.inProgress}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已完成"
              value={statistics.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* 任务列表 */}
        <Col span={16}>
          <Card
            title="任务列表"
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
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 120 }}
                >
                  <Option value="all">全部状态</Option>
                  <Option value="pending">待分配</Option>
                  <Option value="assigned">已分配</Option>
                  <Option value="in_progress">进行中</Option>
                  <Option value="completed">已完成</Option>
                </Select>
                <Button
                  type="primary"
                  icon={<TeamOutlined />}
                  onClick={handleBatchAssign}
                  disabled={selectedTasks.length === 0}
                >
                  批量分配
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleSmartAssign}
                >
                  智能分配
                </Button>
              </Space>
            }
          >
            <Table
              columns={taskColumns}
              dataSource={filteredTasks}
              rowKey="id"
              size="small"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              rowSelection={{
                selectedRowKeys: selectedTasks,
                onChange: (selectedRowKeys: React.Key[]) => {
                  setSelectedTasks(selectedRowKeys as string[]);
                },
                getCheckboxProps: (record) => ({
                  disabled: record.status === "completed",
                }),
              }}
            />
          </Card>
        </Col>

        {/* 标注员列表 */}
        <Col span={8}>
          <Card title="标注员状态" size="small">
            <List
              dataSource={annotators}
              renderItem={(annotator) => (
                <List.Item style={{ padding: "12px 0" }}>
                  <List.Item.Meta
                    avatar={
                      <Badge
                        status={
                          annotator.status === "online"
                            ? "success"
                            : annotator.status === "busy"
                              ? "warning"
                              : "default"
                        }
                        dot
                      >
                        <Avatar src={annotator.avatar} />
                      </Badge>
                    }
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text strong>{annotator.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {annotator.level}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            技能: {annotator.skills.join(", ")}
                          </Text>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <Text style={{ fontSize: 12 }}>
                              任务: {annotator.currentTasks}/{annotator.maxTasks}
                            </Text>
                          </div>
                          <div>
                            <Progress
                              percent={annotator.workload}
                              size="small"
                              style={{ width: 60 }}
                              showInfo={false}
                            />
                          </div>
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <Space size={8}>
                            <Text style={{ fontSize: 11, color: "#52c41a" }}>
                              效率: {annotator.efficiency}%
                            </Text>
                            <Text style={{ fontSize: 11, color: "#1890ff" }}>
                              准确率: {annotator.accuracy}%
                            </Text>
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
      </Row>

      {/* 分配任务模态框 */}
      <Modal
        title="分配任务"
        open={assignModalVisible}
        onOk={handleAssignConfirm}
        onCancel={() => {
          setAssignModalVisible(false);
          setSelectedTasks([]);
          setSelectedAnnotators([]);
        }}
        confirmLoading={loading}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>选中任务: </Text>
          <Text>{selectedTasks.length} 个</Text>
        </div>

        <Divider />

        <div>
          <Text strong style={{ marginBottom: 8, display: "block" }}>
            选择标注人员:
          </Text>
          <List
            dataSource={annotators}
            renderItem={(annotator) => {
              const isSelected = selectedAnnotators.includes(annotator.id);
              const isOverloaded = annotator.currentTasks >= annotator.maxTasks;

              return (
                <List.Item
                  style={{
                    padding: "8px 12px",
                    cursor: isOverloaded ? "not-allowed" : "pointer",
                    background: isSelected ? "#e6f7ff" : "transparent",
                    border: isSelected ? "1px solid #1890ff" : "1px solid transparent",
                    borderRadius: 6,
                    marginBottom: 8,
                    opacity: isOverloaded ? 0.5 : 1,
                  }}
                  onClick={() => {
                    if (isOverloaded) return;

                    if (isSelected) {
                      setSelectedAnnotators(selectedAnnotators.filter(id => id !== annotator.id));
                    } else {
                      setSelectedAnnotators([...selectedAnnotators, annotator.id]);
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={annotator.avatar} size="small" />}
                    title={
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Text strong style={{ fontSize: 14 }}>
                          {annotator.name}
                        </Text>
                        <Space size={4}>
                          {isOverloaded && <Tag color="red" className="small-tag">任务已满</Tag>}
                          <Tag color="blue" className="small-tag">{annotator.level}</Tag>
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          当前任务: {annotator.currentTasks}/{annotator.maxTasks} |
                          准确率: {annotator.accuracy}% |
                          效率: {annotator.efficiency}%
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default TaskAssign;
