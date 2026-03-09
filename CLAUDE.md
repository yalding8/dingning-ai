# dingning.ai 项目规则

## 博客 Slug 规则（重要）

Vercel SSG 静态部署不支持非 ASCII 文件名路由（中文 URL percent-encoded 后无法匹配中文文件名的静态 HTML）。

**必须遵守：**
- 博客文件名和 slug 只允许 ASCII 字符（英文字母、数字、连字符）
- 文件命名格式：`YYYY-MM-DD-english-slug.mdx`，禁止中文出现在文件名中
- 如果文章标题是中文，slug 使用英文翻译/概括，例如标题「18000 行代码」→ slug `18000-lines-vibe-coding-real-cost`
- frontmatter 中可选 `slug` 字段覆盖文件名推导的 slug，优先级高于文件名
- `scripts/generate_blog_post.py` 生成 slug 时必须过滤掉所有非 ASCII 字符

**反例（禁止）：**
```
2026-03-09-18000-行代码我从没叫过一个程序员.mdx  ← 会导致 Vercel 404
```

**正例：**
```
2026-03-09-18000-lines-vibe-coding-real-cost.mdx  ← 正确
```

## 内容一致性规则（重要）

所有博客文章、播客等内容发布前必须通过一致性检查，不通过不允许合并上线。

**核心原则：同一事实在所有文章中必须前后一致，不能自相矛盾。**

### 检查维度
1. **数字一致性**：代码行数、测试数量、岗位数量等指标在不同文章中不能冲突（合理增长除外）
2. **属性一致性**：人物年龄、职位、角色描述不能前后矛盾
3. **时间线自洽**：事件发生的时间顺序不能冲突
4. **技术栈一致性**：使用的技术、工具描述不能矛盾（一篇说 PostgreSQL，另一篇不能说 MySQL）

### 检查流程
- **CI 门禁**：PR 包含博客内容变更时，`Content Consistency Check` job 自动运行
- **自动博客**：`daily-blog.yml` 生成文章后、创建 PR 前自动检查
- **双层检查**：第一层正则规则（快速免费）+ 第二层 LLM 语义分析（深层）
- **阻塞合并**：检查不通过时 CI 失败，PR 无法合并

### 写作时注意
- 引用项目数据前，先查看 `memories/` 目录下的最新数据
- 数字如有更新，应在文中说明是最新数据（如"截至 2026 年 3 月"）
- 不确定的数字用"约"、"近"等模糊表达，避免与其他文章冲突

### 检查脚本
- `scripts/check_content_consistency.py`
- 手动运行：`python scripts/check_content_consistency.py --all`
- 检查单篇：`python scripts/check_content_consistency.py --target content/blog/xxx.mdx`

## 技术栈
- Next.js 14 + Tailwind CSS v3 + MDX
- 部署：Vercel（SSG 静态生成）
- 博客内容：`content/blog/` 目录下的 `.mdx` 文件
- slug 逻辑：`lib/mdx.ts`（优先 frontmatter slug，否则从文件名去日期前缀）
