import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    // Buttondown 未配置时，仅记录并返回成功（开发阶段）
    console.log(`[Newsletter] Subscription request: ${email} (Buttondown not configured)`);
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
