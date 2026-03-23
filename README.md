# dingning.ai

Ning Ding 的个人品牌网站 — 用 AI 重塑国际教育产业链。

**线上地址：** [https://dingning.ai](https://dingning.ai)

## 技术栈

- **框架：** Next.js 14（App Router, SSG 静态生成）
- **样式：** Tailwind CSS v3 + CSS Variables 双色系主题（accent 信息色 + cta 行动色）
- **内容：** MDX 博客文章（`content/blog/`），remark-gfm 支持表格等 GFM 语法
- **部署：** Vercel（HKG1 region）
- **测试：** Vitest + React Testing Library（45 个用例）
- **Newsletter：** Buttondown（`fetch` 直调 REST API，无 SDK 依赖）
- **数据分析：** Vercel Analytics（页面性能 + Web Vitals）+ Google Analytics 4（用户行为 + 实时监控）

## 站点结构

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | Hero + 精选文章 + 关于简介 + Newsletter |
| 博客 | `/blog` | 文章列表，支持标签筛选 |
| 博客详情 | `/blog/[slug]` | MDX 渲染 + 上下篇导航 + 复制链接分享 |
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

### 环境变量

| 变量 | 说明 | 必需 |
|------|------|------|
| `BUTTONDOWN_API_KEY` | Buttondown Newsletter 订阅 API 密钥 | 否（未配置时订阅请求仅打印日志） |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL（文章阅读量追踪） | 否（未配置时阅读量返回 0） |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token | 否（同上） |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | 否（未配置时不加载 GA4） |

## 博客文章规范

- 文件名格式：`YYYY-MM-DD-english-slug.mdx`
- **Slug 必须为纯 ASCII**（Vercel SSG 不支持中文文件名路由）
- Frontmatter 必填字段：`title`、`date`、`excerpt`、`published`
- 详见 `CLAUDE.md` 中的 Slug 规则

## 内容真实性

本站建立了完整的内容真实性保障体系，防止 AI 生成内容中的虚构信息：

- **事实基准：** `memories/company-facts.md` — 公司工具使用、业务数据、指标归属的唯一可信来源
- **数据分级：** A 级（代码可验证）→ B 级（用户确认）→ C 级（第三方公开）→ D 级（AI 推断，禁止作为事实）
- **防护规则：** CLAUDE.md 中的「内容真实性规则」和「合理推测陷阱」防范条款
- **审计报告：** [`docs/AUDIT_2026-03-15_CONTENT_INTEGRITY.md`](docs/AUDIT_2026-03-15_CONTENT_INTEGRITY.md)

## CI/CD

- **Code Quality**（PR 触发）：Lint + Type Check + Build
- **Content Consistency Check**（PR 触发）：博客内容一致性校验
- **Vercel**：push to main 自动部署

## 近期更新

### 2026-03-23 接入 Vercel Analytics + GA4 数据分析

- Vercel Analytics：页面访问量、Web Vitals 性能指标
- Google Analytics 4：实时访客监控、页面热度排行、点击事件追踪、流量来源分析


### 2026-03-15 内容真实性审计 + 品牌安全防线

全站内容真实性审计，识别并修复 7 项问题：

- 修复 memories 技术栈错误（Django → FastAPI）
- 修复 505 测试项目归属混淆（改为"跨项目累计"）
- 市场数据加"据行业估算"/"预估"标注
- 诈骗案例标注来源（飞汇等平台风控报告）
- Gate-Review 专家表加"AI 模拟角色"声明
- 飞书文章重写（异乡好居未使用飞书，改为"朋友推荐"视角）
- 称谓统一：副总裁 → 合伙人（全站 15 处）

建立防线：
- 新增 `memories/company-facts.md` 公司事实基准文件
- CLAUDE.md 新增内容真实性规则 + "合理推测陷阱"防范条款

### 2026-03-15 色彩系统扩展 + 内容去重（PR #27）

- 新增琥珀色 CTA 专用色（#B45309），区分行动按钮与信息链接
- 首页/服务页/关于页核心数字去重，各页面差异化侧重

### 2026-03-15 网站设计评审改进（PR #26）

基于 5 位设计专家（UX/视觉/技术/内容/转化）评审，完成 14 项改进：

**用户体验：** 导航 active state、博客上下篇导航、标签筛选、Header CTA、Footer 三栏布局

**视觉优化：** SVG Favicon、Hero Newsletter 强化、Hover 色差加大、正文字号增大、头像统一

**内容与转化：** 复制链接分享按钮、微信死链修复、文案优化

**工程基础：** Vitest 测试框架、remark-gfm 表格渲染修复

评审报告详见 [`docs/AUDIT_2026-03-15_WEBSITE_DESIGN_REVIEW.md`](docs/AUDIT_2026-03-15_WEBSITE_DESIGN_REVIEW.md)
