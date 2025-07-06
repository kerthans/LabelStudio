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
    key: 'analytics',
    label: '数据分析',
    iconType: 'PieChartOutlined',
    path: '/dashboard/analytics',
  },
  {
    key: 'workspace',
    label: '工作台',
    iconType: 'DesktopOutlined',
    path: '/dashboard/workspace',
  },
  {
    key: 'user-management',
    label: '用户管理',
    iconType: 'UserOutlined',
    path: '/dashboard/users',
    children: [
      { key: 'users', label: '用户列表', path: '/dashboard/users' },
      { key: 'roles', label: '角色管理', path: '/dashboard/roles' },
      { key: 'permissions', label: '权限设置', path: '/dashboard/permissions' },
    ],
  },
  {
    key: 'team-collaboration',
    label: '团队协作',
    iconType: 'TeamOutlined',
    path: '/dashboard/projects',
    children: [
      { key: 'projects', label: '项目管理', path: '/dashboard/projects' },
      { key: 'tasks', label: '任务分配', path: '/dashboard/tasks' },
    ],
  },
  {
    key: 'content',
    label: '内容管理',
    iconType: 'VideoCameraOutlined',
    path: '/dashboard/content',
  },
  {
    key: 'files',
    label: '文件管理',
    iconType: 'FileOutlined',
    path: '/dashboard/files',
  },
  {
    key: 'settings',
    label: '系统设置',
    iconType: 'SettingOutlined',
    path: '/dashboard/settings',
  },
];