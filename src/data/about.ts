export interface AboutInfo {
  /** 页面标题 */
  title: string;
  /** 浏览器描述 */
  description: string;
  /** 大标题，例如「我」 */
  headline: string;
  /** 姓名 */
  name: string;
  /** 身份 / 职位 */
  role: string;
  /** 主要介绍段落 */
  bio: string;
  /** 右侧人物插画路径 */
  avatar: string;
  /** 信息卡片 */
  cards: {
    title: string;
    items: string[];
  }[];
  /** 社交 / 联系链接 */
  links: {
    label: string;
    href: string;
    icon?: string;
  }[];
}

export const aboutInfo: AboutInfo = {
  title: 'About · supervivian',
  description: '关于 supervivian：Creative Programmer，热爱生活与创造。',
  headline: '我',
  name: 'supervivian',
  role: 'Creative Programmer',
  bio: '相信代码也是一种创作语言。喜欢用技术把想法变成可交互的小世界，在日常里收集灵感，把琐碎和温柔都装进作品中。',
  avatar: '/assets/about-avatar.png',
  cards: [
    {
      title: '喜欢的事',
      items: ['写可爱的小工具', '插画与像素风', '散步观察城市', '把复杂变简单'],
    },
    {
      title: '正在探索',
      items: ['Creative Coding', 'Web 交互叙事', '生成艺术', '个人知识管理'],
    },
    {
      title: '常用工具',
      items: ['TypeScript', 'Astro', 'Three.js', 'Figma'],
    },
    {
      title: '小目标',
      items: ['每周产出一个小作品', '保持好奇与笨拙', '记录创作过程', '把主页变成小宇宙'],
    },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/supervivian' },
    { label: '首页', href: '/' },
    { label: 'Weekly', href: '/weekly/' },
  ],
};
