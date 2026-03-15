#!/usr/bin/env python3
"""
Newsletter 草稿生成脚本

从最近 2 周的博客文章中提取内容，调用 LLM 生成 Newsletter 草稿，
通过 Buttondown API 创建草稿（不发送），等待人工确认后发送。

用法：
    python scripts/generate_newsletter.py              # 生成并创建草稿
    python scripts/generate_newsletter.py --dry-run    # 只生成内容，不调 Buttondown API
    python scripts/generate_newsletter.py --days 14    # 自定义时间范围（默认 14 天）
"""

import os
import re
import sys
import json
import yaml
import argparse
from datetime import datetime, timedelta
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_DIR / "scripts" / "blog_config.yaml"
BLOG_DIR = ROOT_DIR / "content" / "blog"
TEMPLATE_DIR = ROOT_DIR / "docs" / "newsletter-templates"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_recent_posts(days: int = 14) -> list[dict]:
    """获取最近 N 天内发布的博客文章"""
    cutoff = datetime.now() - timedelta(days=days)
    posts = []

    for filepath in sorted(BLOG_DIR.glob("*.mdx"), reverse=True):
        content = filepath.read_text(encoding="utf-8")
        match = re.match(r"^---\n(.*?)\n---\s*\n(.*)", content, re.DOTALL)
        if not match:
            continue
        try:
            fm = yaml.safe_load(match.group(1))
        except yaml.YAMLError:
            continue

        if not fm.get("published", False):
            continue

        date_str = str(fm.get("date", ""))
        try:
            post_date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            continue

        if post_date < cutoff:
            continue

        # 提取 slug
        slug = fm.get("slug") or filepath.stem
        slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", slug)

        posts.append({
            "title": fm.get("title", ""),
            "date": date_str,
            "excerpt": fm.get("excerpt", ""),
            "tags": fm.get("tags", []),
            "slug": slug,
            "body": match.group(2)[:1500],  # 取前 1500 字作为摘要
        })

    return posts


def get_newsletter_count() -> int:
    """获取已有 Newsletter 模板数量，用于编号"""
    TEMPLATE_DIR.mkdir(parents=True, exist_ok=True)
    return len(list(TEMPLATE_DIR.glob("*.md")))


def build_prompt(posts: list[dict], issue_number: int, config: dict) -> str:
    """构建 LLM prompt"""
    posts_text = ""
    for p in posts:
        posts_text += f"""
### {p['title']}
- 日期: {p['date']}
- 摘要: {p['excerpt']}
- 标签: {', '.join(p['tags'])}
- 链接: https://dingning.ai/blog/{p['slug']}
- 正文摘录: {p['body'][:800]}
---
"""

    return f"""你是 Ning Ding 的 Newsletter 写作助手。

## 作者信息
{config.get('author', {}).get('name', 'Ning Ding')}，{config.get('author', {}).get('role', '')}

## 写作风格
{config.get('author', {}).get('style_notes', '')}

## 任务
根据以下最近发布的博客文章，生成第 {issue_number} 期 Newsletter 草稿。

## 最近的博客文章
{posts_text}

## Newsletter 格式要求

1. **主题行**：一句话，有吸引力，不超过 30 字
2. **开头**：1-2 句话的问候或引入（简短，不啰嗦）
3. **精选文章**：挑选 2-3 篇最有价值的文章，每篇用 Markdown 链接 + 1-2 句话说清价值。不要简单复制 excerpt，要用 Newsletter 的口吻重新概括
4. **独立思考**：一段 Newsletter 独有的思考（3-5 句），不是博客内容的复制，而是跨文章的洞察或最近的感悟
5. **结尾**：简短收尾，署名 Ning Ding + 网站链接

## 输出格式

返回纯 JSON：
```json
{{
  "subject": "邮件主题行",
  "body": "完整的 Markdown 格式邮件正文"
}}
```

## 注意事项
- 不要编造任何文章中没有的内容
- 链接使用完整 URL（https://dingning.ai/blog/xxx）
- 语气：真实、直接、有温度，不要营销腔
- 正文控制在 300-500 字
"""


