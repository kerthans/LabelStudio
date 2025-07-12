export interface MenuConfigData {
  key: string;
  label: string;
  iconType: string; // 图标类型名称
  path: string;
  children?: Omit<MenuConfigData, "iconType" | "children">[];
}

// 纯数据配置
export const MENU_CONFIG_DATA: MenuConfigData[] = [
  {
    key: "dashboard",
    label: "工作台",
    iconType: "DashboardOutlined",
    path: "/dashboard",
  },
  {
    key: "annotation",
    label: "标注任务",
    iconType: "EditOutlined",
    path: "/dashboard/annotation",
    children: [
      { key: "annotation-page", label: "标注任务管理", path: "/dashboard/annotation" },
      { key: "my-tasks", label: "我的任务", path: "/dashboard/annotation/my-tasks" },
      { key: "task-history", label: "历史任务", path: "/dashboard/annotation/task-history" },
      { key: "task-progress", label: "进度跟踪", path: "/dashboard/annotation/task-progress" },
    ],
  },
  {
    key: "projects",
    label: "项目管理",
    iconType: "ProjectOutlined",
    path: "/dashboard/projects",
    children: [
      { key: "project-list", label: "项目列表", path: "/dashboard/projects/list" },
      { key: "project-create", label: "创建项目", path: "/dashboard/projects/create" },
      { key: "project-templates", label: "项目模板", path: "/dashboard/projects/templates" },
    ],
  },
  {
    key: "tasks",
    label: "任务管理",
    iconType: "UnorderedListOutlined",
    path: "/dashboard/tasks",
    children: [
      { key: "task-create", label: "创建任务", path: "/dashboard/tasks/create" },
      { key: "task-assign", label: "任务分配", path: "/dashboard/tasks/assign" },
      { key: "task-monitor", label: "任务监控", path: "/dashboard/tasks/monitor" },
      { key: "task-review", label: "任务审核", path: "/dashboard/tasks/review" },
    ],
  },
  {
    key: "datasets",
    label: "数据管理",
    iconType: "DatabaseOutlined",
    path: "/dashboard/datasets",
    children: [
      { key: "data-upload", label: "数据上传", path: "/dashboard/datasets/upload" },
      { key: "data-library", label: "数据库", path: "/dashboard/datasets/library" },
      { key: "data-export", label: "数据导出", path: "/dashboard/datasets/export" },
      { key: "data-preprocessing", label: "数据预处理", path: "/dashboard/datasets/preprocessing" },
    ],
  },
  {
    key: "quality",
    label: "质量控制",
    iconType: "CheckCircleOutlined",
    path: "/dashboard/quality",
    children: [
      { key: "quality-review", label: "质量审核", path: "/dashboard/quality/review" },
      { key: "quality-metrics", label: "质量指标", path: "/dashboard/quality/metrics" },
      { key: "quality-consensus", label: "一致性检查", path: "/dashboard/quality/consensus" },
      { key: "quality-sampling", label: "抽样检查", path: "/dashboard/quality/sampling" },
    ],
  },
  {
    key: "analytics",
    label: "统计分析",
    iconType: "BarChartOutlined",
    path: "/dashboard/analytics",
    children: [
      { key: "work-statistics", label: "工作统计", path: "/dashboard/analytics/work-statistics" },
      { key: "efficiency-analysis", label: "效率分析", path: "/dashboard/analytics/efficiency" },
      { key: "quality-reports", label: "质量报告", path: "/dashboard/analytics/quality-reports" },
      { key: "team-performance", label: "团队绩效", path: "/dashboard/analytics/team-performance" },
    ],
  },
  {
    key: "collaboration",
    label: "协作工具",
    iconType: "TeamOutlined",
    path: "/dashboard/collaboration",
    children: [
      { key: "discussions", label: "讨论区", path: "/dashboard/collaboration/discussions" },
      { key: "annotations-review", label: "标注评审", path: "/dashboard/collaboration/annotations-review" },
      { key: "knowledge-base", label: "知识库", path: "/dashboard/collaboration/knowledge-base" },
    ],
  },
  {
    key: "system",
    label: "系统管理",
    iconType: "SettingOutlined",
    path: "/dashboard/system",
    children: [
      { key: "users", label: "用户管理", path: "/dashboard/system/users" },
      { key: "roles", label: "角色权限", path: "/dashboard/system/roles" },
      { key: "label-schema", label: "标签配置", path: "/dashboard/system/label-schema" },
      { key: "workflow", label: "工作流配置", path: "/dashboard/system/workflow" },
      { key: "integrations", label: "集成配置", path: "/dashboard/system/integrations" },
      { key: "audit-logs", label: "审计日志", path: "/dashboard/system/audit-logs" },
    ],
  },
  {
    key: "profile",
    label: "个人中心",
    iconType: "UserOutlined",
    path: "/dashboard/profile",
    children: [
      { key: "personal-info", label: "个人信息", path: "/dashboard/profile/info" },
      { key: "work-preferences", label: "工作偏好", path: "/dashboard/profile/preferences" },
      { key: "performance", label: "个人绩效", path: "/dashboard/profile/performance" },
    ],
  },
  {
    key: "help",
    label: "帮助支持",
    iconType: "QuestionCircleOutlined",
    path: "/dashboard/help",
    children: [
      { key: "documentation", label: "使用文档", path: "/dashboard/help/documentation" },
      { key: "tutorials", label: "标注教程", path: "/dashboard/help/tutorials" },
      { key: "notifications", label: "消息通知", path: "/dashboard/help/notifications" },
      { key: "feedback", label: "意见反馈", path: "/dashboard/help/feedback" },
      { key: "about", label: "关于系统", path: "/dashboard/help/about" },
    ],
  },
];
