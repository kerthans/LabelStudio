"use client";
import type { Document, DocumentCategory, DocumentFilter } from "@/types/dashboard/tender";
import {
  ClockCircleOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FilterOutlined,
  FolderOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Tree,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filter, setFilter] = useState<DocumentFilter>({});
  const [loading, _setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  // 模拟数据
  const mockCategories: DocumentCategory[] = [
    {
      id: "1",
      name: "法规标准",
      description: "相关法律法规和行业标准",
      documentCount: 156,
      children: [
        { id: "1-1", name: "招标法规", description: "招标投标相关法规", documentCount: 45 },
        { id: "1-2", name: "建设标准", description: "建设工程标准规范", documentCount: 67 },
        { id: "1-3", name: "质量标准", description: "质量管理标准", documentCount: 44 },
      ],
    },
    {
      id: "2",
      name: "模板文档",
      description: "各类模板和范本",
      documentCount: 89,
      children: [
        { id: "2-1", name: "投标模板", description: "投标文件模板", documentCount: 23 },
        { id: "2-2", name: "合同模板", description: "合同文本模板", documentCount: 34 },
        { id: "2-3", name: "评标模板", description: "评标相关模板", documentCount: 32 },
      ],
    },
    {
      id: "3",
      name: "技术文档",
      description: "技术规范和说明",
      documentCount: 234,
      children: [
        { id: "3-1", name: "技术规范", description: "技术要求规范", documentCount: 123 },
        { id: "3-2", name: "操作手册", description: "操作指导手册", documentCount: 111 },
      ],
    },
  ];

  const mockDocuments: Document[] = [
    {
      id: "1",
      title: "中华人民共和国招标投标法",
      fileName: "招标投标法.pdf",
      fileSize: 2048576,
      fileType: "pdf",
      category: mockCategories[0].children![0],
      tags: ["法规", "招标", "投标"],
      description: "规范招标投标活动的基本法律",
      uploadDate: "2024-01-10",
      uploadBy: "系统管理员",
      downloadCount: 1234,
      status: "active",
      url: "/documents/招标投标法.pdf",
      previewUrl: "/preview/招标投标法.pdf",
      version: "1.0",
      isPublic: true,
    },
    {
      id: "2",
      title: "建设工程质量管理条例",
      fileName: "质量管理条例.pdf",
      fileSize: 1536000,
      fileType: "pdf",
      category: mockCategories[0].children![2],
      tags: ["法规", "质量", "管理"],
      description: "建设工程质量管理的行政法规",
      uploadDate: "2024-01-08",
      uploadBy: "法务部",
      downloadCount: 856,
      status: "active",
      url: "/documents/质量管理条例.pdf",
      version: "2.1",
      isPublic: true,
    },
    {
      id: "3",
      title: "投标文件编制指南",
      fileName: "投标文件编制指南.docx",
      fileSize: 3072000,
      fileType: "docx",
      category: mockCategories[1].children![0],
      tags: ["模板", "投标", "指南"],
      description: "投标文件编制的详细指导",
      uploadDate: "2024-01-05",
      uploadBy: "业务部",
      downloadCount: 567,
      status: "active",
      url: "/documents/投标文件编制指南.docx",
      version: "3.2",
      isPublic: false,
    },
  ];

  useEffect(() => {
    setCategories(mockCategories);
    setDocuments(mockDocuments);
  }, [mockCategories, mockDocuments]);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FilePdfOutlined style={{ color: "#ff4d4f" }} />;
      case "doc":
      case "docx":
        return <FileWordOutlined style={{ color: "#1890ff" }} />;
      case "xls":
      case "xlsx":
        return <FileExcelOutlined style={{ color: "#52c41a" }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handlePreview = (document: Document) => {
    setPreviewDocument(document);
    setPreviewVisible(true);
  };

  const handleDownload = (document: Document) => {
    message.success(`开始下载：${document.fileName}`);
    // 实际下载逻辑
  };

  const _columns = [
    {
      title: "文档名称",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Document) => (
        <Space>
          {getFileIcon(record.fileType)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      render: (category: DocumentCategory) => category.name,
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "文件大小",
      dataIndex: "fileSize",
      key: "fileSize",
      render: (size: number) => formatFileSize(size),
    },
    {
      title: "上传时间",
      dataIndex: "uploadDate",
      key: "uploadDate",
    },
    {
      title: "下载次数",
      dataIndex: "downloadCount",
      key: "downloadCount",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Document) => (
        <Space size="middle">
          <Tooltip title="预览">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="下载">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const treeData = categories.map(category => ({
    title: (
      <Space>
        <FolderOutlined />
        <span>{category.name}</span>
        <Text type="secondary">({category.documentCount})</Text>
      </Space>
    ),
    key: category.id,
    children: category.children?.map(child => ({
      title: (
        <Space>
          <FolderOutlined />
          <span>{child.name}</span>
          <Text type="secondary">({child.documentCount})</Text>
        </Space>
      ),
      key: child.id,
    })),
  }));

  return (
    <div style={{ padding: "0", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* 页面头部 */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: "8px",
        }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space align="center">
              <DatabaseOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
              <Title level={3} style={{ margin: 0, color: "#262626" }}>文档资料库</Title>
              <Tag color="blue" style={{ fontSize: "12px" }}>智能文档管理系统</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                style={{ borderRadius: "6px" }}
              >
                批量上传
              </Button>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilterDrawerVisible(true)}
                style={{ borderRadius: "6px" }}
              >
                高级筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>文档总数</span>}
              value={documents.length}
              valueStyle={{ color: "#1890ff", fontSize: "24px", fontWeight: 600 }}
              suffix="个"
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>分类数量</span>}
              value={categories.length}
              valueStyle={{ color: "#52c41a", fontSize: "24px", fontWeight: 600 }}
              suffix="类"
              prefix={<FolderOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>总下载量</span>}
              value={documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
              valueStyle={{ color: "#722ed1", fontSize: "24px", fontWeight: 600 }}
              suffix="次"
              prefix={<DownloadOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Statistic
              title={<span style={{ color: "#666", fontSize: "14px" }}>存储空间</span>}
              value={formatFileSize(documents.reduce((sum, doc) => sum + doc.fileSize, 0))}
              valueStyle={{ color: "#faad14", fontSize: "20px", fontWeight: 600 }}
              prefix={<DatabaseOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 左侧分类树 */}
        <Col xs={24} lg={6}>
          <Card
            title={
              <Space>
                <FolderOutlined style={{ color: "#1890ff" }} />
                <span>文档分类</span>
              </Space>
            }
            style={{
              marginBottom: 16,
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{ padding: "16px" }}
          >
            <Tree
              treeData={treeData}
              defaultExpandAll
              showLine={{ showLeafIcon: false }}
              onSelect={(selectedKeys) => {
                setSelectedCategory(selectedKeys[0] as string);
              }}
              style={{
                background: "transparent",
              }}
            />
          </Card>
        </Col>

        {/* 右侧文档列表 */}
        <Col xs={24} lg={18}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: "#1890ff" }} />
                <span>文档列表</span>
                <Tag color="processing">{documents.length} 个文档</Tag>
              </Space>
            }
            extra={
              <Space>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerVisible(true)}
                  style={{ borderRadius: "6px" }}
                >
                  筛选
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ borderRadius: "6px" }}
                >
                  上传文档
                </Button>
              </Space>
            }
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
          >
            {/* 搜索栏 */}
            <Row gutter={16} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={12} md={8}>
                <Search
                  placeholder="搜索文档名称、标签..."
                  allowClear
                  size="large"
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  onSearch={(value) => setFilter({ ...filter, keyword: value })}
                  style={{ borderRadius: "6px" }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="选择文件类型"
                  allowClear
                  size="large"
                  style={{ width: "100%", borderRadius: "6px" }}
                  onChange={(value) => setFilter({ ...filter, fileType: value })}
                >
                  <Option value="pdf">
                    <Space>
                      <FilePdfOutlined style={{ color: "#ff4d4f" }} />
                      PDF 文档
                    </Space>
                  </Option>
                  <Option value="docx">
                    <Space>
                      <FileWordOutlined style={{ color: "#1890ff" }} />
                      Word 文档
                    </Space>
                  </Option>
                  <Option value="xlsx">
                    <Space>
                      <FileExcelOutlined style={{ color: "#52c41a" }} />
                      Excel 表格
                    </Space>
                  </Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Select
                  placeholder="选择文档分类"
                  allowClear
                  size="large"
                  style={{ width: "100%", borderRadius: "6px" }}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                >
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>
                      <Space>
                        <FolderOutlined />
                        {category.name}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>

            {/* 文档表格 */}
            <Table
              columns={[
                {
                  title: "文档信息",
                  dataIndex: "title",
                  key: "title",
                  render: (text: string, record: Document) => (
                    <Space direction="vertical" size={4}>
                      <Space>
                        {getFileIcon(record.fileType)}
                        <Text strong style={{ color: "#262626" }}>{text}</Text>
                        {!record.isPublic && <Tag color="orange" className="small-tah">内部</Tag>}
                      </Space>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {record.fileName} • {formatFileSize(record.fileSize)}
                      </Text>
                    </Space>
                  ),
                },
                {
                  title: "分类标签",
                  dataIndex: "category",
                  key: "category",
                  render: (category: DocumentCategory, record: Document) => (
                    <Space direction="vertical" size={4}>
                      <Tag color="blue">{category.name}</Tag>
                      <Space size={4}>
                        {record.tags.map(tag => (
                          <Tag key={tag} color="processing" className="small-tag">{tag}</Tag>
                        ))}
                      </Space>
                    </Space>
                  ),
                },
                {
                  title: "上传信息",
                  dataIndex: "uploadDate",
                  key: "uploadInfo",
                  render: (date: string, record: Document) => (
                    <Space direction="vertical" size={4}>
                      <Space size={4}>
                        <ClockCircleOutlined style={{ color: "#bfbfbf" }} />
                        <Text style={{ fontSize: "13px" }}>{date}</Text>
                      </Space>
                      <Space size={4}>
                        <TeamOutlined style={{ color: "#bfbfbf" }} />
                        <Text type="secondary" style={{ fontSize: "12px" }}>{record.uploadBy}</Text>
                      </Space>
                    </Space>
                  ),
                },
                {
                  title: "下载统计",
                  dataIndex: "downloadCount",
                  key: "downloadCount",
                  render: (count: number) => (
                    <Space direction="vertical" size={4}>
                      <Text strong style={{ color: "#1890ff" }}>{count}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>次下载</Text>
                    </Space>
                  ),
                  sorter: (a, b) => a.downloadCount - b.downloadCount,
                },
                {
                  title: "操作",
                  key: "action",
                  width: 120,
                  render: (_: any, record: Document) => (
                    <Space size="small">
                      <Tooltip title="预览文档">
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(record)}
                          style={{ borderRadius: "4px" }}
                        />
                      </Tooltip>
                      <Tooltip title="下载文档">
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(record)}
                          style={{ borderRadius: "4px" }}
                        />
                      </Tooltip>
                    </Space>
                  ),
                },
              ]}
              dataSource={documents}
              rowKey="id"
              loading={loading}
              pagination={{
                total: documents.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 个文档`,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              scroll={{ x: 1000 }}
              style={{
                background: "#fff",
                borderRadius: "6px",
              }}
              rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
              }
            />
          </Card>
        </Col>
      </Row>

      {/* 预览模态框 */}
      <Modal
        title={
          <Space>
            <EyeOutlined style={{ color: "#1890ff" }} />
            <span>文档预览</span>
            <Tag color="blue">{previewDocument?.fileName}</Tag>
          </Space>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={900}
        style={{ top: 20 }}
        footer={[
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => previewDocument && handleDownload(previewDocument)}
            style={{ borderRadius: "6px" }}
          >
            下载文档
          </Button>,
          <Button
            key="close"
            onClick={() => setPreviewVisible(false)}
            style={{ borderRadius: "6px" }}
          >
            关闭
          </Button>,
        ]}
      >
        {previewDocument && (
          <div style={{
            height: 600,
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            border: "1px dashed #d9d9d9",
          }}>
            <Space direction="vertical" align="center" size="large">
              {getFileIcon(previewDocument.fileType)}
              <div style={{ textAlign: "center" }}>
                <Title level={4} style={{ color: "#666", margin: 0 }}>
                  {previewDocument.title}
                </Title>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  文档预览功能开发中
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  支持 PDF.js、Office Online 等预览组件
                </Text>
              </div>
            </Space>
          </div>
        )}
      </Modal>

      {/* 筛选抽屉 */}
      <Drawer
        title={
          <Space>
            <FilterOutlined style={{ color: "#1890ff" }} />
            <span>高级筛选</span>
          </Space>
        }
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={420}
        extra={
          <Space>
            <Button onClick={() => setFilterDrawerVisible(false)}>取消</Button>
            <Button type="primary" style={{ borderRadius: "6px" }}>应用筛选</Button>
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <Title level={5} style={{ color: "#262626", marginBottom: 12 }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              上传时间范围
            </Title>
            <RangePicker
              style={{ width: "100%", borderRadius: "6px" }}
              size="large"
            />
          </div>

          <div>
            <Title level={5} style={{ color: "#262626", marginBottom: 12 }}>
              <FileTextOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              文档状态
            </Title>
            <Select
              placeholder="选择文档状态"
              style={{ width: "100%", borderRadius: "6px" }}
              size="large"
            >
              <Option value="active">
                <Space>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#52c41a" }} />
                  正常使用
                </Space>
              </Option>
              <Option value="archived">
                <Space>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#faad14" }} />
                  已归档
                </Space>
              </Option>
            </Select>
          </div>

          <div>
            <Title level={5} style={{ color: "#262626", marginBottom: 12 }}>
              <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              访问权限
            </Title>
            <Select
              placeholder="选择访问权限"
              style={{ width: "100%", borderRadius: "6px" }}
              size="large"
            >
              <Option value={true}>
                <Space>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#52c41a" }} />
                  公开文档
                </Space>
              </Option>
              <Option value={false}>
                <Space>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d4f" }} />
                  内部文档
                </Space>
              </Option>
            </Select>
          </div>

          <div>
            <Title level={5} style={{ color: "#262626", marginBottom: 12 }}>
              <DownloadOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              下载次数
            </Title>
            <Row gutter={8}>
              <Col span={12}>
                <Input placeholder="最小值" size="large" style={{ borderRadius: "6px" }} />
              </Col>
              <Col span={12}>
                <Input placeholder="最大值" size="large" style={{ borderRadius: "6px" }} />
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: "24px 0" }} />

          <Space style={{ width: "100%", justifyContent: "center" }}>
            <Button size="large" style={{ borderRadius: "6px", minWidth: 80 }}>
              重置
            </Button>
            <Button
              type="primary"
              size="large"
              style={{ borderRadius: "6px", minWidth: 80 }}
            >
              应用筛选
            </Button>
          </Space>
        </Space>
      </Drawer>
    </div>
  );
};

export default DocumentsPage;
