"use client";
import type { BreadcrumbItem } from "@/types/dashboard/dashboard";
import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { MENU_CONFIG_DATA, type MenuConfigData } from "./Sidebar/menuConfig";

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

// 查找最匹配的路径标题
const findBestMatchTitle = (pathname: string, pathTitleMap: Record<string, string>): string | null => {
  // 首先尝试精确匹配
  if (pathTitleMap[pathname]) {
    return pathTitleMap[pathname];
  }

  // 如果没有精确匹配，尝试找到最长的匹配前缀
  const segments = pathname.split("/").filter(Boolean);
  let bestMatch = "";
  let bestTitle = null;

  for (let i = segments.length; i > 0; i--) {
    const testPath = "/" + segments.slice(0, i).join("/");
    if (pathTitleMap[testPath] && testPath.length > bestMatch.length) {
      bestMatch = testPath;
      bestTitle = pathTitleMap[testPath];
    }
  }

  return bestTitle;
};

// 默认面包屑生成函数
const generateDefaultBreadcrumb = (pathname: string): BreadcrumbItem[] => {
  const pathTitleMap = buildPathTitleMap();

  // 如果是 dashboard 首页，只显示首页
  if (pathname === "/dashboard") {
    return [{ title: "首页" }];
  }

  // 对于其他 dashboard 子页面，显示：首页 > 当前页面
  if (pathname.startsWith("/dashboard/")) {
    // 尝试找到最匹配的标题
    const matchedTitle = findBestMatchTitle(pathname, pathTitleMap);

    let currentPageTitle = matchedTitle;

    // 如果没有找到匹配的标题，使用路径的最后一段
    if (!currentPageTitle) {
      const lastSegment = pathname.split("/").pop();
      currentPageTitle = lastSegment ?
        lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) :
        "未知页面";
    }

    // 如果是动态路由（包含ID等参数），可以添加更具体的标题
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 2) {
      const parentPath = "/" + segments.slice(0, -1).join("/");
      const parentTitle = pathTitleMap[parentPath];
      const lastSegment = segments[segments.length - 1];

      // 如果最后一段看起来像ID（数字或UUID），显示为"详情"
      if (parentTitle && /^[0-9a-f-]+$/i.test(lastSegment)) {
        currentPageTitle = `${parentTitle}详情`;
      }
    }

    return [
      { title: "首页", href: "/dashboard" },
      { title: currentPageTitle },
    ];
  }

  // 对于非 dashboard 页面，保持原有逻辑
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ title: "首页", href: "/" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    const title = pathTitleMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);

    // 修复：避免显式传递 undefined
    if (isLast) {
      breadcrumbs.push({ title });
    } else {
      breadcrumbs.push({ title, href: currentPath });
    }
  });

  return breadcrumbs;
};

interface DynamicBreadcrumbProps {
  style?: React.CSSProperties;
  className?: string;
}

interface BreadcrumbProps {
  items: Array<{
    title: React.ReactNode;
    key: number;
  }>;
  style?: React.CSSProperties;
  className?: string;
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ style, className }) => {
  const pathname = usePathname();

  // 动态生成面包屑
  const breadcrumbItems = useMemo(() => {
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

  // 构建props对象，避免传递undefined
  const breadcrumbProps: BreadcrumbProps = {
    items: antdBreadcrumbItems,
  };

  // 只在有值时添加属性
  if (style) {
    breadcrumbProps.style = style;
  }
  if (className) {
    breadcrumbProps.className = className;
  }

  return <Breadcrumb {...breadcrumbProps} />;
};

export default DynamicBreadcrumb;
