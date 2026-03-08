#!/usr/bin/env python3
"""
自动博客生成脚本

从 memories/ 目录读取 Claude Code 项目 memory，
选择一个未写过的主题，调用 Claude API 生成文章，
输出为 MDX 格式的博客文件。

用法：
    python scripts/generate_blog_post.py
    python scripts/generate_blog_post.py --dry-run  # 只选题不生成
    python scripts/generate_blog_post.py --topic "指定主题"
"""

import os
import sys
import re
import json
import yaml
import glob
import random
import argparse
from datetime import datetime
from pathlib import Path

# 项目根目录
ROOT_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_DIR / "scripts" / "blog_config.yaml"


def load_config() -> dict:
    """加载配置文件"""
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_memories(memory_dir: str) -> list[dict]:
    """读取所有 memory 文件"""
    memories = []
    mem_path = ROOT_DIR / memory_dir
    if not mem_path.exists():
        print(f"[WARN] Memory 目录不存在: {mem_path}")
        return memories

    for filepath in sorted(mem_path.glob("*.md")):
        if filepath.name == "README.md":
            continue
        content = filepath.read_text(encoding="utf-8")
        memories.append({
            "project": filepath.stem,
            "content": content,
            "filepath": str(filepath),
        })
        print(f"[INFO] 已加载 memory: {filepath.name}")

    return memories


def load_existing_posts(blog_dir: str) -> list[dict]:
    """读取已发布的博客文章元数据"""
    posts = []
    blog_path = ROOT_DIR / blog_dir
    if not blog_path.exists():
        return posts

    for filepath in sorted(blog_path.glob("*.mdx")):
        content = filepath.read_text(encoding="utf-8")
        # 解析 frontmatter
        match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
        if not match:
            continue
        try:
            frontmatter = yaml.safe_load(match.group(1))
            posts.append({
                "title": frontmatter.get("title", ""),
                "date": frontmatter.get("date", ""),
                "tags": frontmatter.get("tags", []),
                "excerpt": frontmatter.get("excerpt", ""),
                "filename": filepath.name,
            })
        except yaml.YAMLError:
            continue

    return posts


def build_topic_selection_prompt(
    memories: list[dict],
    existing_posts: list[dict],
    config: dict,
) -> str:
    """构建主题选择 prompt"""
    # 已有文章列表
    existing_titles = "\n".join(
        f"- [{p['date']}] {p['title']}" for p in existing_posts
    )

    # Memory 摘要
    memory_summaries = "\n\n".join(
        f"### 项目: {m['project']}\n{m['content'][:2000]}"
        for m in memories
    )

    # 可选主题方向
    topic_dirs = "\n".join(
        f"- {t['name']}: {t['description']}"
        for t in config.get("topic_categories", [])
    )

    return f"""你是 Ning Ding 的写作助手。Ning Ding 是异乡好居副总裁、国际教育 AI 布道者。

## 你的任务
从以下项目 memory 中，选择一个**尚未写过**的、有价值的主题，用于今天的博客文章。

## 已发布的文章（避免重复）
{existing_titles}

## 项目 Memory（灵感来源）
{memory_summaries}

## 可选主题方向
{topic_dirs}

## 要求
1. 选择一个与已有文章不重复的、具体的主题
2. 主题要基于 memory 中的**真实案例**，不能凭空编造
3. 标题要有吸引力，适合公众号传播
4. 返回 JSON 格式：

```json
{{
  "title": "文章标题",
  "topic_category": "主题分类",
  "tags": ["标签1", "标签2", "标签3"],
  "outline": "简要大纲（3-5 个要点）",
  "source_projects": ["用到的项目名"],
  "angle": "切入角度说明"
}}
```

只返回 JSON，不要其他内容。"""


def build_article_prompt(
    topic: dict,
    memories: list[dict],
    config: dict,
) -> str:
    """构建文章生成 prompt"""
    style = config.get("author", {}).get("style_notes", "")
    min_words = config.get("generation", {}).get("min_words", 1500)
    max_words = config.get("generation", {}).get("max_words", 3000)

    # 选取相关项目的 memory
    source_projects = topic.get("source_projects", [])
    relevant_memories = "\n\n".join(
        f"### 项目: {m['project']}\n{m['content']}"
        for m in memories
        if m["project"] in source_projects or not source_projects
    )

    return f"""你是 Ning Ding 的写作助手。请根据以下信息，撰写一篇博客文章。

## 文章信息
- 标题：{topic['title']}
- 分类：{topic.get('topic_category', '')}
- 大纲：{topic.get('outline', '')}
- 切入角度：{topic.get('angle', '')}

## 写作风格
{style}

## 参考素材（来自真实项目 memory）
{relevant_memories}

## 要求
1. 字数 {min_words}-{max_words} 字
2. 使用 Markdown 格式（二级标题 ##、三级标题 ###）
3. 基于 memory 中的真实案例，不编造数据
4. 第一人称叙述，口吻真诚务实
5. 适合在公众号和个人博客同步发布
6. 不要在文章开头写标题（标题在 frontmatter 中）
7. 文末可加一句点睛之笔，用斜体

只返回文章正文 Markdown 内容，不要 frontmatter，不要标题。"""


