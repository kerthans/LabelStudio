"use client";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FilterOutlined,
  FolderOpenOutlined,
  ShareAltOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Modal,
  Pagination,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 数据集接口
interface Dataset {
  id: string;
  name: string;
  description: string;
  type: "image" | "text" | "audio" | "video";
  labelType: string;
  fileCount: number;
  size: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
  status: "active" | "processing" | "archived";
  tags: string[];
  progress: number;
  thumbnail?: string;
}

const DataLibrary: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);

  // 模拟数据集数据
  const [datasets] = useState<Dataset[]>([
    {
      id: "ds_001",
      name: "医疗影像数据集",
      description: "包含各种医疗影像的分类数据集，用于疾病诊断模型训练",
      type: "image",
      labelType: "图像分类",
      fileCount: 5000,
      size: "2.3 GB",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      creator: "张医生",
      status: "active",
      tags: ["医疗", "影像", "分类"],
      progress: 100,
      thumbnail: "https://via.placeholder.com/200x150/52c41a/fff?text=Medical",
    },
    {
      id: "ds_002",
      name: "用户评论情感数据集",
      description: "电商平台用户评论的情感分析数据集",
      type: "text",
      labelType: "情感分析",
      fileCount: 8000,
      size: "156 MB",
      createdAt: "2024-01-08",
      updatedAt: "2024-01-14",
      creator: "李分析师",
      status: "active",
      tags: ["文本", "情感", "电商"],
      progress: 85,
      thumbnail: "https://via.placeholder.com/200x150/1890ff/fff?text=Text",
    },
    {
      id: "ds_003",
      name: "自动驾驶场景数据集",
      description: "包含各种道路场景的目标检测数据集",
      type: "image",
      labelType: "目标检测",
      fileCount: 3000,
      size: "5.8 GB",
      createdAt: "2024-01-05",
      updatedAt: "2024-01-12",
      creator: "王工程师",
      status: "processing",
      tags: ["自动驾驶", "检测", "道路"],
      progress: 45,
      thumbnail: "https://via.placeholder.com/200x150/fa8c16/fff?text=Auto",
    },
    {
      id: "ds_004",
      name: "语音识别数据集",
      description: "多语言语音识别训练数据集",
      type: "audio",
      labelType: "语音识别",
      fileCount: 2000,
      size: "1.2 GB",
      createdAt: "2024-01-03",
      updatedAt: "2024-01-10",
      creator: "赵研究员",
      status: "archived",
      tags: ["语音", "识别", "多语言"],
      progress: 100,
      thumbnail: "https://via.placeholder.com/200x150/722ed1/fff?text=Audio",
    },
  ]);

  // 统计数据
  const stats = {
    totalDatasets: datasets.length,
    totalFiles: datasets.reduce((sum, ds) => sum + ds.fileCount, 0),
    totalSize: "9.5 GB",
    activeDatasets: datasets.filter(ds => ds.status === "active").length,
  };

  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image": return <FileImageOutlined style={{ color: "#52c41a" }} />;
      case "text": return <FileTextOutlined style={{ color: "#1890ff" }} />;
      case "audio": return <FileTextOutlined style={{ color: "#722ed1" }} />;
      case "video": return <FileTextOutlined style={{ color: "#fa8c16" }} />;
      default: return <FolderOpenOutlined />;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "processing": return "processing";
      case "archived": return "default";
      default: return "default";
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "活跃";
      case "processing": return "处理中";
      case "archived": return "已归档";
      default: return "未知";
    }
  };

  // 筛选数据集
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchText.toLowerCase()) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    const matchesType = typeFilter === "all" || dataset.type === typeFilter;
    const matchesStatus = statusFilter === "all" || dataset.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 预览数据集
  const handlePreview = (dataset: Dataset) => {
    setCurrentDataset(dataset);
    setPreviewVisible(true);
  };

  // 下载数据集
  const handleDownload = (dataset: Dataset) => {
    message.success(`开始下载数据集: ${dataset.name}`);
  };

  // 编辑数据集
  const handleEdit = (dataset: Dataset) => {
    message.info(`编辑数据集: ${dataset.name}`);
  };

  // 删除数据集
  const handleDelete = (dataset: Dataset) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除数据集 "${dataset.name}" 吗？此操作不可恢复。`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        message.success("数据集已删除");
      },
    });
  };

  // 分享数据集
  const handleShare = (dataset: Dataset) => {
    message.success(`数据集 "${dataset.name}" 分享链接已复制到剪贴板`);
  };

  // 网格视图渲染
  const renderGridView = () => (
    <Row gutter={[16, 16]}>
      {filteredDatasets.map(dataset => (
        <Col xs={24} sm={12} lg={8} xl={6} key={dataset.id}>
          <Card
            hoverable
            cover={
              <div style={{ height: 150, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {dataset.thumbnail ? (
                  <img src={dataset.thumbnail} alt={dataset.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ fontSize: 48, color: "#d9d9d9" }}>
                    {getTypeIcon(dataset.type)}
                  </div>
                )}
              </div>
            }
            actions={[
              <Tooltip title="预览" key="preview">
                <EyeOutlined onClick={() => handlePreview(dataset)} />
              </Tooltip>,
              <Tooltip title="下载" key="download">
                <DownloadOutlined onClick={() => handleDownload(dataset)} />
              </Tooltip>,
              <Tooltip title="编辑" key="edit">
                <EditOutlined onClick={() => handleEdit(dataset)} />
              </Tooltip>,
              <Dropdown
                key="more"
                menu={{
                  items: [
                    {
                      key: "share",
                      label: "分享",
                      icon: <ShareAltOutlined />,
                      onClick: () => handleShare(dataset),
                    },
                    {
                      key: "delete",
                      label: "删除",
                      icon: <DeleteOutlined />,
                      danger: true,
                      onClick: () => handleDelete(dataset),
                    },
                  ],
                }}
              >
                <Button type="text" size="small">更多</Button>
              </Dropdown>,
            ]}
          >
            <Card.Meta
              title={
                <div>
                  <Text strong style={{ fontSize: 14 }}>{dataset.name}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag color={getStatusColor(dataset.status)} className="small-tag">
                      {getStatusText(dataset.status)}
                    </Tag>
                  </div>
                </div>
              }
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                    {dataset.description.length > 50 ? `${dataset.description.substring(0, 50)}...` : dataset.description}
                  </Text>
                  <div style={{ marginBottom: 8 }}>
                    <Space size={4}>
                      {dataset.tags.map(tag => (
                        <Tag key={tag} className="small-tag" color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    <div>文件数: {dataset.fileCount}</div>
                    <div>大小: {dataset.size}</div>
                    <div>创建者: {dataset.creator}</div>
                  </div>
                  {dataset.status === "processing" && (
                    <Progress percent={dataset.progress} size="small" style={{ marginTop: 8 }} />
                  )}
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );

  // 列表视图渲染
  const renderListView = () => (
    <List
      itemLayout="horizontal"
      dataSource={filteredDatasets}
      renderItem={dataset => (
        <List.Item
          actions={[
            <Button key="preview" type="text" icon={<EyeOutlined />} onClick={() => handlePreview(dataset)}>预览</Button>,
            <Button key="download" type="text" icon={<DownloadOutlined />} onClick={() => handleDownload(dataset)}>下载</Button>,
            <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => handleEdit(dataset)}>编辑</Button>,
            <Dropdown
              key="more"
              menu={{
                items: [
                  {
                    key: "share",
                    label: "分享",
                    icon: <ShareAltOutlined />,
                    onClick: () => handleShare(dataset),
                  },
                  {
                    key: "delete",
                    label: "删除",
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDelete(dataset),
                  },
                ],
              }}
            >
              <Button type="text">更多</Button>
            </Dropdown>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar size={64} icon={getTypeIcon(dataset.type)} />}
            title={
              <div>
                <Space>
                  <Text strong>{dataset.name}</Text>
                  <Tag color={getStatusColor(dataset.status)}>
                    {getStatusText(dataset.status)}
                  </Tag>
                </Space>
              </div>
            }
            description={
              <div>
                <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                  {dataset.description}
                </Text>
                <Space size={16}>
                  <Text type="secondary">类型: {dataset.labelType}</Text>
                  <Text type="secondary">文件数: {dataset.fileCount}</Text>
                  <Text type="secondary">大小: {dataset.size}</Text>
                  <Text type="secondary">创建者: {dataset.creator}</Text>
                  <Text type="secondary">更新时间: {dataset.updatedAt}</Text>
                </Space>
                <div style={{ marginTop: 8 }}>
                  <Space size={4}>
                    {dataset.tags.map(tag => (
                      <Tag key={tag} className="small-tag" color="blue">{tag}</Tag>
                    ))}
                  </Space>
                </div>
                {dataset.status === "processing" && (
                  <Progress percent={dataset.progress} size="small" style={{ marginTop: 8, width: 200 }} />
                )}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          数据库
        </Title>
        <Text type="secondary">
          管理和浏览所有数据集，支持搜索、筛选和预览
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="数据集总数"
              value={stats.totalDatasets}
              prefix={<FolderOpenOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="文件总数"
              value={stats.totalFiles}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="存储总量"
              value={stats.totalSize}
              prefix={<TagOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃数据集"
              value={stats.activeDatasets}
              prefix={<FileImageOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选和操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索数据集名称、描述或标签"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="数据类型"
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部类型</Option>
              <Option value="image">图像</Option>
              <Option value="text">文本</Option>
              <Option value="audio">音频</Option>
              <Option value="video">视频</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">活跃</Option>
              <Option value="processing">处理中</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Space>
              <Button.Group>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  onClick={() => setViewMode("grid")}
                >
                  网格视图
                </Button>
                <Button
                  type={viewMode === "list" ? "primary" : "default"}
                  onClick={() => setViewMode("list")}
                >
                  列表视图
                </Button>
              </Button.Group>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 数据集列表 */}
      <Card>
        {viewMode === "grid" ? renderGridView() : renderListView()}

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Pagination
            total={filteredDatasets.length}
            pageSize={viewMode === "grid" ? 12 : 10}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
          />
        </div>
      </Card>

      {/* 预览模态框 */}
      <Modal
        title="数据集预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={() => currentDataset && handleDownload(currentDataset)}>
            下载数据集
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentDataset && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ height: 200, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                  {currentDataset.thumbnail ? (
                    <img src={currentDataset.thumbnail} alt={currentDataset.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
                  ) : (
                    <div style={{ fontSize: 64, color: "#d9d9d9" }}>
                      {getTypeIcon(currentDataset.type)}
                    </div>
                  )}
                </div>
              </Col>
              <Col span={16}>
                <Title level={4}>{currentDataset.name}</Title>
                <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
                  {currentDataset.description}
                </Text>
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>数据类型:</Text> {currentDataset.type}
                  </Col>
                  <Col span={12}>
                    <Text strong>标注类型:</Text> {currentDataset.labelType}
                  </Col>
                  <Col span={12}>
                    <Text strong>文件数量:</Text> {currentDataset.fileCount}
                  </Col>
                  <Col span={12}>
                    <Text strong>数据大小:</Text> {currentDataset.size}
                  </Col>
                  <Col span={12}>
                    <Text strong>创建者:</Text> {currentDataset.creator}
                  </Col>
                  <Col span={12}>
                    <Text strong>创建时间:</Text> {currentDataset.createdAt}
                  </Col>
                  <Col span={24}>
                    <Text strong>标签:</Text>
                    <div style={{ marginTop: 4 }}>
                      {currentDataset.tags.map(tag => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DataLibrary;
