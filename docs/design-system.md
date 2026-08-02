# 设计系统

本项目首页采用「手机桌面拟物化 + 马卡龙粉调」风格。本文档规范配色、字体、布局与图标使用方式，后续添加新 App 或调整样式时请遵守。

## 设计原则

- **清新柔和**：整体使用低饱和度、高明度的马卡龙色系，避免刺眼的高饱和色。
- **拟物可爱**：参考 iOS 小组件与可爱主题手机桌面，使用圆角、阴影、毛玻璃效果。
- **移动端优先**：首页模拟手机界面，桌面端居中展示手机外框。
- **数据驱动**：所有 App 数据来自 `src/data/works.ts` 和 `src/pages/index.astro` 中的配置。

## 色彩规范

### 网页背景

网页背景使用多层 `radial-gradient` 叠加模拟柔和色块，底层是粉色系线性渐变：

```css
background:
  radial-gradient(ellipse 80% 70% at 15% 20%, rgba(255, 200, 210, 0.75) 0%, transparent 55%),
  radial-gradient(ellipse 70% 60% at 85% 30%, rgba(255, 230, 180, 0.65) 0%, transparent 50%),
  radial-gradient(ellipse 70% 70% at 70% 85%, rgba(200, 220, 255, 0.6) 0%, transparent 50%),
  radial-gradient(ellipse 60% 50% at 25% 90%, rgba(230, 200, 230, 0.55) 0%, transparent 45%),
  linear-gradient(180deg, #FFF7F5 0%, #FFF0F0 40%, #FDE8E8 70%, #FCE0E0 100%);
```

| 用途 | 色值 |
|------|------|
| 顶层粉块 | `rgba(255, 200, 210, 0.75)` |
| 顶层黄块 | `rgba(255, 230, 180, 0.65)` |
| 顶层蓝块 | `rgba(200, 220, 255, 0.6)` |
| 顶层紫块 | `rgba(230, 200, 230, 0.55)` |
| 底层渐变起点 | `#FFF7F5` |
| 底层渐变中间 | `#FFF0F0` / `#FDE8E8` |
| 底层渐变终点 | `#FCE0E0` |

### 手机界面

| 用途 | 色值 |
|------|------|
| 手机外框 | `#FFFFFF` |
| 手机背景（纯色） | `#FFF5F2` |
| 状态栏背景 | `rgba(255, 245, 242, 0.6)` |
| Dock 背景 | `rgba(255, 255, 255, 0.55)` |
| 弹窗背景 | `#FFF5F2` |

### 文字颜色

| 用途 | 色值 |
|------|------|
| 主文字 | `#5D4E4A` |
| 次要文字 | `#8D7B75` |
| 状态栏/Dock 文字 | `#5D4E4A` |

### App / Dock 图标背景色

新增 App 或 Dock 入口时，必须从这个调色板中选择：

| 颜色 | 色值 | 建议使用场景 |
|------|------|-------------|
| 马卡龙粉 | `#F4BFBF` | 温馨、节日、喜爱类 |
| 马卡龙蓝 | `#AED9F1` | 地图、工具、逻辑类 |
| 马卡龙黄 | `#F9D5A7` | 收藏、喜欢、暖调类 |
| 马卡龙紫 | `#D7BDE2` | 技术、编译、复杂类 |
| 马卡龙绿 | `#A9DFBF` | 知识、哲学、自然类 |
| 淡紫 | `#C9B1FF` | 社交、链接、GitHub |
| 米灰 | `#E0D5C8` | 占位、待定、空状态 |

> **禁止**使用高饱和度颜色如 `#FF0000`、`#00FF00`、`#0000FF`，会破坏整体柔和氛围。

## 当前 App 配色映射

### 作品 App（`src/data/works.ts`）

| 作品 | 背景色 |
|------|--------|
| Christmas Night | `#F4BFBF` |
| Persona Map | `#AED9F1` |
| What I Love | `#F9D5A7` |
| 编译原理入门 | `#D7BDE2` |
| 个人哲学入门 | `#A9DFBF` |
| ???（占位） | `#E0D5C8` |

### Dock 入口（`src/pages/index.astro`）

| 入口 | 背景色 |
|------|--------|
| GitHub | `#C9B1FF` |
| Mail | `#F4BFBF` |
| About | `#F9D5A7` |
| Weekly | `#A9DFBF` |

## 图标规范

