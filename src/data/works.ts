export interface Work {
  title: string;
  description: string;
  href: string;
  color: string;
  spine: string;
  icon: string;
  isEmpty?: boolean;
}

export const works: Work[] = [
  {
    title: '圣诞夜',
    description: '圣诞夜的互动小屋',
    href: '/works/christmas-night/index.html',
    color: '#F4BFBF',
    spine: 'XMAS',
    icon: '/assets/icons/tree.svg',
  },
  {
    title: '人格地图',
    description: '人格幻想风格地图',
    href: '/works/persona-map/index.html',
    color: '#AED9F1',
    spine: 'PERSONA',
    icon: '/assets/icons/map.svg',
  },
  {
    title: '我喜欢',
    description: '100件喜欢包围着我',
    href: '/works/what-i-love/index.html',
    color: '#F9D5A7',
    spine: 'LOVE',
    icon: '/assets/icons/heart.svg',
  },
  {
    title: '计算机入门',
    description: '从编译原理到操作系统，核心知识体系梳理',
    href: 'https://supervivian.github.io/compiler-intro/',
    color: '#D7BDE2',
    spine: 'CS-INTRO',
    icon: '/assets/icons/gear.svg',
  },
  {
    title: '个人哲学入门',
    description: '从困惑到清晰，构建哲学知识框架',
    href: 'https://supervivian.github.io/personal-zhexue/',
    color: '#A9DFBF',
    spine: 'ZHEXUE',
    icon: '/assets/icons/book.svg',
  },
  {
    title: '樱花街道',
    description: 'Three.js 樱花街道场景，拖动鼠标旋转视角',
    href: '/works/sakura-street/index.html',
    color: '#F8C8DC',
    spine: 'SAKURA',
    icon: '/assets/icons/sakura.svg',
  },
  {
    title: '设计漫谈',
    description: '设计体系知识、创作感想与案例收集',
    href: 'https://supervivian.github.io/design-intro/',
    color: '#C9B1FF',
    spine: 'DESIGN',
    icon: '/assets/icons/design.svg',
  },
];
