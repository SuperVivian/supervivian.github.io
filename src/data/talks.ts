export interface TalkDeck {
  id: string;
  title: string;
  author: string;
  role: string;
  description: string;
  cover: string;
  file: string;
  slides: string[];
  color: string;
}

export interface TalkTheme {
  id: string;
  label: string;
  title: string;
  date: string;
  description: string;
  decks: TalkDeck[];
  status?: 'active' | 'planned';
}

const fengSlides = Array.from(
  { length: 19 },
  (_, i) => `/talks/autumn-2026/feng/slides/${String(i + 1).padStart(2, '0')}.webp`,
);

const xueSlides = Array.from(
  { length: 23 },
  (_, i) => `/talks/autumn-2026/xue/slides/${String(i + 1).padStart(2, '0')}.webp`,
);

export const talkThemes: TalkTheme[] = [
  {
    id: 'autumn-2026',
    label: '秋天 · 2026',
    title: '秋天，我们各自记下的那一页',
    date: '2026.11.15',
    description:
      '同一个秋天主题，两份不同的个人手记：一份从拼豆、立秋与汉字出发，一份从电子明信片、歌单与 AI 写作出发。',
    status: 'active',
    decks: [
      {
        id: 'fengweiwei-autumn',
        title: '秋日拾遗',
        author: '风微微',
        role: '我的分享',
        description: '电子明信片项目、拆字游戏、秋日歌单、文学影像与 AI 写作。',
        cover: '/talks/autumn-2026/feng/cover.webp',
        file: '/talks/autumn-2026/feng/fengweiwei-autumn.pptx',
        slides: fengSlides,
        color: '#D4A574',
      },
      {
        id: 'xueyaxian-autumn',
        title: '秋日手记',
        author: '薛雅娴',
        role: '同期分享',
        description: '拼豆、立秋日记、在湖南、晋祠初秋、桑贝与拆字，共八章秋日笔记。',
        cover: '/talks/autumn-2026/xue/cover.webp',
        file: '/talks/autumn-2026/xue/xueyaxian-autumn.pptx',
        slides: xueSlides,
        color: '#A8C4C1',
      },
    ],
  },
  {
    id: 'annual-2026',
    label: '2026 年度回顾',
    title: '2026 年度回顾',
    date: '即将到来',
    description: '下一次主题手记的预留位置：等年底到了，再把这一年的片段整理进来。',
    status: 'planned',
    decks: [],
  },
];
