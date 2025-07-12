// 帮助文档类型
export interface HelpDocument {
  id: string;
  title: string;
  content: string;
  category: HelpCategory;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isPublished: boolean;
  attachments?: HelpAttachment[];
}

// 帮助分类
export enum HelpCategory {
  GETTING_STARTED = 'getting_started',
  USER_GUIDE = 'user_guide',
  ADMIN_GUIDE = 'admin_guide',
  API_DOCS = 'api_docs',
  TROUBLESHOOTING = 'troubleshooting',
  FAQ = 'faq'
}

// 视频教程
export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // 秒
  category: HelpCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  author: string;
  createdAt: string;
  viewCount: number;
  isPublished: boolean;
}

// 常见问题
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: HelpCategory;
  tags: string[];
  isPopular: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// 帮助附件
export interface HelpAttachment {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'other';
  size: number;
}

// 在线客服
export interface CustomerService {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  department: string;
  workingHours: string;
  contactMethods: ContactMethod[];
}

export interface ContactMethod {
  type: 'chat' | 'email' | 'phone' | 'wechat' | 'qq';
  value: string;
  isAvailable: boolean;
}

// 操作手册
export interface Manual {
  id: string;
  title: string;
  description: string;
  category: ManualCategory;
  sections: ManualSection[];
  version: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
  isPublished: boolean;
}

export enum ManualCategory {
  SYSTEM_OVERVIEW = 'system_overview',
  USER_MANAGEMENT = 'user_management',
  DATA_COLLECTION = 'data_collection',
  TENDER_ANALYSIS = 'tender_analysis',
  REPORT_GENERATION = 'report_generation',
  SYSTEM_SETTINGS = 'system_settings'
}

export interface ManualSection {
  id: string;
  title: string;
  content: string;
  order: number;
  steps: ManualStep[];
  screenshots: string[];
  videoUrl?: string;
}

export interface ManualStep {
  id: string;
  title: string;
  description: string;
  order: number;
  screenshot?: string;
  tips?: string[];
  warnings?: string[];
}

// 搜索参数
export interface HelpSearchParams {
  keyword?: string;
  category?: HelpCategory;
  type?: 'document' | 'video' | 'faq' | 'manual';
  tags?: string[];
  page: number;
  pageSize: number;
}

// 帮助统计
export interface HelpStats {
  totalDocuments: number;
  totalVideos: number;
  totalFAQs: number;
  totalManuals: number;
  popularDocuments: HelpDocument[];
  popularVideos: VideoTutorial[];
  popularFAQs: FAQ[];
  recentUpdates: (HelpDocument | VideoTutorial | FAQ | Manual)[];
}