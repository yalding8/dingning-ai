# 技术设计: 自动化博客生成系统

## 1. 架构概览

```
┌─────────────────────────────────────────────────┐
│              GitHub Actions (cron)               │
│  daily-blog.yml: UTC 0:00 / 手动触发             │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│          generate_blog_post.py                   │
│                                                  │
│  1. load_config()        ← blog_config.yaml     │
│  2. load_memories()      ← memories/*.md        │
│  3. load_existing_posts()← content/blog/*.mdx   │
│  4. select_topic()       → Claude API (JSON)    │
│  5. generate_article()   → Claude API (Markdown)│
│  6. create_mdx_file()    → content/blog/*.mdx   │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│     peter-evans/create-pull-request@v6           │
│     auto-blog/{filename} → main                  │
└─────────────────────────────────────────────────┘
```

## 2. 模块设计

### 2.1 配置模块 (`blog_config.yaml`)

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `claude.model` | string | Claude 模型 ID |
| `claude.max_tokens` | int | 单次请求最大 token |
| `author.*` | object | 作者信息与写作风格 |
| `topic_categories[]` | array | 6 个主题方向 |
| `generation.min/max_words` | int | 目标字数范围 |
| `generation.blog_dir` | string | 已有文章目录 |
| `generation.memory_dir` | string | Memory 来源目录 |
| `generation.output_dir` | string | 文章输出目录 |

### 2.2 Memory 加载 (`load_memories`)
- 扫描 `memories/*.md`，跳过 `README.md`
- 每个文件解析为 `{project, content, filepath}`
- 无 memory 文件时直接退出

### 2.3 选题模块 (`select_topic`)
- **输入**: memories + 已有文章列表 + 配置
- **Prompt 策略**: 提供已发布标题列表要求避免重复，提供 memory 作为素材，限定 6 个主题方向
- **输出**: JSON `{title, topic_category, tags, outline, source_projects, angle}`
- **指定主题模式**: 跳过 API 调用，直接构造 topic 对象

### 2.4 文章生成模块 (`generate_article`)
- **输入**: topic + 相关 memories + 配置
- **Prompt 策略**: 指定写作风格、字数范围、格式要求（Markdown、无标题、无 frontmatter）
- **输出**: 纯 Markdown 文章正文

### 2.5 MDX 文件生成 (`create_mdx_file`)
- 文件名: `{YYYY-MM-DD}-{slug}.mdx`
- Slug 生成: 标题去特殊字符 → 空格转连字符 → 小写；纯中文 fallback `auto-{date}`
- Frontmatter: title, date, excerpt（第一段前 120 字）, tags, published=true, featured=false
- 输出 `GITHUB_OUTPUT` 供 Actions 后续步骤使用

### 2.6 GitHub Actions (`daily-blog.yml`)
- **触发**: `schedule: cron '0 0 * * *'` + `workflow_dispatch`
- **环境**: ubuntu-latest, Python 3.12
- **权限**: `contents: write`, `pull-requests: write`
- **Secret**: `ANTHROPIC_API_KEY`
- **PR 创建**: `peter-evans/create-pull-request@v6`，分支命名 `auto-blog/{filename}`

## 3. 目录结构

```
dingningai/
├── scripts/
│   ├── generate_blog_post.py    # 主脚本
│   ├── blog_config.yaml         # 配置
│   └── requirements.txt         # Python 依赖
├── memories/
│   ├── README.md                # 说明文档
│   ├── dingning-ai.md           # 项目 memory
│   └── uhomes-talent.md         # 项目 memory
├── .github/workflows/
│   └── daily-blog.yml           # 定时触发
└── content/blog/
    └── *.mdx                    # 生成的文章
```

## 4. 依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| anthropic | >=0.40.0 | Claude API SDK |
| pyyaml | >=6.0 | 解析 YAML 配置和 frontmatter |
| Python 标准库 | 3.12 | os, sys, re, json, glob, random, pathlib, argparse, datetime |

## 5. 已知技术债务

1. **JSON 解析无重试**: `select_topic` 用正则提取 JSON，若 Claude 返回非标准格式则直接 `sys.exit(1)`，无 fallback
2. **无 API 调用日志持久化**: 仅 `print` 到 stdout，无法事后分析费用
3. **Slug 生成对中文标题不友好**: 纯中文标题 fallback 为 `auto-{date}`，同一天多次运行会文件名冲突
4. **excerpt 提取脆弱**: 取第一段前 120 字，若文章以列表或标题开头则 excerpt 为空或不完整
5. **workflow 中 `eval` 使用**: `eval python scripts/...` 存在潜在注入风险（虽然输入来自 GitHub Inputs）
