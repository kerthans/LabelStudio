"use client";

import { useEffect } from "react";

interface AntiDebugProps {
  enabled?: boolean;
}

const AntiDebug: React.FC<AntiDebugProps> = ({
  enabled = process.env.NEXT_PUBLIC_ENABLE_ANTI_DEBUG === "true",
}) => {
  useEffect(() => {
    // 移除 NODE_ENV 检查，只检查 enabled 参数
    if (!enabled) {
      console.log("反调试功能已禁用");
      return;
    }

    console.log("反调试功能已启用");

    // 禁用右键菜单
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 禁用开发者工具快捷键
    const disableDevTools = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }

      // Ctrl+U (查看源代码)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
    };

    // 检测开发者工具是否打开
    const detectDevTools = () => {
      const threshold = 160;

      const checkDevTools = () => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          // 检测到开发者工具打开
          console.clear();
          console.log("%c警告", "color: red; font-size: 50px; font-weight: bold;");
          console.log("%c此系统受到保护，请勿尝试调试或逆向工程。", "color: red; font-size: 16px;");

          // 可选：重定向到警告页面
          window.location.href = "/forbidden";
        }
      };

      setInterval(checkDevTools, 1000);
    };

    // 禁用选择文本
    const disableTextSelection = () => {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    };

    // 清空控制台
    const clearConsole = () => {
      const interval = setInterval(() => {
        console.clear();
        console.log("%c系统受保护", "color: #ff6b6b; font-size: 20px; font-weight: bold;");
      }, 1000);

      return () => clearInterval(interval);
    };

    // 添加事件监听器
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableDevTools);

    // 启用保护功能
    detectDevTools();
    disableTextSelection();
    const clearConsoleInterval = clearConsole();

    // 清理函数
    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableDevTools);
      clearConsoleInterval();

      // 恢复文本选择
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, [enabled]);

  return null;
};

export default AntiDebug;
