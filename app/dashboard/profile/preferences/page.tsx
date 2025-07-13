"use client";
import {
  BellOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  NotificationOutlined,
  SaveOutlined,
  SettingOutlined,
  TagsOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  TimePicker,
  Typography
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;

interface WorkPreferences {
  // 工作时间偏好
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  // 任务偏好
  taskPreferences: {
    preferredTaskTypes: string[];
    maxDailyTasks: number;
    difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
    autoAssign: boolean;
  };
  // 通知设置
  notifications: {
    email: boolean;
    browser: boolean;
    taskAssignment: boolean;
    taskDeadline: boolean;
    qualityFeedback: boolean;
    systemUpdates: boolean;
  };
  // 界面设置
  interface: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    fontSize: number;
    compactMode: boolean;
  };
  // 标注偏好
  annotationPreferences: {
    autoSave: boolean;
    autoSaveInterval: number;
    showShortcuts: boolean;
    confirmBeforeSubmit: boolean;
    highlightUncertain: boolean;
  };
}

const WorkPreferencesPage: React.FC = () => {
  const [form] = Form.useForm();
  const [hasChanges, setHasChanges] = useState(false);

  // 模拟用户偏好数据
  const [preferences] = useState<WorkPreferences>({
    workingHours: {
      start: "09:00",
      end: "18:00",
      timezone: "Asia/Shanghai"
    },
    taskPreferences: {
      preferredTaskTypes: ["图像分类", "目标检测"],
      maxDailyTasks: 50,
      difficultyLevel: "medium",
      autoAssign: true
    },
    notifications: {
      email: true,
      browser: true,
      taskAssignment: true,
      taskDeadline: true,
      qualityFeedback: true,
      systemUpdates: false
    },
    interface: {
      theme: "light",
      language: "zh-CN",
      fontSize: 14,
      compactMode: false
    },
    annotationPreferences: {
      autoSave: true,
      autoSaveInterval: 30,
      showShortcuts: true,
      confirmBeforeSubmit: true,
      highlightUncertain: true
    }
  });

  React.useEffect(() => {
    form.setFieldsValue({
      ...preferences,
      workingHoursStart: dayjs(preferences.workingHours.start, 'HH:mm'),
      workingHoursEnd: dayjs(preferences.workingHours.end, 'HH:mm')
    });
  }, [form, preferences]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log('保存工作偏好:', values);
      message.success('工作偏好已保存');
      setHasChanges(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setHasChanges(false);
    message.info('已重置为默认设置');
  };

  const taskTypeOptions = [
    { value: "图像分类", label: "图像分类" },
    { value: "目标检测", label: "目标检测" },
    { value: "语义分割", label: "语义分割" },
    { value: "文本分类", label: "文本分类" },
    { value: "命名实体识别", label: "命名实体识别" },
    { value: "语音标注", label: "语音标注" },
    { value: "视频标注", label: "视频标注" }
  ];

  const timezoneOptions = [
    { value: "Asia/Shanghai", label: "北京时间 (UTC+8)" },
    { value: "Asia/Tokyo", label: "东京时间 (UTC+9)" },
    { value: "Europe/London", label: "伦敦时间 (UTC+0)" },
    { value: "America/New_York", label: "纽约时间 (UTC-5)" },
    { value: "America/Los_Angeles", label: "洛杉矶时间 (UTC-8)" }
  ];

  const languageOptions = [
    { value: "zh-CN", label: "简体中文" },
    { value: "zh-TW", label: "繁体中文" },
    { value: "en-US", label: "English" },
    { value: "ja-JP", label: "日本語" },
    { value: "ko-KR", label: "한국어" }
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <SettingOutlined />
              工作偏好
            </Title>
            <Text type="secondary">个性化您的工作环境和标注偏好设置</Text>
          </div>
          <Space>
            <Button onClick={handleReset} disabled={!hasChanges}>
              重置
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              保存设置
            </Button>
          </Space>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={() => setHasChanges(true)}
      >
        <Row gutter={[24, 24]}>
          {/* 工作时间设置 */}
          <Col xs={24} lg={12}>
            <Card title={<><ClockCircleOutlined /> 工作时间偏好</>} className="preference-card">
              <Form.Item
                name="workingHoursStart"
                label="工作开始时间"
                rules={[{ required: true, message: '请选择工作开始时间' }]}
              >
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  placeholder="选择开始时间"
                />
              </Form.Item>
              <Form.Item
                name="workingHoursEnd"
                label="工作结束时间"
                rules={[{ required: true, message: '请选择工作结束时间' }]}
              >
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  placeholder="选择结束时间"
                />
              </Form.Item>
              <Form.Item
                name={['workingHours', 'timezone']}
                label="时区设置"
              >
                <Select placeholder="选择时区">
                  {timezoneOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* 任务偏好 */}
          <Col xs={24} lg={12}>
            <Card title={<><TagsOutlined /> 任务偏好</>} className="preference-card">
              <Form.Item
                name={['taskPreferences', 'preferredTaskTypes']}
                label="偏好任务类型"
              >
                <Select
                  mode="multiple"
                  placeholder="选择偏好的任务类型"
                  maxTagCount={3}
                >
                  {taskTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['taskPreferences', 'maxDailyTasks']}
                label="每日最大任务数"
              >
                <InputNumber
                  min={1}
                  max={200}
                  style={{ width: '100%' }}
                  placeholder="设置每日最大任务数"
                />
              </Form.Item>
              <Form.Item
                name={['taskPreferences', 'difficultyLevel']}
                label="偏好难度等级"
              >
                <Radio.Group>
                  <Radio value="easy">简单</Radio>
                  <Radio value="medium">中等</Radio>
                  <Radio value="hard">困难</Radio>
                  <Radio value="expert">专家</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name={['taskPreferences', 'autoAssign']}
                label="自动分配任务"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </Card>
          </Col>

          {/* 通知设置 */}
          <Col xs={24} lg={12}>
            <Card title={<><BellOutlined /> 通知设置</>} className="preference-card">
              <Form.Item
                name={['notifications', 'email']}
                label="邮件通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Form.Item
                name={['notifications', 'browser']}
                label="浏览器通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Divider style={{ margin: '12px 0' }} />
              <Form.Item
                name={['notifications', 'taskAssignment']}
                label="任务分配通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Form.Item
                name={['notifications', 'taskDeadline']}
                label="任务截止提醒"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Form.Item
                name={['notifications', 'qualityFeedback']}
                label="质量反馈通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Form.Item
                name={['notifications', 'systemUpdates']}
                label="系统更新通知"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </Card>
          </Col>

          {/* 界面设置 */}
          <Col xs={24} lg={12}>
            <Card title={<><EyeOutlined /> 界面设置</>} className="preference-card">
              <Form.Item
                name={['interface', 'theme']}
                label="主题模式"
              >
                <Radio.Group>
                  <Radio value="light">浅色</Radio>
                  <Radio value="dark">深色</Radio>
                  <Radio value="auto">跟随系统</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name={['interface', 'language']}
                label="界面语言"
              >
                <Select placeholder="选择界面语言">
                  {languageOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name={['interface', 'fontSize']}
                label="字体大小"
              >
                <Slider
                  min={12}
                  max={18}
                  marks={{
                    12: '小',
                    14: '中',
                    16: '大',
                    18: '特大'
                  }}
                  step={1}
                />
              </Form.Item>
              <Form.Item
                name={['interface', 'compactMode']}
                label="紧凑模式"
                valuePropName="checked"
              >
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
            </Card>
          </Col>

          {/* 标注偏好 */}
          <Col xs={24}>
            <Card title={<><NotificationOutlined /> 标注偏好</>} className="preference-card">
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name={['annotationPreferences', 'autoSave']}
                    label="自动保存"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name={['annotationPreferences', 'autoSaveInterval']}
                    label="自动保存间隔（秒）"
                  >
                    <InputNumber
                      min={10}
                      max={300}
                      style={{ width: '100%' }}
                      placeholder="设置自动保存间隔"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name={['annotationPreferences', 'showShortcuts']}
                    label="显示快捷键提示"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name={['annotationPreferences', 'confirmBeforeSubmit']}
                    label="提交前确认"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item
                    name={['annotationPreferences', 'highlightUncertain']}
                    label="高亮不确定标注"
                    valuePropName="checked"
                  >
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default WorkPreferencesPage;
