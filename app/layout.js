import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "40 个问题 - 深度自我反思工具",
  description: "通过40个深度问题进行自我反思，记录人生重要时刻，支持年度和十年回顾，自动保存答案并可导出为Markdown格式",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
