"""一致性检查 LLM prompt 事实基准注入测试。

锁住 2026-07-19 daily-blog 失败的根因：LLM judge 不知道数字的业务主体归属
（异乡好居累计客户 40 万 vs 异乡缴费缴费客户 18 万+，两者都是
memories/company-facts.md 里用户确认过的真实数据），把跨主体的两个数字
判为同一指标的冲突（error 级），阻塞了完全合规的文章。

修复：build_llm_prompt 必须把 company-facts.md 作为事实基准注入 prompt，
并明确"不同业务主体的同类指标不是同一指标"的判定规则。
"""

import scripts.check_content_consistency as cc

NEW_FACTS = [
    {"type": "number", "value": "40", "unit": "万", "context": "异乡好居服务了超过 40 万客户", "source": "new.mdx"},
]
EXISTING_FACTS = [
    {"type": "number", "value": "18", "unit": "万", "context": "累计服务了超过 18 万名客户的留学缴费", "source": "old.mdx"},
]


def test_load_company_facts_reads_memory_file():
    """load_company_facts 读取 memories/company-facts.md 全文。"""
    text = cc.load_company_facts()
    assert "40 万" in text
    assert "异乡缴费" in text
    assert "异乡好居" in text


def test_load_company_facts_missing_file_returns_empty(tmp_path, monkeypatch):
    """事实文件不存在时返回空串，不抛异常。"""
    monkeypatch.setattr(cc, "COMPANY_FACTS_PATH", tmp_path / "nonexistent.md")
    assert cc.load_company_facts() == ""


def test_prompt_includes_ground_truth_and_attribution_rule():
    """有事实基准时，prompt 必须包含基准全文和主体归属判定规则。"""
    ground_truth = "| 客户数（累计） | 40 万 | 异乡好居 |\n| 缴费客户数（5 年） | 18 万+ | 异乡缴费 |"
    prompt = cc.build_llm_prompt(NEW_FACTS, EXISTING_FACTS, "正文", ground_truth)
    assert ground_truth in prompt
    assert "事实基准" in prompt
    # 主体归属规则：不同业务主体的同类指标不是同一指标
    assert "不同业务主体" in prompt
    assert "不是同一指标" in prompt or "不算冲突" in prompt


def test_prompt_without_ground_truth_omits_section():
    """无事实基准（文件缺失）时，prompt 不含空的基准章节，其余结构完整。"""
    prompt = cc.build_llm_prompt(NEW_FACTS, EXISTING_FACTS, "正文", "")
    assert "事实基准" not in prompt
    assert "已有文章的事实性声明" in prompt
    assert "输出格式" in prompt


def test_prompt_still_contains_core_sections_with_ground_truth():
    """注入基准不能破坏原有 prompt 结构（facts 摘要、正文、输出格式、伪冲突约束）。"""
    prompt = cc.build_llm_prompt(NEW_FACTS, EXISTING_FACTS, "正文内容", "基准表")
    assert "已有文章的事实性声明" in prompt
    assert "40" in prompt and "18" in prompt
    assert "正文内容" in prompt
    assert "输出格式" in prompt
    assert "严禁" in prompt  # 伪冲突约束仍在
