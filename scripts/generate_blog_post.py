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
import datetime as dt
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
    """读取所有 memory 文件（含 auto/ 子目录的自动采集素材）"""
    memories = []
    mem_path = ROOT_DIR / memory_dir
    if not mem_path.exists():
        print(f"[WARN] Memory 目录不存在: {mem_path}")
        return memories

    # 递归读取 .md 文件（包含 auto/ 子目录）
    for filepath in sorted(mem_path.rglob("*.md")):
        if filepath.name == "README.md":
            continue
        content = filepath.read_text(encoding="utf-8")
        # 用相对路径作为 project 标识，区分手写和自动素材
        rel = filepath.relative_to(mem_path)
        project = str(rel.with_suffix("")).replace(os.sep, "/")
        memories.append({
            "project": project,
            "content": content,
            "filepath": str(filepath),
        })
        print(f"[INFO] 已加载 memory: {rel}")

    return memories


def load_existing_posts(blog_dir: str) -> list[dict]:
    """读取已发布的博客文章元数据和正文关键词"""
    posts = []
    blog_path = ROOT_DIR / blog_dir
    if not blog_path.exists():
        return posts

    for filepath in sorted(blog_path.glob("*.mdx")):
        content = filepath.read_text(encoding="utf-8")
        # 解析 frontmatter
        match = re.match(r"^---\n(.*?)\n---\s*\n(.*)", content, re.DOTALL)
        if not match:
            continue
        try:
            frontmatter = yaml.safe_load(match.group(1))
            body = match.group(2)
            # 提取二级标题作为内容摘要
            headings = re.findall(r"^##\s+(.+)$", body, re.MULTILINE)
            posts.append({
                "title": frontmatter.get("title", ""),
                "date": frontmatter.get("date", ""),
                "tags": frontmatter.get("tags", []),
                "excerpt": frontmatter.get("excerpt", ""),
                "headings": headings,
                "filename": filepath.name,
            })
        except yaml.YAMLError:
            continue

    return posts


# 领域核心概念词表（用于主题去重）
_CONCEPT_TERMS = {
    # 项目/产品
    "异乡人才", "求职平台", "求职", "推荐引擎", "推荐系统", "岗位",
    "异乡点评", "点评平台", "顾问评分", "评分系统",
    "dingning", "个人网站", "个人品牌",
    "异乡缴费", "留学缴费", "缴费",
    # 技术
    "thompson", "sampling", "bayesian", "贝叶斯",
    "wilson", "pgvector", "redis", "fastapi", "nestjs",
    "nextjs", "next", "mdx", "vercel", "docker",
    "爬虫", "scrapy", "crawler",
    # 方法论
    "vibe", "coding", "gate", "review", "评审",
    "单元测试", "测试", "unit", "test",
    # 角色/身份
    "非程序员", "程序员", "副总裁",
    # 平台/工具
    "claude", "cursor", "obsidian", "github", "飞书",
    "digitalocean", "aliyun", "阿里云", "腾讯云",
    # 话题
    "留学生", "国际教育", "留学",
}

# 概念族：同一产品/领域的概念归为一族，族内任意 2 个命中即视为同一话题
# 注意：只放产品/领域专属词，不放通用词（如"从零"、"搭建"）
_CONCEPT_FAMILIES = {
    "异乡人才": {"异乡人才", "求职平台", "求职", "推荐引擎", "推荐系统", "岗位", "留学生"},
    "异乡点评": {"异乡点评", "点评平台", "顾问评分", "评分系统"},
    "个人品牌": {"dingning", "个人网站", "个人品牌"},
    "vibe_coding": {"vibe coding"},
}


def _extract_concepts(text: str) -> set[str]:
    """提取文本中的核心概念词"""
    text_lower = text.lower()
    found = set()
    for term in _CONCEPT_TERMS:
        if term.lower() in text_lower:
            found.add(term.lower())
    # 合并复合概念（避免拆分导致误匹配）
    if "vibe" in found and "coding" in found:
        found.discard("vibe")
        found.discard("coding")
        found.add("vibe coding")
    if "gate" in found and "review" in found:
        found.discard("gate")
        found.discard("review")
        found.add("gate review")
    if "非程序员" in found and "程序员" in found:
        found.discard("程序员")  # 保留更具体的"非程序员"
    if "单元测试" in found and "测试" in found:
        found.discard("测试")  # 保留更具体的"单元测试"
    if "求职平台" in found and "求职" in found:
        found.discard("求职")  # 保留更具体的"求职平台"
    # 额外提取显著数字（3位以上，可能是项目指标）
    for num in re.findall(r"\d{3,}", text):
        found.add(num)
    return found


