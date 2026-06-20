# 全站审计报告 — dingning.ai

**日期**：2026-06-20
**审查范围**：全仓库（代码质量 / CI-CD / 内容自动化管道 / 安全 / 内容一致性）
**执行**：Claude (Opus 4.8) + 3 个并行 Explore sub-agent，关键项由主 agent 二次核实

---

## ⚠️ 可信度声明（强制）

本报告由 AI 生成。"多组评审"实为同一模型的多个并行实例，**不等于真人专家的独立交叉审查**，共享相同盲区。所有评分/严重度为 AI 主观判断，最终优先级由项目负责人决定。每条发现标注核实状态：`[已核实]`（附证据）/ `[未核实]` / `[已修正]`（sub-agent 初判有误，主 agent 已纠正）。

**最终责任人：项目负责人（AI 报告仅供参考，不构成专业审计意见）。**

---

## 健康度快照

| 维度 | 状态 | 说明 |
|---|---|---|
| TypeScript (`tsc --noEmit`) | ✅ 通过 | 无类型错误 |
| ESLint (`next lint`) | ✅ 通过 | 无警告/错误 |
| 生产构建 (`next build`) | ✅ 通过 | 96 个静态页全部生成 |
| 单元测试 (`vitest`) | ❌ **8/63 失败** | 见 F3，且 **CI 根本不跑测试**（F2）|
| 自动博客 (`daily-blog.yml`) | ❌ **连续失败** | 自 ~06-10 起瘫痪，见 F1 |
| 安全 | ⚠️ 中 | 缺速率限制，见 F5 |

---

## 发现清单（按严重度）

### 🔴 F1 [HIGH] 自动博客管道实质瘫痪 —— 一致性检查假阳性 `[已核实]`

**现象**：`daily-blog.yml` 定时任务 2026-06-13 / 06-16 / 06-19 连续失败（更早 05-28 / 06-04 亦失败）。**最后一次成功是 2026-06-10**。这是本仓库的核心功能（自动生成日更博客）。

**根因**：`scripts/check_content_consistency.py` 的 LLM 语义检查产生**假阳性**。06-19 失败日志原文：

```
❌ [累计服务客户数（异乡缴费）] 数字一致，无冲突，此条仅作确认。
❌ [合作伙伴数量] 数字一致，无冲突，此条仅作确认。
```

LLM judge 在 `explanation` 里明说"**数字一致，无冲突**"，却把这些条目以 `severity:"error"` 塞进 `conflicts[]` 数组，并返回 `pass:false`（自相矛盾）。脚本 `check_content_consistency.py:312-319` 忠实执行——只要 `conflicts[]` 里有任一 `severity=="error"` 就 `has_error=True` → 退出码 1 → 整个 workflow 失败 → 当天博客不发布。

**证据**：
- CI 日志 run 27799297491
- `scripts/check_content_consistency.py:312` `if not result.get("pass", True)` + `:318` `if any(c["severity"]=="error" ...)`
- prompt（`:164-198`）虽要求"无冲突时 conflicts 为空数组"，但 LLM 不可靠地把"确认项"当冲突列出，脚本无任何防御

**修复方向**（任选其一或组合，建议走 Gate-Review）：
1. **收紧 prompt**：明确"仅当数值真正矛盾才入 conflicts；确认一致的条目禁止出现在数组内"，并给正反例。
2. **加防御过滤**：消费前剔除 `explanation` 含"一致/无冲突/确认"且 `existing≈new` 的伪冲突；或仅在 `pass==false` **且** 存在真实矛盾时阻塞。
3. **降级为非阻塞**：语义检查输出 warning，真冲突由人工 review 决定（与现有 Gate-Review 流程一致）。
4. 换更稳的 judge 模型 + 强制 JSON schema 输出。

> 注：06-19 日志中 `⚠️ [累计客户总数] 26万 vs 40万 口径差异` 是**真实的合理 warning**（覆盖留学生群体 26 万 vs 累计客户 40 万口径不同），LLM 判得对；问题只在那两条 `❌` 假阳性。

