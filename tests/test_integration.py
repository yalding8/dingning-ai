"""IT-01 ~ IT-03: integration tests"""

import os
from unittest.mock import patch, MagicMock
from datetime import datetime


MOCK_TOPIC_JSON = '{"title": "Integration Test Article", "topic_category": "Vibe Coding 实战", "tags": ["AI", "测试"], "outline": "1. 背景 2. 实践", "source_projects": ["project-a"], "angle": "测试角度"}'

MOCK_ARTICLE_CONTENT = """在过去的几个月里，我一直在探索 AI 辅助编程的可能性。

## 背景

作为一个非程序员，我从零开始用 AI 搭建了多个产品。

## 实践经验

最重要的经验是：不要害怕犯错。

## 总结

*AI 不会取代你，但会用 AI 的人会。*"""


def _mock_call_claude_api(prompt, config):
    """根据 prompt 内容返回不同的 mock 响应"""
    if "选择一个" in prompt and "尚未写过" in prompt:
        return MOCK_TOPIC_JSON
    return MOCK_ARTICLE_CONTENT


def test_full_pipeline_mock(tmp_dir):
    """IT-01: 完整流程 mock API 生成有效 .mdx 文件"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_dir):
        with patch.object(gen, "CONFIG_PATH", tmp_dir / "config.yaml"):
            # Write a minimal config
            config = {
                "claude": {"model": "claude-sonnet-4-6", "max_tokens": 4096},
                "author": {"name": "Test", "style_notes": "简洁"},
                "topic_categories": [
                    {"name": "Vibe Coding", "tags": ["AI"], "description": "desc"}
                ],
                "generation": {
                    "min_words": 100,
                    "max_words": 500,
                    "blog_dir": "content/blog",
                    "memory_dir": "memories",
                    "output_dir": "content/blog",
                },
            }

            with patch.object(gen, "call_claude_api", side_effect=_mock_call_claude_api):
                with patch.object(gen, "load_config", return_value=config):
                    # Load memories
                    memories = gen.load_memories("memories")
                    assert len(memories) == 2

                    # Load existing posts
                    existing = gen.load_existing_posts("content/blog")

                    # Select topic
                    topic = gen.select_topic(memories, existing, config)
                    assert topic["title"] == "Integration Test Article"

                    # Generate article
                    content = gen.generate_article(topic, memories, config)
                    assert "AI 辅助编程" in content

                    # Create MDX file
                    filepath = gen.create_mdx_file(topic, content, "content/blog")
                    assert os.path.exists(filepath)
                    assert filepath.endswith(".mdx")

                    # Verify file content
                    file_text = open(filepath, encoding="utf-8").read()
                    assert "---" in file_text
                    assert 'title: "Integration Test Article"' in file_text
                    assert "AI 辅助编程" in file_text


def test_dry_run_no_file_created(tmp_dir):
    """IT-02: --dry-run 模式仅选题不生成文件"""
    import scripts.generate_blog_post as gen

    blog_dir = tmp_dir / "content" / "blog"
    initial_files = set(blog_dir.glob("*.mdx"))

    with patch.object(gen, "ROOT_DIR", tmp_dir):
        with patch.object(gen, "call_claude_api", return_value=MOCK_TOPIC_JSON):
            memories = gen.load_memories("memories")
            existing = gen.load_existing_posts("content/blog")
            config = {"topic_categories": []}

            topic = gen.select_topic(memories, existing, config)

    # dry-run 只选题，不调用 create_mdx_file
    final_files = set(blog_dir.glob("*.mdx"))
    assert final_files == initial_files
    assert topic["title"] == "Integration Test Article"


def test_specified_topic_skips_api(tmp_dir):
    """IT-03: --topic 指定主题跳过选题 API"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "ROOT_DIR", tmp_dir):
        with patch.object(gen, "call_claude_api", side_effect=_mock_call_claude_api) as mock_api:
            memories = gen.load_memories("memories")
            existing = gen.load_existing_posts("content/blog")
            config = {"topic_categories": []}

            # 使用指定主题
            topic = gen.select_topic(memories, existing, config, "我的自定义主题")
            assert topic["title"] == "我的自定义主题"

            # 生成文章（只调用一次 API）
            content = gen.generate_article(topic, memories, config)

            filepath = gen.create_mdx_file(topic, content, "content/blog")
            assert os.path.exists(filepath)

            file_text = open(filepath, encoding="utf-8").read()
            assert 'title: "我的自定义主题"' in file_text
