# 测试计划: 自动化博客生成系统

## 1. 测试策略

本项目包含 Python 脚本和 GitHub Actions 工作流，测试分三层：

| 层级 | 工具 | 覆盖范围 |
|------|------|---------|
| 单元测试 | pytest | 各函数独立逻辑 |
| 集成测试 | pytest + mock | API 调用 + 文件生成端到端 |
| E2E 验证 | 手动 `--dry-run` + workflow_dispatch | 真实环境运行 |

## 2. 单元测试用例

### 2.1 `load_config()`
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-01 | 正常加载 blog_config.yaml | 返回 dict，包含 claude/author/topic_categories/generation 键 |
| TC-02 | 配置文件不存在 | 抛出 FileNotFoundError |

### 2.2 `load_memories(memory_dir)`
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-03 | 正常加载 2 个 .md 文件 | 返回 list，len=2，跳过 README.md |
| TC-04 | 目录不存在 | 返回空列表，打印 WARN |
| TC-05 | 目录为空（仅 README.md） | 返回空列表 |

### 2.3 `load_existing_posts(blog_dir)`
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-06 | 正常解析带 frontmatter 的 .mdx | 返回 list，包含 title/date/tags/excerpt/filename |
| TC-07 | .mdx 文件无 frontmatter | 跳过该文件 |
| TC-08 | frontmatter YAML 格式错误 | 跳过该文件，不崩溃 |
| TC-09 | 目录不存在 | 返回空列表 |

### 2.4 `build_topic_selection_prompt()`
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-10 | 正常输入 | 返回字符串，包含已发布文章列表、memory 内容、主题方向 |
| TC-11 | 无已发布文章 | prompt 中已发布列表为空，不报错 |

### 2.5 `build_article_prompt()`
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-12 | 正常 topic + memories | 返回字符串，包含标题、分类、大纲、写作风格 |
| TC-13 | source_projects 为空 | 包含所有 memory（fallback 行为） |

### 2.6 `select_topic()`
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-14 | 指定 topic 参数 | 直接返回构造的 dict，不调用 API |
| TC-15 | API 返回合法 JSON | 正确解析并返回 dict |
| TC-16 | API 返回非 JSON | 打印 ERROR 并 sys.exit(1) |
| TC-17 | API 返回 JSON 包裹在 markdown code block 中 | 正则能提取到 JSON |

### 2.7 `create_mdx_file()`
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-18 | 英文标题 | slug 正确生成，文件写入成功 |
| TC-19 | 纯中文标题 | slug fallback 为 `auto-{date}` |
| TC-20 | 文章第一行是正常段落 | excerpt 取前 120 字 |
| TC-21 | 文章第一行是标题（##） | excerpt 跳过标题取下一段 |
| TC-22 | GITHUB_OUTPUT 环境变量存在 | 写入 filepath/title/filename |

### 2.8 `call_claude_api()` (mock)
| 编号 | 场景 | 预期 |
|------|------|------|
| TC-23 | 正常调用 | 返回 message.content[0].text |
| TC-24 | ANTHROPIC_API_KEY 未设置 | 打印 ERROR 并 sys.exit(1) |
| TC-25 | anthropic 未安装 | 打印 ERROR 并 sys.exit(1) |

## 3. 集成测试用例

| 编号 | 场景 | 预期 |
|------|------|------|
| IT-01 | 完整流程 mock API | 从 load → select → generate → create_mdx，生成有效 .mdx 文件 |
| IT-02 | `--dry-run` 模式 | 仅打印选题结果，不生成文件 |
| IT-03 | `--topic "自定义"` 模式 | 跳过选题 API，使用指定主题生成 |

## 4. E2E 验证（手动）

| 编号 | 步骤 | 验收标准 |
|------|------|---------|
| E2E-01 | 本地运行 `python scripts/generate_blog_post.py --dry-run` | 输出选题 JSON，无报错 |
| E2E-02 | 本地运行完整生成（需 API Key） | `content/blog/` 下新增 .mdx 文件，frontmatter 格式正确 |
| E2E-03 | GitHub Actions `workflow_dispatch` dry_run=true | Actions 成功完成，无 PR 创建 |
| E2E-04 | GitHub Actions `workflow_dispatch` 完整运行 | 创建 PR，包含新 .mdx 文件 |

## 5. 测试环境搭建

```bash
# 安装 Python 测试依赖
pip install pytest pytest-mock pyyaml

# 运行测试
pytest tests/ -v

# 运行覆盖率
pytest tests/ --cov=scripts --cov-report=term-missing
```

## 6. 测试目录结构

```
tests/
├── conftest.py                    # 公共 fixture（sample config, memories, posts）
├── test_load_config.py            # TC-01 ~ TC-02
├── test_load_memories.py          # TC-03 ~ TC-05
├── test_load_existing_posts.py    # TC-06 ~ TC-09
├── test_prompts.py                # TC-10 ~ TC-13
├── test_select_topic.py           # TC-14 ~ TC-17
├── test_create_mdx_file.py        # TC-18 ~ TC-22
├── test_call_claude_api.py        # TC-23 ~ TC-25
└── test_integration.py            # IT-01 ~ IT-03
```

## 7. 通过标准

- 单元测试全部通过（25 个用例）
- 集成测试全部通过（3 个用例）
- 代码覆盖率 ≥ 80%
- E2E `--dry-run` 本地验证通过
