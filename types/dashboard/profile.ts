// 个人中心相关类型定义

// 个人信息表单数据
export interface ProfileFormData {
  realName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  department?: string;
  position?: string;
  location?: string;
}

// 密码修改表单数据
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 2FA设置数据
export interface TwoFactorSettings {
  enabled: boolean;
  method: 'sms' | 'email' | 'app';
  backupCodes: string[];
  lastUsed?: string;
}

// 操作日志条目
export interface OperationLog {
  id: string;
  action: string;
  description: string;
  ip: string;
  userAgent: string;
  location?: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  details?: Record<string, any>;
}

// 安全设置
export interface SecuritySettings {
  loginNotification: boolean;
  passwordExpiry: boolean;
  sessionTimeout: number;
  allowMultipleLogin: boolean;
  ipWhitelist: string[];
}

// 个人偏好设置
export interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

// 个人统计数据
export interface ProfileStats {
  loginCount: number;
  lastLoginTime: string;
  accountAge: number;
  operationCount: number;
  securityScore: number;
}