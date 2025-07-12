// 系统信息相关类型定义
export interface SystemInfo {
  name: string;
  version: string;
  buildNumber: string;
  releaseDate: string;
  environment: 'development' | 'staging' | 'production';
  description: string;
}

// 版本信息
export interface VersionInfo {
  current: string;
  latest: string;
  updateAvailable: boolean;
  releaseNotes: string;
  downloadUrl?: string;
}

// 更新日志条目
export interface ChangelogEntry {
  id: string;
  version: string;
  releaseDate: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  title: string;
  description: string;
  features: string[];
  bugFixes: string[];
  improvements: string[];
  breakingChanges?: string[];
}

// 技术栈信息
export interface TechStack {
  category: string;
  technologies: {
    name: string;
    version: string;
    description: string;
    url?: string;
  }[];
}

// 技术支持信息
export interface TechnicalSupport {
  email: string;
  phone: string;
  workingHours: string;
  timezone: string;
  responseTime: string;
  supportLevel: 'basic' | 'standard' | 'premium';
}

// 联系方式
export interface ContactInfo {
  company: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  socialMedia: {
    platform: string;
    url: string;
    icon: string;
  }[];
}

// 许可证信息
export interface LicenseInfo {
  type: string;
  holder: string;
  validFrom: string;
  validTo: string;
  features: string[];
  limitations?: string[];
}

// 系统统计
export interface SystemStats {
  uptime: string;
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  systemLoad: number;
  memoryUsage: number;
  diskUsage: number;
}