- 所有 App 和 Dock 图标使用 SVG，存放在 `public/assets/icons/`。
- SVG 线条颜色统一使用 `#5D4E4A`，与文字颜色一致。
- SVG 描边宽度建议 `2px`，风格简洁线性。
- 图标尺寸：App 网格中显示为 26×26px，Dock 中显示为 22×22px，弹窗中显示为 34×34px。

## 字体规范

为避免像素风英文与光滑中文字体割裂，采用「像素标题 + 圆润正文」双字体策略。

### 标题 / 按钮 / App 名称

保持像素风，强化手机桌面拟物感：

```css
font-family: 'Press Start 2P', 'Xiaolai SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

| 字体 | 用途 | 说明 |
|------|------|------|
| `Press Start 2P` | 英文/数字标题 | 8-bit 像素风 |
| `Xiaolai SC` | 中文首选 | 手绘像素感中文字体（小赖体），与英文像素风格统一 |
| `PingFang SC` / `Microsoft YaHei` | 系统回退 | 系统无衬线字体兜底 |

### 正文 / 描述 / 弹窗内容

使用圆润可爱字体，提高小字号可读性，并与马卡龙配色更协调：

```css
font-family: 'Yozai', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

| 字体 | 用途 | 说明 |
|------|------|------|
| `Yozai` | 首选正文 | 悠哉手写体，圆润清新，与马卡龙色调协调 |
| `PingFang SC` / `Microsoft YaHei` | 系统回退 | 系统无衬线字体兜底 |

> 注：`Huninn`（粉圆体）视觉效果更圆润，但当前没有稳定可用的 Web Font CDN；后续若找到可靠源，可优先加入正文字体栈。

### 字号规范

- 标题 / App 名称：16px
- 按钮 / Dock 标签：12–14px
- 正文描述：9–10px（因正文使用圆润字体，可读性优于纯像素体）

### Web Font 引入

可通过 npm 或 CDN 引入，按项目实际构建方式选择：

```bash
# npm 示例
npm install @chinese-fonts/xiaolai
npm install @chinese-fonts/yozai
```

```css
/* CDN 示例 */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
@import url('https://cdn.jsdelivr.net/npm/@chinese-fonts/xiaolai@3.0.0/dist/Xiaolai/result.css');
@import url('https://cdn.jsdelivr.net/npm/@chinese-fonts/yozai@3.0.0/dist/Yozai-Regular/result.css');
```

> 注：具体 CDN 路径请以各字体仓库最新版本为准；按需加载，不必同时引入所有字体。粉圆体（Huninn）暂无稳定 CDN，暂不作为默认引入。

## 尺寸规范

| 元素 | 尺寸 |
|------|------|
| 手机宽度（桌面） | 360px |
| 手机高度（桌面） | 720px |
| 大屏手机宽度 | 400px |
| 大屏手机高度 | 800px |
| App 图标 | 56×56px |
| Dock 图标 | 48×48px |
| 图标圆角 | 18px |
| 手机圆角 | 36px |
| Dock 圆角 | 24px |

## 阴影规范

App 图标阴影使用图标自身背景色 + 低透明度：

```css
box-shadow:
  0 6px 16px var(--icon-shadow),
  inset 0 1px 0 rgba(255, 255, 255, 0.35),
  inset 0 -2px 0 rgba(0, 0, 0, 0.05);
```

其中 `--icon-shadow` 由 JS/内联样式传入，值为 `背景色 + 88`（如 `#F4BFBF88`）。

## 交互规范

- App 点击：弹出详情卡片。
- 空作品 / 未上线入口：弹窗显示「敬请期待」，不跳转。
- 已上线外部链接：弹窗显示「打开应用 →」，点击后新标签页打开。
- ESC 键和点击遮罩均可关闭弹窗。

## 添加新 App 流程

1. 设计一个简洁的 SVG 图标，放入 `public/assets/icons/`。
2. 从「App / Dock 图标背景色」调色板中选择颜色。
3. 在 `src/data/works.ts` 或 `src/pages/index.astro` 中添加数据项。
4. 重新运行 `npm run build`。

## 参考资源

- 像素风英文字体：[Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
- 像素风中文字体：小赖体 Xiaolai Mono（中文网字计划 / 霞鹜开源系列）
- 圆润中文字体：悠哉 Yozai（粉圆体 Huninn 暂无稳定 CDN，后续可补充）
- 首页设计灵感：[zhangwenli.com](https://zhangwenli.com/)
- 配色灵感：马卡龙色系 / iOS 小组件 / 可爱主题手机桌面
