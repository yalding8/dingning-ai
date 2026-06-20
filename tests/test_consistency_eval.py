"""一致性检查 LLM 结果判定逻辑测试。

锁住 2026-06-19 daily-blog 失败的根因：LLM judge 把"已确认一致"的条目
以 severity=error 塞进 conflicts[] 并返回 pass=false（自相矛盾），脚本
忠实地 fail 掉构建。evaluate_llm_result 必须过滤这类伪冲突，只在真正
矛盾时阻塞。
"""

import scripts.check_content_consistency as cc


def test_pseudo_conflict_confirmation_does_not_block():
    """复现 06-19 失败：LLM 说"数字一致，无冲突"却以 error 列入 conflicts。"""
    result = {
        "pass": False,
        "conflicts": [
            {
                "severity": "error",
                "field": "累计服务客户数（异乡缴费）",
                "existing": "过去 5 年累计服务超 18 万名客户，交易额超 75 亿",
                "existing_source": "2026-03-01-study-abroad-payment-truth.mdx",
                "new": "异乡缴费：5 年累计服务 18 万+ 客户，交易额超 75 亿",
                "explanation": "数字一致，无冲突，此条仅作确认。",
            },
            {
                "severity": "error",
                "field": "合作伙伴数量",
                "existing": "维护超过 3 万名合作伙伴",
                "existing_source": "2026-02-05-39-years-old-programmer.mdx",
                "new": "3 万+ 合作伙伴",
                "explanation": "数字一致，无冲突，此条仅作确认。",
            },
        ],
        "summary": "整体一致",
    }
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is False
    assert real == []
    assert len(ignored) == 2


def test_real_numeric_conflict_blocks():
    """真实的数值矛盾（不一致）必须阻塞。"""
    result = {
        "pass": False,
        "conflicts": [
            {
                "severity": "error",
                "field": "代码行数",
                "existing": "18,000 行",
                "existing_source": "a.mdx",
                "new": "8,000 行",
                "explanation": "新文章数字比已有文章变小，前后不一致，存在冲突。",
            }
        ],
        "summary": "存在冲突",
    }
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is True
    assert len(real) == 1
    assert ignored == []


def test_buhuiyi_not_filtered():
    """'不一致' 含子串 '一致' 但语义是矛盾，不能被误过滤。"""
    result = {
        "pass": False,
        "conflicts": [
            {
                "severity": "error",
                "field": "年龄",
                "existing": "39 岁",
                "new": "42 岁",
                "explanation": "两篇文章年龄不一致，矛盾。",
            }
        ],
    }
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is True
    assert ignored == []


def test_warning_does_not_block():
    """warning 级（口径差异）记录但不阻塞。"""
    result = {
        "pass": False,
        "conflicts": [
            {
                "severity": "warning",
                "field": "累计客户总数",
                "existing": "覆盖 26 万留学生群体",
                "new": "40 万累计客户",
                "explanation": "口径可能不同，建议明确区分，存在潜在混淆。",
            }
        ],
    }
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is False
    assert len(real) == 1  # 仍展示该 warning
    assert ignored == []


def test_clean_pass():
    """无冲突时不阻塞。"""
    result = {"pass": True, "conflicts": [], "summary": "全部一致"}
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is False
    assert real == []
    assert ignored == []


def test_parse_failure_non_blocking():
    """JSON 解析失败的 fallback（pass=false, conflicts=[]）不阻塞。"""
    result = {"pass": False, "conflicts": [], "summary": "LLM 返回格式异常: ..."}
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is False


def test_english_no_conflict_filtered():
    """英文 'no conflict' 确认也应被过滤。"""
    result = {
        "pass": False,
        "conflicts": [
            {
                "severity": "error",
                "field": "tests",
                "existing": "505 tests",
                "new": "505 tests",
                "explanation": "Values are consistent, no conflict.",
            }
        ],
    }
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is False
    assert len(ignored) == 1


def test_mixed_real_and_pseudo():
    """混合：一条真冲突 + 一条伪冲突 → 阻塞，且只保留真冲突。"""
    result = {
        "pass": False,
        "conflicts": [
            {"severity": "error", "field": "x", "existing": "1", "new": "1",
             "explanation": "数字一致，无冲突。"},
            {"severity": "error", "field": "y", "existing": "10", "new": "2",
             "explanation": "数值变小，矛盾。"},
        ],
    }
    blocking, real, ignored = cc.evaluate_llm_result(result)
    assert blocking is True
    assert len(real) == 1
    assert real[0]["field"] == "y"
    assert len(ignored) == 1
