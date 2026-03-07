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
    default: "Neil Ding - dingning.ai",
    template: "%s | Neil Ding - dingning.ai",
  },
  description:
    "我不会写代码，但我用 AI 构建了三款产品。异乡好居 VP，AI 实践者，Vibe Coder。",
  openGraph: {
    title: "Neil Ding - dingning.ai",
    description:
      "一个国际教育老兵的 AI 实验场。白天管业务，晚上写产品。",
    url: "https://dingning.ai",
    siteName: "dingning.ai",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Neil Ding - dingning.ai",
    description:
      "一个国际教育老兵的 AI 实验场。白天管业务，晚上写产品。",
  },
  metadataBase: new URL("https://dingning.ai"),
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
