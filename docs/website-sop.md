# 个人网站构建 SOP

基于 supervivian 站点实践经验，指导未来个人主页/作品集类网站构建。

## 一、核心原则

1. **首页信息优先，装饰其次**
2. **移动端体验优先**
3. **静态生成 + 自动化部署**
4. **设计系统先行**
5. **数据驱动内容**

## 二、流程概览

```
需求确认 → 风格定位 → 技术选型 → 设计系统 → 基础结构 → 首页开发
    → 响应式适配 → 内容接入 → 图标素材 → 测试验证 → 构建部署 → 维护迭代
```

## 三、详细步骤

### 1. 需求确认

与用户确认：

| 问题 | 记录 |
|------|------|
| 网站用途 | 作品集 / 博客 / 导航页 |
| 核心内容 | 作品、简介、联系方式 |
| 风格偏好 | 像素 / 极简 / 拟物 / 可爱 |
| 是否需要 3D | 默认不建议 |
| 移动端要求 | 必须适配 |

### 2. 风格定位

- 收集 3-5 个参考网站/图片
- 提取配色、布局、图标、字体
- 确定主色、辅色、背景色、文字色

### 3. 技术选型

| 层级 | 推荐 | 慎用 |
|------|------|------|
| 框架 | Astro | Next.js / Nuxt（过重） |
| 样式 | 原生 CSS | Tailwind（个人站不必要） |
| 交互 | 原生 JS | React/Vue（增加体积） |
| 图标 | SVG | emoji（显示不一致） |
| 部署 | GitHub Pages + Actions | 自购服务器 |

### 4. 建立设计系统

创建 `docs/design-system.md`，包含：

- 色彩规范（HEX + CSS 变量）
- 字体规范（字体、字号层级）
- 尺寸规范（圆角、间距、图标大小）
- 阴影规范
- 图标规范

同时在 `src/styles/global.css` 或 `mobile-home.css` 中把色板、字号、间距提取为 CSS 变量。

### 5. 搭建基础结构

```
src/
├── data/works.ts
├── layouts/BaseLayout.astro
├── pages/index.astro
└── styles/
    ├── global.css
    └── home.css
public/
├── assets/icons/
└── works/
```

### 6. 开发首页

顺序：结构 → 样式 → 交互 → 润色

- 信息层级清晰
- 可点击元素有反馈
- 避免过度装饰

### 7. 数据驱动内容

作品/内容放到 `src/data/works.ts`：

```ts
export const works = [
  {
    title: '作品名',
    description: '描述',
    href: '/works/xxx/index.html',
    color: '#XXX',
    icon: '/assets/icons/xxx.svg',
  },
];
```

### 8. 图标与素材

- 统一用 SVG，线条风格一致
- 头像/装饰图优先 SVG
- 背景优先 CSS 渐变

### 9. 响应式适配

- 先设计移动端 375px
- 再扩展桌面端
- 表格/复杂组件在移动端简化

### 10. 测试验证

| 检查项 | 方法 |
|--------|------|
| 构建是否成功 | `npm run build` |
| 移动端效果 | 浏览器 DevTools 375px |
| 实际渲染 | Playwright 截图 |
| 链接是否正常 | 逐个点击验证 |
| 缓存问题 | URL 加版本号 `?v=2` |

### 11. 构建部署

```bash
npm run build
git add .
git commit -m "feat: xxx"
git push origin master
```

GitHub Actions 自动部署到 GitHub Pages。

### 12. 维护迭代

- 新增作品：改 `works.ts` + 加 SVG 图标
- 调整样式：改 CSS 变量
- 修改配色：更新设计系统和 CSS 变量

## 四、检查清单

- [ ] 需求已确认
- [ ] 参考图已收集
- [ ] 设计系统文档已创建
- [ ] CSS 变量已提取
- [ ] 首页结构清晰
- [ ] 移动端适配完成
- [ ] 所有链接可点击
- [ ] `npm run build` 成功
- [ ] 已截图验证关键页面
- [ ] 已推送到部署分支

## 五、常见问题

**Q：首页要不要做 3D？**
A：默认不做。3D 增加体积和复杂度，除非作品本身就是 3D 展示。

**Q：配色怎么定？**
A：先收集参考图，提取主色和辅色，写入设计系统文档，后续不要临时改。

**Q：图标用 emoji 还是 SVG？**
A：个人站点建议 SVG，风格统一且可控。

**Q：改完样式怎么生效？**
A：本地用 `npm run dev`，部署用 `npm run build` + `git push`。

**Q：表格在手机上怎么适配？**
A：隐藏非必要列，减少列数，必要时改成卡片列表。

## 六、参考文件

- `docs/design-system.md`
- `src/data/works.ts`
- `src/styles/mobile-home.css`
- `src/pages/index.astro`
