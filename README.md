# dingning.ai

Ning Ding 的个人品牌网站 — 用 AI 重塑国际教育产业链。

**线上地址：** [https://dingning.ai](https://dingning.ai)

## 技术栈

- **框架：** Next.js 14（App Router, SSG 静态生成）
- **样式：** Tailwind CSS v3 + CSS Variables 主题系统
- **内容：** MDX 博客文章（`content/blog/`）
- **部署：** Vercel（HKG1 region）
- **测试：** Vitest + React Testing Library

## 站点结构

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | Hero + 精选文章 + 关于简介 + Newsletter |
| 博客 | `/blog` | 文章列表，支持标签筛选 |
| 博客详情 | `/blog/[slug]` | MDX 渲染 + 上下篇导航 + 分享 |
| 服务 | `/services` | Vibe Coding 企业实训 + AI 落地咨询 |
| 项目 | `/projects` | 异乡好居、异乡缴费、异乡人才、dingning.ai |
| 资源 | `/resources` | 工具推荐（Claude Code、Obsidian、DigitalOcean 等） |
| 关于 | `/about` | 个人经历时间线 + 联系方式 |

## 本地开发

```bash
npm install
npm run dev     # 启动开发服务器 http://localhost:3000
npm run build   # 生产构建
npm test        # 运行测试（Vitest）
npm run lint    # ESLint 检查
```

## 博客文章规范

- 文件名格式：`YYYY-MM-DD-english-slug.mdx`
- **Slug 必须为纯 ASCII**（Vercel SSG 不支持中文文件名路由）
- Frontmatter 必填字段：`title`、`date`、`excerpt`、`published`
- 详见 `CLAUDE.md` 中的 Slug 规则

## CI/CD

- **Code Quality**（PR 触发）：Lint + Type Check + Build
- **Content Consistency Check**（PR 触发）：博客内容一致性校验
- **Vercel**：push to main 自动部署

## 近期更新

### 2026-03-15 网站设计评审改进（PR #26）

基于 5 位设计专家（UX/视觉/技术/内容/转化）评审，完成 14 项改进：

**用户体验：**
- 导航添加 active state，高亮当前页面
- 博客详情页增加「返回列表」和「上/下一篇」导航
- 博客列表页增加标签筛选功能
- Header 增加「联系我」CTA 按钮
- Footer 升级为三栏布局（品牌/导航/联系）

**视觉优化：**
- 新增 SVG Favicon（深蓝底 + N 字）
- Hero Newsletter 区域视觉强化（背景卡片 + 标题）
- Hover 色差加大提升交互反馈（accent-light #1A6FA0 → #2980B9）
- 博客正文字号 16px → 17px 提升阅读舒适度
- About 页头像尺寸统一（128px → 160px）

**内容与转化：**
- 博客详情页增加「复制链接」分享按钮
- 微信公众号死链修复（`href="#"` → span + tooltip）
- ConnectSection 文案优化（"不卖课" → "不灌水"）

**工程基础：**
- 搭建 Vitest + React Testing Library 测试框架
- 新增 8 个测试文件、36 个测试用例

评审报告详见 [`docs/AUDIT_2026-03-15_WEBSITE_DESIGN_REVIEW.md`](docs/AUDIT_2026-03-15_WEBSITE_DESIGN_REVIEW.md)
