"use client";
import {
  DatabaseOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  TeamOutlined,
  UploadOutlined
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Tag,
  Typography,
  Upload
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 任务模板数据
const taskTemplates = [
  {
    id: "image_classification",
    name: "图像分类任务",
    description: "对图像进行分类标注，支持多类别识别",
    type: "图像分类",
    estimatedTime: "2-5天",
    complexity: "简单",
    icon: <FileTextOutlined />,
  },
  {
    id: "object_detection",
    name: "目标检测任务",
    description: "在图像中标注目标物体的位置和类别",
    type: "目标检测",
    estimatedTime: "5-10天",
    complexity: "中等",
    icon: <DatabaseOutlined />,
  },
  {
    id: "text_annotation",
    name: "文本标注任务",
    description: "对文本进行情感分析、实体识别等标注",
    type: "文本标注",
    estimatedTime: "1-3天",
    complexity: "简单",
    icon: <FileTextOutlined />,
  },
  {
    id: "audio_transcription",
    name: "语音转录任务",
    description: "将语音文件转录为文本并进行标注",
    type: "语音标注",
    estimatedTime: "3-7天",
    complexity: "中等",
    icon: <UploadOutlined />,
  },
];

const CreateTask: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);

  // 步骤配置
  const steps = [
    {
      title: "任务信息",
      icon: <InfoCircleOutlined />,
      description: "设置任务基本信息和类型",
    },
    {
      title: "标注规则",
      icon: <SettingOutlined />,
      description: "配置标注规则和质量要求",
    },
    {
      title: "数据配置",
      icon: <DatabaseOutlined />,
      description: "选择数据源和分配策略",
    },
    {
      title: "团队分配",
      icon: <TeamOutlined />,
      description: "分配标注人员和审核流程",
    },
  ];

  // 文件上传配置
  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "/api/tasks/upload",
    accept: ".jpg,.jpeg,.png,.txt,.wav,.mp3,.mp4",
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  // 处理步骤切换
  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error("请完善当前步骤的必填信息");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 提交任务
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log("任务数据:", values);

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success("任务创建成功！");
      router.push("/dashboard/tasks/monitor");
    } catch (error) {
      message.error("创建失败，请检查信息");
    } finally {
      setLoading(false);
    }
  };

  // 计算预估工期
  const calculateDuration = (dataCount: number, taskType: string) => {
    const baseTime = {
      "图像分类": 0.5,
      "目标检测": 2,
      "文本标注": 0.3,
      "语音标注": 1.5,
    };
    const duration = Math.ceil((dataCount * (baseTime[taskType as keyof typeof baseTime] || 1)) / 8); // 按8小时工作日计算
    setEstimatedDuration(duration);
  };

  // 渲染任务信息步骤
  const renderTaskInfo = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="选择任务模板" size="small">
        <Row gutter={[16, 16]}>
          {taskTemplates.map((template) => (
            <Col span={12} key={template.id}>
              <Card
                hoverable
                size="small"
                className={selectedTemplate === template.id ? "selected-template" : ""}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  form.setFieldsValue({ taskType: template.type });
                }}
                style={{
                  border: selectedTemplate === template.id ? "2px solid #1890ff" : "1px solid #d9d9d9",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "#f0f2f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      color: "#1890ff",
                    }}
                  >
                    {template.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong>{template.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {template.description}
                    </Text>
                    <br />
                    <Space size={4} style={{ marginTop: 4 }}>
                      <Tag color="blue" className="small-tag">{template.estimatedTime}</Tag>
                      <Tag color="green" className="small-tag">{template.complexity}</Tag>
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="任务基本信息">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="taskName"
              label="任务名称"
              rules={[{ required: true, message: "请输入任务名称" }]}
            >
              <Input placeholder="请输入任务名称" size="large" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="任务描述"
              rules={[{ required: true, message: "请输入任务描述" }]}
            >
              <TextArea
                rows={4}
                placeholder="请详细描述任务目标、标注要求和注意事项"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="taskType"
              label="任务类型"
              rules={[{ required: true, message: "请选择任务类型" }]}
            >
              <Select placeholder="选择任务类型" size="large">
                <Option value="图像分类">图像分类</Option>
                <Option value="目标检测">目标检测</Option>
                <Option value="文本标注">文本标注</Option>
                <Option value="语音标注">语音标注</Option>
                <Option value="视频标注">视频标注</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="priority"
              label="任务优先级"
              rules={[{ required: true, message: "请选择任务优先级" }]}
            >
              <Select placeholder="选择优先级" size="large">
                <Option value="high">高优先级</Option>
                <Option value="medium">中优先级</Option>
                <Option value="low">低优先级</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="expectedDuration"
              label="预期工期（天）"
              rules={[{ required: true, message: "请输入预期工期" }]}
            >
              <InputNumber
                min={1}
                max={365}
                placeholder="预期工期"
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="deadline"
              label="截止时间"
              rules={[{ required: true, message: "请选择截止时间" }]}
            >
              <RangePicker
                showTime
                style={{ width: "100%" }}
                size="large"
                placeholder={["开始时间", "截止时间"]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Space>
  );

  // 渲染标注规则步骤
  const renderAnnotationRules = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="标注规则配置">
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="annotationGuidelines"
              label="标注指南"
              rules={[{ required: true, message: "请输入标注指南" }]}
            >
              <TextArea
                rows={6}
                placeholder="请详细描述标注规则、标准和示例"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="qualityThreshold"
              label="质量阈值（%）"
              rules={[{ required: true, message: "请设置质量阈值" }]}
            >
              <InputNumber
                min={60}
                max={100}
                placeholder="质量阈值"
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="reviewRatio"
              label="抽检比例（%）"
              rules={[{ required: true, message: "请设置抽检比例" }]}
            >
              <InputNumber
                min={5}
                max={100}
                placeholder="抽检比例"
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="enableConsensus" valuePropName="checked">
              <Switch /> 启用一致性检查（多人标注同一数据）
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="enableAutoReview" valuePropName="checked">
              <Switch /> 启用自动质量检查
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="标签配置">
        <Alert
          message="标签配置"
          description="请根据任务类型配置相应的标签类别和属性。系统将根据您的配置生成标注界面。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Form.Item
          name="labels"
          label="标签列表"
          rules={[{ required: true, message: "请配置标签" }]}
        >
          <TextArea
            rows={4}
            placeholder="请输入标签，每行一个，例如：\n猫\n狗\n鸟"
          />
        </Form.Item>
      </Card>
    </Space>
  );

  // 渲染数据配置步骤
  const renderDataConfig = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="数据源配置">
        <Form.Item
          name="dataSource"
          label="数据来源"
          rules={[{ required: true, message: "请选择数据来源" }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="upload">上传本地文件</Radio>
              <Radio value="dataset">选择已有数据集</Radio>
              <Radio value="url">从URL导入</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="dataFiles"
          label="数据文件"
          rules={[{ required: true, message: "请上传数据文件" }]}
        >
          <Upload.Dragger {...uploadProps} style={{ padding: "20px" }}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传。支持图片、文本、音频、视频等格式
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dataCount"
              label="数据量"
              rules={[{ required: true, message: "请输入数据量" }]}
            >
              <InputNumber
                min={1}
                placeholder="数据条数"
                style={{ width: "100%" }}
                size="large"
                onChange={(value) => {
                  if (value) {
                    const taskType = form.getFieldValue("taskType");
                    calculateDuration(value, taskType);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="预估工期">
              <Input
                value={estimatedDuration > 0 ? `${estimatedDuration} 天` : "请先输入数据量"}
                disabled
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="分配策略">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="assignmentStrategy"
              label="分配策略"
              rules={[{ required: true, message: "请选择分配策略" }]}
            >
              <Select placeholder="选择分配策略" size="large">
                <Option value="auto">自动分配</Option>
                <Option value="manual">手动分配</Option>
                <Option value="skill">按技能分配</Option>
                <Option value="workload">按工作量分配</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="batchSize"
              label="批次大小"
              rules={[{ required: true, message: "请输入批次大小" }]}
            >
              <InputNumber
                min={1}
                max={1000}
                placeholder="每批数据量"
                style={{ width: "100%" }}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Space>
  );

  // 渲染团队分配步骤
  const renderTeamAssignment = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="标注团队">
        <Form.Item
          name="annotators"
          label="标注人员"
          rules={[{ required: true, message: "请选择标注人员" }]}
        >
          <Select
            mode="multiple"
            placeholder="选择标注人员"
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="user1">张小明 - 高级标注员</Option>
            <Option value="user2">李小红 - 中级标注员</Option>
            <Option value="user3">王小强 - 专家标注员</Option>
            <Option value="user4">赵小美 - 初级标注员</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reviewers"
          label="审核人员"
          rules={[{ required: true, message: "请选择审核人员" }]}
        >
          <Select
            mode="multiple"
            placeholder="选择审核人员"
            size="large"
            style={{ width: "100%" }}
          >
            <Option value="reviewer1">项目经理A</Option>
            <Option value="reviewer2">质量专家B</Option>
            <Option value="reviewer3">高级审核员C</Option>
          </Select>
        </Form.Item>
      </Card>

      <Card title="工作流配置">
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="workflowType"
              label="工作流类型"
              rules={[{ required: true, message: "请选择工作流类型" }]}
            >
              <Select placeholder="选择工作流" size="large">
                <Option value="simple">简单流程（标注→审核）</Option>
                <Option value="consensus">一致性流程（多人标注→一致性检查→审核）</Option>
                <Option value="hierarchical">分层流程（初审→复审→终审）</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="autoAssign"
              label="自动分配"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notifications"
          label="通知设置"
        >
          <Select
            mode="multiple"
            placeholder="选择通知方式"
            size="large"
          >
            <Option value="email">邮件通知</Option>
            <Option value="sms">短信通知</Option>
            <Option value="system">系统通知</Option>
          </Select>
        </Form.Item>
      </Card>
    </Space>
  );

  // 渲染当前步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderTaskInfo();
      case 1:
        return renderAnnotationRules();
      case 2:
        return renderDataConfig();
      case 3:
        return renderTeamAssignment();
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>
            创建标注任务
          </Title>
          <Text type="secondary">
            创建新的数据标注任务，配置标注规则和分配团队
          </Text>
        </div>

        <Card style={{ marginBottom: 24 }}>
          <Steps current={currentStep} items={steps} />
        </Card>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            priority: "medium",
            qualityThreshold: 95,
            reviewRatio: 20,
            batchSize: 100,
            workflowType: "simple",
          }}
        >
          {renderStepContent()}
        </Form>

        <Card style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              {currentStep > 0 && (
                <Button size="large" onClick={handlePrev}>
                  上一步
                </Button>
              )}
            </div>
            <div>
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
                  创建任务
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateTask;