def _check_family_overlap(new_concepts: set[str], post_concepts: set[str]) -> tuple[bool, str]:
    """检查两组概念是否落在同一概念族内（表明讨论同一产品/领域）"""
    for family_name, family_terms in _CONCEPT_FAMILIES.items():
        new_in_family = new_concepts & family_terms
        post_in_family = post_concepts & family_terms
        # 新主题和已有文章各有 2+ 个概念命中同一族 → 高度相关
        if len(new_in_family) >= 2 and len(post_in_family) >= 2:
            return True, (
                f"概念族「{family_name}」重叠 "
                f"(新: {', '.join(sorted(new_in_family))}; "
                f"旧: {', '.join(sorted(post_in_family))})"
            )
    return False, ""


def check_topic_similarity(new_title: str, new_tags: list[str], existing_posts: list[dict]) -> tuple[bool, str]:
    """
    检查新主题与已有文章的相似度。
    返回 (is_duplicate, reason)。
    """
    new_text = new_title + " " + " ".join(new_tags)
    new_concepts = _extract_concepts(new_text)

    if not new_concepts:
        return False, ""

    for post in existing_posts:
        # 构建已有文章的概念集合（标题 + 标签 + 章节标题 + 摘要）
        post_text = post["title"] + " " + " ".join(post.get("tags", []))
        post_text += " " + " ".join(post.get("headings", []))
        post_text += " " + post.get("excerpt", "")
        post_concepts = _extract_concepts(post_text)

        if not post_concepts:
            continue

        # 概念重叠度
        overlap = new_concepts & post_concepts
        if not overlap:
            continue

        # 概念族检查：两篇文章在同一产品/领域内各有 2+ 概念 → 重复
        is_family_dup, family_reason = _check_family_overlap(new_concepts, post_concepts)
        if is_family_dup:
            return True, (
                f"与已有文章《{post['title']}》主题重复 "
                f"({family_reason})"
            )

        # 新主题的概念被已有文章覆盖的比例
        coverage = len(overlap) / len(new_concepts)
        # 双向 Jaccard
        jaccard = len(overlap) / len(new_concepts | post_concepts)

        # 判断规则：
        # - 至少有 2 个概念词重叠（避免单词碰巧匹配）
        # - 且新主题 60%+ 的核心概念已被某篇文章覆盖 → 重复
        # - 或者 Jaccard > 50%（双方高度重叠）→ 重复
        if len(overlap) < 2:
            continue
        if coverage >= 0.6 or jaccard >= 0.5:
            return True, (
                f"与已有文章《{post['title']}》主题重复 "
                f"(概念覆盖={coverage:.0%}, Jaccard={jaccard:.0%}, "
                f"共有概念: {', '.join(sorted(overlap))})"
            )

    return False, ""


