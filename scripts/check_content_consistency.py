#!/usr/bin/env python3
"""
内容一致性检查器

扫描所有已发布博客文章，提取事实性声明（数字、日期、属性描述），
检测新增/修改文章与已有内容之间是否存在事实冲突。

用法:
  # 检查所有文章的相互一致性
  python scripts/check_content_consistency.py

  # 只检查指定文件与已有文章的一致性
  python scripts/check_content_consistency.py --target content/blog/new-post.mdx

  # CI 模式：只检查本次 PR 变更的博客文件
  python scripts/check_content_consistency.py --diff-base origin/main
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import yaml

ROOT_DIR = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT_DIR / "content" / "blog"
FACTS_DB = ROOT_DIR / "content" / "facts.json"
CONFIG_PATH = ROOT_DIR / "scripts" / "blog_config.yaml"

# --- 事实提取（正则） ---

# 匹配数字 + 中文/英文单位
NUM_PATTERN = re.compile(
    r"(\d[\d,]*\.?\d*)\s*[\+]?\s*"
    r"(行代码|行|个单元测试|个测试|个岗位|个活跃岗位|个职位|"
    r"个产品|个项目|个仓库|个文章|篇文章|篇博客|个 commit|个提交|"
    r"万|亿|美元|元|秒|毫秒|ms|分钟|小时|天|周|月|年|"
    r"lines?|tests?|jobs?|positions?|repos?|posts?|commits?|"
    r"pages?|components?|files?|users?|articles?)",
    re.IGNORECASE,
)

# 匹配年龄/出生年份
AGE_PATTERN = re.compile(r"(\d{2,3})\s*岁")
YEAR_PATTERN = re.compile(r"(19|20)\d{2}\s*年")

# 匹配角色/头衔声明
ROLE_PATTERN = re.compile(
    r"(我是|身为|作为|担任|职位|角色|title)\s*[:：]?\s*(.{2,30}?)(?:[，。,.\n])"
)


def load_config():
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH) as f:
            return yaml.safe_load(f)
    return {}


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """解析 MDX frontmatter 和正文"""
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)", text, re.DOTALL)
    if not m:
        return {}, text
    try:
        meta = yaml.safe_load(m.group(1))
    except yaml.YAMLError:
        meta = {}
    return meta or {}, m.group(2)


def extract_facts(text: str, source: str) -> list[dict]:
    """从文本中提取事实性声明"""
    facts = []

    for m in NUM_PATTERN.finditer(text):
        number = m.group(1).replace(",", "")
        unit = m.group(2).strip()
        context_start = max(0, m.start() - 40)
        context_end = min(len(text), m.end() + 40)
        context = text[context_start:context_end].replace("\n", " ").strip()
        facts.append(
            {
                "type": "number",
                "value": number,
                "unit": unit,
                "context": context,
                "source": source,
            }
        )

    for m in AGE_PATTERN.finditer(text):
        context_start = max(0, m.start() - 40)
        context_end = min(len(text), m.end() + 40)
        context = text[context_start:context_end].replace("\n", " ").strip()
        facts.append(
            {
                "type": "age",
                "value": m.group(1),
                "context": context,
                "source": source,
            }
        )

    for m in ROLE_PATTERN.finditer(text):
        facts.append(
            {
                "type": "role",
                "value": m.group(2).strip(),
                "context": m.group(0).strip(),
                "source": source,
            }
        )

    return facts


def load_all_posts() -> dict[str, tuple[dict, str]]:
    """加载所有已发布博客文章"""
    posts = {}
    for f in sorted(BLOG_DIR.glob("*.mdx")):
        raw = f.read_text(encoding="utf-8")
        meta, content = parse_frontmatter(raw)
        if meta.get("published", True):
            posts[f.name] = (meta, content)
    return posts


def get_changed_blog_files(base: str) -> list[str]:
    """获取相对于 base 分支变更的博客文件"""
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", "--diff-filter=ACMR", base, "HEAD"],
            capture_output=True,
            text=True,
            cwd=ROOT_DIR,
        )
        changed = [
            line.strip()
            for line in result.stdout.strip().split("\n")
            if line.strip().startswith("content/blog/") and line.strip().endswith(".mdx")
        ]
        return changed
    except Exception:
        return []


def call_llm_check(new_facts: list[dict], existing_facts: list[dict], new_content: str, config: dict) -> dict:
    """调用 LLM 进行深层语义一致性检查"""
    provider = config.get("llm", {}).get("provider", "anthropic")

    existing_summary = "\n".join(
        f"- [{f['source']}] {f['type']}: {f.get('value', '')} — {f['context']}"
        for f in existing_facts[:100]  # 限制长度
    )
    new_summary = "\n".join(
        f"- {f['type']}: {f.get('value', '')} — {f['context']}" for f in new_facts
    )

    prompt = f"""你是一个内容一致性审查员。请检查新文章中的事实性声明是否与已有文章存在冲突。

