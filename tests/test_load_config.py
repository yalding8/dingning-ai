"""TC-01 ~ TC-02: load_config tests"""

import pytest
from unittest.mock import patch
from pathlib import Path


def test_load_config_success(tmp_path):
    """TC-01: 正常加载 blog_config.yaml"""
    config_file = tmp_path / "scripts" / "blog_config.yaml"
    config_file.parent.mkdir(parents=True)
    config_file.write_text(
        'claude:\n  model: "claude-sonnet-4-6"\n  max_tokens: 4096\nauthor:\n  name: "Test"\n',
        encoding="utf-8",
    )

    import scripts.generate_blog_post as gen

    with patch.object(gen, "CONFIG_PATH", config_file):
        config = gen.load_config()

    assert "claude" in config
    assert "author" in config
    assert config["claude"]["model"] == "claude-sonnet-4-6"


def test_load_config_file_not_found():
    """TC-02: 配置文件不存在"""
    import scripts.generate_blog_post as gen

    with patch.object(gen, "CONFIG_PATH", Path("/nonexistent/config.yaml")):
        with pytest.raises(FileNotFoundError):
            gen.load_config()
