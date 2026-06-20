"""provenance.python.example.py — 跨项目「产物出生证」通用参考实现 (Python)

与 provenance.nodejs.example.ts 等价的 Python 端口。目的、用法、不变量见 TS 版头注释。

怎么用（每个 Python repo 照抄）：
    1. 拷到你的包里，去掉 `.example`。
    2. 产物出口处调用：
           from provenance import build_provenance
           stamp = build_provenance(script="pipelines/payrent_sku_tasks.py",
                                    repo="uhomes-data-platform", trigger="cron")
       把 stamp 放进产物低调位置（文本末行 / 海报页脚 / bitable 隐藏字段），
       渲染样式是各仓 UI 细节，不写进模板。

设计不变量（复刻时别破坏）：
    - 零漂移：commit 由运行时 git / CI 环境变量算出。
    - 绝不崩业务：任何 git 调用失败降级成 'unknown'，不抛异常。
    - 脏工作区标记：本地未提交跑会标 +dirty。
    - 可测试：commit / dirty / now 可注入，默认走真实 git / 时钟。

时间一律按 Asia/Shanghai (UTC+8，无夏令时) 输出。
"""
from __future__ import annotations

import os
import subprocess
from datetime import datetime, timedelta, timezone
from typing import Callable, Optional

_CST = timezone(timedelta(hours=8))


def build_provenance(
    script: str,
    repo: str,
    trigger: Optional[str] = None,
    *,
    resolve_commit: Optional[Callable[[], str]] = None,
    resolve_dirty: Optional[Callable[[], bool]] = None,
    now: Optional[Callable[[], datetime]] = None,
) -> str:
    """构造一行 provenance 文本，例如：
    '源 uhomes-data-platform/pipelines/payrent.py · 36404c2 · 2026-06-09 14:35 CST · cron'
    """
    commit = (resolve_commit or _default_resolve_commit)()
    dirty = (resolve_dirty or _default_resolve_dirty)()
    moment = (now or (lambda: datetime.now(_CST)))()

    parts = [
        f"源 {repo}/{script}",
        f"{commit}{'+dirty' if dirty else ''}",
        f"{moment.astimezone(_CST).strftime('%Y-%m-%d %H:%M')} CST",
    ]
    if trigger and trigger.strip():
        parts.append(trigger.strip())
    return " · ".join(parts)


# ------------------------------- 默认实现 -------------------------------

def _default_resolve_commit() -> str:
    # CI 注入的 SHA 优先（GitHub Actions: GITHUB_SHA；GitLab CI: CI_COMMIT_SHA）
    from_env = os.environ.get("GITHUB_SHA") or os.environ.get("CI_COMMIT_SHA")
    if from_env and from_env.strip():
        return from_env.strip()[:7]
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, check=True,
        )
        return out.stdout.strip() or "unknown"
    except Exception:
        return "unknown"


def _default_resolve_dirty() -> bool:
    # CI 是干净 checkout，无需也无法可靠判断脏工作区
    if os.environ.get("CI") or os.environ.get("GITHUB_ACTIONS"):
        return False
    try:
        out = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True, text=True, check=True,
        )
        return bool(out.stdout.strip())
    except Exception:
        return False