## 已有文章的事实性声明
{existing_summary}

## 新文章提取的事实性声明
{new_summary}

## 新文章全文（前 3000 字）
{new_content[:3000]}

## 检查规则
1. 同一个数据指标（如代码行数、测试数量、岗位数量）在不同文章中的数字应该一致，或者新文章的数字应该合理增长（不应该变小）
2. 人物属性（年龄、职位、角色）不应冲突
3. 时间线应该自洽（不能说 2024 年开始做的事情在 2023 年已经有成果）
4. 技术栈描述应该一致（不能一篇说用 PostgreSQL，另一篇说用 MySQL）
5. 如果数字有合理的时间推移变化（如岗位数增长），这不算冲突

## 输出格式（严格 JSON）
{{
  "pass": true/false,
  "conflicts": [
    {{
      "severity": "error" 或 "warning",
      "field": "冲突字段",
      "existing": "已有文章的表述",
      "existing_source": "来源文件名",
      "new": "新文章的表述",
      "explanation": "简要说明为什么冲突"
    }}
  ],
  "summary": "一句话总结检查结果"
}}

只输出 JSON，不要其他内容。如果没有冲突，conflicts 为空数组，pass 为 true。"""

    if provider == "anthropic":
        from anthropic import Anthropic

        client = Anthropic()
        resp = client.messages.create(
            model=config.get("llm", {}).get("model", "claude-sonnet-4-6"),
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        )
        text = resp.content[0].text
    elif provider == "deepseek":
        from openai import OpenAI

        client = OpenAI(
            api_key=os.environ.get("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com",
        )
        resp = client.chat.completions.create(
            model=config.get("llm", {}).get("model", "deepseek-chat"),
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        )
        text = resp.choices[0].message.content
    elif provider == "openai":
        from openai import OpenAI

        client = OpenAI()
        resp = client.chat.completions.create(
            model=config.get("llm", {}).get("model", "gpt-4o"),
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        )
        text = resp.choices[0].message.content
    else:
        return {"pass": True, "conflicts": [], "summary": f"未知 provider: {provider}，跳过 LLM 检查"}

    # 解析 JSON（容忍 markdown 代码块）
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*$", "", text)
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return {"pass": False, "conflicts": [], "summary": f"LLM 返回格式异常: {text[:200]}"}


def check_consistency(target_files: list[str] | None = None) -> bool:
    """
    执行一致性检查。
    target_files: 要检查的文件列表（相对路径）。None 表示全量检查。
    返回 True 表示通过，False 表示存在冲突。
    """
    posts = load_all_posts()
    config = load_config()

    if not posts:
        print("✅ 没有已发布的博客文章，跳过检查")
        return True

    # 提取所有已有文章的事实
    all_facts: dict[str, list[dict]] = {}
    for filename, (meta, content) in posts.items():
        all_facts[filename] = extract_facts(content, filename)

    # 确定要检查的目标文件
    if target_files:
        targets = [Path(f).name for f in target_files if Path(f).name in posts]
    else:
        targets = list(posts.keys())

    if not targets:
        print("✅ 没有需要检查的博客文件")
        return True

    print(f"📋 检查 {len(targets)} 篇文章，已有 {len(posts)} 篇文章的事实库\n")

    has_error = False
    has_llm_key = any(
        os.environ.get(k)
        for k in ("ANTHROPIC_API_KEY", "DEEPSEEK_API_KEY", "OPENAI_API_KEY")
    )

    for target in targets:
        meta, content = posts[target]
        new_facts = all_facts[target]
        existing_facts = []
        for fname, facts in all_facts.items():
            if fname != target:
                existing_facts.extend(facts)

        print(f"🔍 检查: {meta.get('title', target)}")
        print(f"   提取到 {len(new_facts)} 条事实声明")

        if not existing_facts:
            print("   ✅ 无其他文章可对比，跳过\n")
            continue

        # 第一层：正则规则检查（快速、免费）
        rule_conflicts = rule_based_check(new_facts, existing_facts)
        if rule_conflicts:
            for c in rule_conflicts:
                severity_icon = "❌" if c["severity"] == "error" else "⚠️"
                print(f"   {severity_icon} {c['field']}: {c['explanation']}")
                print(f"      已有: {c['existing']} ({c['existing_source']})")
                print(f"      新文: {c['new']}")
            if any(c["severity"] == "error" for c in rule_conflicts):
                has_error = True

        # 第二层：LLM 语义检查（深层、需 API key）
        if has_llm_key and existing_facts:
            print("   🤖 LLM 语义一致性检查...")
            try:
                result = call_llm_check(new_facts, existing_facts, content, config)
                if not result.get("pass", True):
                    for c in result.get("conflicts", []):
                        severity_icon = "❌" if c["severity"] == "error" else "⚠️"
                        print(f"   {severity_icon} [{c['field']}] {c['explanation']}")
                        print(f"      已有: {c['existing']} ({c.get('existing_source', '?')})")
                        print(f"      新文: {c['new']}")
                    if any(c["severity"] == "error" for c in result.get("conflicts", [])):
                        has_error = True
                else:
                    print(f"   ✅ {result.get('summary', '无冲突')}")
            except Exception as e:
                print(f"   ⚠️ LLM 检查失败（非阻塞）: {e}")
        elif not has_llm_key:
            print("   ⏭️ 无 LLM API key，跳过语义检查（仅规则检查）")

        if not rule_conflicts:
            print("   ✅ 规则检查通过")
        print()

    if has_error:
        print("❌ 一致性检查未通过，存在事实冲突")
        return False
    else:
        print("✅ 一致性检查全部通过")
        return True


def context_similarity(ctx1: str, ctx2: str) -> float:
    """简单的上下文相似度：基于共有关键词的 Jaccard 系数"""
    # 提取中英文词汇
    words1 = set(re.findall(r"[\u4e00-\u9fff]+|[a-zA-Z]+", ctx1.lower()))
    words2 = set(re.findall(r"[\u4e00-\u9fff]+|[a-zA-Z]+", ctx2.lower()))
    if not words1 or not words2:
        return 0.0
    return len(words1 & words2) / len(words1 | words2)


# 通用度量单位（不同文章中很可能指不同事物）不做跨文章比较
GENERIC_UNITS = {
    "万", "亿", "元", "美元", "秒", "毫秒", "ms", "分钟", "小时",
    "天", "周", "月", "年", "pages", "files", "users",
}


def rule_based_check(new_facts: list[dict], existing_facts: list[dict]) -> list[dict]:
    """基于规则的快速一致性检查，只在语义上下文相似时比较数字"""
    conflicts = []

    # 归类已有事实：按 (type, unit) 分组
    existing_by_key: dict[str, list[dict]] = {}
    for f in existing_facts:
        if f["type"] == "number":
            key = f"number:{f['unit'].lower()}"
        elif f["type"] == "age":
            key = "age"
        elif f["type"] == "role":
            key = "role"
        else:
            continue
        existing_by_key.setdefault(key, []).append(f)

    for nf in new_facts:
        if nf["type"] == "number":
            unit_lower = nf["unit"].lower()
            key = f"number:{unit_lower}"
            if key not in existing_by_key:
                continue
            # 跳过通用单位的跨文章比较（太容易误报）
            if nf["unit"] in GENERIC_UNITS:
                continue
            for ef in existing_by_key[key]:
                # 只在上下文相似度 > 0.3 时才比较（说的是同一件事）
                sim = context_similarity(nf["context"], ef["context"])
                if sim < 0.3:
                    continue
                try:
                    new_val = float(nf["value"])
                    old_val = float(ef["value"])
                except ValueError:
                    continue
                if new_val == old_val:
                    continue
                # 数字减少超过 30% 且不是小数字（<100），标记为 warning
                if old_val > 100 and new_val < old_val * 0.7:
                    conflicts.append(
                        {
                            "severity": "warning",
                            "field": f"{nf['unit']}数量",
                            "existing": f"{ef['value']} {ef['unit']}",
                            "existing_source": ef["source"],
                            "new": f"{nf['value']} {nf['unit']}",
                            "explanation": f"同一指标数字显著减少（{ef['value']} → {nf['value']}），上下文相似度 {sim:.0%}",
                        }
                    )

        elif nf["type"] == "age":
            if "age" in existing_by_key:
                for ef in existing_by_key["age"]:
                    try:
                        new_age = int(nf["value"])
                        old_age = int(ef["value"])
                    except ValueError:
                        continue
                    if abs(new_age - old_age) > 2:
                        conflicts.append(
                            {
                                "severity": "error",
                                "field": "年龄",
                                "existing": f"{ef['value']}岁",
                                "existing_source": ef["source"],
                                "new": f"{nf['value']}岁",
                                "explanation": f"年龄差异过大（{ef['value']} vs {nf['value']}）",
                            }
                        )

    return conflicts


def main():
    parser = argparse.ArgumentParser(description="博客内容一致性检查")
    parser.add_argument("--target", help="指定要检查的文件路径")
    parser.add_argument("--diff-base", help="对比基准分支，只检查变更文件")
    parser.add_argument("--all", action="store_true", help="全量检查所有文章")
    args = parser.parse_args()

    target_files = None

    if args.target:
        target_files = [args.target]
    elif args.diff_base:
        target_files = get_changed_blog_files(args.diff_base)
        if not target_files:
            print("✅ 本次 PR 未变更博客文件，跳过一致性检查")
            sys.exit(0)
        print(f"📝 检测到 {len(target_files)} 个变更的博客文件:")
        for f in target_files:
            print(f"   - {f}")
        print()
    elif args.all:
        target_files = None  # 全量
    else:
        # 默认：全量检查
        target_files = None

    passed = check_consistency(target_files)
    sys.exit(0 if passed else 1)


if __name__ == "__main__":
    main()
