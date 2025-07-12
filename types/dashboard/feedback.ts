// 反馈类型枚举
export enum FeedbackType {
  BUG_REPORT = 'bug_report',
  FEATURE_REQUEST = 'feature_request',
  IMPROVEMENT = 'improvement',
  COMPLAINT = 'complaint',
  COMPLIMENT = 'compliment',
  QUESTION = 'question',
  OTHER = 'other'
}

// 反馈优先级
export enum FeedbackPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// 反馈状态
export enum FeedbackStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected'
}

// 附件信息
export interface FeedbackAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadTime: string;
}

// 反馈表单数据
export interface FeedbackFormData {
  type: FeedbackType;
  priority: FeedbackPriority;
  title: string;
  description: string;
  stepsToReproduce?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  browserInfo?: string;
  deviceInfo?: string;
  attachments: FeedbackAttachment[];
  contactEmail?: string;
  allowContact: boolean;
}

// 反馈记录
export interface FeedbackRecord {
  id: string;
  type: FeedbackType;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  title: string;
  description: string;
  submittedBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  submittedAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments: FeedbackAttachment[];
  responses: FeedbackResponse[];
  tags: string[];
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down';
  };
}

// 反馈回复
export interface FeedbackResponse {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: 'user' | 'admin' | 'developer';
    avatar?: string;
  };
  createdAt: string;
  isInternal: boolean;
}

// 反馈查询参数
export interface FeedbackQueryParams {
  page: number;
  pageSize: number;
  type?: FeedbackType;
  status?: FeedbackStatus;
  priority?: FeedbackPriority;
  assignedTo?: string;
  submittedBy?: string;
  dateRange?: [string, string];
  keyword?: string;
  tags?: string[];
}

// 反馈列表响应
export interface FeedbackListResponse {
  data: FeedbackRecord[];
  total: number;
  page: number;
  pageSize: number;
}

// 反馈统计
export interface FeedbackStats {
  total: number;
  byType: Record<FeedbackType, number>;
  byStatus: Record<FeedbackStatus, number>;
  byPriority: Record<FeedbackPriority, number>;
  avgResponseTime: number;
  satisfactionRate: number;
}

// 反馈配置
export interface FeedbackConfig {
  allowAnonymous: boolean;
  requireEmail: boolean;
  maxAttachments: number;
  maxAttachmentSize: number;
  allowedFileTypes: string[];
  autoAssignment: boolean;
  emailNotifications: boolean;
  publicVoting: boolean;
}