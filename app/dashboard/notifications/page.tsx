"use client";
import type {
  Notification,
  NotificationPriority,
  NotificationQueryParams,
  NotificationSettings,
  NotificationStats,
  NotificationStatus,
  NotificationType,
  PushConfig,
} from "@/types/dashboard/notification";
import {
  BellOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FilterOutlined,
  FireOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  MobileOutlined,
  MoreOutlined,
  ReloadOutlined,
  RocketOutlined,
  SafetyOutlined,
  SearchOutlined,
  SettingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Pagination,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// 企业级通知概览组件 - 替代重复的统计卡片
interface NotificationOverviewProps {
  stats: NotificationStats;
  unreadCount: number;
  urgentCount: number;
  onViewModeChange: (mode: "all" | "unread" | "urgent") => void;
  onMarkAllRead: () => void;
}

const NotificationOverview: React.FC<NotificationOverviewProps> = ({
  stats,
  unreadCount,
  urgentCount,
  onViewModeChange,
  onMarkAllRead,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title level={3} className="mb-1 text-gray-800">通知中心</Title>
          <Text type="secondary">高效管理您的系统通知</Text>
        </div>
        <div className="flex items-center space-x-4">
          {unreadCount > 0 && (
            <Badge count={unreadCount} className="mr-2">
              <Button
                type="primary"
                icon={<BellOutlined />}
                onClick={() => onViewModeChange("unread")}
              >
                未读通知
              </Button>
            </Badge>
          )}
          {urgentCount > 0 && (
            <Badge count={urgentCount} className="mr-2">
              <Button
                danger
                icon={<FireOutlined />}
                onClick={() => onViewModeChange("urgent")}
              >
                紧急通知
              </Button>
            </Badge>
          )}
        </div>
      </div>

      <Row gutter={16}>
        <Col span={8}>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.totalCount}</div>
            <div className="text-sm text-gray-500">总通知</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <div className="text-sm text-gray-500">待处理</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.todayCount}</div>
            <div className="text-sm text-gray-500">今日新增</div>
          </div>
        </Col>
      </Row>

      {unreadCount > 0 && (
        <div className="mt-4 text-center">
          <Button type="link" onClick={onMarkAllRead}>
            全部标记为已读
          </Button>
        </div>
      )}
    </div>
  );
};

// 优先级指示器组件
const PriorityIndicator: React.FC<{ priority: NotificationPriority }> = ({ priority }) => {
  const config = {
    urgent: { color: "#ff4d4f", text: "紧急", icon: <FireOutlined /> },
    high: { color: "#fa8c16", text: "重要", icon: <ExclamationCircleOutlined /> },
    normal: { color: "#1890ff", text: "普通", icon: <InfoCircleOutlined /> },
    low: { color: "#52c41a", text: "低", icon: <CheckCircleOutlined /> },
  };

  const { color, text, icon } = config[priority];

  return (
    <div className="flex items-center" style={{ color }}>
      {icon}
      <span className="ml-1 text-xs">{text}</span>
    </div>
  );
};

// 通知类型配置组件
const NotificationTypeConfig: React.FC<{
  type: NotificationType;
  config: any;
  onChange: (type: NotificationType, field: string, value: boolean) => void;
}> = ({ type, config, onChange }) => {
  const typeInfo = {
    system: { icon: <SettingOutlined />, label: "系统通知", color: "#1890ff" },
    security: { icon: <SafetyOutlined />, label: "安全警告", color: "#ff4d4f" },
    task: { icon: <RocketOutlined />, label: "任务通知", color: "#52c41a" },
    reminder: { icon: <ClockCircleOutlined />, label: "提醒通知", color: "#faad14" },
    warning: { icon: <WarningOutlined />, label: "警告通知", color: "#fa8c16" },
    info: { icon: <BulbOutlined />, label: "信息通知", color: "#13c2c2" },
  };

  const info = typeInfo[type];

  return (
    <Card size="small" className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: `${info.color}15`, color: info.color }}
          >
            {info.icon}
          </div>
          <span className="font-medium">{info.label}</span>
        </div>
        <Switch
          checked={config.enabled}
          onChange={(checked) => onChange(type, "enabled", checked)}
        />
      </div>

      {config.enabled && (
        <div className="grid grid-cols-3 gap-4 text-sm">
          <Checkbox
            checked={config.email}
            onChange={(e) => onChange(type, "email", e.target.checked)}
          >
            邮件
          </Checkbox>
          <Checkbox
            checked={config.sms}
            onChange={(e) => onChange(type, "sms", e.target.checked)}
          >
            短信
          </Checkbox>
          <Checkbox
            checked={config.push}
            onChange={(e) => onChange(type, "push", e.target.checked)}
          >
            推送
          </Checkbox>
        </div>
      )}
    </Card>
  );
};

