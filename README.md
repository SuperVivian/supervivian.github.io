# supervivian Site

个人作品展示站点，采用「手机桌面拟物化 + 马卡龙粉调」作为首页设计。

## 设计思路

参考 [zhangwenli.com](https://zhangwenli.com/) 的首页结构，把作品入口设计成手机桌面上的 App 图标：

- **状态栏**：模拟手机顶部状态栏，显示实时时间、信号、电量。
- **主屏壁纸**：马卡龙粉调柔和色块渐变。
- **个人卡片**：头像、昵称、一句话简介。
- **App 网格**：每个作品对应一个 App，点击后直接跳转。
- **Dock 栏**：底部固定常用入口（GitHub、About、Weekly）。

相比之前的「书房场景化 UI」和「3D 书房」，手机桌面方案更简洁、加载更快、移动端体验更好，也更容易维护。

## 技术栈

- [Astro](https://astro.build) - 静态网站框架
- 原生 CSS - 拟物化手机桌面样式
- 原生 JavaScript - App 点击、弹窗、实时时间

## 实现原理

### 1. 页面结构（`src/pages/index.astro`）

整个首页由 `index.astro` 单文件实现，包含：

- **HTML 结构**：手机外框、状态栏、主屏、App 网格、Dock、弹窗。
- **数据绑定**：从 `src/data/works.ts` 读取作品列表，循环渲染成 App 图标。
- **内联脚本**：原生 JS 处理 App 点击、弹窗开关、状态栏实时时间。

Astro 构建时会把这些静态 HTML + CSS + JS 输出到 `dist/index.html`，无需 React/Vue。

### 2. 数据层（`src/data/works.ts`）

每个作品包含以下字段：

```ts
export interface Work {
  title: string;        // 作品名
  description: string;  // 作品描述
  href: string;         // 作品链接
  color: string;        // App 图标背景色
  spine: string;        // 书脊缩写（备用）
  icon: string;         // App 图标（SVG 路径）
  isEmpty?: boolean;    // 是否为空位
}
```

添加新作品时，只需在 `works` 数组中新增一项，首页会自动出现一个 App。

### 3. 样式层（`src/styles/mobile-home.css`）

核心样式：

| 类名 | 作用 |
|------|------|
| `.phone-frame` | 手机外框，带圆角和阴影 |
| `.status-bar` | 顶部状态栏 |
| `.home-screen` | 主屏区域，包含壁纸和 App |
| `.wallpaper` | 马卡龙粉调柔和色块背景 |
| `.profile-card` | 个人头像和简介 |
| `.app-grid` | App 图标网格布局 |
| `.app-icon` | 圆角图标 + 阴影 + SVG |
| `.dock` | 底部毛玻璃 Dock 栏 |
| `.app-modal` | App 详情弹窗 |

响应式处理：

- 桌面端：居中显示手机外框。
- 移动端（< 420px）：手机外框铺满全屏，去掉阴影和圆角。
- 平板端（> 768px）：适当放大手机尺寸。

### 4. 交互逻辑（`index.astro` 内 `<script>`）

- 点击 App：直接跳转对应作品链接。
- 空作品：弹窗显示「敬请期待」，不跳转。
- Dock 的 About：弹窗显示个人简介。
- 状态栏时间：`setInterval` 每秒更新。
- ESC 键和点击遮罩均可关闭弹窗。

## 目录结构

```
src/
├── data/
│   ├── about.ts            # About 页面数据
│   ├── dock.ts             # Dock 入口数据
│   └── works.ts            # 作品数据
├── layouts/
│   └── BaseLayout.astro    # 基础布局（字体、全局样式、loading）
├── pages/
│   ├── index.astro         # 首页（手机桌面）
│   ├── about.astro         # 个人简介页
│   └── weekly.astro        # 周报聚合页
├── styles/
│   ├── about.css           # About 页面样式
│   ├── global.css          # 全局像素风变量与重置
│   └── mobile-home.css     # 手机桌面首页样式
└── tests/                  # Playwright 自动化测试
    ├── home.spec.ts
    ├── links.spec.ts
    └── sakura-street.spec.ts

public/
├── assets/
│   ├── about-avatar.webp   # About 页头像
│   └── icons/              # SVG 图标
├── weekly/                 # 周报 HTML
└── works/                  # 作品文件夹（直接访问路径）

docs/
├── design-system.md        # 设计系统规范
└── website-sop.md          # 网站构建与维护 SOP
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发预览
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 运行自动化测试（构建 + 启动 preview + 执行 Playwright）
npm run test

# 调试用 UI 模式运行测试
npm run test:ui
```

## 添加新作品

1. 将作品文件夹放入 `public/works/` 目录。
2. 在 `src/data/works.ts` 的 `works` 数组中新增一项：

```ts
{
  title: '作品名',
  description: '作品描述',
  href: '/works/作品路径/index.html',
  color: '#主色调',
  spine: '缩写',
  icon: '/assets/icons/图标.svg',
}
```

3. 重新构建即可。

## 部署

本项目使用 GitHub Actions 自动部署到 GitHub Pages，触发分支为 `main`。

```bash
git add .
git commit -m "update site"
git push origin main
```

部署完成后访问：`https://supervivian.github.io/`

**注意**：GitHub Actions 的 Node 版本需要跟随 runner 更新。当前 `.github/workflows/deploy.yml` 使用 Node 22。如果构建报 Node 版本相关错误，优先升级 `actions/setup-node` 的 `node-version`。

## 历史方案

- 最初：`anime` / `minimal` 双主题切换。
- 第二版：2D 像素书房场景化首页。
- 第三版：Three.js 3D 书房（已删除，复杂且不易维护）。
- 当前：手机桌面拟物化首页。

## 经验总结

### 1. 首页不要过度设计

一开始想做「像素风书房」甚至「3D 书房」，实际做下来发现：

- 场景化 UI 素材多、层级多、适配难。
- 3D 版本依赖 Three.js，体积大、移动端发热、交互复杂。
- 最终改成「手机桌面拟物化」，结构清晰、加载快、移动端体验好。

**结论**：个人站点首页应该优先保证信息清晰和加载速度，装饰性效果适可而止。

### 2. 配色需要成体系并文档化

配色反复调了很多轮，从黄橙调到马卡龙粉调，最后确定后才稳定下来。关键做法：

- 把色板写成 CSS 变量。
- 把配色规范写入 `docs/design-system.md`。
- 新增 App 时必须从既定色板中选色。

**结论**：配色不要临时拍脑袋，先定好色板并文档化，后续维护和扩展都更容易。

### 3. SVG 图标比 emoji 更可控

早期 App 图标用 emoji，但不同系统/浏览器显示效果差异大。换成 SVG 后：

- 风格统一。
- 颜色、线条粗细可控。
- 可以按需绘制个性化图标（如小女孩头像、樱花图标）。

**结论**：对风格一致性要求高的项目，优先用 SVG 图标。

### 4. 数据驱动让首页可扩展

作品信息全部放在 `src/data/works.ts`，首页只负责渲染。好处是：

- 新增作品只需改一个文件。
- 不用担心 HTML 结构写死。
- 未来如果要加分类、搜索、筛选都很容易。

### 5. 响应式要先考虑最窄场景

手机桌面方案虽然主体是手机框，但 Weekly 页面的表格在手机 iframe 里适配很费劲。经验：

- 表格在手机上尽量少列，只保留核心信息。
- 固定列宽 + `table-layout: auto` 比隐藏列更稳定。
- 复杂表格可以考虑改成卡片列表。

### 6. 静态构建 + GitHub Pages 足够个人站点

Astro 生成纯静态 HTML，配合 GitHub Actions 自动部署，流程简单：

```
改代码 → npm run build → git push → 自动部署
```

不需要服务器、不需要数据库，维护成本极低。

### 7. 设计变量要提取成配置

把字体大小、App 名称最大宽度、圆角、间距等都提取成 CSS 变量：

- 方便后期微调。
- 避免魔法数字散落各处。
- 更容易做主题切换或 A/B 测试。

### 8. 缓存会让调试变复杂

修改 SVG 或 iframe 内的 HTML 时，浏览器容易缓存旧资源。应对方法：

- 给静态资源 URL 加版本号，如 `avatar.svg?v=2`。
- 调试时按 `Ctrl + F5` 强制刷新。
- 用 Playwright 截图验证实际渲染效果。

### 9. 性能问题通常来自字体和大图

实际遇到的性能瓶颈：

- 中文字体文件大（2-5MB），会阻塞首屏。改用 `font-display: swap` 或延迟加载。
- 背景图/头像未压缩。`about-avatar.png` 从 649KB 压到 52KB 的 webp。
- 复杂 Three.js 场景在手机上卡顿。按设备降配（减少粒子、降低阴影质量）。
- `backdrop-filter: blur()` 在移动端消耗大，可针对手机禁用。

### 10. 必须有自动化测试再部署

使用 Playwright 覆盖：

- 首页 App 点击后正确跳转，不弹窗。
- 全站内部链接 200。
- 关键作品页（如樱花街道）3 秒内加载完成。

测试命令：`npm run test`。部署前跑一遍能避免很多上线后才发现的问题。

### 11. GitHub Actions 需要持续维护

GitHub runner 升级后，旧 Node 版本可能导致构建失败。例如 Node 20 被废弃后，需要把 `.github/workflows/deploy.yml` 里的 `node-version` 升级到 22 或更高。

## 参考资源

- 像素风字体：[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
- 首页设计灵感：[zhangwenli.com](https://zhangwenli.com/)
- 配色灵感：马卡龙色系 / iOS 小组件 / 可爱主题手机桌面
