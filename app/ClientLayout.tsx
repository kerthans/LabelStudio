"use client";
import { ConfigProvider } from "antd";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function ConfigProviderWrapper({ children }: { children: React.ReactNode }) {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ConfigProviderWrapper>
        {children}
      </ConfigProviderWrapper>
    </ThemeProvider>
  );
}
