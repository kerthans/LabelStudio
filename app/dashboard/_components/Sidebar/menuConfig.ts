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
    label: "仪表盘",
    iconType: "DashboardOutlined",
    path: "/dashboard",
  },
  {
    key: "tender-projects",
    label: "招标项目",
    iconType: "ProjectOutlined",
    path: "/dashboard/tender-projects",
  },
  {
    key: "bid-analysis",
    label: "标书分析",
    iconType: "FileSearchOutlined",
    path: "/dashboard/bid-analysis",
  },
  {
    key: "qualification",
    label: "资质管理",
    iconType: "SafetyCertificateOutlined",
    path: "/dashboard/qualification",
  },
  {
    key: "evaluation",
    label: "评标辅助",
    iconType: "CheckCircleOutlined",
    path: "/dashboard/evaluation",
  },
  {
    key: "documents",
    label: "文档库",
    iconType: "FileOutlined",
    path: "/dashboard/documents",
  },
  {
    key: "reports",
    label: "报告中心",
    iconType: "BarChartOutlined",
    path: "/dashboard/reports",
  },
  {
    key: "system",
    label: "系统管理",
    iconType: "SettingOutlined",
    path: "/dashboard/settings",
    children: [
      { key: "users", label: "用户管理", path: "/dashboard/users" },
      { key: "data-collection", label: "数据采集", path: "/dashboard/data-collection" },
      { key: "security", label: "安全管理", path: "/dashboard/security" },
      { key: "audit-logs", label: "审计日志", path: "/dashboard/audit-logs" },
    ],
  },
  {
    key: "profile",
    label: "个人中心",
    iconType: "UserOutlined",
    path: "/dashboard/profile",
  },
  {
    key: "help",
    label: "帮助支持",
    iconType: "QuestionCircleOutlined",
    path: "/dashboard/help",
    children: [
      { key: "notifications", label: "消息通知", path: "/dashboard/notifications" },
      { key: "feedback", label: "意见反馈", path: "/dashboard/feedback" },
      { key: "about", label: "关于系统", path: "/dashboard/about" },
    ],
  },
];
