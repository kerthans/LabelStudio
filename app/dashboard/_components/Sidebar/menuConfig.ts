export interface MenuConfigData {
  key: string;
  label: string;
  iconType: string; // 图标类型名称
  path: string;
  children?: Omit<MenuConfigData, 'iconType' | 'children'>[];
}

// 纯数据配置
export const MENU_CONFIG_DATA: MenuConfigData[] = [
  {
    key: 'dashboard',
    label: '仪表板',
    iconType: 'DashboardOutlined',
    path: '/dashboard',
  },
  {
    key: 'datasets',
    label: '数据集管理',
    iconType: 'DatabaseOutlined',
    path: '/dashboard/datasets',
    children: [
      { key: 'dataset-list', label: '数据集列表', path: '/dashboard/datasets' },
      { key: 'dataset-upload', label: '数据上传', path: '/dashboard/datasets/upload' },
      { key: 'dataset-import', label: '数据导入', path: '/dashboard/datasets/import' },
    ],
  },
  {
    key: 'annotation',
    label: '标注任务',
    iconType: 'EditOutlined',
    path: '/dashboard/annotation',
    children: [
      { key: 'task-list', label: '任务列表', path: '/dashboard/annotation/tasks' },
      { key: 'task-create', label: '创建任务', path: '/dashboard/annotation/create' },
      { key: 'task-templates', label: '标注模板', path: '/dashboard/annotation/templates' },
    ],
  },
  {
    key: 'labeling',
    label: '标注工作台',
    iconType: 'HighlightOutlined',
    path: '/dashboard/labeling',
  },
  {
    key: 'quality',
    label: '质量控制',
    iconType: 'SafetyCertificateOutlined',
    path: '/dashboard/quality',
    children: [
      { key: 'quality-review', label: '标注审核', path: '/dashboard/quality/review' },
      { key: 'quality-metrics', label: '质量指标', path: '/dashboard/quality/metrics' },
      { key: 'quality-reports', label: '质量报告', path: '/dashboard/quality/reports' },
    ],
  },
  {
    key: 'models',
    label: '模型训练',
    iconType: 'ExperimentOutlined',
    path: '/dashboard/models',
    children: [
      { key: 'model-list', label: '模型列表', path: '/dashboard/models' },
      { key: 'model-training', label: '训练任务', path: '/dashboard/models/training' },
      { key: 'model-evaluation', label: '模型评估', path: '/dashboard/models/evaluation' },
    ],
  },
  {
    key: 'analytics',
    label: '数据分析',
    iconType: 'BarChartOutlined',
    path: '/dashboard/analytics',
    children: [
      { key: 'progress-stats', label: '进度统计', path: '/dashboard/analytics/progress' },
      { key: 'performance-stats', label: '性能分析', path: '/dashboard/analytics/performance' },
      { key: 'export-reports', label: '导出报告', path: '/dashboard/analytics/export' },
    ],
  },
  {
    key: 'team',
    label: '团队管理',
    iconType: 'TeamOutlined',
    path: '/dashboard/team',
    children: [
      { key: 'members', label: '成员管理', path: '/dashboard/team/members' },
      { key: 'roles', label: '角色权限', path: '/dashboard/team/roles' },
      { key: 'workload', label: '工作量分配', path: '/dashboard/team/workload' },
    ],
  },
  {
    key: 'export',
    label: '数据导出',
    iconType: 'ExportOutlined',
    path: '/dashboard/export',
  },
  {
    key: 'settings',
    label: '系统设置',
    iconType: 'SettingOutlined',
    path: '/dashboard/settings',
  },
];