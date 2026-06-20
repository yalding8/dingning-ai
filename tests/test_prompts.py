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


def test_article_prompt_has_anti_fabrication_guardrail(sample_topic, sample_memories, sample_config):
    """护栏：文章 prompt 必须含真实性红线，禁止虚构地点/事件/原话/亲历场景。

    锁住 PR #73 的教训——AI 借第一人称编造了"济南香格里拉展会"整场经历。
    个人品牌站虚构=伤品牌，这条护栏不允许被静默移除。
    """
    import scripts.generate_blog_post as gen

    prompt = gen.build_article_prompt(sample_topic, sample_memories, sample_config)

    assert "真实性红线" in prompt
    # 必须明确禁止虚构具体场景要素
    assert "具体地点" in prompt
    assert "原话" in prompt
    # 必须澄清第一人称 ≠ 可虚构亲历
    assert "第一人称" in prompt and "不等于" in prompt
    # 必须给出"设想/演绎"的合规出口
    assert "设想" in prompt


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