const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [pushConfig, setPushConfig] = useState<PushConfig | null>(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "unread" | "urgent">("all");

  const [queryParams, setQueryParams] = useState<NotificationQueryParams>({
    page: 1,
    pageSize: 20,
  });

  const [settingsForm] = Form.useForm();
  const [pushForm] = Form.useForm();

  // ... existing code ...
  const mockNotifications: Notification[] = [
    {
      id: "1",
      title: "系统维护通知",
      content: "系统将于今晚23:00-01:00进行维护，期间可能影响正常使用。",
      type: "system" as NotificationType,
      priority: "high" as NotificationPriority,
      status: "unread" as NotificationStatus,
      sender: "系统管理员",
      recipient: "admin",
      createdAt: "2024-01-15T10:00:00Z",
      expiresAt: "2024-01-16T10:00:00Z",
      actionUrl: "/dashboard/settings",
      actionText: "查看详情",
    },
    {
      id: "2",
      title: "安全警告",
      content: "检测到异常登录尝试，IP地址：192.168.1.100，请确认是否为本人操作。",
      type: "security" as NotificationType,
      priority: "urgent" as NotificationPriority,
      status: "read" as NotificationStatus,
      sender: "安全系统",
      recipient: "admin",
      createdAt: "2024-01-15T09:30:00Z",
      readAt: "2024-01-15T09:35:00Z",
    },
    {
      id: "3",
      title: "任务完成通知",
      content: "数据采集任务\"招标信息采集\"已完成，共采集到156条数据。",
      type: "task" as NotificationType,
      priority: "normal" as NotificationPriority,
      status: "read" as NotificationStatus,
      sender: "数据采集系统",
      recipient: "admin",
      createdAt: "2024-01-15T08:45:00Z",
      readAt: "2024-01-15T09:00:00Z",
    },
    {
      id: "4",
      title: "提醒：密码即将过期",
      content: "您的密码将在7天后过期，请及时修改密码以确保账户安全。",
      type: "reminder" as NotificationType,
      priority: "normal" as NotificationPriority,
      status: "unread" as NotificationStatus,
      sender: "系统",
      recipient: "admin",
      createdAt: "2024-01-15T08:00:00Z",
      actionUrl: "/dashboard/profile",
      actionText: "修改密码",
    },
  ];

  const mockStats: NotificationStats = {
    totalCount: 156,
    unreadCount: 12,
    todayCount: 8,
    weekCount: 45,
    typeDistribution: {
      system: 45,
      security: 23,
      task: 67,
      reminder: 15,
      warning: 4,
      info: 2,
    } as Record<NotificationType, number>,
    priorityDistribution: {
      low: 89,
      normal: 45,
      high: 18,
      urgent: 4,
    } as Record<NotificationPriority, number>,
  };

  const mockSettings: NotificationSettings = {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    types: {
      system: { enabled: true, email: true, sms: false, push: true },
      security: { enabled: true, email: true, sms: true, push: true },
      task: { enabled: true, email: false, sms: false, push: true },
      reminder: { enabled: true, email: true, sms: false, push: true },
      warning: { enabled: true, email: true, sms: true, push: true },
      info: { enabled: true, email: false, sms: false, push: false },
    } as any,
    quietHours: {
      enabled: true,
      startTime: "22:00",
      endTime: "08:00",
    },
    frequency: "realtime",
  };

  const mockPushConfig: PushConfig = {
    webPush: {
      enabled: true,
      endpoint: "https://fcm.googleapis.com/fcm/send/...",
      keys: {
        p256dh: "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8YlKtxiHiWhHXmVWWdDJmN0qGYTWw",
        auth: "tBHItJI5svbpez7KI4CCXg",
      },
    },
    mobilePush: {
      enabled: false,
      platform: "ios",
    },
  };

  useEffect(() => {
    loadNotifications();
    loadStats();
    loadSettings();
  }, [queryParams]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (_error) {
      message.error("加载通知失败");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setStats(mockStats);
    } catch (_error) {
      console.error("加载统计数据失败");
    }
  };

  const loadSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setSettings(mockSettings);
      setPushConfig(mockPushConfig);

      // 修复 TimePicker 时间格式问题
      const formattedSettings = {
        ...mockSettings,
        quietHours: {
          ...mockSettings.quietHours,
          startTime: mockSettings.quietHours.startTime ? dayjs(mockSettings.quietHours.startTime, "HH:mm") : null,
          endTime: mockSettings.quietHours.endTime ? dayjs(mockSettings.quietHours.endTime, "HH:mm") : null,
        },
      };

      settingsForm.setFieldsValue(formattedSettings);
      pushForm.setFieldsValue(mockPushConfig);
    } catch (_error) {
      console.error("加载设置失败");
    }
  };

  const handleMarkAsRead = async (notificationIds: string[]) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification.id)
            ? { ...notification, status: "read" as NotificationStatus, readAt: new Date().toISOString() }
            : notification,
        ),
      );
      message.success(`已标记 ${notificationIds.length} 条通知为已读`);
      setSelectedNotifications([]);
    } catch (_error) {
      message.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsUnread = async (notificationIds: string[]) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification.id)
            ? { ...notification, status: "unread" as NotificationStatus, readAt: undefined }
            : notification,
        ),
      );
      message.success(`已标记 ${notificationIds.length} 条通知为未读`);
      setSelectedNotifications([]);
    } catch (_error) {
      message.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationIds: string[]) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除选中的 ${notificationIds.length} 条通知吗？此操作不可撤销。`,
      onOk: async () => {
        setLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          setNotifications(prev =>
            prev.filter(notification => !notificationIds.includes(notification.id)),
          );
          message.success(`已删除 ${notificationIds.length} 条通知`);
          setSelectedNotifications([]);
        } catch (_error) {
          message.error("删除失败");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter(n => n.status === "unread")
      .map(n => n.id);

    if (unreadIds.length === 0) {
      message.info("没有未读通知");
      return;
    }

    await handleMarkAsRead(unreadIds);
  };

  const handleSettingsUpdate = async (values: any) => {
    setLoading(true);
    try {
      // 处理时间格式
      const processedValues = {
        ...values,
        quietHours: {
          ...values.quietHours,
          startTime: values.quietHours?.startTime ? values.quietHours.startTime.format("HH:mm") : null,
          endTime: values.quietHours?.endTime ? values.quietHours.endTime.format("HH:mm") : null,
        },
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setSettings(processedValues);
      message.success("通知设置更新成功");
    } catch (_error) {
      message.error("更新失败");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeConfigChange = (type: NotificationType, field: string, value: boolean) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      types: {
        ...settings.types,
        [type]: {
          ...settings.types[type],
          [field]: value,
        },
      },
    };

    setSettings(newSettings);
    settingsForm.setFieldsValue(newSettings);
  };

  const getNotificationIcon = (type: NotificationType) => {
    const iconMap = {
      system: <SettingOutlined />,
      security: <SafetyOutlined />,
      task: <RocketOutlined />,
      reminder: <ClockCircleOutlined />,
      warning: <WarningOutlined />,
      info: <BulbOutlined />,
    };
    return iconMap[type];
  };

  const getNotificationColor = (type: NotificationType, priority: NotificationPriority) => {
    if (priority === "urgent") return "#ff4d4f";
    if (priority === "high") return "#fa8c16";

    const colorMap = {
      system: "#1890ff",
      security: "#ff4d4f",
      task: "#52c41a",
      reminder: "#faad14",
      warning: "#fa8c16",
      info: "#13c2c2",
    };
    return colorMap[type];
  };

  const getTypeTag = (type: NotificationType) => {
    const typeConfig = {
      system: { color: "blue", text: "系统" },
      security: { color: "red", text: "安全" },
      task: { color: "green", text: "任务" },
      reminder: { color: "orange", text: "提醒" },
      warning: { color: "volcano", text: "警告" },
      info: { color: "cyan", text: "信息" },
    };
    const config = typeConfig[type];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (viewMode === "unread" && notification.status !== "unread") return false;
    if (viewMode === "urgent" && notification.priority !== "urgent") return false;
    if (queryParams.type && notification.type !== queryParams.type) return false;
    if (queryParams.priority && notification.priority !== queryParams.priority) return false;
    if (queryParams.status && notification.status !== queryParams.status) return false;
    if (queryParams.keyword) {
      const keyword = queryParams.keyword.toLowerCase();
      return notification.title.toLowerCase().includes(keyword) ||
        notification.content.toLowerCase().includes(keyword);
    }
    return true;
  });

  const unreadCount = notifications.filter(n => n.status === "unread").length;
  const urgentCount = notifications.filter(n => n.priority === "urgent").length;

  if (!stats) {
    return <div className="flex items-center justify-center h-64">加载中...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 页面头部 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <Title level={2} className="mb-2">消息通知中心</Title>
            <Text type="secondary">统一管理系统消息、通知设置和推送配置</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadNotifications}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => setActiveTab("settings")}
            >
              通知设置
            </Button>
          </Space>
        </div>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="bg-white rounded-lg">
        {/* 概览页面 - 优化后的企业级设计 */}
        <TabPane tab={<span><DashboardOutlined />概览</span>} key="overview">
          <div className="p-6">
            {/* 替换统计卡片为更实用的概览组件 */}
            <NotificationOverview
              stats={stats}
              unreadCount={unreadCount}
              urgentCount={urgentCount}
              onViewModeChange={setViewMode}
              onMarkAllRead={handleMarkAllAsRead}
            />

            {/* 快速筛选 */}
            <Card className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Title level={4} className="mb-2">通知筛选</Title>
                  <Text type="secondary">快速查看不同类型的通知</Text>
                </div>
                <Segmented
                  value={viewMode}
                  onChange={setViewMode}
                  options={[
                    { label: "全部", value: "all" },
                    { label: `未读 (${unreadCount})`, value: "unread" },
                    { label: `紧急 (${urgentCount})`, value: "urgent" },
                  ]}
                />
              </div>
            </Card>

            {/* 最新通知列表 */}
            <Card title="最新通知" extra={
              <Button type="link" onClick={() => setActiveTab("list")}>查看全部</Button>
            }>
              {filteredNotifications.length === 0 ? (
                <Empty description="暂无通知" />
              ) : (
                <List
                  loading={loading}
                  dataSource={filteredNotifications.slice(0, 5)}
                  renderItem={(notification) => (
                    <List.Item
                      key={notification.id}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${notification.status === "unread" ? "bg-blue-50 border-l-4 border-blue-500" : ""
                      } ${notification.priority === "urgent" ? "border-l-4 border-red-500" : ""
                      }`}
                      actions={[
                        <PriorityIndicator key="priority" priority={notification.priority} />,
                        <Dropdown
                          key="more"
                          menu={{
                            items: [
                              {
                                key: "read",
                                label: notification.status === "unread" ? "标记已读" : "标记未读",
                                icon: notification.status === "unread" ? <EyeOutlined /> : <EyeInvisibleOutlined />,
                                onClick: () => {
                                  if (notification.status === "unread") {
                                    handleMarkAsRead([notification.id]);
                                  } else {
                                    handleMarkAsUnread([notification.id]);
                                  }
                                },
                              },
                              {
                                key: "delete",
                                label: "删除",
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleDelete([notification.id]),
                              },
                            ],
                          }}
                        >
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge dot={notification.status === "unread"}>
                            <Avatar
                              icon={getNotificationIcon(notification.type)}
                              style={{
                                backgroundColor: getNotificationColor(notification.type, notification.priority),
                              }}
                            />
                          </Badge>
                        }
                        title={
                          <div className="flex items-center justify-between">
                            <span className={notification.status === "unread" ? "font-semibold" : ""}>
                              {notification.title}
                            </span>
                            <Space>
                              {getTypeTag(notification.type)}
                            </Space>
                          </div>
                        }
                        description={
                          <div>
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              className="mb-2 text-gray-600"
                            >
                              {notification.content}
                            </Paragraph>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>发送者：{notification.sender}</span>
                              <span>{dayjs(notification.createdAt).format("YYYY-MM-DD HH:mm")}</span>
                            </div>
                            {notification.actionUrl && (
                              <div className="mt-2">
                                <Button
                                  type="link"
                                  size="small"
                                  onClick={() => router.push(notification.actionUrl!)}
                                >
                                  {notification.actionText || "查看详情"}
                                </Button>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </div>
        </TabPane>

        {/* 通知列表 */}
        <TabPane tab={<span><MessageOutlined />通知列表</span>} key="list">
          <div className="p-6">
            <div className="mb-4">
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Button
                      icon={<FilterOutlined />}
                      onClick={() => setFilterVisible(!filterVisible)}
                    >
                      筛选
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={loadNotifications}>
                      刷新
                    </Button>
                    {selectedNotifications.length > 0 && (
                      <>
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => handleMarkAsRead(selectedNotifications)}
                        >
                          标记已读
                        </Button>
                        <Button
                          icon={<EyeInvisibleOutlined />}
                          onClick={() => handleMarkAsUnread(selectedNotifications)}
                        >
                          标记未读
                        </Button>
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => handleDelete(selectedNotifications)}
                        >
                          删除
                        </Button>
                      </>
                    )}
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button onClick={handleMarkAllAsRead}>
                      全部已读
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* 筛选器 */}
            {filterVisible && (
              <Card size="small" className="mb-4">
                <Row gutter={16}>
                  <Col span={6}>
                    <Select
                      placeholder="通知类型"
                      allowClear
                      style={{ width: "100%" }}
                      value={queryParams.type}
                      onChange={(value) => setQueryParams(prev => ({ ...prev, type: value }))}
                    >
                      <Option value="system">系统</Option>
                      <Option value="security">安全</Option>
                      <Option value="task">任务</Option>
                      <Option value="reminder">提醒</Option>
                      <Option value="warning">警告</Option>
                      <Option value="info">信息</Option>
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      placeholder="优先级"
                      allowClear
                      style={{ width: "100%" }}
                      value={queryParams.priority}
                      onChange={(value) => setQueryParams(prev => ({ ...prev, priority: value }))}
                    >
                      <Option value="low">低</Option>
                      <Option value="normal">普通</Option>
                      <Option value="high">高</Option>
                      <Option value="urgent">紧急</Option>
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      placeholder="状态"
                      allowClear
                      style={{ width: "100%" }}
                      value={queryParams.status}
                      onChange={(value) => setQueryParams(prev => ({ ...prev, status: value }))}
                    >
                      <Option value="unread">未读</Option>
                      <Option value="read">已读</Option>
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Input
                      placeholder="搜索通知内容"
                      prefix={<SearchOutlined />}
                      value={queryParams.keyword}
                      onChange={(e) => setQueryParams(prev => ({ ...prev, keyword: e.target.value }))}
                    />
                  </Col>
                </Row>
              </Card>
            )}

            {/* 通知列表 */}
            <List
              loading={loading}
              dataSource={filteredNotifications}
              renderItem={(notification) => (
                <List.Item
                  key={notification.id}
                  className={`cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${notification.status === "unread" ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  } ${notification.priority === "urgent" ? "border-l-4 border-red-500" : ""
                  }`}
                  actions={[
                    <Checkbox
                      key="select"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications(prev => [...prev, notification.id]);
                        } else {
                          setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                        }
                      }}
                    />,
                    <PriorityIndicator key="priority" priority={notification.priority} />,
                    <Dropdown
                      key="more"
                      menu={{
                        items: [
                          {
                            key: "read",
                            label: notification.status === "unread" ? "标记已读" : "标记未读",
                            icon: notification.status === "unread" ? <EyeOutlined /> : <EyeInvisibleOutlined />,
                            onClick: () => {
                              if (notification.status === "unread") {
                                handleMarkAsRead([notification.id]);
                              } else {
                                handleMarkAsUnread([notification.id]);
                              }
                            },
                          },
                          {
                            key: "delete",
                            label: "删除",
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => handleDelete([notification.id]),
                          },
                        ],
                      }}
                    >
                      <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={notification.status === "unread"}>
                        <Avatar
                          icon={getNotificationIcon(notification.type)}
                          style={{
                            backgroundColor: getNotificationColor(notification.type, notification.priority),
                          }}
                        />
                      </Badge>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span className={notification.status === "unread" ? "font-semibold" : ""}>
                          {notification.title}
                        </span>
                        <Space>
                          {getTypeTag(notification.type)}
                        </Space>
                      </div>
                    }
                    description={
                      <div>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          className="mb-2 text-gray-600"
                        >
                          {notification.content}
                        </Paragraph>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>发送者：{notification.sender}</span>
                          <span>{dayjs(notification.createdAt).format("YYYY-MM-DD HH:mm")}</span>
                        </div>
                        {notification.actionUrl && (
                          <div className="mt-2">
                            <Button
                              type="link"
                              size="small"
                              onClick={() => router.push(notification.actionUrl!)}
                            >
                              {notification.actionText || "查看详情"}
                            </Button>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

            {/* 分页 */}
            <div className="mt-6 text-center">
              <Pagination
                current={queryParams.page}
                pageSize={queryParams.pageSize}
                total={filteredNotifications.length}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`}
                onChange={(page, pageSize) => {
                  setQueryParams(prev => ({ ...prev, page, pageSize }));
                }}
              />
            </div>
          </div>
        </TabPane>

        {/* 通知设置 - 优化后的企业级设计 */}
        <TabPane tab={<span><SettingOutlined />通知设置</span>} key="settings">
          <div className="p-6">
            {settings && (
              <Form
                form={settingsForm}
                layout="vertical"
                onFinish={handleSettingsUpdate}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="基础设置" className="mb-6">
                      <Form.Item name="emailEnabled" valuePropName="checked">
                        <Checkbox>启用邮件通知</Checkbox>
                      </Form.Item>
                      <Form.Item name="smsEnabled" valuePropName="checked">
                        <Checkbox>启用短信通知</Checkbox>
                      </Form.Item>
                      <Form.Item name="pushEnabled" valuePropName="checked">
                        <Checkbox>启用推送通知</Checkbox>
                      </Form.Item>

                      <Form.Item label="通知频率" name="frequency">
                        <Select>
                          <Option value="realtime">实时</Option>
                          <Option value="hourly">每小时</Option>
                          <Option value="daily">每日</Option>
                          <Option value="weekly">每周</Option>
                        </Select>
                      </Form.Item>
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card title="免打扰设置" className="mb-6">
                      <Form.Item name={["quietHours", "enabled"]} valuePropName="checked">
                        <Checkbox>启用免打扰时间</Checkbox>
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="开始时间" name={["quietHours", "startTime"]}>
                            <Input
                              placeholder="22:00"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="结束时间" name={["quietHours", "endTime"]}>
                            <Input
                              placeholder="08:00"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Alert
                        message="免打扰时间内，除紧急通知外，其他通知将被静默处理"
                        type="info"
                        showIcon
                        className="mt-4"
                      />
                    </Card>
                  </Col>
                </Row>

                <Divider>通知类型设置</Divider>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.types).map(([type, config]) => (
                    <NotificationTypeConfig
                      key={type}
                      type={type as NotificationType}
                      config={config}
                      onChange={handleTypeConfigChange}
                    />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Space>
                    <Button onClick={() => settingsForm.resetFields()}>
                      重置
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存设置
                    </Button>
                  </Space>
                </div>
              </Form>
            )}
          </div>
        </TabPane>

        {/* 推送配置 */}
        <TabPane tab={<span><MobileOutlined />推送配置</span>} key="push">
          <div className="p-6">
            {pushConfig && (
              <Form
                form={pushForm}
                layout="vertical"
                initialValues={pushConfig}
                onFinish={(values) => {
                  setLoading(true);
                  setTimeout(() => {
                    setPushConfig(values);
                    setLoading(false);
                    message.success("推送配置更新成功");
                  }, 1000);
                }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="Web推送配置">
                      <Form.Item name={["webPush", "enabled"]} valuePropName="checked">
                        <Checkbox>启用Web推送</Checkbox>
                      </Form.Item>

                      <Form.Item label="推送端点" name={["webPush", "endpoint"]}>
                        <Input.TextArea rows={3} placeholder="推送服务端点URL" />
                      </Form.Item>

                      <Form.Item label="P256DH密钥" name={["webPush", "keys", "p256dh"]}>
                        <Input.TextArea rows={2} placeholder="P256DH公钥" />
                      </Form.Item>

                      <Form.Item label="Auth密钥" name={["webPush", "keys", "auth"]}>
                        <Input placeholder="Auth密钥" />
                      </Form.Item>
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card title="移动推送配置">
                      <Form.Item name={["mobilePush", "enabled"]} valuePropName="checked">
                        <Checkbox>启用移动推送</Checkbox>
                      </Form.Item>

                      <Form.Item label="平台" name={["mobilePush", "platform"]}>
                        <Select>
                          <Option value="ios">iOS</Option>
                          <Option value="android">Android</Option>
                          <Option value="both">iOS + Android</Option>
                        </Select>
                      </Form.Item>

                      <Alert
                        message="推送配置说明"
                        description="移动推送需要配置相应的推送服务（如APNs、FCM等），请联系系统管理员进行配置。"
                        type="info"
                        showIcon
                        className="mt-4"
                      />
                    </Card>
                  </Col>
                </Row>

                <div className="mt-6 text-center">
                  <Space>
                    <Button onClick={() => pushForm.resetFields()}>
                      重置
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      保存配置
                    </Button>
                  </Space>
                </div>
              </Form>
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
