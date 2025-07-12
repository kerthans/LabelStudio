"use client";

import { ReportParameter, ReportTemplate } from "@/types/dashboard/tender";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Skeleton,
  Steps,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const GenerateReportPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("template");

  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [parameters, setParameters] = useState<{ [key: string]: any }>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setSelectedTemplate(template);
        setCurrentStep(1); // 直接跳到参数配置步骤
        form.setFieldsValue({ templateId });
      }
    }
  }, [templateId, templates]);

  const loadTemplates = () => {
    setLoading(true);

    const mockTemplates: ReportTemplate[] = [
      {
        id: "template-1",
        name: "招标分析报告",
        description: "全面分析招标项目的投标情况、价格趋势和竞争态势，为决策提供数据支持",
        type: "tender",
        category: "分析报告",
        sections: [],
        parameters: [
          {
            id: "projectId",
            name: "projectId",
            label: "项目选择",
            type: "select",
            required: true,
            options: [
              { label: "办公楼建设项目 - 预算2000万", value: "project-1" },
              { label: "道路改造工程 - 预算1500万", value: "project-2" },
              { label: "学校综合楼建设 - 预算3000万", value: "project-3" },
            ],
          },
          {
            id: "dateRange",
            name: "dateRange",
            label: "分析时间范围",
            type: "date",
            required: true,
          },
          {
            id: "includeCharts",
            name: "includeCharts",
            label: "包含数据图表",
            type: "boolean",
            required: false,
            defaultValue: true,
          },
          {
            id: "detailLevel",
            name: "detailLevel",
            label: "报告详细程度",
            type: "select",
            required: true,
            options: [
              { label: "简要概述", value: "brief" },
              { label: "标准详细", value: "standard" },
              { label: "深度分析", value: "detailed" },
            ],
          },
        ],
        format: "pdf",
        isDefault: true,
        isPublic: true,
        createdBy: "系统管理员",
        createdAt: "2024-01-01 00:00:00",
        updatedAt: "2024-01-01 00:00:00",
        usageCount: 156,
      },
      {
        id: "template-2",
        name: "评标结果汇总",
        description: "汇总专家评分结果，生成标准化的评标报告，包含评分统计和专家意见",
        type: "evaluation",
        category: "评标报告",
        sections: [],
        parameters: [
          {
            id: "evaluationId",
            name: "evaluationId",
            label: "评标项目",
            type: "select",
            required: true,
            options: [
              { label: "办公楼建设项目评标 - 5家投标商", value: "eval-1" },
              { label: "道路改造工程评标 - 8家投标商", value: "eval-2" },
              { label: "设备采购项目评标 - 3家投标商", value: "eval-3" },
            ],
          },
          {
            id: "expertFilter",
            name: "expertFilter",
            label: "专家筛选",
            type: "multiselect",
            required: false,
            options: [
              { label: "张建华 - 建筑工程专家", value: "expert-1" },
              { label: "李明 - 造价工程师", value: "expert-2" },
              { label: "王芳 - 法律顾问", value: "expert-3" },
              { label: "陈强 - 技术专家", value: "expert-4" },
            ],
          },
          {
            id: "includeComments",
            name: "includeComments",
            label: "包含专家评语",
            type: "boolean",
            required: false,
            defaultValue: true,
          },
        ],
        format: "word",
        isDefault: true,
        isPublic: true,
        createdBy: "系统管理员",
        createdAt: "2024-01-01 00:00:00",
        updatedAt: "2024-01-01 00:00:00",
        usageCount: 89,
      },
      {
        id: "template-3",
        name: "供应商资质分析",
        description: "深度分析供应商资质情况，对比各家供应商的实力和信誉度",
        type: "qualification",
        category: "资质报告",
        sections: [],
        parameters: [
          {
            id: "supplierIds",
            name: "supplierIds",
            label: "供应商选择",
            type: "multiselect",
            required: true,
            options: [
              { label: "中建集团 - AAA级资质", value: "supplier-1" },
              { label: "万科建设 - AA级资质", value: "supplier-2" },
              { label: "绿地建设 - AA级资质", value: "supplier-3" },
              { label: "保利建设 - A级资质", value: "supplier-4" },
            ],
          },
          {
            id: "analysisType",
            name: "analysisType",
            label: "分析维度",
            type: "multiselect",
            required: true,
            options: [
              { label: "资质等级", value: "qualification" },
              { label: "财务状况", value: "financial" },
              { label: "项目经验", value: "experience" },
              { label: "信誉记录", value: "reputation" },
            ],
          },
        ],
        format: "excel",
        isDefault: false,
        isPublic: true,
        createdBy: "张三",
        createdAt: "2024-01-10 00:00:00",
        updatedAt: "2024-01-10 00:00:00",
        usageCount: 34,
      },
    ];

    setTimeout(() => {
      setTemplates(mockTemplates);
      setLoading(false);
    }, 800);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);

    setParameters({});

    if (template) {
      const defaultParams: { [key: string]: any } = {};
      template.parameters.forEach(param => {
        if (param.defaultValue !== undefined) {
          defaultParams[param.name] = param.defaultValue;
        }
      });
      setParameters(defaultParams);
    }
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters({
      ...parameters,
      [paramName]: value,
    });
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FilePdfOutlined className="text-red-500" />;
      case "word":
        return <FileWordOutlined className="text-blue-500" />;
      case "excel":
        return <FileExcelOutlined className="text-green-500" />;
      default:
        return <FileTextOutlined className="text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    const typeMap = {
      tender: "blue",
      evaluation: "green",
      qualification: "orange",
      analysis: "purple",
      custom: "default",
    };
    return typeMap[type as keyof typeof typeMap] || "default";
  };

  const renderParameterInput = (param: ReportParameter) => {
    const value = parameters[param.name];

    switch (param.type) {
      case "text":
        return (
          <Input
            value={value}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            placeholder={`请输入${param.label}`}
            size="large"
          />
        );

      case "number":
        return (
          <InputNumber
            value={value}
            onChange={(val) => handleParameterChange(param.name, val)}
            placeholder={`请输入${param.label}`}
            style={{ width: "100%" }}
            size="large"
            min={param.validation?.min}
            max={param.validation?.max}
          />
        );

      case "date":
        return (
          <DatePicker.RangePicker
            value={value}
            onChange={(dates) => handleParameterChange(param.name, dates)}
            style={{ width: "100%" }}
            size="large"
            placeholder={["开始日期", "结束日期"]}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onChange={(val) => handleParameterChange(param.name, val)}
            placeholder={`请选择${param.label}`}
            style={{ width: "100%" }}
            size="large"
            showSearch
            optionFilterProp="children"
          >
            {param.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "multiselect":
        return (
          <Select
            mode="multiple"
            value={value}
            onChange={(val) => handleParameterChange(param.name, val)}
            placeholder={`请选择${param.label}`}
            style={{ width: "100%" }}
            size="large"
            showSearch
            optionFilterProp="children"
          >
            {param.options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value}
              onChange={(checked) => handleParameterChange(param.name, checked)}
              size="default"
            />
            <Text type="secondary">{value ? "是" : "否"}</Text>
          </div>
        );

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleParameterChange(param.name, e.target.value)}
            placeholder={`请输入${param.label}`}
            size="large"
          />
        );
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return selectedTemplate !== null;
      case 1:
        if (!selectedTemplate) return false;
        const missingParams = selectedTemplate.parameters
          .filter(param => param.required && !parameters[param.name])
          .length;
        return missingParams === 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    } else {
      if (currentStep === 0) {
        message.warning("请先选择一个报告模板");
      } else if (currentStep === 1) {
        message.warning("请填写所有必填参数");
      }
    }
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handleGenerate = async (_isScheduled = false) => {
    try {
      const _formValues = await form.validateFields();

      setGenerating(true);
      setGenerationProgress(0);

      const mockGenerationId = `gen-${Date.now()}`;
      setGenerationId(mockGenerationId);

      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setGenerating(false);
            message.success("报告生成完成！");
            setTimeout(() => {
              router.push("/dashboard/reports");
            }, 1500);
            return 100;
          }
          return prev + Math.random() * 15 + 5;
        });
      }, 600);
    } catch (_error) {
      message.error("请填写完整的报告信息");
    }
  };

  const steps = [
    {
      title: "选择模板",
      description: "选择适合的报告模板",
      icon: <FileTextOutlined />,
    },
    {
      title: "配置参数",
      description: "设置报告生成参数",
      icon: <SettingOutlined />,
    },
    {
      title: "确认生成",
      description: "预览并生成报告",
      icon: <CheckCircleOutlined />,
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center py-4">
              <Title level={3} className="!mb-2">选择报告模板</Title>
              <Text type="secondary" className="text-base">
                选择一个适合您需求的报告模板，我们提供多种专业模板
              </Text>
            </div>

            {loading ? (
              <Row gutter={[24, 24]}>
                {[1, 2, 3].map(i => (
                  <Col span={8} key={i}>
                    <Card>
                      <Skeleton active />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row gutter={[24, 24]}>
                {templates.map(template => (
                  <Col span={8} key={template.id}>
                    <Card
                      hoverable
                      className={`transition-all duration-200 ${selectedTemplate?.id === template.id
                        ? "ring-2 ring-blue-500 shadow-lg"
                        : "hover:shadow-md"
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                      bodyStyle={{ padding: "20px" }}
                    >
                      <div className="space-y-4">
                        <Flex justify="space-between" align="flex-start">
                          <div className="flex-1">
                            <Flex align="center" gap={8} className="mb-2">
                              {getFormatIcon(template.format)}
                              <Title level={5} className="!mb-0">{template.name}</Title>
                            </Flex>
                            <Paragraph
                              type="secondary"
                              className="!mb-0 text-sm leading-relaxed"
                              ellipsis={{ rows: 2, tooltip: template.description }}
                            >
                              {template.description}
                            </Paragraph>
                          </div>
                          {selectedTemplate?.id === template.id && (
                            <CheckCircleOutlined className="text-blue-500 text-lg" />
                          )}
                        </Flex>

                        <div className="space-y-3">
                          <Flex gap={6} wrap="wrap">
                            <Tag color={getTypeColor(template.type)}>
                              {template.type === "tender" ? "招标" :
                                template.type === "evaluation" ? "评标" :
                                  template.type === "qualification" ? "资质" : "其他"}
                            </Tag>
                            <Tag color="default">{template.format.toUpperCase()}</Tag>
                            {template.isDefault && <Tag color="gold">推荐</Tag>}
                          </Flex>

                          <Flex justify="space-between" align="center">
                            <Text type="secondary" className="text-xs">
                              使用 {template.usageCount} 次
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {template.parameters.length} 个参数
                            </Text>
                          </Flex>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center py-4">
              <Title level={3} className="!mb-2">配置报告参数</Title>
              <Text type="secondary" className="text-base">
                根据您的需求配置报告生成参数
              </Text>
            </div>

            {selectedTemplate ? (
              <div className="space-y-6">
                <Alert
                  message={`已选择模板：${selectedTemplate.name}`}
                  description={selectedTemplate.description}
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                  className="bg-blue-50 border-blue-200"
                />

                <Card title="参数配置" className="shadow-sm">
                  <Form layout="vertical" size="large">
                    <Row gutter={[24, 16]}>
                      {selectedTemplate.parameters.map(param => (
                        <Col span={param.type === "boolean" ? 24 : 12} key={param.id}>
                          <Form.Item
                            label={
                              <span className="text-sm font-medium">
                                {param.label}
                                {param.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                            }
                            required={param.required}
                            className="mb-4"
                          >
                            {renderParameterInput(param)}
                          </Form.Item>
                        </Col>
                      ))}
                    </Row>
                  </Form>
                </Card>
              </div>
            ) : (
              <Empty
                description="请先选择模板"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center py-4">
              <Title level={3} className="!mb-2">确认并生成报告</Title>
              <Text type="secondary" className="text-base">
                请确认配置信息，然后生成您的报告
              </Text>
            </div>

            {selectedTemplate ? (
              <div className="space-y-6">
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="模板信息" className="h-full">
                      <div className="space-y-3">
                        <Flex justify="space-between">
                          <Text type="secondary">模板名称</Text>
                          <Text strong>{selectedTemplate.name}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text type="secondary">报告类型</Text>
                          <Tag color={getTypeColor(selectedTemplate.type)}>
                            {selectedTemplate.type === "tender" ? "招标" :
                              selectedTemplate.type === "evaluation" ? "评标" :
                                selectedTemplate.type === "qualification" ? "资质" : "其他"}
                          </Tag>
                        </Flex>
                        <Flex justify="space-between">
                          <Text type="secondary">输出格式</Text>
                          <Flex align="center" gap={4}>
                            {getFormatIcon(selectedTemplate.format)}
                            <Text>{selectedTemplate.format.toUpperCase()}</Text>
                          </Flex>
                        </Flex>
                        <Flex justify="space-between">
                          <Text type="secondary">预计生成时间</Text>
                          <Text>2-5 分钟</Text>
                        </Flex>
                      </div>
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card title="参数配置" className="h-full">
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {selectedTemplate.parameters.map(param => {
                          const value = parameters[param.name];
                          const displayValue = typeof value === "boolean"
                            ? (value ? "是" : "否")
                            : Array.isArray(value)
                              ? value.join(", ")
                              : String(value || "未设置");

                          return (
                            <Flex justify="space-between" key={param.id}>
                              <Text type="secondary">{param.label}</Text>
                              <Text className="text-right flex-1 ml-4" ellipsis>
                                {displayValue}
                              </Text>
                            </Flex>
                          );
                        })}
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Card title="报告信息" className="shadow-sm">
                  <Form form={form} layout="vertical" size="large">
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name="title"
                          label="报告标题"
                          rules={[{ required: true, message: "请输入报告标题" }]}
                        >
                          <Input
                            placeholder="请输入报告标题"
                            prefix={<FileTextOutlined className="text-gray-400" />}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="description" label="报告描述">
                          <Input placeholder="请输入报告描述（可选）" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <Flex justify="center" gap={16}>
                    <Button
                      size="large"
                      icon={<EyeOutlined />}
                      onClick={handlePreview}
                      className="min-w-32"
                    >
                      预览报告
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ThunderboltOutlined />}
                      onClick={() => handleGenerate(false)}
                      className="min-w-32"
                    >
                      立即生成
                    </Button>
                    <Button
                      size="large"
                      icon={<HistoryOutlined />}
                      onClick={() => handleGenerate(true)}
                      className="min-w-32"
                    >
                      定时生成
                    </Button>
                  </Flex>
                </div>
              </div>
            ) : (
              <Empty
                description="请先选择模板并配置参数"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={16}>
              <Link href="/dashboard/reports">
                <Button icon={<ArrowLeftOutlined />} type="text">
                  返回报告列表
                </Button>
              </Link>
              <Divider type="vertical" className="h-6" />
              <div>
                <Title level={3} className="!mb-1">生成报告</Title>
                <Text type="secondary">选择模板并配置参数来生成自定义报告</Text>
              </div>
            </Flex>
            <Button icon={<SaveOutlined />} type="default">
              保存草稿
            </Button>
          </Flex>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* 步骤指示器 */}
          <Card className="mb-6 shadow-sm">
            <Steps
              current={currentStep}
              size="default"
              className="px-8 py-4"
            >
              {steps.map((step, index) => (
                <Steps.Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                />
              ))}
            </Steps>
          </Card>

          {/* 步骤内容 */}
          <Card className="shadow-sm min-h-96">
            {renderStepContent()}
          </Card>

          {/* 底部操作 */}
          <div className="mt-6">
            <Flex justify="space-between">
              <Button
                size="large"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
                className="min-w-24"
              >
                上一步
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  disabled={!validateCurrentStep()}
                  className="min-w-24"
                >
                  下一步
                </Button>
              )}
            </Flex>
          </div>
        </div>
      </div>

      {/* 生成进度模态框 */}
      <Modal
        title="正在生成报告"
        open={generating}
        footer={null}
        closable={false}
        centered
        width={480}
      >
        <div className="text-center py-8">
          <Progress
            type="circle"
            percent={Math.round(generationProgress)}
            status={generationProgress === 100 ? "success" : "active"}
            size={120}
            strokeWidth={6}
          />
          <div className="mt-6 space-y-2">
            <Text className="text-lg">正在生成报告，请稍候...</Text>
            <br />
            <Text type="secondary">
              {generationProgress < 30 ? "正在分析数据..." :
                generationProgress < 60 ? "正在生成内容..." :
                  generationProgress < 90 ? "正在格式化报告..." : "即将完成..."}
            </Text>
            {generationId && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <Text type="secondary" className="text-xs">
                  生成ID：{generationId}
                </Text>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* 预览模态框 */}
      <Modal
        title="报告预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={900}
        footer={[
          <Button key="cancel" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button key="download" icon={<DownloadOutlined />} type="primary">
            下载预览
          </Button>,
        ]}
      >
        <div className="h-96 border border-gray-200 rounded-lg p-6 bg-white">
          <div className="text-center text-gray-500 h-full flex flex-col justify-center">
            <FileTextOutlined className="text-6xl mb-4 text-gray-300" />
            <Title level={4} type="secondary">报告预览</Title>
            <Text type="secondary">这里将显示报告的预览内容</Text>
            <div className="mt-4">
              <Text type="secondary" className="text-sm">
                预览功能正在开发中，生成后可查看完整报告
              </Text>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GenerateReportPage;
