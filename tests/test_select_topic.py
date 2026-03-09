"""TC-14 ~ TC-17: select_topic tests"""

import pytest
from unittest.mock import patch, MagicMock


def test_select_topic_specified(sample_memories, sample_existing_posts, sample_config):
    """TC-14: 指定 topic 参数时直接返回，不调用 API"""
    import scripts.generate_blog_post as gen

    result = gen.select_topic(
        sample_memories, sample_existing_posts, sample_config, "自定义主题"
    )

    assert result["title"] == "自定义主题"
    assert result["angle"] == "用户指定主题"
    assert len(result["source_projects"]) == 2


def test_select_topic_valid_json(sample_memories, sample_existing_posts, sample_config):
    """TC-15: API 返回合法 JSON 时正确解析"""
    import scripts.generate_blog_post as gen

    mock_response = '{"title": "AI 测试", "topic_category": "AI", "tags": ["AI"], "outline": "大纲", "source_projects": ["dingning-ai"], "angle": "角度"}'

    with patch.object(gen, "call_claude_api", return_value=mock_response):
        result = gen.select_topic(sample_memories, sample_existing_posts, sample_config)

    assert result["title"] == "AI 测试"
    assert result["tags"] == ["AI"]


def test_select_topic_no_json(sample_memories, sample_existing_posts, sample_config):
    """TC-16: API 返回非 JSON 时 sys.exit(1)"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "call_claude_api", return_value="这不是 JSON 格式的回复"):
        with pytest.raises(SystemExit) as exc_info:
            gen.select_topic(sample_memories, sample_existing_posts, sample_config)
        assert exc_info.value.code == 1


def test_select_topic_json_in_code_block(sample_memories, sample_existing_posts, sample_config):
    """TC-17: API 返回 JSON 包裹在 markdown code block 中"""
    import scripts.generate_blog_post as gen

    mock_response = '```json\n{"title": "代码块中的JSON", "topic_category": "AI", "tags": ["AI"], "outline": "大纲", "source_projects": [], "angle": "角度"}\n```'

    with patch.object(gen, "call_claude_api", return_value=mock_response):
        result = gen.select_topic(sample_memories, sample_existing_posts, sample_config)

    assert result["title"] == "代码块中的JSON"