def call_llm(prompt: str, config: dict) -> str:
    """调用 LLM API"""
    llm_config = config.get("llm", {})
    provider = llm_config.get("provider", "deepseek")
    model = llm_config.get("model", "deepseek-chat")
    max_tokens = llm_config.get("max_tokens", 4096)

    if provider == "deepseek":
        api_key = os.environ.get("DEEPSEEK_API_KEY")
        base_url = llm_config.get("base_url", "https://api.deepseek.com")
        if not api_key:
            print("[ERROR] DEEPSEEK_API_KEY 未设置")
            sys.exit(1)
    elif provider == "anthropic":
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        base_url = "https://api.anthropic.com"
        if not api_key:
            print("[ERROR] ANTHROPIC_API_KEY 未设置")
            sys.exit(1)
    elif provider == "openai":
        api_key = os.environ.get("OPENAI_API_KEY")
        base_url = llm_config.get("base_url", "https://api.openai.com")
        if not api_key:
            print("[ERROR] OPENAI_API_KEY 未设置")
            sys.exit(1)
    else:
        print(f"[ERROR] 不支持的 provider: {provider}")
        sys.exit(1)

    import urllib.request

    if provider == "anthropic":
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        payload = {
            "model": model,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }
        url = f"{base_url}/v1/messages"
    else:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "max_tokens": max_tokens,
            "messages": [{"role": "user", "content": prompt}],
        }
        url = f"{base_url}/v1/chat/completions"

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    print(f"[INFO] 调用 {provider} API ({model})...")
    with urllib.request.urlopen(req, timeout=60) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    if provider == "anthropic":
        return result["content"][0]["text"]
    else:
        return result["choices"][0]["message"]["content"]


def parse_llm_response(text: str) -> dict:
    """从 LLM 响应中提取 JSON"""
    # 尝试提取 ```json ... ``` 块
    match = re.search(r"```json\s*\n?(.*?)\n?```", text, re.DOTALL)
    if match:
        return json.loads(match.group(1))
    # 尝试直接解析
    return json.loads(text)


def create_buttondown_draft(subject: str, body: str) -> dict | None:
    """通过 Buttondown API 创建邮件草稿"""
    api_key = os.environ.get("BUTTONDOWN_API_KEY")
    if not api_key:
        print("[WARN] BUTTONDOWN_API_KEY 未设置，跳过草稿创建")
        return None

    import urllib.request

    url = "https://api.buttondown.email/v1/emails"
    headers = {
        "Authorization": f"Token {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "subject": subject,
        "body": body,
        "status": "draft",  # 关键：创建草稿，不发送
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    print("[INFO] 创建 Buttondown 草稿...")
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    return result


def save_template(issue_number: int, subject: str, body: str):
    """保存 Newsletter 模板到本地"""
    TEMPLATE_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{issue_number:03d}-{datetime.now().strftime('%Y-%m-%d')}.md"
    filepath = TEMPLATE_DIR / filename

    content = f"""# Newsletter #{issue_number:03d}

**生成日期：** {datetime.now().strftime('%Y-%m-%d')}
**主题行：** {subject}
**状态：** 草稿（待人工确认后在 Buttondown 后台发送）

---

{body}
"""
    filepath.write_text(content, encoding="utf-8")
    print(f"[INFO] 模板已保存: {filepath}")
    return filepath


def main():
    parser = argparse.ArgumentParser(description="生成 Newsletter 草稿")
    parser.add_argument("--dry-run", action="store_true", help="只生成内容，不调 Buttondown API")
    parser.add_argument("--days", type=int, default=14, help="获取最近 N 天的文章（默认 14）")
    args = parser.parse_args()

    config = load_config()
    posts = get_recent_posts(args.days)

    if not posts:
        print(f"[INFO] 最近 {args.days} 天没有新文章，跳过生成")
        sys.exit(0)

    print(f"[INFO] 找到 {len(posts)} 篇最近 {args.days} 天的文章:")
    for p in posts:
        print(f"  - [{p['date']}] {p['title']}")

    issue_number = get_newsletter_count() + 1
    print(f"\n[INFO] 生成第 {issue_number} 期 Newsletter...")

    prompt = build_prompt(posts, issue_number, config)
    response = call_llm(prompt, config)
    result = parse_llm_response(response)

    subject = result["subject"]
    body = result["body"]

    print(f"\n{'='*60}")
    print(f"主题行: {subject}")
    print(f"{'='*60}")
    print(body)
    print(f"{'='*60}\n")

    # 保存模板
    save_template(issue_number, subject, body)

    # 创建 Buttondown 草稿
    if not args.dry_run:
        try:
            draft = create_buttondown_draft(subject, body)
            if draft:
                print(f"[OK] Buttondown 草稿已创建！")
                print(f"[OK] 请登录 https://buttondown.com/emails 预览并发送")
        except Exception as e:
            print(f"[WARN] Buttondown 草稿创建失败: {e}")
            print(f"[INFO] 模板已保存到本地，可手动粘贴到 Buttondown")
    else:
        print("[DRY-RUN] 跳过 Buttondown API 调用")

    print("\n[DONE] Newsletter 草稿生成完成")


if __name__ == "__main__":
    main()
