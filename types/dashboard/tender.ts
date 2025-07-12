// 招标项目相关类型定义
export interface TenderProject {
  id: string;
  title: string;
  projectNumber: string;
  status: 'draft' | 'published' | 'bidding' | 'evaluation' | 'completed' | 'cancelled';
  publishDate: string;
  deadline: string;
  budget: number;
  category: string;
  description: string;
  attachments: TenderAttachment[];
  bidCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenderAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
}

export interface TenderProjectFilter {
  status?: string;
  category?: string;
  dateRange?: [string, string];
  keyword?: string;
}

export interface BidAnalysis {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  analysisStatus: 'pending' | 'analyzing' | 'completed' | 'failed';
  progress: number;
  defects: BidDefect[];
  suggestions: string[];
  score: number;
}

export interface BidDefect {
  id: string;
  type: 'critical' | 'major' | 'minor';
  description: string;
  location: string;
  suggestion: string;
}

export interface ProjectOperation {
  id: string;
  action: string;
  operator: string;
  timestamp: string;
  description: string;
}

// 资质相关类型定义
export interface Qualification {
  id: string;
  companyName: string;
  companyCode: string;
  qualificationType: string;
  qualificationLevel: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  businessScope: string[];
  status: 'valid' | 'expired' | 'expiring' | 'suspended';
  attachments: QualificationAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface QualificationAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
}

export interface QualificationFilter {
  companyName?: string;
  qualificationType?: string;
  qualificationLevel?: string;
  status?: string;
  expiryDateRange?: [string, string];
  keyword?: string;
}

export interface QualificationForm {
  companyName: string;
  companyCode: string;
  qualificationType: string;
  qualificationLevel: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  businessScope: string[];
  attachments: File[];
}

// 分析详情扩展
export interface DetailedBidAnalysis extends BidAnalysis {
  analysisReport: AnalysisReport;
  scoreDetails: ScoreDetails;
  defectStatistics: DefectStatistics;
}

export interface AnalysisReport {
  id: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  riskAssessment: RiskItem[];
  complianceCheck: ComplianceItem[];
}

export interface ScoreDetails {
  totalScore: number;
  categories: ScoreCategory[];
}

export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  details: string;
}

export interface DefectStatistics {
  total: number;
  critical: number;
  major: number;
  minor: number;
  byCategory: { [key: string]: number };
}

export interface RiskItem {
  id: string;
  level: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  mitigation: string;
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  details: string;
}

// 资质历史记录
export interface QualificationHistory {
  id: string;
  action: 'create' | 'update' | 'renew' | 'suspend' | 'restore';
  operator: string;
  timestamp: string;
  description: string;
  changes?: { [key: string]: { from: any; to: any } };
}

// 关联项目
export interface RelatedProject {
  id: string;
  projectName: string;
  projectNumber: string;
  status: string;
  startDate: string;
  endDate?: string;
  role: string; // 参与角色：主承包商、分包商等
}

// 资质对比
export interface QualificationComparison {
  companies: Qualification[];
  comparisonResult: ComparisonResult;
}

export interface ComparisonResult {
  differences: ComparisonDifference[];
  scores: CompanyScore[];
  summary: ComparisonSummary;
}

export interface ComparisonDifference {
  field: string;
  fieldName: string;
  values: { [companyId: string]: any };
  isDifferent: boolean;
}

export interface CompanyScore {
  companyId: string;
  companyName: string;
  totalScore: number;
  categoryScores: { [category: string]: number };
  rank: number;
}

export interface ComparisonSummary {
  totalCompanies: number;
  differenceCount: number;
  recommendedCompany: string;
  comparisonDate: string;
}

// 文档管理相关类型定义
export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  category: DocumentCategory;
  tags: string[];
  description: string;
  uploadDate: string;
  uploadBy: string;
  downloadCount: number;
  status: 'active' | 'archived' | 'deleted';
  url: string;
  previewUrl?: string;
  version: string;
  isPublic: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  parentId?: string;
  description: string;
  documentCount: number;
  children?: DocumentCategory[];
}

export interface DocumentFilter {
  category?: string;
  tags?: string[];
  fileType?: string;
  dateRange?: [string, string];
  keyword?: string;
  status?: string;
}

export interface DocumentUpload {
  file: File;
  category: string;
  tags: string[];
  description: string;
  isPublic: boolean;
}

export interface UploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'failed' | 'paused';
  error?: string;
}

// 评标辅助相关类型定义
export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
  subCriteria?: EvaluationSubCriteria[];
}

export interface EvaluationSubCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface ExpertEvaluation {
  id: string;
  expertId: string;
  expertName: string;
  projectId: string;
  bidId: string;
  scores: EvaluationScore[];
  totalScore: number;
  comments: string;
  evaluationDate: string;
  status: 'draft' | 'submitted' | 'reviewed';
}

export interface EvaluationScore {
  criteriaId: string;
  score: number;
  comment: string;
}

export interface EvaluationComparison {
  projectId: string;
  bids: BidEvaluationResult[];
  criteria: EvaluationCriteria[];
  summary: EvaluationSummary;
}

export interface BidEvaluationResult {
  bidId: string;
  bidderName: string;
  totalScore: number;
  rank: number;
  scores: { [criteriaId: string]: number };
  expertScores: ExpertEvaluation[];
}

export interface EvaluationSummary {
  totalBids: number;
  totalExperts: number;
  averageScore: number;
  recommendedBid: string;
  evaluationDate: string;
}

