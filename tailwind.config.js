/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      // 移动端优先的断点配置
      'xs': '475px',     // 超小屏幕
      'sm': '640px',     // 小屏幕 (手机横屏)
      'md': '768px',     // 中等屏幕 (平板)
      'lg': '1024px',    // 大屏幕 (小型笔记本)
      'xl': '1280px',    // 超大屏幕 (桌面)
      '2xl': '1536px',   // 超超大屏幕 (大桌面)

      // 自定义断点
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',

      // 最大宽度断点 (max-width)
      'max-sm': {'max': '639px'},
      'max-md': {'max': '767px'},
      'max-lg': {'max': '1023px'},
      'max-xl': {'max': '1279px'},

      // 范围断点
      'sm-md': {'min': '640px', 'max': '767px'},
      'md-lg': {'min': '768px', 'max': '1023px'},
      'lg-xl': {'min': '1024px', 'max': '1279px'},
    },
    extend: {
      // 扩展颜色
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      // 扩展间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // 扩展字体大小
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      // 扩展动画
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  // 暗色模式配置
  darkMode: ['class', '[data-theme="dark"]'],
}
