"use client";

import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface ShareCardProps {
  url: string;
  title: string;
  excerpt?: string;
  platform: "wechat" | "xiaohongshu";
  onClose: () => void;
}

export function ShareCard({ url, title, excerpt, platform, onClose }: ShareCardProps) {
  const platformLabel = platform === "wechat" ? "微信" : "小红书";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="关闭"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-4">
            长按或截图保存，分享到{platformLabel}
          </p>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
              {title}
            </h3>
            {excerpt && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {excerpt}
              </p>
            )}
            <div className="flex justify-center">
              <QRCodeSVG
                value={url}
                size={120}
                level="M"
                bgColor="transparent"
              />
            </div>
            <p className="text-xs text-gray-400 mt-3">扫码阅读原文</p>
          </div>

          <p className="text-xs text-gray-300">dingning.ai</p>
        </div>
      </div>
    </div>
  );
}
