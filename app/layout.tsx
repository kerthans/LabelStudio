import AntiDebug from "@/components/security/AntiDebug";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "腾升·千江 AI",
  description: "工程项管 AI 平台，赋能基建数字化蝶变",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {/* Anti-debug component */}
        <AntiDebug />
        <AntdRegistry>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