def call_claude_api(prompt: str, config: dict) -> str:
    """调用 Claude API"""
    try:
        import anthropic
    except ImportError:
        print("[ERROR] 请安装 anthropic SDK: pip install anthropic")
        sys.exit(1)

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("[ERROR] 请设置 ANTHROPIC_API_KEY 环境变量")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    model = config.get("claude", {}).get("model", "claude-sonnet-4-6")
    max_tokens = config.get("claude", {}).get("max_tokens", 4096)

    print(f"[INFO] 调用 Claude API (model={model})...")
    message = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text


def select_topic(memories: list[dict], existing_posts: list[dict], config: dict, specified_topic: str | None = None) -> dict:
    """选择今日主题"""
    if specified_topic:
        return {
            "title": specified_topic,
            "topic_category": "",
            "tags": ["AI"],
            "outline": "",
            "source_projects": [m["project"] for m in memories],
            "angle": "用户指定主题",
        }

    prompt = build_topic_selection_prompt(memories, existing_posts, config)
    response = call_claude_api(prompt, config)

    # 提取 JSON
    json_match = re.search(r"\{[\s\S]*\}", response)
    if not json_match:
        print(f"[ERROR] 无法解析主题选择结果:\n{response}")
        sys.exit(1)

    return json.loads(json_match.group())


def generate_article(topic: dict, memories: list[dict], config: dict) -> str:
    """生成文章内容"""
    prompt = build_article_prompt(topic, memories, config)
    return call_claude_api(prompt, config)


def create_mdx_file(topic: dict, content: str, output_dir: str) -> str:
    """生成 MDX 文件"""
    today = datetime.now().strftime("%Y-%m-%d")
    # 生成 slug：取标题前几个关键词拼音或英文
    slug = re.sub(r"[^\w\s-]", "", topic["title"])
    slug = re.sub(r"[\s]+", "-", slug).strip("-").lower()
    # 如果 slug 全是中文字符，用日期 + auto
    if not re.search(r"[a-z0-9]", slug):
        slug = f"auto-{today}"

    filename = f"{today}-{slug}.mdx"
    filepath = ROOT_DIR / output_dir / filename

    # 构建 frontmatter
    tags_str = json.dumps(topic.get("tags", ["AI"]), ensure_ascii=False)
    excerpt = content[:100].replace('"', '\\"').replace("\n", " ").strip()
    # 取第一段作为 excerpt
    first_para = ""
    for line in content.split("\n"):
        line = line.strip()
        if line and not line.startswith("#"):
            first_para = line[:120]
            break
    if first_para:
        excerpt = first_para

    mdx_content = f"""---
title: "{topic['title']}"
date: "{today}"
excerpt: "{excerpt}"
tags: {tags_str}
published: true
featured: false
---

{content}
"""

    filepath.write_text(mdx_content, encoding="utf-8")
    print(f"[INFO] 文章已生成: {filepath}")
    return str(filepath)


def main():
    parser = argparse.ArgumentParser(description="自动博客生成脚本")
    parser.add_argument("--dry-run", action="store_true", help="只选题不生成文章")
    parser.add_argument("--topic", type=str, help="指定文章主题")
    args = parser.parse_args()

    # 加载配置
    config = load_config()
    gen_config = config.get("generation", {})

    # 加载 memories
    memories = load_memories(gen_config.get("memory_dir", "memories"))
    if not memories:
        print("[ERROR] 没有找到任何 memory 文件，请先在 memories/ 目录中添加项目 CLAUDE.md")
        sys.exit(1)

    # 加载已有文章
    existing_posts = load_existing_posts(gen_config.get("blog_dir", "content/blog"))
    print(f"[INFO] 已有 {len(existing_posts)} 篇文章，{len(memories)} 个项目 memory")

    # 选题
    print("[INFO] 正在选择今日主题...")
    topic = select_topic(memories, existing_posts, config, args.topic)
    print(f"[INFO] 今日主题: {topic['title']}")
    print(f"[INFO] 分类: {topic.get('topic_category', 'N/A')}")
    print(f"[INFO] 标签: {topic.get('tags', [])}")
    print(f"[INFO] 大纲: {topic.get('outline', 'N/A')}")

    if args.dry_run:
        print("\n[DRY-RUN] 以上为选题结果，未生成文章。")
        # 输出 topic JSON 供后续使用
        print(json.dumps(topic, ensure_ascii=False, indent=2))
        return

    # 生成文章
    print("[INFO] 正在生成文章...")
    content = generate_article(topic, memories, config)

    # 写入 MDX 文件
    output_dir = gen_config.get("output_dir", "content/blog")
    filepath = create_mdx_file(topic, content, output_dir)

    print(f"\n[DONE] 文章生成完成!")
    print(f"  文件: {filepath}")
    print(f"  标题: {topic['title']}")

    # 输出文件路径供 GitHub Actions 使用
    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a") as f:
            f.write(f"filepath={filepath}\n")
            f.write(f"title={topic['title']}\n")
            f.write(f"filename={Path(filepath).name}\n")


if __name__ == "__main__":
    main()
