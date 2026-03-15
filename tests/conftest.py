"""公共 fixtures for auto-blog-generator tests"""

import pytest
import tempfile
import os
from pathlib import Path


@pytest.fixture
def sample_config():
    return {
        "claude": {"model": "claude-sonnet-4-6", "max_tokens": 4096},
        "author": {
            "name": "Ning Ding",
            "role": "异乡好居合伙人",
            "style_notes": "第一人称，真实、有温度",
        },
        "topic_categories": [
            {
                "name": "Vibe Coding 实战",
                "tags": ["Vibe Coding", "AI", "实战"],
                "description": "非程序员用 AI 写代码的真实体验",
            },
            {
                "name": "AI 工具评测",
                "tags": ["AI", "工具", "效率"],
                "description": "实际使用过的 AI 工具分享",
            },
        ],
        "generation": {
            "min_words": 1500,
            "max_words": 3000,
            "blog_dir": "content/blog",
            "memory_dir": "memories",
            "output_dir": "content/blog",
        },
    }


@pytest.fixture
def sample_memories():
    return [
        {
            "project": "dingning-ai",
            "content": "# dingning.ai\n\nNext.js 14 个人网站，MDX 博客系统。",
            "filepath": "/fake/memories/dingning-ai.md",
        },
        {
            "project": "uhomes-talent",
            "content": "# 异乡人才\n\nAI 驱动的留学生求职平台，10645 个活跃岗位。",
            "filepath": "/fake/memories/uhomes-talent.md",
        },
    ]


@pytest.fixture
def sample_existing_posts():
    return [
        {
            "title": "我如何用 AI 搭建个人网站",
            "date": "2026-03-01",
            "tags": ["AI", "Vibe Coding"],
            "excerpt": "这是一篇关于...",
            "filename": "2026-03-01-how-i-built-my-site.mdx",
        },
        {
            "title": "Thompson Sampling 入门",
            "date": "2026-03-02",
            "tags": ["AI", "算法"],
            "excerpt": "推荐算法...",
            "filename": "2026-03-02-thompson-sampling.mdx",
        },
    ]


@pytest.fixture
def sample_topic():
    return {
        "title": "Why Vibe Coding Works",
        "topic_category": "Vibe Coding 实战",
        "tags": ["Vibe Coding", "AI"],
        "outline": "1. 背景 2. 实践 3. 总结",
        "source_projects": ["dingning-ai"],
        "angle": "从个人经验出发",
    }


@pytest.fixture
def sample_topic_chinese():
    return {
        "title": "为什么非程序员也能写代码",
        "topic_category": "Vibe Coding 实战",
        "tags": ["Vibe Coding"],
        "outline": "大纲",
        "source_projects": ["dingning-ai"],
        "angle": "角度",
    }


@pytest.fixture
def tmp_dir(tmp_path):
    """Provide a temporary directory with sample structure."""
    # Create memories
    mem_dir = tmp_path / "memories"
    mem_dir.mkdir()
    (mem_dir / "project-a.md").write_text("# Project A\nSome content.", encoding="utf-8")
    (mem_dir / "project-b.md").write_text("# Project B\nMore content.", encoding="utf-8")
    (mem_dir / "README.md").write_text("# README\nSkip this.", encoding="utf-8")

    # Create blog dir with sample posts
    blog_dir = tmp_path / "content" / "blog"
    blog_dir.mkdir(parents=True)
    (blog_dir / "2026-03-01-sample.mdx").write_text(
        '---\ntitle: "Sample Post"\ndate: "2026-03-01"\ntags: ["AI"]\nexcerpt: "A sample"\npublished: true\n---\n\nHello world.',
        encoding="utf-8",
    )

    return tmp_path
