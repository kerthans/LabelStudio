'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: MouseEvent) => void;
  isTransitioning: boolean;
  antdTheme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Ant Design 主题配置
  const antdTheme: ThemeConfig = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      // 深色模式下的优化配置
      ...(currentTheme === 'dark' && {
        // 背景色系 - 使用柔和的黑色调
        colorBgBase: '#141414',
        colorBgContainer: '#1a1a1a',
        colorBgElevated: '#1f1f1f',
        colorBgLayout: '#141414',
        colorBgSpotlight: '#262626',
        colorBgMask: 'rgba(0, 0, 0, 0.65)',
        
        // 边框色系
        colorBorder: '#2a2a2a',
        colorBorderSecondary: '#262626',
        
        // 文字色系
        colorText: '#e8e8e8',
        colorTextSecondary: '#a8a8a8',
        colorTextTertiary: '#888888',
        colorTextQuaternary: '#666666',
        
        // 填充色系
        colorFill: '#262626',
        colorFillSecondary: '#1f1f1f',
        colorFillTertiary: '#1a1a1a',
        colorFillQuaternary: '#171717',
        
        // 分割线
        colorSplit: '#2a2a2a',
        
        // 阴影
        boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        boxShadowSecondary: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        
        // 控件特定颜色
        controlItemBgHover: '#262626',
        controlItemBgActive: '#2a2a2a',
        controlItemBgActiveHover: '#2f2f2f',
      })
    },
    components: {
      // 针对深色模式优化特定组件
      ...(currentTheme === 'dark' && {
        Button: {
          defaultBg: '#1a1a1a',
          defaultBorderColor: '#2a2a2a',
          defaultColor: '#e8e8e8',
          defaultHoverBg: '#262626',
          defaultHoverBorderColor: '#2f2f2f',
          defaultHoverColor: '#ffffff',
        },
        Input: {
          colorBgContainer: '#1a1a1a',
          colorBorder: '#2a2a2a',
          colorText: '#e8e8e8',
          colorTextPlaceholder: '#888888',
          hoverBorderColor: '#3a3a3a',
          activeBorderColor: '#1890ff',
        },
        Card: {
          colorBgContainer: '#1a1a1a',
          colorBorderSecondary: '#2a2a2a',
        },
        Tabs: {
          colorBgContainer: '#1a1a1a',
          itemColor: '#a8a8a8',
          itemHoverColor: '#e8e8e8',
          itemSelectedColor: '#1890ff',
          inkBarColor: '#1890ff',
        },
        Alert: {
          colorInfoBg: '#1a1a1a',
          colorInfoBorder: '#2a2a2a',
          colorSuccessBg: '#1a1a1a',
          colorSuccessBorder: '#2a2a2a',
          colorWarningBg: '#1a1a1a',
          colorWarningBorder: '#2a2a2a',
          colorErrorBg: '#1a1a1a',
          colorErrorBorder: '#2a2a2a',
        },
        Form: {
          labelColor: '#e8e8e8',
          labelRequiredMarkColor: '#ff4d4f',
        },
        Typography: {
          colorText: '#e8e8e8',
          colorTextSecondary: '#a8a8a8',
          colorTextTertiary: '#888888',
        }
      })
    }
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setCurrentTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  /**
   * 检测用户的系统是否被开启了动画减弱功能
   */
  const isReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
  };

  /**
   * 当前主题色是否是暗色
   */
  const isDark = () => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  };

  /**
   * 切换主题色，html标签切换data-theme属性
   */
  const toggleDark = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  /**
   * 切换主题色，扩散渐变动画
   * @param {MouseEvent} event 点击事件
   */
  const toggleTheme = (event?: MouseEvent) => {
    if (isTransitioning || !mounted) return;

    setIsTransitioning(true);
    const willDark = !isDark();
    
    // 浏览器新特性不支持 或者 开启了动画减弱
    if (!document.startViewTransition || isReducedMotion()) {
      toggleDark();
      setIsTransitioning(false);
      return;
    }

    const transition = document.startViewTransition(() => {
      toggleDark();
    });

    // 传入点击事件，从点击处开始扩散。否则，从右上角开始扩散
    const x = event?.clientX ?? window.innerWidth;
    const y = event?.clientY ?? 0;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    
    void transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      document.documentElement.animate(
        {
          clipPath: willDark ? clipPath : [...clipPath].reverse()
        },
        {
          duration: 500,
          easing: "ease-in",
          pseudoElement: willDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)"
        }
      );
    });

    // 动画完成后重置状态
    transition.finished.finally(() => {
      setIsTransitioning(false);
    });
  };

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ 
        theme: 'light', 
        toggleTheme: () => {}, 
        isTransitioning: false,
        antdTheme: {
          algorithm: theme.defaultAlgorithm,
          token: { colorPrimary: '#1890ff' }
        }
      }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme, isTransitioning, antdTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};