def build_topic_selection_prompt(
    memories: list[dict],
    existing_posts: list[dict],
    config: dict,
) -> str:
    """构建主题选择 prompt"""
    # 已有文章列表（含 excerpt 和 tags，帮助 LLM 判断语义重复）
    existing_titles = "\n".join(
        f"- [{p['date']}] {p['title']}  \n  摘要: {p.get('excerpt', '')[:80]}  \n  标签: {', '.join(p.get('tags', []))}"
        for p in existing_posts
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

    return f"""你是 Ning Ding 的写作助手。Ning Ding 是异乡好居副总裁、dingning.ai 主理人、国际教育 AI 布道者。
注意：Ning Ding 的称谓是「主理人」，不要使用「创始人」。

## 你的任务
从以下项目 memory 中，选择一个**尚未写过**的、有价值的主题，用于今天的博客文章。

## 已发布的文章（避免重复）
{existing_titles}

## 项目 Memory（灵感来源）
{memory_summaries}

## 可选主题方向
{topic_dirs}

## 要求
1. **严格去重**：新主题不能与已有文章在主题、角度、核心论点上重复。即使换了标题措辞，如果讲的是同一件事（如"构建求职平台的经历"已经写过，就不能再写"如何用 AI 搭建岗位平台"），也算重复
2. 主题要基于 memory 中的**真实案例**，不能凭空编造
3. 标题要有吸引力，适合公众号传播
4. 优先选择已有文章**未覆盖的角度或子主题**
5. 返回 JSON 格式：

```json
{{
  "title": "文章标题",
  "slug": "english-slug-for-url",
  "topic_category": "主题分类",
  "tags": ["标签1", "标签2", "标签3"],
  "outline": "简要大纲（3-5 个要点）",
  "source_projects": ["用到的项目名"],
  "angle": "切入角度说明"
}}
```

**slug 要求**：必须是英文小写、用连字符分隔的 URL 友好字符串（如 "recommendation-engine-architecture"）。这是文件名的一部分，禁止中文。

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

## 今天的日期
{dt.date.today().isoformat()}

## 要求
1. 字数 {min_words}-{max_words} 字
2. 使用 Markdown 格式（二级标题 ##、三级标题 ###）
3. 基于 memory 中的真实案例，不编造数据
4. **时间线必须真实**：严格按照 memory 中「项目时间线」的日期来叙述。异乡人才项目始于 2026 年 2 月，dingning.ai 始于 2026 年 3 月，不要编造更早的时间（如"去年"、"去年夏天"、"几个月前"等）。如果不确定具体时间，宁可不提，也不要虚构
5. **称谓**：Ning Ding 的身份是「主理人」，不要使用「创始人」「联合创始人」等称谓
6. 第一人称叙述，口吻真诚务实
7. 适合在公众号和个人博客同步发布
8. 不要在文章开头写标题（标题在 frontmatter 中）
9. 文末可加一句点睛之笔，用斜体

只返回文章正文 Markdown 内容，不要 frontmatter，不要标题。"""


_usage_log: list[dict] = []

# Provider 环境变量映射
_PROVIDER_ENV_KEYS = {
    "anthropic": "ANTHROPIC_API_KEY",
    "deepseek": "DEEPSEEK_API_KEY",
    "openai": "OPENAI_API_KEY",
}

# Provider 默认 base_url
_PROVIDER_BASE_URLS = {
    "deepseek": "https://api.deepseek.com",
    "openai": "https://api.openai.com/v1",
}


def _call_anthropic(prompt: str, config: dict) -> tuple[str, dict]:
    """调用 Anthropic Claude API"""
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
    model = config.get("llm", config.get("claude", {})).get("model", "claude-sonnet-4-6")
    max_tokens = config.get("llm", config.get("claude", {})).get("max_tokens", 4096)

    message = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )

    usage = {
        "model": message.model,
        "input_tokens": message.usage.input_tokens,
        "output_tokens": message.usage.output_tokens,
    }
    return message.content[0].text, usage


def _call_openai_compatible(prompt: str, config: dict) -> tuple[str, dict]:
    """调用 OpenAI 兼容 API（DeepSeek / OpenAI / 其他）"""
    try:
        from openai import OpenAI
    except ImportError:
        print("[ERROR] 请安装 openai SDK: pip install openai")
        sys.exit(1)

    llm_config = config.get("llm", config.get("claude", {}))
    provider = llm_config.get("provider", "anthropic")
    env_key = _PROVIDER_ENV_KEYS.get(provider, f"{provider.upper()}_API_KEY")
    api_key = os.environ.get(env_key)
    if not api_key:
        print(f"[ERROR] 请设置 {env_key} 环境变量")
        sys.exit(1)

    base_url = llm_config.get("base_url", _PROVIDER_BASE_URLS.get(provider))
    model = llm_config.get("model", "deepseek-chat")
    max_tokens = llm_config.get("max_tokens", 4096)

    client = OpenAI(api_key=api_key, base_url=base_url)
    response = client.chat.completions.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )

    usage = {
        "model": response.model,
        "input_tokens": response.usage.prompt_tokens,
        "output_tokens": response.usage.completion_tokens,
    }
    return response.choices[0].message.content, usage


def call_llm_api(prompt: str, config: dict) -> str:
    """统一 LLM 调用入口，根据 provider 分发"""
    llm_config = config.get("llm", config.get("claude", {}))
    provider = llm_config.get("provider", "anthropic")
    model = llm_config.get("model", "unknown")

    print(f"[INFO] 调用 LLM API (provider={provider}, model={model})...")

    if provider == "anthropic":
        text, usage = _call_anthropic(prompt, config)
    else:
        text, usage = _call_openai_compatible(prompt, config)

    _usage_log.append(usage)
    print(f"[INFO] Token 用量: input={usage['input_tokens']}, output={usage['output_tokens']}")

    return text


# 保持向后兼容
call_claude_api = call_llm_api


def get_usage_summary() -> dict:
    """汇总所有 API 调用的 token 用量"""
    total_input = sum(u["input_tokens"] for u in _usage_log)
    total_output = sum(u["output_tokens"] for u in _usage_log)
    return {
        "calls": len(_usage_log),
        "input_tokens": total_input,
        "output_tokens": total_output,
        "total_tokens": total_input + total_output,
        "details": _usage_log,
    }