---

### 🟠 F2 [HIGH] CI 从不运行测试套件 `[已核实]`

`code-quality.yml` 只跑 `tsc --noEmit` + `next lint` + `next build`，**没有 `npm test` / vitest 步骤**。项目有 63 个测试，其中 8 个已失败，但因 CI 不跑测试，**长期无人察觉，测试静默腐烂**。

**证据**：`.github/workflows/code-quality.yml`（全文无 vitest/test 调用）。

**修复**：在 `quality-check` job 增加 `- name: Unit tests \n run: npm test`（放在 build 前，fail-fast）。**前提是先修好 F3 的 8 个失败测试**，否则加上即红。

---

### 🟡 F3 [MEDIUM] 8 个单元测试失败 —— 均为测试质量问题，非生产 bug `[已核实]`

4 个文件 8 个失败。逐条核实结论：**没有一个是线上代码的真 bug**，全是测试自身问题：

| 测试 | 失败数 | 类型 | 根因 |
|---|---|---|---|
| `Header.test.tsx` | 5 | **测试基建缺陷** | `ThemeToggle.tsx:13` 调 `window.matchMedia`，但 `vitest.setup.ts` 未 mock，jsdom 下 `matchMedia is not a function` → Header 整体渲染崩，5 个断言全挂。浏览器真实环境无此问题。 |
| `ConnectSection.test.tsx` | 1 | **测试过时** | 测试找文本 `"微信公众号"`，源码已改为 `"微信：dingningdocai"`（`WeChatPopover.tsx:43`）。测试没跟上。 |
| `ranking.test.ts` | 1 | **时间依赖脆弱测试** | `ranking.ts:12` 用 `Date.now()` 真实时间。测试造的两篇文章（2026-01-01 / 03-20）到今天都已 >90 天衰减窗口，recencyScore 均为 0，无法区分。需把 `now` 作为参数注入或 mock。 |
| `tags.test.ts` | 1 | **测试/实现不一致** | `tags.ts:11` 用默认 `.sort()`（UTF-16 码点序），测试用 `localeCompare` 断言字典序。大小写/中文混排时两者不一致。需统一为 `.sort((a,b)=>a.localeCompare(b))` 或改测试。 |

**修复优先级**：先补 `vitest.setup.ts` 的 `matchMedia` mock（解决 5 个）→ 更新 ConnectSection 测试 → ranking 注入时间 → tags 统一排序。修完再做 F2（CI 接入测试）。

---

### 🟡 F4 [MEDIUM] 中文文件名违反 ASCII 规则（但当前未造成 404）`[已修正]`

`content/blog/2026-03-09-18000-行代码我从没叫过一个程序员vibe-coding-一年后的真实账单.mdx`

- **sub-agent 初判**：CRITICAL，会导致 Vercel 404。
- **主 agent 核实修正**：该文件 **确在 git 跟踪中**（`git ls-files` 因八进制转义，初次 grep 误判为"未跟踪"）；但其 frontmatter 有 `slug: "18000-lines-vibe-coding-real-cost"`，路由由 `lib/mdx.ts` 走 ASCII slug 生成，**实际不产生 404**（build 已验证该页正常生成）。
- **真实定性**：违反 `CLAUDE.md` 明文规则"博客文件名只允许 ASCII"，属规则违规 + 潜在脆弱性（一旦某文章漏写 frontmatter slug 就会 404），**非当前线上故障**。

**修复**：`git mv` 重命名为 `2026-03-09-18000-lines-vibe-coding-real-cost.mdx`（与 slug 对齐）。低风险、建议做。

---

### 🟡 F5 [MEDIUM] API 路由缺少速率限制 `[已核实]`

