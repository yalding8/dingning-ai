"""TC-23 ~ TC-25: call_claude_api tests"""

import pytest
import os
from unittest.mock import patch, MagicMock


def test_call_claude_api_success(sample_config):
    """TC-23: 正常调用返回 text"""
    import scripts.generate_blog_post as gen

    mock_message = MagicMock()
    mock_message.content = [MagicMock(text="Generated text response")]

    mock_client = MagicMock()
    mock_client.messages.create.return_value = mock_message

    mock_anthropic = MagicMock()
    mock_anthropic.Anthropic.return_value = mock_client

    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "test-key"}):
        with patch.dict("sys.modules", {"anthropic": mock_anthropic}):
            result = gen.call_claude_api("test prompt", sample_config)

    assert result == "Generated text response"
    mock_client.messages.create.assert_called_once()


def test_call_claude_api_no_key(sample_config):
    """TC-24: ANTHROPIC_API_KEY 未设置时 exit"""
    import scripts.generate_blog_post as gen

    env = os.environ.copy()
    env.pop("ANTHROPIC_API_KEY", None)

    with patch.dict(os.environ, env, clear=True):
        with pytest.raises(SystemExit) as exc_info:
            gen.call_claude_api("test", sample_config)
        assert exc_info.value.code == 1


def test_call_claude_api_no_sdk(sample_config):
    """TC-25: anthropic 未安装时 exit"""
    import scripts.generate_blog_post as gen

    with patch.dict(os.environ, {"ANTHROPIC_API_KEY": "test-key"}):
        with patch.dict("sys.modules", {"anthropic": None}):
            with pytest.raises((SystemExit, ImportError)):
                gen.call_claude_api("test", sample_config)