def save_usage_log(filepath: str, topic_title: str):
    """将 token 用量追加到 usage log 文件"""
    summary = get_usage_summary()
    log_path = ROOT_DIR / "logs" / "usage.jsonl"
    log_path.parent.mkdir(parents=True, exist_ok=True)

    entry = {
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "title": topic_title,
        "filepath": filepath,
        **summary,
    }
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    print(f"[INFO] Token 用量已记录: {log_path}")


def select_topic(memories: list[dict], existing_posts: list[dict], config: dict, specified_topic: str | None = None) -> dict:
    """选择今日主题（含相似度校验和重试）"""
    if specified_topic:
        return {
            "title": specified_topic,
            "topic_category": "",
            "tags": ["AI"],
            "outline": "",
            "source_projects": [m["project"] for m in memories],
            "angle": "用户指定主题",
        }

    max_retries = 8
    rejected_titles: list[str] = []
    rejected_reasons: list[str] = []

    for attempt in range(1, max_retries + 1):
        prompt = build_topic_selection_prompt(memories, existing_posts, config)
        if rejected_titles:
            rejection_details = "\n".join(
                f"- 「{t}」→ 被拒原因: {r}" for t, r in zip(rejected_titles, rejected_reasons)
            )
            prompt += (
                f"\n\n## 已被拒绝的主题（不要再选类似的！）\n{rejection_details}\n\n"
                "**重要：请选择完全不同方向的主题，不要围绕「非程序员编程」、「求职平台搭建」等已有角度。"
                "尝试技术细节、运维经验、工具对比、团队管理等新方向。**"
            )

        response = call_llm_api(prompt, config)

        # 提取 JSON
        json_match = re.search(r"\{[\s\S]*\}", response)
        if not json_match:
            print(f"[ERROR] 无法解析主题选择结果:\n{response}")
            sys.exit(1)

        topic = json.loads(json_match.group())

        # 程序化相似度校验
        is_dup, reason = check_topic_similarity(
            topic.get("title", ""),
            topic.get("tags", []),
            existing_posts,
        )

        if not is_dup:
            if attempt > 1:
                print(f"[INFO] 第 {attempt} 次选题通过去重校验")
            return topic

        print(f"[WARN] 第 {attempt}/{max_retries} 次选题被拒: {reason}")
        rejected_titles.append(topic["title"])
        rejected_reasons.append(reason)

    print(f"[ERROR] 连续 {max_retries} 次选题均与已有文章重复，放弃生成")
    print(f"[INFO] 被拒主题: {rejected_titles}")
    sys.exit(1)


def generate_article(topic: dict, memories: list[dict], config: dict) -> str:
    """生成文章内容"""
    prompt = build_article_prompt(topic, memories, config)
    return call_claude_api(prompt, config)


def create_mdx_file(topic: dict, content: str, output_dir: str) -> str:
    """生成 MDX 文件"""
    today = datetime.now().strftime("%Y-%m-%d")
    # 优先使用 LLM 返回的英文 slug
    slug = topic.get("slug", "")
    if slug:
        # 清洗：只保留 ASCII 字母、数字、连字符
        slug = re.sub(r"[^a-zA-Z0-9-]", "", slug).strip("-").lower()
    if not slug:
        # 回退：从标题提取 ASCII 部分
        slug = re.sub(r"[^a-zA-Z0-9\s-]", "", topic["title"])
        slug = re.sub(r"[\s]+", "-", slug).strip("-").lower()
    if not slug:
        slug = f"auto-{today}"

    filename = f"{today}-{slug}.mdx"
    filepath = ROOT_DIR / output_dir / filename

    # 处理文件名冲突：追加数字后缀
    counter = 1
    while filepath.exists():
        filename = f"{today}-{slug}-{counter}.mdx"
        filepath = ROOT_DIR / output_dir / filename
        counter += 1

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
slug: "{slug}"
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

    # 保存 token 用量日志
    save_usage_log(filepath, topic['title'])
    usage = get_usage_summary()

    print(f"\n[DONE] 文章生成完成!")
    print(f"  文件: {filepath}")
    print(f"  标题: {topic['title']}")
    print(f"  API 调用: {usage['calls']} 次")
    print(f"  Token: {usage['input_tokens']} input + {usage['output_tokens']} output = {usage['total_tokens']} total")

    # 输出供 GitHub Actions 使用
    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a") as f:
            f.write(f"filepath={filepath}\n")
            f.write(f"title={topic['title']}\n")
            f.write(f"filename={Path(filepath).name}\n")
            f.write(f"api_calls={usage['calls']}\n")
            f.write(f"input_tokens={usage['input_tokens']}\n")
            f.write(f"output_tokens={usage['output_tokens']}\n")
            f.write(f"total_tokens={usage['total_tokens']}\n")


if __name__ == "__main__":
    main()
