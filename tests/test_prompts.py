"""TC-10 ~ TC-13: prompt building tests"""


def test_topic_selection_prompt_normal(sample_memories, sample_existing_posts, sample_config):
    """TC-10: 正常输入生成完整 prompt"""
    import scripts.generate_blog_post as gen

    prompt = gen.build_topic_selection_prompt(sample_memories, sample_existing_posts, sample_config)

    assert "我如何用 AI 搭建个人网站" in prompt
    assert "Thompson Sampling 入门" in prompt
    assert "dingning-ai" in prompt or "dingning.ai" in prompt
    assert "uhomes-talent" in prompt or "异乡人才" in prompt
    assert "Vibe Coding 实战" in prompt
    assert "JSON" in prompt


def test_topic_selection_prompt_no_posts(sample_memories, sample_config):
    """TC-11: 无已发布文章时 prompt 不报错"""
    import scripts.generate_blog_post as gen

    prompt = gen.build_topic_selection_prompt(sample_memories, [], sample_config)

    assert "JSON" in prompt
    assert "dingning-ai" in prompt or "dingning.ai" in prompt


def test_article_prompt_normal(sample_topic, sample_memories, sample_config):
    """TC-12: 正常 topic + memories 生成文章 prompt"""
    import scripts.generate_blog_post as gen

    prompt = gen.build_article_prompt(sample_topic, sample_memories, sample_config)

    assert "Why Vibe Coding Works" in prompt
    assert "Vibe Coding 实战" in prompt
    assert "dingning.ai" in prompt or "dingning-ai" in prompt
    assert "1500" in prompt
    assert "3000" in prompt


def test_article_prompt_empty_source_projects(sample_memories, sample_config):
    """TC-13: source_projects 为空时包含所有 memory"""
    import scripts.generate_blog_post as gen

    topic = {
        "title": "Test",
        "topic_category": "",
        "tags": [],
        "outline": "",
        "source_projects": [],
        "angle": "",
    }

    prompt = gen.build_article_prompt(topic, sample_memories, sample_config)

    # 两个 memory 都应该被包含
    assert "dingning-ai" in prompt or "dingning.ai" in prompt
    assert "uhomes-talent" in prompt or "异乡人才" in prompt
