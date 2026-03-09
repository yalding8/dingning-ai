"""TC-03 ~ TC-05: load_memories tests"""

from unittest.mock import patch
from pathlib import Path


def test_load_memories_normal(tmp_dir):
    """TC-03: 正常加载 2 个 .md 文件，跳过 README.md"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_dir):
        memories = gen.load_memories("memories")

    assert len(memories) == 2
    names = [m["project"] for m in memories]
    assert "project-a" in names
    assert "project-b" in names
    assert "README" not in names


def test_load_memories_dir_not_exist(tmp_path):
    """TC-04: 目录不存在返回空列表"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_path):
        memories = gen.load_memories("nonexistent")

    assert memories == []


def test_load_memories_only_readme(tmp_path):
    """TC-05: 目录仅有 README.md 返回空列表"""
    mem_dir = tmp_path / "memories"
    mem_dir.mkdir()
    (mem_dir / "README.md").write_text("# README", encoding="utf-8")

    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_path):
        memories = gen.load_memories("memories")

    assert memories == []
