"use client";
import {
  CloudDownloadOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FolderOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Progress,
  Radio,
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
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 导出任务数据接口
interface ExportTask {
  id: string;
  name: string;
  type: string;
  format: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  dataCount: number;
  fileSize: string;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  creator: string;
}

// 数据集信息接口
interface DatasetInfo {
  id: string;
  name: string;
  type: string;
  itemCount: number;
  size: string;
  lastModified: string;
  tags: string[];
  description: string;
}

// 导出统计接口
interface ExportStats {
  totalTasks: number;
  completedTasks: number;
  processingTasks: number;
  failedTasks: number;
  totalDataExported: number;
  totalSizeExported: string;
}

const DataExport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [exportForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // 模拟导出统计数据
  const [stats] = useState<ExportStats>({
    totalTasks: 45,
    completedTasks: 38,
    processingTasks: 5,
    failedTasks: 2,
    totalDataExported: 125000,
    totalSizeExported: "2.8GB",
  });

  // 模拟导出任务数据
  const [exportTasks] = useState<ExportTask[]>([
    {
      id: "export_001",
      name: "医疗影像数据集导出",
      type: "图像分类",
      format: "COCO JSON",
      status: "completed",
      progress: 100,
      dataCount: 5000,
      fileSize: "1.2GB",
      createdAt: "2024-01-15 10:30:00",
      completedAt: "2024-01-15 11:45:00",
      downloadUrl: "/downloads/medical_images_export.zip",
      creator: "张小明",
    },
    {
      id: "export_002",
      name: "文本情感分析数据导出",
      type: "文本分类",
      format: "CSV",
      status: "processing",
      progress: 65,
      dataCount: 8000,
      fileSize: "估算 450MB",
      createdAt: "2024-01-15 14:20:00",
      creator: "李小红",
    },
    {
      id: "export_003",
      name: "目标检测标注导出",
      type: "目标检测",
      format: "YOLO",
      status: "failed",
      progress: 0,
      dataCount: 3000,
      fileSize: "未知",
      createdAt: "2024-01-15 09:15:00",
      creator: "王小强",
    },
  ]);

  // 模拟数据集数据
  const [datasets] = useState<DatasetInfo[]>([
    {
      id: "dataset_001",
      name: "医疗影像分类数据集",
      type: "图像分类",
      itemCount: 5000,
      size: "1.8GB",
      lastModified: "2024-01-15",
      tags: ["医疗", "影像", "分类"],
      description: "包含多种医疗影像的分类标注数据",
    },
    {
      id: "dataset_002",
      name: "用户评论情感数据集",
      type: "文本分类",
      itemCount: 8000,
      size: "120MB",
      lastModified: "2024-01-14",
      tags: ["文本", "情感", "分析"],
      description: "电商用户评论的情感标注数据",
    },
    {
      id: "dataset_003",
      name: "自动驾驶目标检测数据集",
      type: "目标检测",
      itemCount: 3000,
      size: "2.5GB",
      lastModified: "2024-01-13",
      tags: ["自动驾驶", "目标检测", "车辆"],
      description: "道路场景中的车辆、行人等目标检测数据",
    },
  ]);

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "processing";
      case "failed":
        return "error";
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
      case "processing":
        return "处理中";
      case "failed":
        return "失败";
      case "pending":
        return "等待中";
      default:
        return "未知";
    }
  };

  // 获取格式图标
  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "csv":
      case "excel":
        return <FileExcelOutlined style={{ color: "#52c41a" }} />;
      case "json":
      case "coco json":
        return <FileTextOutlined style={{ color: "#1890ff" }} />;
      case "yolo":
      case "xml":
        return <FileImageOutlined style={{ color: "#fa8c16" }} />;
      default:
        return <FolderOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  // 处理新建导出
  const handleCreateExport = () => {
    setExportModalVisible(true);
    exportForm.resetFields();
  };

  // 处理导出确认
  const handleExportConfirm = async () => {
    try {
      setLoading(true);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("导出任务已创建，正在处理中...");
      setExportModalVisible(false);
      exportForm.resetFields();
    } catch (error) {
      message.error("创建导出任务失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理下载
  const handleDownload = (task: ExportTask) => {
    if (task.downloadUrl) {
      message.success(`开始下载: ${task.name}`);
      // 这里可以实现实际的下载逻辑
    } else {
      message.warning("下载链接不可用");
    }
  };

  // 处理重试
  const handleRetry = (taskId: string) => {
    message.info(`重试导出任务: ${taskId}`);
  };

  // 导出任务表格列
  const exportColumns: ColumnsType<ExportTask> = [
    {
      title: "任务信息",
      key: "taskInfo",
      width: 250,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.name}</div>
          <Space size={4}>
            <Tag color="blue">{record.type}</Tag>
            <Tag icon={getFormatIcon(record.format)} color="default">
              {record.format}
            </Tag>
          </Space>
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 120,
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
            {record.dataCount} 条数据
          </Text>
        </div>
      ),
    },
    {
      title: "文件大小",
      dataIndex: "fileSize",
      key: "fileSize",
      width: 100,
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
          {record.status === "completed" && (
            <Tooltip title="下载">
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => handleDownload(record)}
              />
            </Tooltip>
          )}
          {record.status === "failed" && (
            <Tooltip title="重试">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => handleRetry(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title="详情">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 数据集表格列
  const datasetColumns: ColumnsType<DatasetInfo> = [
    {
      title: "数据集名称",
      key: "datasetInfo",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
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
      title: "数据量",
      key: "itemCount",
      width: 100,
      render: (_, record) => (
        <div>
          <div>{record.itemCount.toLocaleString()}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.size}
          </Text>
        </div>
      ),
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      width: 200,
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {tags.map((tag) => (
            <Tag key={tag} className="small-tag">
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "最后修改",
      dataIndex: "lastModified",
      key: "lastModified",
      width: 120,
    },
  ];

  // 过滤导出任务
  const filteredTasks = exportTasks.filter((task) => {
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
          数据导出
        </Title>
        <Text type="secondary">
          导出标注数据为各种格式，支持批量导出和自定义配置
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总导出任务"
              value={stats.totalTasks}
              prefix={<ExportOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completedTasks}
              prefix={<CloudDownloadOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="处理中"
              value={stats.processingTasks}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已导出数据"
              value={stats.totalDataExported}
              suffix="条"
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 导出任务列表 */}
        <Col span={24}>
          <Card
            title="导出任务"
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
                  <Option value="completed">已完成</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="failed">失败</Option>
                  <Option value="pending">等待中</Option>
                </Select>
                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  style={{ width: 120 }}
                >
                  <Option value="all">全部类型</Option>
                  <Option value="图像分类">图像分类</Option>
                  <Option value="文本分类">文本分类</Option>
                  <Option value="目标检测">目标检测</Option>
                </Select>
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  onClick={handleCreateExport}
                >
                  新建导出
                </Button>
              </Space>
            }
          >
            <Table
              columns={exportColumns}
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
        </Col>
      </Row>

      {/* 新建导出模态框 */}
      <Modal
        title="新建数据导出"
        open={exportModalVisible}
        onOk={handleExportConfirm}
        onCancel={() => setExportModalVisible(false)}
        confirmLoading={loading}
        width={800}
      >
        <Form
          form={exportForm}
          layout="vertical"
          initialValues={{
            format: "json",
            includeImages: true,
            includeAnnotations: true,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="导出任务名称"
                rules={[{ required: true, message: "请输入任务名称" }]}
              >
                <Input placeholder="请输入导出任务名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="format"
                label="导出格式"
                rules={[{ required: true, message: "请选择导出格式" }]}
              >
                <Select placeholder="选择导出格式">
                  <Option value="json">COCO JSON</Option>
                  <Option value="yolo">YOLO</Option>
                  <Option value="csv">CSV</Option>
                  <Option value="xml">Pascal VOC XML</Option>
                  <Option value="excel">Excel</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="选择数据集">
            <Table
              columns={datasetColumns}
              dataSource={datasets}
              rowKey="id"
              size="small"
              pagination={false}
              rowSelection={{
                selectedRowKeys: selectedDatasets,
                onChange: (selectedRowKeys: React.Key[]) => {
                  setSelectedDatasets(selectedRowKeys.map(key => key.toString()));
                },
              }}
              style={{ marginBottom: 16 }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="导出内容">
                <Checkbox.Group>
                  <Space direction="vertical">
                    <Checkbox value="images" defaultChecked>
                      包含原始图像/文本
                    </Checkbox>
                    <Checkbox value="annotations" defaultChecked>
                      包含标注数据
                    </Checkbox>
                    <Checkbox value="metadata">
                      包含元数据
                    </Checkbox>
                    <Checkbox value="statistics">
                      包含统计信息
                    </Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="质量过滤">
                <Radio.Group defaultValue="all">
                  <Space direction="vertical">
                    <Radio value="all">导出全部数据</Radio>
                    <Radio value="reviewed">仅导出已审核数据</Radio>
                    <Radio value="high_quality">仅导出高质量数据</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="描述">
            <TextArea
              rows={3}
              placeholder="请输入导出任务的描述信息（可选）"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataExport;
