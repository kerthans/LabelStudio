'use client';
import React, { useState } from 'react';
import {
  Card,
  Upload,
  Button,
  Form,
  Input,
  Select,
  Space,
  Progress,
  Alert,
  Steps,
} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Step } = Steps;

const DatasetUploadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form] = Form.useForm();

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploadProgress(Math.random() * 100);
      }
      if (status === 'done') {
        setUploadProgress(100);
        setCurrentStep(2);
      }
    },
  };

  const steps = [
    {
      title: '基本信息',
      content: (
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="数据集名称"
            rules={[{ required: true, message: '请输入数据集名称' }]}
          >
            <Input placeholder="请输入数据集名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="数据类型"
            rules={[{ required: true, message: '请选择数据类型' }]}
          >
            <Select placeholder="请选择数据类型">
              <Select.Option value="image">图像</Select.Option>
              <Select.Option value="text">文本</Select.Option>
              <Select.Option value="audio">音频</Select.Option>
              <Select.Option value="video">视频</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入数据集描述" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: '上传文件',
      content: (
        <div>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传。严禁上传公司数据或其他敏感文件。
            </p>
          </Dragger>
          {uploadProgress > 0 && (
            <div style={{ marginTop: 16 }}>
              <Progress percent={uploadProgress} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: '完成',
      content: (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <CheckCircleOutlined
            style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }}
          />
          <h3>上传完成！</h3>
          <p>数据集已成功上传，您可以开始创建标注任务了。</p>
        </div>
      ),
    },
  ];

  const next = () => {
    if (currentStep === 0) {
      form.validateFields().then(() => {
        setCurrentStep(currentStep + 1);
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Card title="上传数据集">
      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div style={{ minHeight: 300 }}>
        {steps[currentStep].content}
      </div>

      <div style={{ marginTop: 24 }}>
        <Space>
          {currentStep > 0 && (
            <Button onClick={prev}>
              上一步
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              下一步
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={() => window.history.back()}>
              返回数据集列表
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default DatasetUploadPage;