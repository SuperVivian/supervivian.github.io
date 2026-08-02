export interface DockItem {
  title: string;
  href: string;
  icon: string;
  color: string;
  /** 是否为弹窗类型，点击后弹出介绍卡片 */
  isModal?: boolean;
  /** 弹窗描述内容，仅在 isModal 为 true 时有效 */
  desc?: string;
}

export const dockItems: DockItem[] = [
  {
    title: 'GitHub',
    href: 'https://github.com/supervivian',
    icon: '/assets/icons/github.svg',
    color: '#C9B1FF',
  },
  {
    title: 'About',
    href: '/about/',
    icon: '/assets/icons/person.svg',
    color: '#F9D5A7',
  },
  {
    title: 'Weekly',
    href: '/weekly/',
    icon: '/assets/icons/document.svg',
    color: '#A9DFBF',
  },
];
