import { NextRequest, NextResponse } from "next/server";
import { allow, clientIp, getNewsletterLimiter } from "@/lib/ratelimit";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  // 速率限制（按 IP）——防止脚本刷爆 Buttondown 配额 / 垃圾订阅。
  // Redis 未配置时 fail-open（个人站，可用性优先）。
  if (!(await allow(getNewsletterLimiter(), clientIp(req)))) {
    return NextResponse.json(
      { error: "订阅过于频繁，请稍后再试。" },
      { status: 429 }
    );
  }

  const { email } = await req.json();

  // 后端不信任前端校验：强制格式 + 长度，再转发第三方。
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    // Buttondown 未配置时，仅记录并返回成功（开发阶段）。不打印邮箱（隐私）。
    console.log("[Newsletter] Subscription request received (Buttondown not configured)");
    return NextResponse.json({ success: true });
  }

  const res = await fetch("https://api.buttondown.email/v1/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (res.ok) {
    return NextResponse.json({ success: true });
  }

  const data = await res.json();
  const detail = JSON.stringify(data);

  if (res.status === 400) {
    if (detail.includes("already")) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }
    if (detail.includes("blocked") || detail.includes("firewall")) {
      return NextResponse.json(
        { error: "该邮箱地址不被支持，请使用常规邮箱。" },
        { status: 400 }
      );
    }
  }

  return NextResponse.json(
    { error: "订阅失败，请稍后重试。" },
    { status: 500 }
  );
}
