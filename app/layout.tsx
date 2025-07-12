import AntiDebug from "@/components/security/AntiDebug";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "LableStudio",
  description: "Label Studio is an powerfuldata labeling tool.",
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
