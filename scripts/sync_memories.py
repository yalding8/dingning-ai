#!/usr/bin/env python3
"""
素材采集脚本 — 从多个来源程序化采集博客创作素材

数据源：
1. GitHub 仓库动态（commit、PR、Issue 摘要）
2. Claude Code 项目 memory（本地 ~/.claude/projects/）
3. 各项目 CLAUDE.md / AGENTS.md 工程规范
4. 跨仓库代码统计（行数、语言、测试数等关键指标）

输出：memories/auto/ 目录下的 .md 文件，供 generate_blog_post.py 消费。

用法：
    python scripts/sync_memories.py
    python scripts/sync_memories.py --days 30        # 采集最近 30 天
    python scripts/sync_memories.py --repos-only     # 仅采集 GitHub 仓库
    python scripts/sync_memories.py --local-only     # 仅采集本地素材
"""

import argparse
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

import yaml

ROOT_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_DIR / "scripts" / "blog_config.yaml"
AUTO_MEMORY_DIR = ROOT_DIR / "memories" / "auto"

# Claude Code 项目 memory 根目录
CLAUDE_PROJECTS_DIR = Path.home() / ".claude" / "projects"


def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def run_gh(args: list[str], fallback="") -> str:
    """运行 gh CLI 命令，失败时返回 fallback"""
    try:
        result = subprocess.run(
            ["gh"] + args,
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode == 0:
            return result.stdout.strip()
        return fallback
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return fallback


def run_git(args: list[str], cwd=None, fallback="") -> str:
    """运行 git 命令"""
    try:
        result = subprocess.run(
            ["git"] + args,
            capture_output=True, text=True, timeout=15, cwd=cwd,
        )
        return result.stdout.strip() if result.returncode == 0 else fallback
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return fallback


# ── 数据源 1: GitHub 仓库动态 ──────────────────────────────────


def fetch_repo_list(config: dict) -> list[dict]:
    """获取要采集的仓库列表"""
    repos_config = config.get("memory_sources", {}).get("github_repos", [])

    if repos_config:
        # 配置文件指定的仓库
        return repos_config

    # 默认：从 gh 拉取最近活跃的仓库
    raw = run_gh([
        "repo", "list", "--limit", "20",
        "--json", "name,pushedAt,isPrivate,description",
    ])
    if not raw:
        return []

    repos = json.loads(raw)
    return [
        {"name": r["name"], "private": r["isPrivate"], "description": r.get("description", "")}
        for r in repos
    ]


def fetch_repo_activity(repo_name: str, owner: str, days: int) -> dict:
    """采集单个仓库的近期动态"""
    since = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%dT00:00:00Z")

    # 最近的 commit 摘要
    commits_raw = run_gh([
        "api", f"repos/{owner}/{repo_name}/commits",
        "--jq", f'[.[] | select(.commit.committer.date >= "{since}") | '
                f'{{message: .commit.message, date: .commit.committer.date, sha: .sha[:7]}}][:15]',
    ])
    commits = json.loads(commits_raw) if commits_raw else []

    # 最近的 PR
    prs_raw = run_gh([
        "api", f"repos/{owner}/{repo_name}/pulls",
        "-f", "state=all", "-f", "sort=updated", "-f", "per_page=10",
        "--jq", '[.[] | {title: .title, state: .state, merged: .merged_at, number: .number}]',
    ])
    prs = json.loads(prs_raw) if prs_raw else []

    # 仓库语言统计
    langs_raw = run_gh([
        "api", f"repos/{owner}/{repo_name}/languages",
    ])
    languages = json.loads(langs_raw) if langs_raw else {}

    # README（前 500 字）
    readme = run_gh([
        "api", f"repos/{owner}/{repo_name}/readme",
        "--jq", ".content",
    ])
    readme_text = ""
    if readme:
        import base64
        try:
            readme_text = base64.b64decode(readme).decode("utf-8")[:500]
        except Exception:
            pass

    return {
        "commits": commits,
        "prs": prs,
        "languages": languages,
        "readme_excerpt": readme_text,
    }


def build_repo_memory(repo_name: str, activity: dict, description: str) -> str:
    """将仓库动态格式化为 memory 文件内容"""
    lines = [f"# {repo_name} — 近期动态\n"]

    if description:
        lines.append(f"**简介**: {description}\n")

    # 语言统计
    if activity["languages"]:
        total = sum(activity["languages"].values())
        lang_parts = []
        for lang, bytes_ in sorted(activity["languages"].items(), key=lambda x: -x[1])[:5]:
            pct = bytes_ / total * 100
            lang_parts.append(f"{lang} {pct:.0f}%")
        lines.append(f"**技术栈**: {', '.join(lang_parts)}\n")

    # Commits
    if activity["commits"]:
        lines.append("## 近期提交")
        for c in activity["commits"][:10]:
            msg = c["message"].split("\n")[0]  # 只取第一行
            date = c["date"][:10]
            lines.append(f"- [{date}] {msg}")
        lines.append("")

    # PRs
    merged_prs = [p for p in activity["prs"] if p.get("merged")]
    if merged_prs:
        lines.append("## 已合并的 PR")
        for p in merged_prs[:8]:
            lines.append(f"- #{p['number']} {p['title']}")
        lines.append("")

    # README 摘要
    if activity["readme_excerpt"]:
        lines.append("## README 摘要")
        # 去掉 badge 和图片链接
        excerpt = re.sub(r"!\[.*?\]\(.*?\)", "", activity["readme_excerpt"])
        excerpt = re.sub(r"\[!\[.*?\]\(.*?\)\]\(.*?\)", "", excerpt)
        lines.append(excerpt.strip())
        lines.append("")

    return "\n".join(lines)


def sync_github_repos(config: dict, days: int):
    """采集所有 GitHub 仓库动态"""
    owner = run_gh(["api", "user", "--jq", ".login"])
    if not owner:
        print("[WARN] 无法获取 GitHub 用户名，跳过仓库采集")
        return

    repos = fetch_repo_list(config)
    if not repos:
        print("[WARN] 没有找到要采集的仓库")
        return

    print(f"[INFO] 采集 {len(repos)} 个 GitHub 仓库动态 (最近 {days} 天)")

    for repo_info in repos:
        name = repo_info["name"] if isinstance(repo_info, dict) else repo_info
        desc = repo_info.get("description", "") if isinstance(repo_info, dict) else ""
        print(f"  → {name}...", end=" ")

        activity = fetch_repo_activity(name, owner, days)
        if not activity["commits"] and not activity["prs"]:
            print("无近期活动，跳过")
            continue

        content = build_repo_memory(name, activity, desc)
        outfile = AUTO_MEMORY_DIR / f"github-{name}.md"
        outfile.write_text(content, encoding="utf-8")
        print(f"✓ ({len(activity['commits'])} commits, {len(activity['prs'])} PRs)")


# ── 数据源 2: Claude Code 项目 Memory ──────────────────────────


def sync_claude_code_memories():
    """采集本地 Claude Code 项目的 memory 文件"""
    if not CLAUDE_PROJECTS_DIR.exists():
        print("[INFO] 未检测到 Claude Code 项目目录，跳过")
        return

    project_dirs = [d for d in CLAUDE_PROJECTS_DIR.iterdir() if d.is_dir()]
    if not project_dirs:
        return

    print(f"[INFO] 扫描 {len(project_dirs)} 个 Claude Code 项目 memory")

    all_memories = []
    for proj_dir in sorted(project_dirs):
        memory_dir = proj_dir / "memory"
        if not memory_dir.exists():
            continue

        # 从目录名还原项目路径
        proj_name = proj_dir.name.replace("-", "/").lstrip("/")
        # 简化项目名：取最后两段路径
        parts = proj_name.split("/")
        short_name = "/".join(parts[-2:]) if len(parts) >= 2 else parts[-1]

        memory_files = list(memory_dir.glob("*.md"))
        if not memory_files:
            continue

        for mf in memory_files:
            if mf.name == "MEMORY.md":
                continue
            content = mf.read_text(encoding="utf-8").strip()
            if not content or len(content) < 20:
                continue
            all_memories.append({
                "project": short_name,
                "file": mf.name,
                "content": content,
            })

    if not all_memories:
        print("  → 未发现有效 memory 文件")
        return

    # 按项目分组输出
    projects: dict[str, list] = {}
    for m in all_memories:
        projects.setdefault(m["project"], []).append(m)

    lines = ["# Claude Code 协作记录\n"]
    lines.append("从各项目的 Claude Code memory 中提取的经验和决策。\n")

    for proj, mems in sorted(projects.items()):
        lines.append(f"## {proj}\n")
        for m in mems:
            # 提取 frontmatter 中的 description
            desc_match = re.search(r"description:\s*(.+)", m["content"])
            desc = desc_match.group(1).strip() if desc_match else m["file"]
            # 提取正文（去掉 frontmatter）
            body = re.sub(r"^---\n.*?\n---\s*\n?", "", m["content"], flags=re.DOTALL).strip()
            if body:
                lines.append(f"### {desc}")
                lines.append(body[:300])
                lines.append("")

    outfile = AUTO_MEMORY_DIR / "claude-code-memories.md"
    outfile.write_text("\n".join(lines), encoding="utf-8")
    print(f"  → 采集 {len(all_memories)} 条 memory，来自 {len(projects)} 个项目")


# ── 数据源 3: 各项目 CLAUDE.md 工程规范 ────────────────────────


def sync_project_specs():
    """采集本地各项目的 CLAUDE.md / AGENTS.md 工程规范"""
    # 扫描 ~/Desktop 和 ~/Projects 下的项目
    search_dirs = [
        Path.home() / "Desktop",
        Path.home() / "Projects",
    ]

    specs = []
    for search_dir in search_dirs:
        if not search_dir.exists():
            continue
        for proj_dir in sorted(search_dir.iterdir()):
            if not proj_dir.is_dir():
                continue
            for spec_name in ["CLAUDE.md", "AGENTS.md"]:
                spec_file = proj_dir / spec_name
                if spec_file.exists():
                    content = spec_file.read_text(encoding="utf-8").strip()
                    if len(content) > 50:
                        specs.append({
                            "project": proj_dir.name,
                            "file": spec_name,
                            "content": content[:1500],
                        })

    if not specs:
        print("[INFO] 未检测到其他项目的工程规范文件，跳过")
        return

    lines = ["# 各项目工程规范摘要\n"]
    lines.append("从各项目 CLAUDE.md/AGENTS.md 中提取的工程实践和规范。\n")

    for s in specs:
        lines.append(f"## {s['project']} ({s['file']})\n")
        lines.append(s["content"])
        lines.append("")

    outfile = AUTO_MEMORY_DIR / "project-specs.md"
    outfile.write_text("\n".join(lines), encoding="utf-8")
    print(f"[INFO] 采集 {len(specs)} 个项目的工程规范")


# ── 数据源 4: 跨仓库代码统计 ──────────────────────────────────


def sync_code_stats(config: dict):
    """汇总跨仓库的关键代码指标"""
    owner = run_gh(["api", "user", "--jq", ".login"])
    if not owner:
        return

    repos_config = config.get("memory_sources", {}).get("github_repos", [])
    # 重点统计的仓库
    key_repos = [r["name"] if isinstance(r, dict) else r for r in repos_config] if repos_config else []
    if not key_repos:
        # 默认统计所有仓库
        raw = run_gh(["repo", "list", "--limit", "20", "--json", "name", "--jq", ".[].name"])
        key_repos = raw.split("\n") if raw else []

    if not key_repos:
        return

    print(f"[INFO] 统计 {len(key_repos)} 个仓库的代码指标")

    stats = []
    for repo in key_repos:
        if not repo.strip():
            continue
        langs_raw = run_gh(["api", f"repos/{owner}/{repo}/languages"])
        if not langs_raw:
            continue
        languages = json.loads(langs_raw)
        total_bytes = sum(languages.values())
        # 粗略估算行数（平均每行 40 bytes）
        est_lines = total_bytes // 40
        top_lang = max(languages, key=languages.get) if languages else "N/A"
        stats.append({
            "repo": repo,
            "total_bytes": total_bytes,
            "est_lines": est_lines,
            "top_language": top_lang,
            "languages": languages,
        })

    if not stats:
        return

    lines = ["# 跨仓库代码统计\n"]
    lines.append(f"统计时间: {datetime.now().strftime('%Y-%m-%d')}\n")

    total_lines = sum(s["est_lines"] for s in stats)
    total_repos = len(stats)
    lines.append(f"**总计**: {total_repos} 个仓库, 约 {total_lines:,} 行代码\n")

    lines.append("| 仓库 | 主语言 | 预估行数 |")
    lines.append("|------|--------|----------|")
    for s in sorted(stats, key=lambda x: -x["total_bytes"]):
        lines.append(f"| {s['repo']} | {s['top_language']} | {s['est_lines']:,} |")
    lines.append("")

    # 语言汇总
    lang_total: dict[str, int] = {}
    for s in stats:
        for lang, bytes_ in s["languages"].items():
            lang_total[lang] = lang_total.get(lang, 0) + bytes_
    if lang_total:
        lines.append("## 语言分布")
        grand_total = sum(lang_total.values())
        for lang, bytes_ in sorted(lang_total.items(), key=lambda x: -x[1])[:8]:
            pct = bytes_ / grand_total * 100
            lines.append(f"- {lang}: {pct:.1f}%")
        lines.append("")

    outfile = AUTO_MEMORY_DIR / "code-stats.md"
    outfile.write_text("\n".join(lines), encoding="utf-8")
    print(f"  → {total_repos} 仓库, 约 {total_lines:,} 行代码")


# ── 主流程 ────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description="素材采集脚本")
    parser.add_argument("--days", type=int, default=14, help="采集最近 N 天的动态 (默认 14)")
    parser.add_argument("--repos-only", action="store_true", help="仅采集 GitHub 仓库")
    parser.add_argument("--local-only", action="store_true", help="仅采集本地素材")
    args = parser.parse_args()

    config = load_config()

    # 确保输出目录存在
    AUTO_MEMORY_DIR.mkdir(parents=True, exist_ok=True)

    print(f"[INFO] 素材采集开始 (范围: 最近 {args.days} 天)")
    print(f"[INFO] 输出目录: {AUTO_MEMORY_DIR}\n")

    if not args.local_only:
        sync_github_repos(config, args.days)
        sync_code_stats(config)

    if not args.repos_only:
        sync_claude_code_memories()
        sync_project_specs()

    # 汇总
    auto_files = list(AUTO_MEMORY_DIR.glob("*.md"))
    print(f"\n[DONE] 采集完成，共生成 {len(auto_files)} 个素材文件:")
    for f in sorted(auto_files):
        size = f.stat().st_size
        print(f"  {f.name} ({size:,} bytes)")


if __name__ == "__main__":
    main()
