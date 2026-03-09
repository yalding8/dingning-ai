"""TC-06 ~ TC-09: load_existing_posts tests"""

from unittest.mock import patch


def test_load_existing_posts_normal(tmp_dir):
    """TC-06: 正常解析带 frontmatter 的 .mdx 文件"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_dir):
        posts = gen.load_existing_posts("content/blog")

    assert len(posts) == 1
    assert posts[0]["title"] == "Sample Post"
    assert posts[0]["date"] == "2026-03-01"
    assert posts[0]["tags"] == ["AI"]
    assert "filename" in posts[0]


def test_load_existing_posts_no_frontmatter(tmp_path):
    """TC-07: .mdx 文件无 frontmatter 则跳过"""
    blog_dir = tmp_path / "content" / "blog"
    blog_dir.mkdir(parents=True)
    (blog_dir / "no-frontmatter.mdx").write_text(
        "Just some content without frontmatter.", encoding="utf-8"
    )

    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_path):
        posts = gen.load_existing_posts("content/blog")

    assert posts == []


def test_load_existing_posts_invalid_yaml(tmp_path):
    """TC-08: frontmatter YAML 格式错误则跳过"""
    blog_dir = tmp_path / "content" / "blog"
    blog_dir.mkdir(parents=True)
    (blog_dir / "bad-yaml.mdx").write_text(
        "---\ntitle: [invalid yaml\n  broken: {{\n---\n\nContent.",
        encoding="utf-8",
    )

    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_path):
        posts = gen.load_existing_posts("content/blog")

    assert posts == []


def test_load_existing_posts_dir_not_exist(tmp_path):
    """TC-09: 目录不存在返回空列表"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_path):
        posts = gen.load_existing_posts("nonexistent/blog")

    assert posts == []
