"use client";
import {
  DatabaseOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 项目模板数据
const projectTemplates = [
  {
    id: "template_image_classification",
    name: "图像分类标注",
    description: "适用于图像分类、物体识别等任务",
    type: "图像分类",
    features: ["多类别标注", "质量控制", "批量处理"],
    estimatedTime: "2-4周",
  },
  {
    id: "template_object_detection",
    name: "目标检测标注",
    description: "适用于目标检测、边界框标注等任务",
    type: "目标检测",
    features: ["边界框标注", "多目标识别", "精确定位"],
    estimatedTime: "3-6周",
  },
  {
    id: "template_text_classification",
    name: "文本分类标注",
    description: "适用于情感分析、文本分类等任务",
    type: "文本分类",
    features: ["情感分析", "主题分类", "意图识别"],
    estimatedTime: "1-3周",
  },
  {
    id: "template_speech_annotation",
    name: "语音标注",
    description: "适用于语音识别、语音转录等任务",
    type: "语音标注",
    features: ["语音转录", "语音分割", "说话人识别"],
    estimatedTime: "2-5周",
  },
];

const CreateProject: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 步骤配置
  const steps = [
    {
      title: "基本信息",
      icon: <InfoCircleOutlined />,
      description: "设置项目基本信息",
    },
    {
      title: "标注配置",
      icon: <SettingOutlined />,
      description: "配置标注规则和质量控制",
    },
    {
      title: "数据上传",
      icon: <DatabaseOutlined />,
      description: "上传待标注数据",
    },
    {
      title: "团队分配",
      icon: <TeamOutlined />,
      description: "分配标注团队和审核人员",
    },
  ];

  // 文件上传配置
  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (status === "error") {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // 处理步骤切换
  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (_error) {
      message.error("请完善当前步骤的信息");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 提交项目
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log("项目数据:", values);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success("项目创建成功！");
      router.push("/dashboard/projects/list");
    } catch (_error) {
      message.error("创建失败，请检查信息");
    } finally {
      setLoading(false);
    }
  };

  // 渲染基本信息步骤
  const renderBasicInfo = () => (
    <Card title="项目基本信息" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: "请输入项目名称" }]}
          >
            <Input placeholder="请输入项目名称" size="large" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: "请输入项目描述" }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述项目目标、数据类型和标注要求"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="type"
            label="项目类型"
            rules={[{ required: true, message: "请选择项目类型" }]}
          >
            <Select placeholder="选择项目类型" size="large">
              <Option value="图像分类">图像分类</Option>
              <Option value="目标检测">目标检测</Option>
              <Option value="文本分类">文本分类</Option>
              <Option value="语音标注">语音标注</Option>
              <Option value="视频标注">视频标注</Option>
              <Option value="自定义">自定义</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="priority"
            label="项目优先级"
            rules={[{ required: true, message: "请选择项目优先级" }]}
          >
            <Radio.Group size="large">
              <Radio.Button value="high">高</Radio.Button>
              <Radio.Button value="medium">中</Radio.Button>
              <Radio.Button value="low">低</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="deadline"
            label="截止日期"
            rules={[{ required: true, message: "请选择截止日期" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              size="large"
              placeholder="选择截止日期"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="budget"
            label="预算金额"
            rules={[{ required: true, message: "请输入预算金额" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              size="large"
              placeholder="请输入预算金额"
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/¥\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* 项目模板选择 */}
      <Divider orientation="left">选择项目模板（可选）</Divider>
      <Row gutter={[16, 16]}>
        {projectTemplates.map((template) => (
          <Col xs={24} sm={12} lg={6} key={template.id}>
            <Card
              hoverable
              className={selectedTemplate === template.id ? "selected-template" : ""}
              onClick={() => setSelectedTemplate(template.id)}
              style={{
                border: selectedTemplate === template.id ? "2px solid #1890ff" : "1px solid #d9d9d9",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0 }}>
                  {template.name}
                </Title>
              </div>
              <Paragraph
                type="secondary"
                style={{ fontSize: 12, textAlign: "center", marginBottom: 12 }}
              >
                {template.description}
              </Paragraph>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                {template.features.map((feature) => (
                  <Tag key={feature} className="small-tag">
                    {feature}
                  </Tag>
                ))}
              </div>
              <Text type="secondary" style={{ fontSize: 11 }}>
                预计时间: {template.estimatedTime}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );

  // 渲染标注配置步骤
  const renderAnnotationConfig = () => (
    <Card title="标注配置" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="labelSchema"
            label="标签体系"
            rules={[{ required: true, message: "请选择标签体系" }]}
          >
            <Select placeholder="选择或创建标签体系" size="large">
              <Option value="custom">自定义标签</Option>
              <Option value="coco">COCO数据集标签</Option>
              <Option value="imagenet">ImageNet标签</Option>
              <Option value="sentiment">情感分析标签</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="qualityControl"
            label="质量控制"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="multiAnnotator"
            label="多人标注"
            valuePropName="checked"
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="consensusThreshold"
            label="一致性阈值"
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              placeholder="设置一致性阈值"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="annotationGuidelines"
            label="标注指南"
          >
            <TextArea
              rows={6}
              placeholder="请输入详细的标注指南和规范"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 渲染数据上传步骤
  const renderDataUpload = () => (
    <Card title="数据上传" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name="dataFiles"
            label="上传数据文件"
          >
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。支持图片、文本、音频、视频等格式
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dataFormat"
            label="数据格式"
          >
            <Select placeholder="选择数据格式" size="large">
              <Option value="image">图像文件 (JPG, PNG, BMP)</Option>
              <Option value="text">文本文件 (TXT, CSV, JSON)</Option>
              <Option value="audio">音频文件 (WAV, MP3, FLAC)</Option>
              <Option value="video">视频文件 (MP4, AVI, MOV)</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="estimatedCount"
            label="预计数据量"
          >
            <InputNumber
              style={{ width: "100%" }}
              size="large"
              placeholder="预计数据条数"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/,/g, "")}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 渲染团队分配步骤
  const renderTeamAssignment = () => (
    <Card title="团队分配" style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="projectManager"
            label="项目负责人"
            rules={[{ required: true, message: "请选择项目负责人" }]}
          >
            <Select placeholder="选择项目负责人" size="large">
              <Option value="manager1">张医生</Option>
              <Option value="manager2">李工程师</Option>
              <Option value="manager3">王总监</Option>
              <Option value="manager4">赵专家</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="annotationTeam"
            label="标注团队"
            rules={[{ required: true, message: "请选择标注团队" }]}
          >
            <Select
              mode="multiple"
              placeholder="选择标注团队"
              size="large"
            >
              <Option value="team1">标注团队A</Option>
              <Option value="team2">标注团队B</Option>
              <Option value="team3">标注团队C</Option>
              <Option value="team4">标注团队D</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="reviewers"
            label="审核人员"
          >
            <Select
              mode="multiple"
              placeholder="选择审核人员"
              size="large"
            >
              <Option value="reviewer1">高级审核员A</Option>
              <Option value="reviewer2">高级审核员B</Option>
              <Option value="reviewer3">专家审核员C</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="maxAnnotators"
            label="最大标注员数量"
          >
            <InputNumber
              style={{ width: "100%" }}
              size="large"
              min={1}
              max={50}
              placeholder="设置最大标注员数量"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderAnnotationConfig();
      case 2:
        return renderDataUpload();
      case 3:
        return renderTeamAssignment();
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          创建项目
        </Title>
        <Text type="secondary">创建新的数据标注项目</Text>
      </div>

      {/* 步骤导航 */}
      <Card style={{ marginBottom: 24 }}>
        <Steps current={currentStep} items={steps} />
      </Card>

      {/* 表单内容 */}
      <Form
        form={form}
        layout="vertical"
        size="large"
        initialValues={{
          priority: "medium",
          qualityControl: true,
          multiAnnotator: false,
          consensusThreshold: 80,
        }}
      >
        {renderStepContent()}
      </Form>

      {/* 操作按钮 */}
      <Card>
        <div style={{ textAlign: "right" }}>
          <Space>
            {currentStep > 0 && (
              <Button size="large" onClick={handlePrev}>
                上一步
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="primary" size="large" onClick={handleNext}>
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
              >
                创建项目
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default CreateProject;