// 评分模板相关类型定义
export interface EvaluationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  criteria: EvaluationCriteria[];
  totalWeight: number;
  status: 'active' | 'inactive' | 'draft';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isDefault: boolean;
}

export interface TemplateUsageRecord {
  id: string;
  templateId: string;
  projectName: string;
  projectId: string;
  usedBy: string;
  usedAt: string;
  status: 'completed' | 'in-progress' | 'cancelled';
}

export interface EvaluationReport {
  id: string;
  projectId: string;
  reportType: 'summary' | 'detailed' | 'comparison' | 'expert';
  title: string;
  content: string;
  charts: string[];
  generatedBy: string;
  generatedAt: string;
  status: 'generating' | 'completed' | 'failed';
}

// 报告中心相关类型定义
export interface Report {
  id: string;
  title: string;
  type: 'tender' | 'evaluation' | 'qualification' | 'analysis' | 'custom';
  category: string;
  description: string;
  templateId?: string;
  templateName?: string;
  status: 'draft' | 'generating' | 'completed' | 'failed' | 'scheduled';
  progress: number;
  fileUrl?: string;
  fileSize?: number;
  format: 'pdf' | 'word' | 'excel' | 'html';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  generatedAt?: string;
  downloadCount: number;
  isShared: boolean;
  sharedWith: string[];
  tags: string[];
  projectId?: string;
  projectName?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'tender' | 'evaluation' | 'qualification' | 'analysis' | 'custom';
  category: string;
  sections: ReportSection[];
  parameters: ReportParameter[];
  format: 'pdf' | 'word' | 'excel' | 'html';
  isDefault: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  previewUrl?: string;
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'text' | 'table' | 'chart' | 'image' | 'list';
  order: number;
  required: boolean;
  content?: string;
  dataSource?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'scatter';
  parameters?: { [key: string]: any };
}

export interface ReportParameter {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface ReportFilter {
  type?: string;
  category?: string;
  status?: string;
  createdBy?: string;
  dateRange?: [string, string];
  keyword?: string;
  tags?: string[];
  projectId?: string;
}

export interface ReportGeneration {
  id: string;
  templateId: string;
  parameters: { [key: string]: any };
  title: string;
  description?: string;
  format: 'pdf' | 'word' | 'excel' | 'html';
  scheduledAt?: string;
  isScheduled: boolean;
  repeatType?: 'none' | 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'generating' | 'completed' | 'failed';
  progress: number;
  error?: string;
  createdBy: string;
  createdAt: string;
}

export interface ReportShare {
  id: string;
  reportId: string;
  sharedBy: string;
  sharedWith: string[];
  permissions: ('view' | 'download' | 'edit')[];
  expiryDate?: string;
  accessCount: number;
  isPublic: boolean;
  shareUrl?: string;
  createdAt: string;
}

export interface ReportStatistics {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  totalDownloads: number;
  popularTemplates: { templateId: string; templateName: string; usageCount: number }[];
  recentActivity: ReportActivity[];
}

export interface ReportActivity {
  id: string;
  type: 'generated' | 'downloaded' | 'shared' | 'deleted';
  reportId: string;
  reportTitle: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

// 数据采集相关类型定义
export interface DataSource {
  id: string;
  name: string;
  domain: string;
  url: string;
  type: 'tender' | 'qualification' | 'company' | 'news' | 'other';
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  lastCollectionTime: string;
  nextCollectionTime: string;
  collectionInterval: number; // 分钟
  requestCount: number;
  dailyRequestLimit: number;
  successRate: number;
  errorCount: number;
  ipRotationEnabled: boolean;
  currentIp: string;
  availableIps: string[];
  antiCrawlDetected: boolean;
  lastError?: string;
  configuration: DataSourceConfig;
  statistics: DataSourceStatistics;
}

export interface DataSourceConfig {
  headers: { [key: string]: string };
  cookies: { [key: string]: string };
  userAgents: string[];
  requestDelay: number; // 毫秒
  retryCount: number;
  timeout: number; // 毫秒
  proxyEnabled: boolean;
  proxyList: string[];
  selectors: { [key: string]: string };
  filters: DataSourceFilter[];
}

export interface DataSourceFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
  value: string;
  enabled: boolean;
}

export interface DataSourceStatistics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  dataCollected: number;
  lastWeekTrend: number[];
  errorTypes: { [type: string]: number };
}

export interface CollectionTask {
  id: string;
  dataSourceId: string;
  dataSourceName: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  progress: number;
  itemsCollected: number;
  itemsTotal: number;
  currentUrl?: string;
  error?: string;
  logs: CollectionLog[];
}

export interface CollectionLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: any;
}

export interface IpRotationSystem {
  id: string;
  name: string;
  provider: string;
  totalIps: number;
  activeIps: number;
  bannedIps: number;
  rotationStrategy: 'random' | 'sequential' | 'smart';
  rotationInterval: number; // 分钟
  healthCheckEnabled: boolean;
  lastHealthCheck: string;
  status: 'active' | 'inactive' | 'error';
}

export interface AntiCrawlMonitor {
  id: string;
  domain: string;
  detectionMethods: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastDetectionTime: string;
  detectionCount: number;
  countermeasures: string[];
  bypassSuccess: boolean;
  notes: string;
}

export interface DataCollectionDashboard {
  totalDataSources: number;
  activeDataSources: number;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  dataCollectedToday: number;
  activeTasks: number;
  errorAlerts: number;
  ipRotationStatus: 'healthy' | 'warning' | 'error';
  antiCrawlAlerts: number;
}