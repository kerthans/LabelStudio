// 标注任务状态
export type AnnotationTaskStatus = 'pending' | 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'review';

// 标注任务优先级
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 标注任务类型
export type AnnotationTaskType = 'image_classification' | 'object_detection' | 'text_classification' | 'ner' | 'sentiment_analysis' | 'speech_recognition' | 'video_annotation';

// 标注任务数据
export interface AnnotationTask {
  id: string;
  title: string;
  description: string;
  type: AnnotationTaskType;
  status: AnnotationTaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeId: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  qualityScore?: number;
  tags: string[];
  dataset: {
    id: string;
    name: string;
    size: number;
  };
  instructions?: string;
  estimatedTime?: number; // 预估完成时间（小时）
}

// 标注历史记录
export interface AnnotationHistory {
  id: string;
  taskId: string;
  taskTitle: string;
  type: AnnotationTaskType;
  completedAt: string;
  duration: number; // 完成耗时（分钟）
  itemsCompleted: number;
  qualityScore: number;
  feedback?: string;
  reviewer?: string;
}

// 标注进度统计
export interface AnnotationProgress {
  taskId: string;
  taskTitle: string;
  type: AnnotationTaskType;
  totalItems: number;
  completedItems: number;
  reviewedItems: number;
  approvedItems: number;
  rejectedItems: number;
  progress: number;
  qualityScore: number;
  estimatedCompletion: string;
  dailyProgress: {
    date: string;
    completed: number;
    quality: number;
  }[];
}

// 标注员信息
export interface Annotator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: 'junior' | 'intermediate' | 'senior' | 'expert';
  specialties: AnnotationTaskType[];
  totalCompleted: number;
  averageQuality: number;
  status: 'online' | 'offline' | 'busy';
}

// 任务筛选条件
export interface TaskFilters {
  status?: AnnotationTaskStatus[];
  type?: AnnotationTaskType[];
  priority?: TaskPriority[];
  assignee?: string[];
  dateRange?: [string, string];
  search?: string;
}

// 分页参数
export interface PaginationParams {
  current: number;
  pageSize: number;
  total: number;
}