- `POST /api/newsletter`（`app/api/newsletter/route.ts`）：无限速，可被脚本刷爆 Buttondown 配额 / 制造垃圾订阅。
- `POST /api/views/[slug]`（`app/api/views/[slug]/route.ts`）：无限速，可无限 INCR 刷假浏览量、消耗 Upstash 配额。

项目已依赖 `@upstash/redis`，加 `@upstash/ratelimit` 滑动窗口即可（newsletter 按 email、views 按 IP+slug）。

**附带**：后端邮箱仅校验 `typeof string`，建议加正则 + 长度上限；两处 `console.log` 打印了用户 email / slug（`newsletter/route.ts:14`、`views/[slug]/route.ts:11`），建议脱敏（CI 已对 console.log 发 warning 但非阻塞）。

---

### 🟢 F6 [误报，已撤销] coffee 日更"断更"系本地 main 陈旧导致 `[已修正]`

**初判**：coffee 停在 06-14，断更 6 天。
**核实修正**：`origin/main` 实际已有 `content/coffee/2026-06-15` 至 `2026-06-20` 全部提交（origin/main HEAD = `6d2ca58 feat(coffee): 异乡早咖啡 2026-06-20`）。初判是被**本地 main 落后于 origin/main**（本地停在 c09ff38=06-14）误导。**coffee 日更正常，无故障**。教训：审计前应先 `git fetch` 对齐 origin，勿以本地工作区状态推断线上。

---

### 🟢 F7 [LOW] 内容归属表述不够精确 `[已核实]`

- `2026-03-09-18000...mdx` 指标表把 "505 个单元测试"（实属**异乡点评**）与 18000 行、10645 岗位（属**异乡人才**）并列在同一上下文，读者可能误读为同一项目。建议加脚注标注 "505 测试属异乡点评"。
- `memories/uhomes-talent.md:20` "跨项目累计 505 个单元测试" 措辞模糊，建议改为 "其中 505 个在异乡点评项目"。

> 其余跨文章量化指标（18000 行 / 10645 岗位 / 18万客户 / 75亿交易 / 3万合作伙伴 / 39 岁）经核实**全部一致且归属正确**。"2000 亿留学缴费市场"为 D 级 AI 估算，但文中已用"据行业估算/预估/粗略推算"正确对冲，**合规**。

---

### 🟢 F8 [LOW] 维护性杂项 `[已核实]`

- GitHub Actions 仍用 Node 20（已被强制升 Node 24，发 deprecation warning）；建议 `setup-node` 升 `node-version: 22`。
- Next.js 14.2.35 已进维护期，无已知高危 CVE；可纳入后续升级计划（非紧急）。

---

## 修复状态跟踪表

| 编号 | 严重度 | 发现 | 状态 |
|---|---|---|---|
| F1 | HIGH | 自动博客瘫痪（一致性检查假阳性）| ❌ 未修 |
| F2 | HIGH | CI 不跑测试套件 | ❌ 未修 |
| F3 | MEDIUM | 8 个失败测试（测试质量）| ❌ 未修 |
| F4 | MEDIUM | 中文文件名违规（无 404）| ❌ 未修 |
| F5 | MEDIUM | API 缺速率限制 | ❌ 未修 |
| F6 | LOW | coffee 断更 06-14 | ⏭️ 需服务器侧排查 |
| F7 | LOW | 内容归属表述模糊 | ❌ 未修 |
| F8 | LOW | Node 20 / Next 14 维护项 | ❌ 未修 |

---

## 下一步行动建议（优先级序）

1. **F1**：修一致性检查假阳性 → 恢复日更管道（核心功能，最高优先）。先手动跑 `python scripts/check_content_consistency.py --all` 复现。
2. **F3 → F2**：修 8 个测试（先补 matchMedia mock）→ 再把 vitest 接入 CI，防止再次静默腐烂。
3. **F5**：两个 POST 路由加 `@upstash/ratelimit`。
4. **F4 / F7**：重命名中文文件 + 修正归属表述（低风险快改）。
5. **F6**：登服务器查 coffee cron / healthcheck。
