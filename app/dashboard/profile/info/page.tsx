"use client";
import {
  CalendarOutlined,
  CameraOutlined,
  EditOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  message
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface UserProfile {
  id: string;
  avatar: string;
  realName: string;
  username: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  position: string;
  joinDate: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  bio: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const PersonalInfoPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://api.dicebear.com/7.x/miniavs/svg?seed=user"
  );

  // 模拟用户数据
  const [userProfile] = useState<UserProfile>({
    id: "user_001",
    avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=user",
    realName: "张明",
    username: "zhangming",
    email: "zhangming@company.com",
    phone: "13800138001",
    employeeId: "EMP2023001",
    department: "医疗AI部",
    position: "高级标注专家",
    joinDate: "2023-03-15",
    birthday: "1990-05-20",
    gender: "male",
    address: "北京市朝阳区科技园区创新大厦",
    bio: "专注于医疗影像数据标注，具有5年以上标注经验，擅长多种标注工具的使用和质量控制。",
    emergencyContact: {
      name: "李红",
      phone: "13900139001",
      relationship: "配偶"
    }
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...userProfile,
      joinDate: dayjs(userProfile.joinDate),
      birthday: dayjs(userProfile.birthday),
      emergencyContactName: userProfile.emergencyContact.name,
      emergencyContactPhone: userProfile.emergencyContact.phone,
      emergencyContactRelationship: userProfile.emergencyContact.relationship
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存用户信息:', values);
      message.success('个人信息已更新');
      setIsEditing(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
        return false;
      }

      // 模拟上传
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
        message.success('头像上传成功');
      };
      reader.readAsDataURL(file);
      return false;
    },
  };

  const genderOptions = [
    { value: 'male', label: '男' },
    { value: 'female', label: '女' },
    { value: 'other', label: '其他' }
  ];

  const relationshipOptions = [
    { value: '配偶', label: '配偶' },
    { value: '父母', label: '父母' },
    { value: '子女', label: '子女' },
    { value: '兄弟姐妹', label: '兄弟姐妹' },
    { value: '朋友', label: '朋友' },
    { value: '其他', label: '其他' }
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <UserOutlined />
              个人信息
            </Title>
            <Text type="secondary">管理您的个人资料和基本信息</Text>
          </div>
          <Space>
            {isEditing ? (
              <>
                <Button onClick={handleCancel}>取消</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  保存
                </Button>
              </>
            ) : (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                编辑信息
              </Button>
            )}
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧：头像和基本信息 */}
        <Col xs={24} lg={8}>
          <Card title="个人头像" className="profile-avatar-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                <Avatar
                  size={120}
                  src={avatarUrl}
                  style={{ border: '4px solid #f0f0f0' }}
                />
                {isEditing && (
                  <Upload {...uploadProps}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CameraOutlined />}
                      size="small"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        border: '2px solid #fff'
                      }}
                    />
                  </Upload>
                )}
              </div>
              <div>
                <Title level={4} style={{ margin: '0 0 4px 0' }}>{userProfile.realName}</Title>
                <Text type="secondary">@{userProfile.username}</Text>
                <br />
                <Text type="secondary">{userProfile.position}</Text>
              </div>
            </div>
          </Card>

          <Card title="快速信息" style={{ marginTop: 16 }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="员工编号">{userProfile.employeeId}</Descriptions.Item>
              <Descriptions.Item label="所属部门">{userProfile.department}</Descriptions.Item>
              <Descriptions.Item label="入职时间">{userProfile.joinDate}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 右侧：详细信息表单 */}
        <Col xs={24} lg={16}>
          {isEditing ? (
            <Form form={form} layout="vertical">
              <Card title="基本信息" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="realName"
                      label="真实姓名"
                      rules={[{ required: true, message: '请输入真实姓名' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="请输入真实姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="username"
                      label="用户名"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input prefix={<IdcardOutlined />} placeholder="请输入用户名" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="邮箱地址"
                      rules={[
                        { required: true, message: '请输入邮箱地址' },
                        { type: 'email', message: '请输入有效的邮箱地址' }
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="手机号码"
                      rules={[{ required: true, message: '请输入手机号码' }]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="请输入手机号码" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="gender"
                      label="性别"
                      rules={[{ required: true, message: '请选择性别' }]}
                    >
                      <Select placeholder="请选择性别">
                        {genderOptions.map(option => (
                          <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="birthday"
                      label="出生日期"
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="请选择出生日期"
                        suffixIcon={<CalendarOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="joinDate"
                      label="入职时间"
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="请选择入职时间"
                        suffixIcon={<CalendarOutlined />}
                        disabled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card title="工作信息" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="department"
                      label="所属部门"
                      rules={[{ required: true, message: '请输入所属部门' }]}
                    >
                      <Input prefix={<TeamOutlined />} placeholder="请输入所属部门" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="position"
                      label="职位"
                      rules={[{ required: true, message: '请输入职位' }]}
                    >
                      <Input placeholder="请输入职位" disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="address" label="工作地址">
                  <Input prefix={<EnvironmentOutlined />} placeholder="请输入工作地址" />
                </Form.Item>
                <Form.Item name="bio" label="个人简介">
                  <TextArea
                    rows={3}
                    placeholder="请输入个人简介"
                    maxLength={200}
                    showCount
                  />
                </Form.Item>
              </Card>

              <Card title="紧急联系人">
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      name="emergencyContactName"
                      label="联系人姓名"
                      rules={[{ required: true, message: '请输入联系人姓名' }]}
                    >
                      <Input placeholder="请输入联系人姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="emergencyContactPhone"
                      label="联系人电话"
                      rules={[{ required: true, message: '请输入联系人电话' }]}
                    >
                      <Input placeholder="请输入联系人电话" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="emergencyContactRelationship"
                      label="关系"
                      rules={[{ required: true, message: '请选择关系' }]}
                    >
                      <Select placeholder="请选择关系">
                        {relationshipOptions.map(option => (
                          <Option key={option.value} value={option.value}>{option.label}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Form>
          ) : (
            <>
              <Card title="基本信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="真实姓名">{userProfile.realName}</Descriptions.Item>
                  <Descriptions.Item label="用户名">{userProfile.username}</Descriptions.Item>
                  <Descriptions.Item label="邮箱地址">{userProfile.email}</Descriptions.Item>
                  <Descriptions.Item label="手机号码">{userProfile.phone}</Descriptions.Item>
                  <Descriptions.Item label="性别">
                    {userProfile.gender === 'male' ? '男' : userProfile.gender === 'female' ? '女' : '其他'}
                  </Descriptions.Item>
                  <Descriptions.Item label="出生日期">{userProfile.birthday}</Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="工作信息" style={{ marginBottom: 16 }}>
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="员工编号">{userProfile.employeeId}</Descriptions.Item>
                  <Descriptions.Item label="所属部门">{userProfile.department}</Descriptions.Item>
                  <Descriptions.Item label="职位">{userProfile.position}</Descriptions.Item>
                  <Descriptions.Item label="入职时间">{userProfile.joinDate}</Descriptions.Item>
                  <Descriptions.Item label="工作地址" span={2}>{userProfile.address}</Descriptions.Item>
                  <Descriptions.Item label="个人简介" span={2}>{userProfile.bio}</Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="紧急联系人">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="联系人姓名">{userProfile.emergencyContact.name}</Descriptions.Item>
                  <Descriptions.Item label="联系人电话">{userProfile.emergencyContact.phone}</Descriptions.Item>
                  <Descriptions.Item label="关系" span={2}>{userProfile.emergencyContact.relationship}</Descriptions.Item>
                </Descriptions>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PersonalInfoPage;
