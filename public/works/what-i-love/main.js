/* ==============================
   what i love · 100个圆形泡泡 · 碰撞挤压
   ============================== */

document.addEventListener('DOMContentLoaded', () => {
  const items = [
    '睡觉', '吃面', '美剧', '存钱', '沙发瘫', '贴贴', '小蛋糕', 'Action', '整理',
    '喝茶', '咖啡', '游戏', '说废话', '云朵发呆', '听歌', '看小说', '猫咪',
    '可爱贴纸', '甜点', '爱情公寓', '拍照', '晚睡', '画画', '旅行', '购物',
    '鲜花', '披萨', '火锅', '奶茶', '炸鸡', '冰淇淋', '巧克力', '撸猫', '摸鱼',
    '发呆', '散步', '看电影', '追番', '漫画', '弹琴', '唱歌', '跳舞', '游泳',
    '跑步', '练字', '做手工', '做饭', '烘焙', '种花', '下雨天', '阳光', '星空',
    '海浪', '读书', '写日记', '看日出', '看日落', '吹风', '泡温泉', '按摩',
    '化妆', '穿搭', '逛市集', '逛书店', '逛展览', '听播客', '冥想', '数星星',
    '看月亮', '发朋友圈', '聊天', '聚会', '唱K', '打麻将', '下棋', '拼图',
    '乐高', '做实验', '学新技能', '写代码', '修图', '剪视频', '做PPT', '宅家',
    '出门', '自驾', '坐火车', '去海边', '去露营', '去野餐', '逛宜家', '吃烤肉',
    '吃日料', '喝下午茶', '毛绒熊', '彩虹', '气球', '荡秋千', '滑滑梯', '旋转木马',
    '放风筝', '看星星', '踩水坑',
  ];

  const colors = [
    '#ff8fab', '#a78bfa', '#34d399', '#ff6b9d', '#60a5fa', '#f472b6',
    '#fbbf24', '#7c4dff', '#38bdf8', '#e879f9', '#fb923c', '#00d4ff',
    '#86efac', '#c084fc', '#f87171', '#22d3ee', '#a3e635', '#f472b6',
    '#818cf8', '#34d399', '#fbbf24', '#c084fc', '#fb7185', '#60a5fa',
  ];

  const container = document.querySelector('.bubbles-container');
  const cw = container.offsetWidth || 900;
  const ch = container.offsetHeight || 700;

  // 中心圆形禁区（角色区域）- 正中央
  const cx = cw / 2;
  const cy = ch / 2;
  const centerR = Math.min(cw, ch) * 0.15; // 禁区半径

  // 每个泡泡对象
  const bubbles = [];
  const padding = 3; // 泡泡之间的间距 px

  items.forEach((name, i) => {
    const r = (64 + (i % 7) * 5) / 2; // 半径 32~47px
    // 初始：从中心向外随机生成
    const angle = Math.random() * Math.PI * 2;
    const dist = centerR + r + padding + 5 + Math.random() * 200;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;

    bubbles.push({
      name,
      x, y, r,
      c: colors[i % colors.length],
      rot: -5 + Math.random() * 10,
    });
  });

  // ===== 碰撞挤压迭代 =====
  const ITERATIONS = 200;

  function dist(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  for (let iter = 0; iter < ITERATIONS; iter++) {
    // 每个泡泡与中心禁区
    for (const b of bubbles) {
      const d = dist(b, { x: cx, y: cy });
      const minD = centerR + b.r + padding;
      if (d < minD && d > 0.001) {
        const push = (minD - d) * 0.3;
        b.x += ((b.x - cx) / d) * push;
        b.y += ((b.y - cy) / d) * push;
      }
    }

    // 泡泡之间碰撞
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const a = bubbles[i], b = bubbles[j];
        const d = dist(a, b);
        const minD = a.r + b.r + padding;
        if (d < minD && d > 0.001) {
          const push = (minD - d) * 0.3;
          const dx = (a.x - b.x) / d;
          const dy = (a.y - b.y) / d;
          a.x += dx * push;
          a.y += dy * push;
          b.x -= dx * push;
          b.y -= dy * push;
        }
      }
    }

    // 边界约束（保留 5px 边距）
    for (const b of bubbles) {
      b.x = Math.max(b.r + 5, Math.min(cw - b.r - 5, b.x));
      b.y = Math.max(b.r + 5, Math.min(ch - b.r - 5, b.y));
    }
  }

  // ===== 渲染 =====
  for (const b of bubbles) {
    const xPct = (b.x / cw * 100).toFixed(1);
    const yPct = (b.y / ch * 100).toFixed(1);
    const diam = (b.r * 2).toFixed(0);

    const el = document.createElement('div');
    el.className = 'bubble';
    el.textContent = b.name;
    el.style.cssText =
      `left:${xPct}%;top:${yPct}%;` +
      `width:${diam}px;height:${diam}px;` +
      `--c:${b.c};--rot:${b.rot.toFixed(1)}deg;` +
      `font-size:${Math.max(11, b.r * 0.35)}px;`;

    // 随机边框圆角取不同风格（但保持圆形主题）
    const style = Math.random();
    if (style < 0.33) {
      el.style.borderRadius = '50%';
      el.style.border = `2.5px solid ${b.c}`;
      el.style.background = `rgba(255,255,255,0.5)`;
    } else if (style < 0.66) {
      el.style.borderRadius = '50%';
      el.style.border = `3px dashed ${b.c}`;
      el.style.background = `rgba(255,255,255,0.4)`;
    } else {
      el.style.borderRadius = '50%';
      el.style.border = `2px dotted ${b.c}`;
      el.style.background = `rgba(255,255,255,0.6)`;
    }

    container.appendChild(el);
  }
});