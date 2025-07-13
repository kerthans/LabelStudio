"use client";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Upload,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile, UploadProps } from "antd/es/upload";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;

// 上传文件接口
interface UploadFileData {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "done" | "error";
  progress: number;
  uploadTime: string;
  dataType: "image" | "text" | "audio" | "video";
}


const DataUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFileData[]>([]);
  const [uploading, setUploading] = useState(false);

  // 模拟统计数据
  const stats = {
    totalFiles: 1248,
    totalSize: "15.6 GB",
    todayUploads: 89,
    processingFiles: 12
  };

  // 支持的文件类型
  const supportedTypes = {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
    text: ['.txt', '.csv', '.json', '.xml'],
    audio: ['.mp3', '.wav', '.flac', '.aac'],
    video: ['.mp4', '.avi', '.mov', '.wmv']
  };

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      const isValidType = Object.values(supportedTypes).flat().some(ext =>
        file.name.toLowerCase().endsWith(ext)
      );
      if (!isValidType) {
        message.error(`不支持的文件类型: ${file.name}`);
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('文件大小不能超过 100MB!');
        return false;
      }
      return false; // 阻止自动上传
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onDrop: (e) => {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  // 开始上传
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择文件');
      return;
    }

    setUploading(true);
    try {
      // 模拟上传过程
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const uploadData: UploadFileData = {
          id: `file_${Date.now()}_${i}`,
          name: file.name,
          size: file.size || 0,
          type: file.type || '',
          status: 'uploading',
          progress: 0,
          uploadTime: new Date().toLocaleString(),
          dataType: getDataType(file.name)
        };

        setUploadedFiles(prev => [...prev, uploadData]);

        // 模拟上传进度
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === uploadData.id
                ? { ...f, progress, status: progress === 100 ? 'done' : 'uploading' }
                : f
            )
          );
        }
      }

      message.success('文件上传成功!');
      setFileList([]);
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 获取数据类型
  const getDataType = (filename: string): "image" | "text" | "audio" | "video" => {
    const ext = filename.toLowerCase().split('.').pop() || '';
    if (supportedTypes.image.some(type => type.includes(ext))) return 'image';
    if (supportedTypes.text.some(type => type.includes(ext))) return 'text';
    if (supportedTypes.audio.some(type => type.includes(ext))) return 'audio';
    if (supportedTypes.video.some(type => type.includes(ext))) return 'video';
    return 'text';
  };

  // 获取文件图标
  const getFileIcon = (dataType: string) => {
    switch (dataType) {
      case 'image': return <FileImageOutlined style={{ color: '#52c41a' }} />;
      case 'text': return <FileTextOutlined style={{ color: '#1890ff' }} />;
      case 'audio': return <FileTextOutlined style={{ color: '#722ed1' }} />;
      case 'video': return <FileTextOutlined style={{ color: '#fa8c16' }} />;
      default: return <FileTextOutlined />;
    }
  };

  // 删除文件
  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    message.success('文件已删除');
  };

  // 预览文件
  const handlePreviewFile = (file: UploadFileData) => {
    message.info(`预览文件: ${file.name}`);
  };

  // 上传文件表格列
  const fileColumns: ColumnsType<UploadFileData> = [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {getFileIcon(record.dataType)}
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (type) => {
        const colorMap = {
          image: 'green',
          text: 'blue',
          audio: 'purple',
          video: 'orange'
        };
        return <Tag color={colorMap[type as keyof typeof colorMap]}>{type}</Tag>;
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        if (status === 'uploading') {
          return <Progress percent={record.progress} size="small" />;
        }
        const statusMap = {
          done: { color: 'success', text: '已完成' },
          error: { color: 'error', text: '失败' }
        };
        const config = statusMap[status as keyof typeof statusMap];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewFile(record)}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteFile(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          数据上传
        </Title>
        <Text type="secondary">
          上传和管理标注数据集，支持多种文件格式
        </Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总文件数"
              value={stats.totalFiles}
              prefix={<FolderOpenOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总存储量"
              value={stats.totalSize}
              prefix={<CloudUploadOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日上传"
              value={stats.todayUploads}
              prefix={<UploadOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="处理中"
              value={stats.processingFiles}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* 上传区域 */}
        <Col xs={24} lg={16}>
          <Card title="文件上传" style={{ marginBottom: 16 }}>
            <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。支持图片、文本、音频、视频等格式，单个文件不超过100MB
              </p>
            </Dragger>

            <Space style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={uploading}
                onClick={handleUpload}
                disabled={fileList.length === 0}
              >
                开始上传
              </Button>
              <Button
                onClick={() => setFileList([])}
                disabled={fileList.length === 0}
              >
                清空列表
              </Button>
            </Space>

            {fileList.length > 0 && (
              <div>
                <Text strong>待上传文件 ({fileList.length}):</Text>
                <List
                  size="small"
                  dataSource={fileList}
                  renderItem={(file) => (
                    <List.Item>
                      <Space>
                        {getFileIcon(getDataType(file.name))}
                        <Text>{file.name}</Text>
                        <Text type="secondary">
                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            )}
          </Card>

          {/* 已上传文件列表 */}
          <Card title="已上传文件">
            <Table
              columns={fileColumns}
              dataSource={uploadedFiles}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个文件`,
              }}
            />
          </Card>
        </Col>

        {/* 配置面板 */}
        <Col xs={24} lg={8}>
          <Card title="数据集配置">
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                console.log('Dataset config:', values);
                message.success('配置已保存');
              }}
            >
              <Form.Item
                name="name"
                label="数据集名称"
                rules={[{ required: true, message: '请输入数据集名称' }]}
              >
                <Input placeholder="输入数据集名称" />
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
              >
                <TextArea
                  rows={3}
                  placeholder="输入数据集描述"
                />
              </Form.Item>

              <Form.Item
                name="dataType"
                label="数据类型"
                rules={[{ required: true, message: '请选择数据类型' }]}
              >
                <Select placeholder="选择数据类型">
                  <Option value="image">图像数据</Option>
                  <Option value="text">文本数据</Option>
                  <Option value="audio">音频数据</Option>
                  <Option value="video">视频数据</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="labelType"
                label="标注类型"
                rules={[{ required: true, message: '请选择标注类型' }]}
              >
                <Select placeholder="选择标注类型">
                  <Option value="classification">分类标注</Option>
                  <Option value="detection">目标检测</Option>
                  <Option value="segmentation">语义分割</Option>
                  <Option value="ner">命名实体识别</Option>
                  <Option value="sentiment">情感分析</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="tags"
                label="标签"
              >
                <Select
                  mode="tags"
                  placeholder="添加标签"
                  style={{ width: '100%' }}
                >
                  <Option value="医疗">医疗</Option>
                  <Option value="金融">金融</Option>
                  <Option value="教育">教育</Option>
                  <Option value="电商">电商</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  保存配置
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* 支持格式说明 */}
          <Card title="支持格式" size="small" style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12 }}>
              <div style={{ marginBottom: 8 }}>
                <Text strong>图像:</Text> {supportedTypes.image.join(', ')}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>文本:</Text> {supportedTypes.text.join(', ')}
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text strong>音频:</Text> {supportedTypes.audio.join(', ')}
              </div>
              <div>
                <Text strong>视频:</Text> {supportedTypes.video.join(', ')}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DataUpload;
