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

## 技术栈
- Next.js 14 + Tailwind CSS v3 + MDX
- 部署：Vercel（SSG 静态生成）
- 博客内容：`content/blog/` 目录下的 `.mdx` 文件
- slug 逻辑：`lib/mdx.ts`（优先 frontmatter slug，否则从文件名去日期前缀）
