// 用户角色枚举
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

// 实名认证状态枚举
export enum VerificationStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  REJECTED = 'rejected',
  NOT_SUBMITTED = 'not_submitted'
}

// 2FA状态枚举
export enum TwoFactorStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  PENDING = 'pending'
}

// 用户权限类型
export interface UserPermission {
  id: string;
  name: string;
  description: string;
  module: string;
}

// 用户基本信息
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  realName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  verificationStatus: VerificationStatus;
  twoFactorStatus: TwoFactorStatus;
  permissions: UserPermission[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

// 用户表单数据
export interface UserFormData {
  username: string;
  email: string;
  phone?: string;
  realName?: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  permissions: string[];
  status: UserStatus;
  enableTwoFactor: boolean;
}

// 用户列表查询参数
export interface UserQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;
  role?: UserRole;
  status?: UserStatus;
  verificationStatus?: VerificationStatus;
  twoFactorStatus?: TwoFactorStatus;
}

// 用户列表响应
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

// 角色配置
export interface RoleConfig {
  value: UserRole;
  label: string;
  color: string;
  permissions: string[];
}