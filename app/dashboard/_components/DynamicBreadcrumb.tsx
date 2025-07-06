'use client';
import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from 'antd';
import type { BreadcrumbItem } from '@/types/dashboard/dashboard';
import { MENU_CONFIG_DATA, type MenuConfigData } from './Sidebar/menuConfig';

// 构建路径到标题的映射
const buildPathTitleMap = (): Record<string, string> => {
  const pathTitleMap: Record<string, string> = {};
  
  const traverse = (items: MenuConfigData[]) => {
    items.forEach(item => {
      pathTitleMap[item.path] = item.label;
      if (item.children) {
        item.children.forEach(child => {
          pathTitleMap[child.path] = child.label;
        });
      }
    });
  };
  
  traverse(MENU_CONFIG_DATA);
  return pathTitleMap;
};

// 路径到面包屑的映射配置
const routeBreadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { title: '首页', href: '/' },
    { title: '仪表板' },
  ],
  '/dashboard/settings': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '系统设置' },
  ],
  '/dashboard/analytics': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '数据分析' },
  ],
  '/dashboard/workspace': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '工作台' },
  ],
  '/dashboard/users': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '用户管理' },
    { title: '用户列表' },
  ],
  '/dashboard/roles': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '用户管理', href: '/dashboard/users' },
    { title: '角色管理' },
  ],
  '/dashboard/permissions': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '用户管理', href: '/dashboard/users' },
    { title: '权限设置' },
  ],
  '/dashboard/projects': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '团队协作' },
    { title: '项目管理' },
  ],
  '/dashboard/tasks': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '团队协作', href: '/dashboard/projects' },
    { title: '任务分配' },
  ],
  '/dashboard/content': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '内容管理' },
  ],
  '/dashboard/files': [
    { title: '首页', href: '/' },
    { title: '仪表板', href: '/dashboard' },
    { title: '文件管理' },
  ],
};

// 默认面包屑生成函数
const generateDefaultBreadcrumb = (pathname: string): BreadcrumbItem[] => {
  const pathTitleMap = buildPathTitleMap();
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ title: '首页', href: '/' }];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // 优先使用菜单配置中的标题
    const title = pathTitleMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      title,
      href: isLast ? undefined : currentPath,
    });
  });
  
  return breadcrumbs;
};

interface DynamicBreadcrumbProps {
  style?: React.CSSProperties;
  className?: string;
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ style, className }) => {
  const pathname = usePathname();
  
  // 动态生成面包屑
  const breadcrumbItems = useMemo(() => {
    // 优先使用预定义的映射
    if (routeBreadcrumbMap[pathname]) {
      return routeBreadcrumbMap[pathname];
    }
    
    // 否则使用默认生成逻辑
    return generateDefaultBreadcrumb(pathname);
  }, [pathname]);
  
  // 转换为 Ant Design Breadcrumb 组件需要的格式
  const antdBreadcrumbItems = breadcrumbItems.map((item, index) => ({
    title: item.href ? (
      <a href={item.href}>{item.title}</a>
    ) : (
      item.title
    ),
    key: index,
  }));

  return (
    <Breadcrumb 
      items={antdBreadcrumbItems} 
      style={style}
      className={className}
    />
  );
};

export default DynamicBreadcrumb;