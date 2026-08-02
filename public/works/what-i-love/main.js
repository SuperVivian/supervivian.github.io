/* ==============================
   what i love · 100个圆形泡泡 · 碰撞挤压（优化版）
   ============================== */

document.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.getElementById('loading');
  function hideLoading() {
    if (!loadingEl) return;
    loadingEl.classList.add('hidden');
    setTimeout(() => loadingEl.remove(), 500);
  }

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

  const cx = cw / 2;
  const cy = ch / 2;
  const centerR = Math.min(cw, ch) * 0.15;

  const bubbles = [];
  const padding = 3;

  items.forEach((name, i) => {
    const r = (64 + (i % 7) * 5) / 2;
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

  // ===== 空间网格 + 碰撞挤压 =====
  const ITERATIONS = 120; // 迭代次数适当减少，效果足够
  const CELL_SIZE = 120;  // 网格大小

  function buildGrid() {
    const grid = new Map();
    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      const gx = Math.floor(b.x / CELL_SIZE);
      const gy = Math.floor(b.y / CELL_SIZE);
      const key = `${gx},${gy}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(i);
    }
    return grid;
  }

  function resolvePair(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const d2 = dx * dx + dy * dy;
    const minD = a.r + b.r + padding;
    if (d2 === 0 || d2 >= minD * minD) return;
    const d = Math.sqrt(d2);
    const push = (minD - d) * 0.3;
    const nx = dx / d;
    const ny = dy / d;
    a.x += nx * push;
    a.y += ny * push;
    b.x -= nx * push;
    b.y -= ny * push;
  }

  for (let iter = 0; iter < ITERATIONS; iter++) {
    // 与中心禁区碰撞
    for (const b of bubbles) {
      const dx = b.x - cx;
      const dy = b.y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const minD = centerR + b.r + padding;
      if (d < minD && d > 0.001) {
        const push = (minD - d) * 0.3;
        b.x += (dx / d) * push;
        b.y += (dy / d) * push;
      }
    }

    // 泡泡之间碰撞（空间网格优化）
    const grid = buildGrid();
    for (const [key, idxs] of grid) {
      const [gx, gy] = key.split(',').map(Number);
      const neighborKeys = [
        `${gx},${gy}`, `${gx + 1},${gy}`, `${gx},${gy + 1}`, `${gx + 1},${gy + 1}`,
        `${gx - 1},${gy}`, `${gx},${gy - 1}`, `${gx - 1},${gy - 1}`, `${gx + 1},${gy - 1}`, `${gx - 1},${gy + 1}`,
      ];

      const neighbors = [];
      for (const nk of neighborKeys) {
        if (grid.has(nk)) neighbors.push(...grid.get(nk));
      }

      for (let i = 0; i < idxs.length; i++) {
        for (let j = i + 1; j < neighbors.length; j++) {
          resolvePair(bubbles[idxs[i]], bubbles[neighbors[j]]);
        }
      }
    }

    // 边界约束
    for (const b of bubbles) {
      b.x = Math.max(b.r + 5, Math.min(cw - b.r - 5, b.x));
      b.y = Math.max(b.r + 5, Math.min(ch - b.r - 5, b.y));
    }
  }

  // ===== 分帧渲染 =====
  const fragment = document.createDocumentFragment();
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

    const style = Math.random();
    el.style.borderRadius = '50%';
    if (style < 0.33) {
      el.style.border = `2.5px solid ${b.c}`;
      el.style.background = `rgba(255,255,255,0.5)`;
    } else if (style < 0.66) {
      el.style.border = `3px dashed ${b.c}`;
      el.style.background = `rgba(255,255,255,0.4)`;
    } else {
      el.style.border = `2px dotted ${b.c}`;
      el.style.background = `rgba(255,255,255,0.6)`;
    }

    fragment.appendChild(el);
  }

  // 使用 requestAnimationFrame 让首屏先绘制 loading，避免白屏
  requestAnimationFrame(() => {
    container.appendChild(fragment);
    requestAnimationFrame(hideLoading);
  });
});
