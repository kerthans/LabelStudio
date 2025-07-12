"use client";
import type { DocumentCategory, UploadProgress } from "@/types/dashboard/tender";
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  FolderOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  TagsOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";

const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const DocumentUploadPage: React.FC = () => {
  const [form] = Form.useForm();
  const [uploadList, setUploadList] = useState<UploadProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 模拟分类数据
  const categories: DocumentCategory[] = [
    { id: "1", name: "法规标准", description: "法律法规和标准", documentCount: 0 },
    { id: "2", name: "模板文档", description: "各类模板", documentCount: 0 },
    { id: "3", name: "技术文档", description: "技术规范", documentCount: 0 },
  ];

  // 预定义标签
  const predefinedTags = [
    "法规", "标准", "模板", "技术", "招标", "投标", "评标",
    "合同", "质量", "安全", "环保", "财务", "管理",
  ];

  const handleUpload = (file: File) => {
    const uploadId = Date.now().toString();
    const newUpload: UploadProgress = {
      id: uploadId,
      fileName: file.name,
      progress: 0,
      status: "uploading",
    };

    setUploadList(prev => [...prev, newUpload]);

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadList(prev =>
        prev.map(item => {
          if (item.id === uploadId && item.status === "uploading") {
            const newProgress = Math.min(item.progress + Math.random() * 20, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...item, progress: 100, status: "completed" };
            }
            return { ...item, progress: newProgress };
          }
          return item;
        }),
      );
    }, 500);

    return false; // 阻止默认上传
  };

  const handlePauseUpload = (id: string) => {
    setUploadList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "paused" } : item,
      ),
    );
  };

  const handleResumeUpload = (id: string) => {
    setUploadList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: "uploading" } : item,
      ),
    );
  };

  const handleRemoveUpload = (id: string) => {
    setUploadList(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (_values: any) => {
    setUploading(true);
    try {
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success("文档上传成功！");
      form.resetFields();
      setUploadList([]);
      setSelectedTags([]);
    } catch (_error) {
      message.error("上传失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: UploadProgress["status"]) => {
    switch (status) {
      case "uploading":
        return <PauseCircleOutlined style={{ color: "#1890ff" }} />;
      case "completed":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "failed":
        return <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "paused":
        return <PlayCircleOutlined style={{ color: "#faad14" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: UploadProgress["status"]) => {
    switch (status) {
      case "uploading":
        return "blue";
      case "completed":
        return "green";
      case "failed":
        return "red";
      case "paused":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: UploadProgress["status"]) => {
    switch (status) {
      case "uploading":
        return "上传中";
      case "completed":
        return "已完成";
      case "failed":
        return "上传失败";
      case "paused":
        return "已暂停";
      default:
        return "未知状态";
    }
  };

  const completedCount = uploadList.filter(item => item.status === "completed").length;
  const uploadingCount = uploadList.filter(item => item.status === "uploading" || item.status === "paused").length;
  const failedCount = uploadList.filter(item => item.status === "failed").length;

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
              <CloudUploadOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
              <Title level={3} style={{ margin: 0, color: "#262626" }}>文档上传中心</Title>
              <Tag color="blue" style={{ fontSize: "12px" }}>批量上传管理</Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Tooltip title="上传帮助">
                <Button
                  icon={<InfoCircleOutlined />}
                  style={{ borderRadius: "6px" }}
                >
                  帮助
                </Button>
              </Tooltip>
              <Button
                icon={<SettingOutlined />}
                style={{ borderRadius: "6px" }}
              >
                设置
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
              title={<span style={{ color: "#666", fontSize: "14px" }}>队列总数</span>}
              value={uploadList.length}
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
              title={<span style={{ color: "#666", fontSize: "14px" }}>已完成</span>}
              value={completedCount}
              valueStyle={{ color: "#52c41a", fontSize: "24px", fontWeight: 600 }}
              suffix="个"
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
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
              title={<span style={{ color: "#666", fontSize: "14px" }}>进行中</span>}
              value={uploadingCount}
              valueStyle={{ color: "#faad14", fontSize: "24px", fontWeight: 600 }}
              suffix="个"
              prefix={<UploadOutlined style={{ color: "#faad14" }} />}
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
              title={<span style={{ color: "#666", fontSize: "14px" }}>失败数量</span>}
              value={failedCount}
              valueStyle={{ color: "#ff4d4f", fontSize: "24px", fontWeight: 600 }}
              suffix="个"
              prefix={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <CloudUploadOutlined style={{ color: "#1890ff" }} />
                <span>文档上传</span>
              </Space>
            }
            style={{
              marginBottom: 16,
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Alert
              message="上传规范说明"
              description="支持 PDF、Word、Excel、PPT 等格式文档，单个文件不超过 100MB，可批量上传多个文件。请确保文档内容合规，不包含敏感信息。"
              type="info"
              showIcon
              style={{
                marginBottom: 24,
                borderRadius: "6px",
                border: "1px solid #e6f7ff",
              }}
            />

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="category"
                    label={
                      <Space>
                        <FolderOutlined style={{ color: "#1890ff" }} />
                        <span>文档分类</span>
                      </Space>
                    }
                    rules={[{ required: true, message: "请选择文档分类" }]}
                  >
                    <Select
                      placeholder="选择文档分类"
                      size="large"
                      style={{ borderRadius: "6px" }}
                    >
                      {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>
                          <Space>
                            <FolderOutlined />
                            {cat.name}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="isPublic"
                    label={
                      <Space>
                        <SettingOutlined style={{ color: "#1890ff" }} />
                        <span>访问权限</span>
                      </Space>
                    }
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="公开访问"
                      unCheckedChildren="内部文档"
                      style={{ borderRadius: "12px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="tags"
                label={
                  <Space>
                    <TagsOutlined style={{ color: "#1890ff" }} />
                    <span>文档标签</span>
                  </Space>
                }
              >
                <Select
                  mode="tags"
                  placeholder="选择或输入自定义标签"
                  value={selectedTags}
                  onChange={setSelectedTags}
                  size="large"
                  style={{ width: "100%", borderRadius: "6px" }}
                  maxTagCount={8}
                  maxTagTextLength={10}
                >
                  {predefinedTags.map(tag => (
                    <Option key={tag} value={tag}>
                      <Tag color="blue" className="small-tag">{tag}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label={
                  <Space>
                    <FileTextOutlined style={{ color: "#1890ff" }} />
                    <span>文档描述</span>
                  </Space>
                }
              >
                <TextArea
                  rows={4}
                  placeholder="请详细描述文档内容、用途和注意事项..."
                  showCount
                  maxLength={500}
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <InboxOutlined style={{ color: "#1890ff" }} />
                    <span>选择文件</span>
                  </Space>
                }
              >
                <Dragger
                  multiple
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  style={{
                    borderRadius: "8px",
                    border: "2px dashed #d9d9d9",
                    background: "#fafafa",
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
                  </p>
                  <p className="ant-upload-text" style={{ fontSize: "16px", fontWeight: 500 }}>
                    点击或拖拽文件到此区域上传
                  </p>
                  <p className="ant-upload-hint" style={{ color: "#666", fontSize: "14px" }}>
                    支持单个或批量上传，严禁上传公司敏感数据或其他机密文件
                  </p>
                </Dragger>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Space size="large">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={uploading}
                    disabled={uploadList.length === 0}
                    size="large"
                    icon={<CloudUploadOutlined />}
                    style={{ borderRadius: "6px", minWidth: 120 }}
                  >
                    开始上传
                  </Button>
                  <Button
                    size="large"
                    style={{ borderRadius: "6px", minWidth: 80 }}
                    onClick={() => {
                      form.resetFields();
                      setUploadList([]);
                      setSelectedTags([]);
                    }}
                  >
                    重置表单
                  </Button>
                  <Button
                    size="large"
                    danger
                    style={{ borderRadius: "6px", minWidth: 80 }}
                    onClick={() => setUploadList([])}
                    disabled={uploadList.length === 0}
                  >
                    清空队列
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <Badge count={uploadList.length} showZero>
                  <UploadOutlined style={{ color: "#1890ff" }} />
                </Badge>
                <span>上传队列</span>
              </Space>
            }
            style={{
              marginBottom: 16,
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
            extra={
              uploadList.length > 0 && (
                <Space>
                  <Button
                    size="small"
                    type="text"
                    onClick={() => setUploadList([])}
                    style={{ color: "#ff4d4f" }}
                  >
                    清空
                  </Button>
                </Space>
              )
            }
          >
            {uploadList.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#bfbfbf",
                background: "#fafafa",
                borderRadius: "8px",
                border: "1px dashed #d9d9d9",
              }}>
                <InboxOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: "16px" }}>暂无上传文件</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: "12px" }}>请先选择要上传的文件</Text>
                </div>
              </div>
            ) : (
              <List
                dataSource={uploadList}
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      padding: "12px 0",
                      borderBottom: index === uploadList.length - 1 ? "none" : "1px solid #f0f0f0",
                    }}
                    actions={[
                      item.status === "uploading" ? (
                        <Tooltip title="暂停上传">
                          <Button
                            type="text"
                            size="small"
                            icon={<PauseCircleOutlined />}
                            onClick={() => handlePauseUpload(item.id)}
                            style={{ borderRadius: "4px" }}
                          />
                        </Tooltip>
                      ) : item.status === "paused" ? (
                        <Tooltip title="继续上传">
                          <Button
                            type="text"
                            size="small"
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleResumeUpload(item.id)}
                            style={{ borderRadius: "4px" }}
                          />
                        </Tooltip>
                      ) : null,
                      <Tooltip title="移除文件">
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveUpload(item.id)}
                          style={{ borderRadius: "4px" }}
                        />
                      </Tooltip>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={getStatusIcon(item.status)}
                      title={
                        <div>
                          <Tooltip title={item.fileName}>
                            <Text ellipsis style={{ maxWidth: "180px", display: "block" }}>
                              {item.fileName}
                            </Text>
                          </Tooltip>
                          <Tag
                            color={getStatusColor(item.status)}
                            className="small-tag"
                            style={{ marginTop: 4 }}
                          >
                            {getStatusText(item.status)}
                          </Tag>
                        </div>
                      }
                      description={
                        <div style={{ marginTop: 8 }}>
                          <Progress
                            percent={Math.round(item.progress)}
                            size="small"
                            status={item.status === "failed" ? "exception" :
                              item.status === "completed" ? "success" : "active"}
                            strokeColor={{
                              "0%": "#1890ff",
                              "100%": "#52c41a",
                            }}
                          />
                          <Text type="secondary" style={{ fontSize: "12px", marginTop: 4, display: "block" }}>
                            {item.status === "completed" ? "上传完成" :
                              item.status === "failed" ? "上传失败" :
                                item.status === "paused" ? "已暂停" :
                                  `${Math.round(item.progress)}% 已完成`}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>

          <Card
            title={
              <Space>
                <InfoCircleOutlined style={{ color: "#1890ff" }} />
                <span>上传统计</span>
              </Space>
            }
            style={{
              borderRadius: "8px",
              border: "1px solid #f0f0f0",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#52c41a",
                    lineHeight: 1,
                  }}>
                    {completedCount}
                  </div>
                  <Text type="secondary" style={{ fontSize: "14px" }}>已完成</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{
                    fontSize: "28px",
                    fontWeight: 600,
                    color: "#faad14",
                    lineHeight: 1,
                  }}>
                    {uploadingCount}
                  </div>
                  <Text type="secondary" style={{ fontSize: "14px" }}>进行中</Text>
                </div>
              </Col>
              {failedCount > 0 && (
                <Col span={24}>
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#ff4d4f",
                      lineHeight: 1,
                    }}>
                      {failedCount}
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>上传失败</Text>
                  </div>
                </Col>
              )}
            </Row>

            {uploadList.length > 0 && (
              <>
                <Divider style={{ margin: "16px 0" }} />
                <div style={{ textAlign: "center" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    总进度：{Math.round(uploadList.reduce((sum, item) => sum + item.progress, 0) / uploadList.length)}%
                  </Text>
                  <Progress
                    percent={Math.round(uploadList.reduce((sum, item) => sum + item.progress, 0) / uploadList.length)}
                    size="small"
                    style={{ marginTop: 8 }}
                    strokeColor={{
                      "0%": "#1890ff",
                      "100%": "#52c41a",
                    }}
                  />
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentUploadPage;
