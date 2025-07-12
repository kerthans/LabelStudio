"use client";
import type { UserFormData } from "@/types/dashboard/user";
import {
  ArrowLeftOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SecurityScanOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const { Option } = Select;
const { Step } = Steps;
const { Title, Text } = Typography;

const AddUserPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<UserFormData>();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState(true);

  // 角色配置
  const roleOptions = [
    {
      value: "admin",
      label: "系统管理员",
      description: "拥有完整系统权限，可管理用户和系统设置",
      color: "#ff4d4f",
      permissions: ["user_management", "system_settings", "audit_logs", "security_management"],
    },
    {
      value: "manager",
      label: "部门经理",
      description: "拥有业务管理权限，可管理项目和团队",
      color: "#1890ff",
      permissions: ["project_management", "document_management", "report_generation"],
    },
    {
      value: "user",
      label: "普通用户",
      description: "拥有基础功能权限，可使用日常操作功能",
      color: "#52c41a",
      permissions: ["document_management", "data_analysis"],
    },
    {
      value: "viewer",
      label: "访客用户",
      description: "只读权限，仅可查看相关信息和报告",
      color: "#faad14",
      permissions: ["data_analysis"],
    },
  ];

  // 权限配置
  const permissionOptions = [
    {
      label: "用户管理",
      value: "user_management",
      description: "创建、编辑和管理系统用户",
      icon: <UserOutlined />,
      category: "系统管理",
    },
    {
      label: "项目管理",
      value: "project_management",
      description: "管理招标项目和工作流程",
      icon: <CheckCircleOutlined />,
      category: "业务管理",
    },
    {
      label: "文档管理",
      value: "document_management",
      description: "上传、组织和管理文档",
      icon: <UploadOutlined />,
      category: "内容管理",
    },
    {
      label: "数据分析",
      value: "data_analysis",
      description: "查看和分析业务数据报告",
      icon: <InfoCircleOutlined />,
      category: "数据分析",
    },
    {
      label: "系统设置",
      value: "system_settings",
      description: "配置系统参数和偏好设置",
      icon: <SecurityScanOutlined />,
      category: "系统管理",
    },
    {
      label: "审计日志",
      value: "audit_logs",
      description: "访问系统活动和安全日志",
      icon: <SafetyCertificateOutlined />,
      category: "安全管理",
    },
    {
      label: "报告生成",
      value: "report_generation",
      description: "生成和导出各类业务报告",
      icon: <CheckCircleOutlined />,
      category: "数据分析",
    },
    {
      label: "安全管理",
      value: "security_management",
      description: "管理安全策略和访问控制",
      icon: <LockOutlined />,
      category: "安全管理",
    },
  ];

  // 密码强度检查
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  // 表单进度计算
  const calculateFormProgress = () => {
    const values = form.getFieldsValue();
    const requiredFields = ["username", "realName", "email", "password", "confirmPassword", "role"];
    const filledFields = requiredFields.filter(field => values[field as keyof UserFormData]);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  // 头像上传前处理
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG 格式的图片!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB!");
      return false;
    }

    // 模拟上传过程
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
      setUploading(false);
      message.success("头像上传成功!");
    };
    reader.readAsDataURL(file);

    return false; // 阻止自动上传
  };

  // 删除头像
  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    message.success("头像已删除");
  };

  // 头像上传配置
  const uploadProps: UploadProps = {
    name: "avatar",
    showUploadList: false,
    beforeUpload,
    accept: "image/jpeg,image/png",
  };

  // 处理表单提交
  const handleSubmit = async (values: UserFormData) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("提交的用户数据:", values);
      message.success({
        content: "用户创建成功！欢迎邮件已发送。",
        duration: 4,
      });
      router.push("/dashboard/users");
    } catch (_error) {
      message.error("创建用户失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理角色选择
  const handleRoleChange = (role: string) => {
    const selectedRole = roleOptions.find(r => r.value === role);
    if (selectedRole) {
      form.setFieldsValue({ permissions: selectedRole.permissions });
    }
  };

  // 获取密码强度文本
  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return "弱";
    if (strength < 50) return "一般";
    if (strength < 75) return "良好";
    return "强";
  };

  // 获取密码强度颜色
  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 25) return "#ff4d4f";
    if (strength < 50) return "#faad14";
    if (strength < 75) return "#1890ff";
    return "#52c41a";
  };

  // 步骤内容
  const steps = [
    {
      title: "基本信息",
      icon: <UserOutlined />,
      content: (
        <div style={{ padding: "24px 0" }}>
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <Form.Item label="用户头像" style={{ marginBottom: 16 }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    {avatarUrl ? (
                      <div style={{ position: "relative" }}>
                        <Avatar
                          size={120}
                          src={avatarUrl}
                          style={{
                            border: "4px solid #f0f0f0",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          display: "flex",
                          gap: 4,
                        }}>
                          <Upload {...uploadProps}>
                            <Button
                              type="primary"
                              shape="circle"
                              size="small"
                              icon={<CameraOutlined />}
                              style={{
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              }}
                            />
                          </Upload>
                          <Button
                            danger
                            shape="circle"
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={handleRemoveAvatar}
                            style={{
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Upload {...uploadProps}>
                        <div style={{
                          width: 120,
                          height: 120,
                          border: "2px dashed #d9d9d9",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          backgroundColor: "#fafafa",
                          position: "relative",
                          overflow: "hidden",
                        }}>
                          {uploading ? (
                            <>
                              <Progress
                                type="circle"
                                size={80}
                                percent={100}
                                status="active"
                                strokeColor="#1890ff"
                                format={() => "上传中"}
                              />
                            </>
                          ) : (
                            <>
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                backgroundColor: "#1890ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 8,
                              }}>
                                <CameraOutlined style={{ fontSize: 20, color: "white" }} />
                              </div>
                              <Text style={{ fontSize: 12, color: "#666" }}>点击上传头像</Text>
                            </>
                          )}
                        </div>
                      </Upload>
                    )}
                  </div>
                </Form.Item>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  建议尺寸：400x400px，支持 JPG、PNG 格式，文件大小不超过 2MB
                </Text>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: "请输入用户名" },
                  { min: 3, max: 20, message: "用户名长度为3-20个字符" },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名只能包含字母、数字和下划线" },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#1890ff" }} />}
                  placeholder="请输入用户名"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="realName"
                label="真实姓名"
                rules={[{ required: true, message: "请输入真实姓名" }]}
              >
                <Input
                  placeholder="请输入真实姓名"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: "请输入邮箱地址" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#1890ff" }} />}
                  placeholder="请输入邮箱地址"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="手机号码"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: "请输入有效的手机号码" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: "#1890ff" }} />}
                  placeholder="请输入手机号码"
                  size="large"
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="department"
                label="所属部门"
              >
                <Select
                  placeholder="请选择所属部门"
                  size="large"
                  style={{ borderRadius: 8 }}
                  allowClear
                >
                  <Option value="engineering">技术部</Option>
                  <Option value="sales">销售部</Option>
                  <Option value="marketing">市场部</Option>
                  <Option value="hr">人力资源部</Option>
                  <Option value="finance">财务部</Option>
                  <Option value="operations">运营部</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "账户安全",
      icon: <LockOutlined />,
      content: (
        <div style={{ padding: "24px 0" }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="登录密码"
                rules={[
                  { required: true, message: "请输入登录密码" },
                  { min: 8, message: "密码长度至少8个字符" },
                  { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: "密码必须包含大小写字母和数字" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#1890ff" }} />}
                  placeholder="请输入登录密码"
                  size="large"
                  style={{ borderRadius: 8 }}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  onChange={(e) => setPasswordStrength(checkPasswordStrength(e.target.value))}
                />
              </Form.Item>
              {passwordStrength > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>密码强度：</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: getPasswordStrengthColor(passwordStrength),
                        fontWeight: "bold",
                      }}
                    >
                      {getPasswordStrengthText(passwordStrength)}
                    </Text>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    size="small"
                    strokeColor={getPasswordStrengthColor(passwordStrength)}
                    showInfo={false}
                    trailColor="#f0f0f0"
                  />
                </div>
              )}
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "请确认密码" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("两次输入的密码不一致"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#1890ff" }} />}
                  placeholder="请再次输入密码"
                  size="large"
                  style={{ borderRadius: 8 }}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="账户状态"
                initialValue="active"
                rules={[{ required: true, message: "请选择账户状态" }]}
              >
                <Select placeholder="请选择账户状态" size="large" style={{ borderRadius: 8 }}>
                  <Option value="active">
                    <Badge status="success" text="正常" />
                  </Option>
                  <Option value="inactive">
                    <Badge status="default" text="禁用" />
                  </Option>
                  <Option value="pending">
                    <Badge status="processing" text="待审核" />
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="enableTwoFactor"
                label="双因子认证"
                valuePropName="checked"
                initialValue={false}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Switch
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                    style={{ borderRadius: 12 }}
                  />
                  <Tooltip title="建议启用以增强账户安全性">
                    <InfoCircleOutlined style={{ color: "#1890ff" }} />
                  </Tooltip>
                </div>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Alert
                message="安全建议"
                description="请使用包含大小写字母、数字的强密码，长度至少8个字符。建议启用双因子认证以增强账户安全性。"
                type="info"
                showIcon
                closable
                style={{ borderRadius: 8 }}
              />
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "角色权限",
      icon: <SecurityScanOutlined />,
      content: (
        <div style={{ padding: "24px 0" }}>
          <Row gutter={[24, 32]}>
            <Col xs={24}>
              <Form.Item
                name="role"
                label="用户角色"
                rules={[{ required: true, message: "请选择用户角色" }]}
              >
                <Select
                  placeholder="请选择用户角色"
                  size="large"
                  style={{ borderRadius: 8 }}
                  onChange={handleRoleChange}
                >
                  {roleOptions.map(role => (
                    <Option key={role.value} value={role.value}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Tag color={role.color} style={{ margin: 0 }}>{role.label}</Tag>
                        <div>
                          <div style={{ fontSize: "12px", color: "#999" }}>{role.description}</div>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="permissions"
                label="权限配置"
                tooltip="选择用户可以访问的功能模块"
              >
                <div style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                  padding: "20px",
                  backgroundColor: "#fafafa",
                }}>
                  {["系统管理", "业务管理", "内容管理", "数据分析", "安全管理"].map(category => {
                    const categoryPermissions = permissionOptions.filter(p => p.category === category);
                    return (
                      <div key={category} style={{ marginBottom: 24 }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 12,
                        }}>
                          <div style={{
                            width: 4,
                            height: 16,
                            backgroundColor: "#1890ff",
                            borderRadius: 2,
                          }} />
                          <Text strong style={{ color: "#1890ff", fontSize: 14 }}>{category}</Text>
                        </div>
                        <Checkbox.Group style={{ width: "100%" }}>
                          <Row gutter={[12, 12]}>
                            {categoryPermissions.map(permission => (
                              <Col xs={24} sm={12} key={permission.value}>
                                <Checkbox
                                  value={permission.value}
                                  style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #e8e8e8",
                                    borderRadius: 6,
                                    backgroundColor: "white",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 12,
                                    margin: 0,
                                  }}
                                >
                                  <div style={{
                                    color: "#1890ff",
                                    fontSize: 16,
                                    marginTop: 2,
                                    flexShrink: 0,
                                  }}>
                                    {permission.icon}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                      fontSize: 13,
                                      color: "#262626",
                                      fontWeight: 500,
                                      marginBottom: 4,
                                      lineHeight: 1.4,
                                    }}>
                                      {permission.label}
                                    </div>
                                    <div style={{
                                      fontSize: 11,
                                      color: "#8c8c8c",
                                      lineHeight: 1.4,
                                    }}>
                                      {permission.description}
                                    </div>
                                  </div>
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      </div>
                    );
                  })}
                </div>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div style={{
      padding: "24px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    }}>
      {/* 页面标题 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space size="large">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              size="large"
              style={{ borderRadius: 8 }}
            >
              返回
            </Button>
            <div>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                新增用户
              </Title>
              <Text type="secondary">为系统添加新用户并分配相应的角色和权限</Text>
            </div>
          </Space>
        </Col>
        <Col>
          <div style={{ textAlign: "right" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>表单完成度</Text>
            <Progress
              percent={formProgress}
              size="small"
              strokeColor="#1890ff"
              style={{ width: 120, marginTop: 4 }}
            />
          </div>
        </Col>
      </Row>

      {/* 步骤指示器 */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Steps
          current={currentStep}
          style={{ marginBottom: 0 }}
          size="default"
        >
          {steps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              icon={step.icon}
              status={currentStep === index ? "process" : currentStep > index ? "finish" : "wait"}
            />
          ))}
        </Steps>
      </Card>

      {/* 表单内容 */}
      <Card style={{
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={() => setFormProgress(calculateFormProgress())}
          initialValues={{
            status: "active",
            enableTwoFactor: false,
            permissions: [],
          }}
        >
          {/* 安全提示 */}
          {showSecurityAlert && (
            <Alert
              message="安全提示"
              description="创建用户时请确保信息准确，用户创建后将收到邮件通知。建议为重要角色启用双因子认证以增强安全性。"
              type="info"
              showIcon
              closable
              onClose={() => setShowSecurityAlert(false)}
              style={{
                marginBottom: 32,
                borderRadius: 8,
                border: "1px solid #1890ff20",
                backgroundColor: "#f6ffed",
              }}
            />
          )}

          {/* 当前步骤内容 */}
          <div style={{ minHeight: 500 }}>
            {steps[currentStep].content}
          </div>

          <Divider style={{ margin: "32px 0" }} />

          {/* 操作按钮 */}
          <Row justify="space-between" align="middle">
            <Col>
              {currentStep > 0 && (
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  size="large"
                  style={{ borderRadius: 8 }}
                >
                  上一步
                </Button>
              )}
            </Col>
            <Col>
              <Space size="middle">
                <Button
                  onClick={handleBack}
                  size="large"
                  style={{ borderRadius: 8 }}
                >
                  取消
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    size="large"
                    style={{
                      borderRadius: 8,
                      backgroundColor: "#1890ff",
                      borderColor: "#1890ff",
                    }}
                  >
                    下一步
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                    style={{
                      borderRadius: 8,
                      backgroundColor: "#52c41a",
                      borderColor: "#52c41a",
                    }}
                  >
                    {loading ? "创建中..." : "创建用户"}
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddUserPage;
