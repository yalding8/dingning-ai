import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ning Ding - dingning.ai",
    template: "%s | Ning Ding - dingning.ai",
  },
  description:
    "用 AI 重塑国际教育产业链。异乡好居副总裁，管理 3 万+合作伙伴，累计服务 40 万客户、交易 75 亿。",
  openGraph: {
    title: "Ning Ding - dingning.ai",
    description:
      "用 AI 重塑国际教育产业链。管理 3 万+合作伙伴，从自己的团队开始布道 AI。",
    url: "https://dingning.ai",
    siteName: "dingning.ai",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ning Ding - dingning.ai",
    description:
      "用 AI 重塑国际教育产业链。管理 3 万+合作伙伴，从自己的团队开始布道 AI。",
  },
  metadataBase: new URL("https://dingning.ai"),
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
