"use client";
import type { QualificationForm } from "@/types/dashboard/tender";
import {
  ArrowLeftOutlined,
  BankOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  List,
  Progress,
  Row,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;

const AddQualificationPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<QualificationForm>();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isDraft, setIsDraft] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  const steps = [
    {
      title: "基本信息",
      description: "填写企业和资质基本信息",
      icon: <BankOutlined />,
    },
    {
      title: "资质详情",
      description: "填写资质证书详细信息",
      icon: <SafetyCertificateOutlined />,
    },
    {
      title: "附件上传",
      description: "上传相关证书和文件",
      icon: <UploadOutlined />,
    },
  ];

  const qualificationTypes = [
    { value: "建筑工程施工总承包", label: "建筑工程施工总承包", category: "建筑类" },
    { value: "市政公用工程施工总承包", label: "市政公用工程施工总承包", category: "市政类" },
    { value: "机电工程施工总承包", label: "机电工程施工总承包", category: "机电类" },
    { value: "公路工程施工总承包", label: "公路工程施工总承包", category: "交通类" },
    { value: "水利水电工程施工总承包", label: "水利水电工程施工总承包", category: "水利类" },
    { value: "电力工程施工总承包", label: "电力工程施工总承包", category: "电力类" },
    { value: "石油化工工程施工总承包", label: "石油化工工程施工总承包", category: "化工类" },
    { value: "冶金工程施工总承包", label: "冶金工程施工总承包", category: "冶金类" },
    { value: "通信工程施工总承包", label: "通信工程施工总承包", category: "通信类" },
    { value: "铁路工程施工总承包", label: "铁路工程施工总承包", category: "铁路类" },
  ];

  const qualificationLevels = [
    { value: "特级", label: "特级", color: "gold", description: "最高等级，承接各类工程" },
    { value: "一级", label: "一级", color: "blue", description: "高等级，承接大型工程" },
    { value: "二级", label: "二级", color: "green", description: "中等级，承接中型工程" },
    { value: "三级", label: "三级", color: "default", description: "基础等级，承接小型工程" },
  ];

  const businessScopeOptions = [
    "房屋建筑工程", "市政公用工程", "机电安装工程", "公路工程",
    "桥梁工程", "隧道工程", "水利工程", "电力工程",
    "石油化工工程", "冶金工程", "通信工程", "铁路工程",
    "城市轨道交通工程", "港口与航道工程", "民航工程",
  ];

  // 计算表单完成进度
  const calculateProgress = () => {
    const values = form.getFieldsValue();
    const requiredFields = [
      "companyName", "companyCode", "qualificationType", "qualificationLevel",
      "certificateNumber", "issueDate", "expiryDate", "issuingAuthority", "businessScope",
    ];

    const completedFields = requiredFields.filter(field => {
      const value = values[field as keyof QualificationForm];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    }).length;

    const progress = Math.round((completedFields / requiredFields.length) * 100);
    setFormProgress(progress);
    return progress;
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    fileList,
    beforeUpload: (file) => {
      const isValidType = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type);

      if (!isValidType) {
        message.error("只支持 PDF、JPG、PNG、DOC、DOCX 格式的文件！");
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("文件大小不能超过 10MB！");
        return false;
      }

      return true;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    customRequest: ({ file, onSuccess, onError }) => {
      // 模拟上传进度
      let progress = 0;
      const timer = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(timer);
          onSuccess?.(null);
          message.success(`${(file as File).name} 上传成功`);
        }
      }, 100);
    },
    onRemove: (file) => {
      message.success(`${file.name} 已移除`);
    },
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(["companyName", "companyCode", "qualificationType", "qualificationLevel"]);
      } else if (currentStep === 1) {
        await form.validateFields(["certificateNumber", "issueDate", "expiryDate", "issuingAuthority", "businessScope"]);
      }
      setCurrentStep(currentStep + 1);
      calculateProgress();
    } catch (error) {
      message.error("请完善必填信息后继续");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setIsDraft(true);
    try {
      const values = await form.getFieldsValue();
      // 模拟保存草稿
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("草稿保存成功，可稍后继续编辑");
    } catch (error) {
      message.error("保存失败，请重试");
    } finally {
      setLoading(false);
      setIsDraft(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      // 模拟提交
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success("资质信息提交成功，等待审核");
      router.push("/dashboard/qualification");
    } catch (error) {
      message.error("提交失败，请检查表单信息");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Alert
              message="填写企业基本信息"
              description="请准确填写企业名称、统一社会信用代码等基本信息，确保与营业执照一致。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="企业名称"
                  name="companyName"
                  rules={[
                    { required: true, message: "请输入企业名称" },
                    { min: 2, message: "企业名称至少2个字符" },
                  ]}
                  tooltip="请输入营业执照上的企业全称"
                >
                  <Input
                    placeholder="请输入企业全称"
                    prefix={<BankOutlined />}
                    size="large"
                    onChange={calculateProgress}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="统一社会信用代码"
                  name="companyCode"
                  rules={[
                    { required: true, message: "请输入统一社会信用代码" },
                    { pattern: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/, message: "请输入正确的统一社会信用代码" },
                  ]}
                  tooltip="18位统一社会信用代码"
                >
                  <Input
                    placeholder="请输入18位统一社会信用代码"
                    maxLength={18}
                    size="large"
                    onChange={calculateProgress}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="资质类型"
                  name="qualificationType"
                  rules={[{ required: true, message: "请选择资质类型" }]}
                >
                  <Select
                    placeholder="请选择资质类型"
                    size="large"
                    showSearch
                    optionFilterProp="children"
                    onChange={calculateProgress}
                  >
                    {qualificationTypes.map(type => (
                      <Option key={type.value} value={type.value}>
                        <div>
                          <div>{type.label}</div>
                          <Text type="secondary" style={{ fontSize: 12 }}>{type.category}</Text>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="资质等级"
                  name="qualificationLevel"
                  rules={[{ required: true, message: "请选择资质等级" }]}
                >
                  <Select
                    placeholder="请选择资质等级"
                    size="large"
                    onChange={calculateProgress}
                  >
                    {qualificationLevels.map(level => (
                      <Option key={level.value} value={level.value}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Tag color={level.color}>{level.label}</Tag>
                          <Text type="secondary" style={{ fontSize: 12 }}>{level.description}</Text>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      case 1:
        return (
          <div>
            <Alert
              message="填写资质证书详情"
              description="请根据资质证书准确填写证书编号、发证机关、有效期等信息。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="证书编号"
                  name="certificateNumber"
                  rules={[
                    { required: true, message: "请输入证书编号" },
                    { min: 6, message: "证书编号至少6位" },
                  ]}
                >
                  <Input
                    placeholder="请输入资质证书编号"
                    prefix={<SafetyCertificateOutlined />}
                    size="large"
                    onChange={calculateProgress}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="发证机关"
                  name="issuingAuthority"
                  rules={[{ required: true, message: "请输入发证机关" }]}
                >
                  <Input
                    placeholder="请输入发证机关名称"
                    size="large"
                    onChange={calculateProgress}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="发证日期"
                  name="issueDate"
                  rules={[{ required: true, message: "请选择发证日期" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="请选择发证日期"
                    size="large"
                    disabledDate={(current) => current && current > dayjs().endOf("day")}
                    onChange={calculateProgress}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="有效期至"
                  name="expiryDate"
                  rules={[
                    { required: true, message: "请选择有效期" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const issueDate = getFieldValue("issueDate");
                        if (!value || !issueDate || value.isAfter(issueDate)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("有效期不能早于发证日期"));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="请选择有效期"
                    size="large"
                    disabledDate={(current) => {
                      const issueDate = form.getFieldValue("issueDate");
                      return current && issueDate && current.isBefore(issueDate);
                    }}
                    onChange={calculateProgress}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="经营范围"
                  name="businessScope"
                  rules={[
                    { required: true, message: "请选择经营范围" },
                    { type: "array", min: 1, message: "至少选择一个经营范围" },
                  ]}
                  tooltip="可多选，请根据资质证书选择对应的经营范围"
                >
                  <Select
                    mode="multiple"
                    placeholder="请选择经营范围"
                    style={{ width: "100%" }}
                    size="large"
                    maxTagCount={3}
                    onChange={calculateProgress}
                  >
                    {businessScopeOptions.map(scope => (
                      <Option key={scope} value={scope}>{scope}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="备注说明"
                  name="remarks"
                >
                  <TextArea
                    placeholder="请输入备注说明（选填）"
                    rows={3}
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      case 2:
        return (
          <div>
            <Alert
              message="上传资质相关文件"
              description="请上传资质证书、营业执照等相关文件。支持 PDF、JPG、PNG、DOC、DOCX 格式，单个文件不超过 10MB。"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Upload.Dragger {...uploadProps} style={{ marginBottom: 24 }}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 48, color: "#1890ff" }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传，严格保护您的文件安全
              </p>
            </Upload.Dragger>

            {fileList.length > 0 && (
              <Card title="已上传文件" size="small">
                <List
                  dataSource={fileList}
                  renderItem={(file, index) => (
                    <List.Item
                      actions={[
                        <Button
                          key="view"
                          type="link"
                          icon={<EyeOutlined />}
                          size="small"
                        >
                          预览
                        </Button>,
                        <Button
                          key="delete"
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          onClick={() => {
                            const newFileList = fileList.filter((_, i) => i !== index);
                            setFileList(newFileList);
                          }}
                        >
                          删除
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<FileTextOutlined />}
                            style={{ backgroundColor: "#1890ff" }}
                          />
                        }
                        title={file.name}
                        description={
                          <Space>
                            <Text type="secondary">
                              {file.size ? (file.size / 1024 / 1024).toFixed(2) + " MB" : ""}
                            </Text>
                            <Badge
                              status={file.status === "done" ? "success" : "processing"}
                              text={file.status === "done" ? "上传完成" : "上传中"}
                            />
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}

            <Alert
              message="文件要求"
              description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>资质证书扫描件或照片（必需）</li>
                  <li>营业执照副本（必需）</li>
                  <li>其他相关证明文件（可选）</li>
                </ul>
              }
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* 页面头部 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={4} style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <SafetyCertificateOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              新增企业资质
            </Title>
            <Text type="secondary">填写企业资质信息，完善资质档案</Text>
          </div>
          <Space>
            <div style={{ textAlign: "center" }}>
              <Progress
                type="circle"
                percent={formProgress}
                size={60}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
              />
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>完成度</Text>
              </div>
            </div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
              size="large"
            >
              返回
            </Button>
          </Space>
        </div>

        <Divider />

        <Steps
          current={currentStep}
          items={steps.map((step, index) => ({
            ...step,
            status: index < currentStep ? "finish" : index === currentStep ? "process" : "wait",
          }))}
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* 表单内容 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            businessScope: [],
          }}
          onValuesChange={calculateProgress}
        >
          {renderStepContent()}
        </Form>

        <Divider style={{ margin: "40px 0" }} />

        {/* 操作按钮 */}
        <div style={{ textAlign: "center" }}>
          <Space size="large">
            {currentStep > 0 && (
              <Button
                size="large"
                onClick={handlePrev}
              >
                上一步
              </Button>
            )}

            <Button
              icon={<SaveOutlined />}
              onClick={handleSaveDraft}
              loading={loading && isDraft}
              size="large"
            >
              保存草稿
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="primary"
                onClick={handleNext}
                size="large"
              >
                下一步
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmit}
                loading={loading && !isDraft}
                size="large"
              >
                提交审核
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default AddQualificationPage;
