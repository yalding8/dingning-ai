import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-sc",
});

export const metadata: Metadata = {
  title: {
    default: "Ning Ding - dingning.ai",
    template: "%s | Ning Ding - dingning.ai",
  },
  description:
    "用 AI 重塑国际教育产业链。异乡好居合伙人，管理 3 万+合作伙伴，累计服务 40 万客户、交易 75 亿。",
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
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(t==null&&window.matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        <Script id="baidu-push" strategy="afterInteractive">
          {`(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    } else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();`}
        </Script>
      </body>
    </html>
  );
}
