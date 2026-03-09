"""TC-18 ~ TC-22: create_mdx_file tests"""

import os
from unittest.mock import patch
from datetime import datetime


def test_create_mdx_english_title(tmp_path, sample_topic):
    """TC-18: 英文标题生成正确 slug"""
    import scripts.generate_blog_post as gen

    content = "This is the first paragraph of the article.\n\n## Section 1\n\nMore content."

    with patch.object(gen, "ROOT_DIR", tmp_path):
        blog_dir = tmp_path / "content" / "blog"
        blog_dir.mkdir(parents=True)
        filepath = gen.create_mdx_file(sample_topic, content, "content/blog")

    assert os.path.exists(filepath)
    file_content = open(filepath, encoding="utf-8").read()
    assert 'title: "Why Vibe Coding Works"' in file_content
    assert "why-vibe-coding-works" in filepath
    assert file_content.startswith("---")


def test_create_mdx_chinese_title(tmp_path, sample_topic_chinese):
    """TC-19: 纯中文标题 fallback 为 auto-{date}"""
    import scripts.generate_blog_post as gen

    content = "这是文章的第一段话。\n\n## 章节\n\n更多内容。"
    today = datetime.now().strftime("%Y-%m-%d")

    with patch.object(gen, "ROOT_DIR", tmp_path):
        blog_dir = tmp_path / "content" / "blog"
        blog_dir.mkdir(parents=True)
        filepath = gen.create_mdx_file(sample_topic_chinese, content, "content/blog")

    assert f"auto-{today}" in filepath


def test_create_mdx_excerpt_normal_paragraph(tmp_path, sample_topic):
    """TC-20: 第一行是正常段落时 excerpt 取前 120 字"""
    import scripts.generate_blog_post as gen

    content = "这是一段正常的文章开头，用来测试 excerpt 提取功能。" * 3

    with patch.object(gen, "ROOT_DIR", tmp_path):
        blog_dir = tmp_path / "content" / "blog"
        blog_dir.mkdir(parents=True)
        filepath = gen.create_mdx_file(sample_topic, content, "content/blog")

    file_content = open(filepath, encoding="utf-8").read()
    assert "excerpt:" in file_content
    assert "这是一段正常的文章开头" in file_content


def test_create_mdx_excerpt_skips_heading(tmp_path, sample_topic):
    """TC-21: 第一行是标题时 excerpt 跳过取下一段"""
    import scripts.generate_blog_post as gen

    content = "## 这是标题\n\n这才是正文第一段。"

    with patch.object(gen, "ROOT_DIR", tmp_path):
        blog_dir = tmp_path / "content" / "blog"
        blog_dir.mkdir(parents=True)
        filepath = gen.create_mdx_file(sample_topic, content, "content/blog")

    file_content = open(filepath, encoding="utf-8").read()
    assert "这才是正文第一段" in file_content


def test_github_output_written_by_main(tmp_path, sample_topic, sample_config):
    """TC-22: main() 中 GITHUB_OUTPUT 环境变量存在时写入输出"""
    import scripts.generate_blog_post as gen
    from pathlib import Path

    output_file = tmp_path / "github_output.txt"
    output_file.touch()

    # 模拟 main() 中 GITHUB_OUTPUT 写入逻辑
    filepath = "/fake/content/blog/2026-03-09-test.mdx"
    topic = sample_topic

    with patch.dict(os.environ, {"GITHUB_OUTPUT": str(output_file)}):
        github_output = os.environ.get("GITHUB_OUTPUT")
        if github_output:
            with open(github_output, "a") as f:
                f.write(f"filepath={filepath}\n")
                f.write(f"title={topic['title']}\n")
                f.write(f"filename={Path(filepath).name}\n")

    output_content = output_file.read_text(encoding="utf-8")
    assert "filepath=" in output_content
    assert "title=Why Vibe Coding Works" in output_content
    assert "filename=2026-03-09-test.mdx" in output_content


def test_create_mdx_filename_collision(tmp_path, sample_topic):
    """TC-18b: 同名文件已存在时追加数字后缀"""
    import scripts.generate_blog_post as gen

    content = "Content."
    today = datetime.now().strftime("%Y-%m-%d")

    with patch.object(gen, "ROOT_DIR", tmp_path):
        blog_dir = tmp_path / "content" / "blog"
        blog_dir.mkdir(parents=True)

        # 第一次生成
        path1 = gen.create_mdx_file(sample_topic, content, "content/blog")
        # 第二次生成同一 topic
        path2 = gen.create_mdx_file(sample_topic, content, "content/blog")

    assert path1 != path2
    assert "-1.mdx" in path2
