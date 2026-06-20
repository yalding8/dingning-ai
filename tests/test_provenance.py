"""溯源盖戳测试（溯源契约 ① 产物盖戳）。

锁住两件事：
1. build_provenance 的不变量：`源 <repo>/<script>` 永在；git 不可用时 commit
   降级为 unknown，但不抛异常、不丢 repo/script。
2. create_mdx_file 生成的文章 frontmatter 必须含 generated_by 戳，让任何
   自动生成的文章都能还原出身（哪个 repo/script/run）。
"""

import os
from datetime import datetime, timezone, timedelta
from unittest.mock import patch

import scripts.provenance as prov


def test_stamp_always_carries_repo_and_script():
    stamp = prov.build_provenance(
        script="scripts/generate_blog_post.py",
        repo="dingning-ai",
        trigger="github-actions",
        resolve_commit=lambda: "abc1234",
        resolve_dirty=lambda: False,
        now=lambda: datetime(2026, 6, 20, 14, 35, tzinfo=timezone(timedelta(hours=8))),
    )
    assert "源 dingning-ai/scripts/generate_blog_post.py" in stamp
    assert "abc1234" in stamp
    assert "github-actions" in stamp


def test_stamp_degrades_commit_to_unknown_without_git():
    """git 挂了：commit=unknown，但 repo/script 仍在，且不抛异常。"""
    stamp = prov.build_provenance(
        script="scripts/generate_blog_post.py",
        repo="dingning-ai",
        resolve_commit=lambda: "unknown",
        resolve_dirty=lambda: False,
        now=lambda: datetime(2026, 6, 20, 14, 35, tzinfo=timezone(timedelta(hours=8))),
    )
    assert "源 dingning-ai/scripts/generate_blog_post.py" in stamp
    assert "unknown" in stamp


def test_generated_post_carries_provenance_stamp(tmp_path, sample_topic):
    """生成的 .mdx frontmatter 必须含 generated_by 戳。"""
    import scripts.generate_blog_post as gen

    content = "This is the first paragraph.\n\n## Section\n\nMore."
    with patch.object(gen, "ROOT_DIR", tmp_path):
        (tmp_path / "content" / "blog").mkdir(parents=True)
        filepath = gen.create_mdx_file(sample_topic, content, "content/blog")

    fc = open(filepath, encoding="utf-8").read()
    assert "generated_by:" in fc
    assert "源 dingning-ai/scripts/generate_blog_post.py" in fc
