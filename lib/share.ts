export type SharePlatform = "twitter" | "weibo" | "linkedin";

export interface ShareData {
  url: string;
  title: string;
  excerpt?: string;
}

export function getShareUrl(platform: SharePlatform, data: ShareData): string {
  const { url, title } = data;

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    case "weibo":
      return `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  }
}
