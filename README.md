# supervivian Site

个人作品展示站点

## 技术栈

- [Astro](https://astro.build) - 静态网站框架

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
```

## 目录结构

```
src/
├── components/    # 组件
├── layouts/       # 页面布局
├── pages/         # 页面
└── styles/        # 样式

public/
└── works/         # 作品文件夹（直接访问路径）
```

## 添加新作品

将作品文件夹放入 `public/works/` 目录，然后在 `src/pages/index.astro` 的 `works` 数组中添加作品信息即可。
