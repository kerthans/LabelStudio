// 消息通知相关类型定义

// 通知类型枚举
export enum NotificationType {
  SYSTEM = 'system',
  SECURITY = 'security',
  TASK = 'task',
  REMINDER = 'reminder',
  WARNING = 'warning',
  INFO = 'info'
}

// 通知优先级枚举
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 通知状态枚举
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

// 通知条目
export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  sender?: string;
  recipient: string;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

// 通知查询参数
export interface NotificationQueryParams {
  page: number;
  pageSize: number;
  type?: NotificationType;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  keyword?: string;
  dateRange?: [string, string];
}

// 通知列表响应
export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
}

// 通知设置
export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  types: {
    [key in NotificationType]: {
      enabled: boolean;
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

// 推送配置
export interface PushConfig {
  webPush: {
    enabled: boolean;
    endpoint?: string;
    keys?: {
      p256dh: string;
      auth: string;
    };
  };
  mobilePush: {
    enabled: boolean;
    deviceToken?: string;
    platform: 'ios' | 'android';
  };
}

// 通知统计
export interface NotificationStats {
  totalCount: number;
  unreadCount: number;
  todayCount: number;
  weekCount: number;
  typeDistribution: Record<NotificationType, number>;
  priorityDistribution: Record<NotificationPriority, number>;
}