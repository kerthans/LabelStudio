"use client";
import {
  BellOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  FilterOutlined,
  InfoCircleOutlined,
  MailOutlined,
  SettingOutlined,
  WarningOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Empty,
  List,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tag,
  Typography
} from "antd";
import React, { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  category: 'task' | 'system' | 'quality' | 'announcement';
  isRead: boolean;
  createdAt: string;
  sender?: string;
  avatar?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  taskAssignment: boolean;
  taskDeadline: boolean;
  qualityFeedback: boolean;
  systemUpdates: boolean;
  announcements: boolean;
}

const NotificationsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // 模拟通知数据
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif_001",
      title: "新任务分配",
      content: "您有一个新的图像分类任务需要处理，任务名称：医疗影像数据集标注",
      type: "info",
      category: "task",
      isRead: false,
      createdAt: "2024-01-15 14:30",
      sender: "项目管理员",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=admin",
      actionUrl: "/dashboard/annotation/my-tasks",
      priority: "high"
    },
    {
      id: "notif_002",
      title: "质量评估完成",
      content: "您提交的标注任务已通过质量检查，评分：96.5%，表现优秀！",
      type: "success",
      category: "quality",
      isRead: false,
      createdAt: "2024-01-15 11:20",
      sender: "质量控制系统",
      priority: "medium"
    },
    {
      id: "notif_003",
      title: "任务即将截止",
      content: "任务'文本情感分析'将在2小时后截止，请及时完成提交",
      type: "warning",
      category: "task",
      isRead: true,
      createdAt: "2024-01-15 09:45",
      sender: "系统提醒",
      actionUrl: "/dashboard/annotation/my-tasks",
      priority: "urgent"
    },
    {
      id: "notif_004",
      title: "系统维护通知",
      content: "系统将于今晚22:00-24:00进行维护升级，期间可能影响正常使用",
      type: "info",
      category: "system",
      isRead: true,
      createdAt: "2024-01-14 16:00",
      sender: "系统管理员",
      priority: "medium"
    },
    {
      id: "notif_005",
      title: "标注错误提醒",
      content: "检测到您在任务'目标检测-交通场景'中存在标注不一致问题，请重新检查",
      type: "error",
      category: "quality",
      isRead: false,
      createdAt: "2024-01-14 14:15",
      sender: "质量检查系统",
      actionUrl: "/dashboard/quality/review",
      priority: "high"
    },
    {
      id: "notif_006",
      title: "平台功能更新",
      content: "标注平台新增智能辅助标注功能，可提高标注效率30%，欢迎体验！",
      type: "info",
      category: "announcement",
      isRead: true,
      createdAt: "2024-01-13 10:00",
      sender: "产品团队",
      priority: "low"
    }
  ]);

  // 通知设置
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    browserNotifications: true,
    taskAssignment: true,
    taskDeadline: true,
    qualityFeedback: true,
    systemUpdates: false,
    announcements: true
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'error': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'system': return <SettingOutlined style={{ color: '#722ed1' }} />;
      default: return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return '#f6ffed';
      case 'warning': return '#fffbe6';
      case 'error': return '#fff2f0';
      case 'system': return '#f9f0ff';
      default: return '#e6f7ff';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '紧急';
      case 'high': return '重要';
      case 'medium': return '普通';
      case 'low': return '一般';
      default: return '普通';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'task': return '任务';
      case 'system': return '系统';
      case 'quality': return '质量';
      case 'announcement': return '公告';
      default: return '其他';
    }
  };

  // 筛选通知
  const filteredNotifications = notifications.filter(notification => {
    const typeMatch = filterType === 'all' ||
      (filterType === 'unread' && !notification.isRead) ||
      (filterType === 'read' && notification.isRead) ||
      notification.type === filterType;
    const categoryMatch = filterCategory === 'all' || notification.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    message.success('已标记为已读');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    message.success('已全部标记为已读');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条通知吗？',
      onOk: () => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        message.success('通知已删除');
      },
    });
  };

  const handleBatchDelete = () => {
    if (selectedNotifications.length === 0) {
      message.warning('请先选择要删除的通知');
      return;
    }
    Modal.confirm({
      title: '批量删除',
      content: `确定要删除选中的 ${selectedNotifications.length} 条通知吗？`,
      onOk: () => {
        setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
        setSelectedNotifications([]);
        message.success('批量删除成功');
      },
    });
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    message.success('设置已保存');
  };

  const typeOptions = [
    { value: 'all', label: '全部通知' },
    { value: 'unread', label: '未读通知' },
    { value: 'read', label: '已读通知' },
    { value: 'info', label: '信息通知' },
    { value: 'success', label: '成功通知' },
    { value: 'warning', label: '警告通知' },
    { value: 'error', label: '错误通知' },
    { value: 'system', label: '系统通知' }
  ];

  const categoryOptions = [
    { value: 'all', label: '全部分类' },
    { value: 'task', label: '任务相关' },
    { value: 'quality', label: '质量相关' },
    { value: 'system', label: '系统相关' },
    { value: 'announcement', label: '公告通知' }
  ];

  const actionMenuItems = [
    {
      key: 'markAllRead',
      label: '全部标记为已读',
      icon: <CheckOutlined />,
      onClick: handleMarkAllAsRead,
    },
    {
      key: 'batchDelete',
      label: '批量删除',
      icon: <DeleteOutlined />,
      onClick: handleBatchDelete,
      danger: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'settings',
      label: '通知设置',
      icon: <SettingOutlined />,
      onClick: () => setShowSettings(true),
    },
  ];

  return (
    <div style={{ padding: "0 4px" }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={3} style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Badge count={unreadCount} size="small">
                <BellOutlined />
              </Badge>
              消息通知
            </Title>
            <Text type="secondary">查看和管理您的系统通知消息</Text>
          </div>
          <Space>
            <Dropdown menu={{ items: actionMenuItems }} trigger={['click']}>
              <Button icon={<SettingOutlined />}>
                操作
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* 筛选器 */}
        <Row gutter={16}>
          <Col xs={12} sm={8} md={6}>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: '100%' }}
              placeholder="选择通知类型"
              suffixIcon={<FilterOutlined />}
            >
              {typeOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: '100%' }}
              placeholder="选择通知分类"
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* 统计信息 */}
        <div style={{ marginTop: 16, padding: 16, background: '#f0f2f5', borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
                  {notifications.length}
                </div>
                <div style={{ color: '#666' }}>总通知</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ff4d4f' }}>
                  {unreadCount}
                </div>
                <div style={{ color: '#666' }}>未读</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#52c41a' }}>
                  {notifications.length - unreadCount}
                </div>
                <div style={{ color: '#666' }}>已读</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: '#faad14' }}>
                  {notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length}
                </div>
                <div style={{ color: '#666' }}>重要</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 通知列表 */}
      <Card>
        {filteredNotifications.length === 0 ? (
          <Empty
            description="暂无通知"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={filteredNotifications}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                style={{
                  backgroundColor: notification.isRead ? '#fff' : getTypeColor(notification.type),
                  border: notification.isRead ? '1px solid #f0f0f0' : `1px solid ${notification.type === 'error' ? '#ffccc7' : '#d9f7be'}`,
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 16
                }}
                actions={[
                  <Button
                    key="view"
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  >
                    {notification.isRead ? '已读' : '标记已读'}
                  </Button>,
                  <Button
                    key="delete"
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(notification.id)}
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {getTypeIcon(notification.type)}
                      {notification.avatar && (
                        <Avatar src={notification.avatar} size={32} />
                      )}
                    </div>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                        {notification.title}
                      </span>
                      <Tag color={getPriorityColor(notification.priority)} className="small-tag">
                        {getPriorityText(notification.priority)}
                      </Tag>
                      <Tag color="blue" className="small-tag">
                        {getCategoryText(notification.category)}
                      </Tag>
                      {!notification.isRead && (
                        <Badge status="error" text="未读" />
                      )}
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph
                        style={{
                          margin: '8px 0',
                          color: notification.isRead ? '#666' : '#333'
                        }}
                      >
                        {notification.content}
                      </Paragraph>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space size="small">
                          <ClockCircleOutlined style={{ color: '#999' }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {notification.createdAt}
                          </Text>
                          {notification.sender && (
                            <>
                              <Divider type="vertical" />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                来自: {notification.sender}
                              </Text>
                            </>
                          )}
                        </Space>
                        {notification.actionUrl && (
                          <Button type="link" size="small">
                            查看详情
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 通知设置弹窗 */}
      <Modal
        title="通知设置"
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowSettings(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <Title level={5}>通知方式</Title>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <MailOutlined style={{ marginRight: 8 }} />
                邮件通知
              </div>
              <Switch
                checked={settings.emailNotifications}
                onChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <BellOutlined style={{ marginRight: 8 }} />
                浏览器通知
              </div>
              <Switch
                checked={settings.browserNotifications}
                onChange={(checked) => handleSettingChange('browserNotifications', checked)}
              />
            </div>
          </div>

          <Title level={5}>通知内容</Title>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>任务分配通知</div>
              <Switch
                checked={settings.taskAssignment}
                onChange={(checked) => handleSettingChange('taskAssignment', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>任务截止提醒</div>
              <Switch
                checked={settings.taskDeadline}
                onChange={(checked) => handleSettingChange('taskDeadline', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>质量反馈通知</div>
              <Switch
                checked={settings.qualityFeedback}
                onChange={(checked) => handleSettingChange('qualityFeedback', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>系统更新通知</div>
              <Switch
                checked={settings.systemUpdates}
                onChange={(checked) => handleSettingChange('systemUpdates', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>公告通知</div>
              <Switch
                checked={settings.announcements}
                onChange={(checked) => handleSettingChange('announcements', checked)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
