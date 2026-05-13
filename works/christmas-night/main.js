/* ============================================================
 * 圣诞夜的小屋 · main.js
 * ============================================================ */

// ---------- 全局：场景切换 ----------
const scenes = document.querySelectorAll('.scene');
const navDots = document.querySelectorAll('.nav-dot');
let currentScene = 0;

function goToScene(idx) {
  if (idx < 0 || idx >= scenes.length || idx === currentScene) return;
  scenes[currentScene].classList.remove('active');
  navDots[currentScene].classList.remove('active');
  scenes[idx].classList.add('active');
  navDots[idx].classList.add('active');
  currentScene = idx;

  // 场景进入时的钩子
  if (idx === 2) ensureGiftsRendered();
  if (idx === 3) startFireworks();
  else stopFireworks();
}

navDots.forEach((dot, i) => {
  dot.addEventListener('click', () => goToScene(i));
});

// 键盘方向键切换
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToScene(currentScene + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToScene(currentScene - 1);
});

// ============================================================
// 全局雪花粒子系统（Canvas）
// ============================================================
const snowCanvas = document.getElementById('snowCanvas');
const snowCtx = snowCanvas.getContext('2d');
let snowflakes = [];

function resizeSnow() {
  snowCanvas.width = window.innerWidth;
  snowCanvas.height = window.innerHeight;
}
resizeSnow();
window.addEventListener('resize', resizeSnow);

class Snowflake {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * snowCanvas.width;
    this.y = initial ? Math.random() * snowCanvas.height : -10;
    this.r = Math.random() * 3 + 1;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = Math.random() * 1 + 0.6;
    this.alpha = Math.random() * 0.6 + 0.4;
    this.swing = Math.random() * 0.02 + 0.005;
    this.phase = Math.random() * Math.PI * 2;
  }
  update(mouse) {
    this.phase += this.swing;
    this.x += this.vx + Math.sin(this.phase) * 0.3;
    this.y += this.vy;

    // 鼠标驱散
    if (mouse.active) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 80) {
        const force = (80 - dist) / 80;
        this.x += (dx / dist) * force * 4;
        this.y += (dy / dist) * force * 2;
      }
    }

    if (this.y > snowCanvas.height + 5 || this.x < -10 || this.x > snowCanvas.width + 10) {
      this.reset();
    }
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.shadowColor = 'rgba(255,255,255,0.6)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

for (let i = 0; i < 140; i++) snowflakes.push(new Snowflake());

const mouse = { x: 0, y: 0, active: false };
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});
window.addEventListener('mouseout', () => { mouse.active = false; });

function snowLoop() {
  snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowflakes.forEach(s => { s.update(mouse); s.draw(snowCtx); });
  requestAnimationFrame(snowLoop);
}
snowLoop();

// ============================================================
// 场景一：推门进入
// ============================================================
const doorGroup = document.getElementById('doorGroup');
doorGroup.addEventListener('click', () => {
  doorGroup.classList.add('opening');
  setTimeout(() => goToScene(1), 700);
});

// ============================================================
// 场景二：壁炉火焰（Canvas 粒子）
// ============================================================
const fireCanvas = document.getElementById('fireCanvas');
const fireCtx = fireCanvas.getContext('2d');
let fireParticles = [];
let fireIntensity = 1.0; // 火焰强度

class FireParticle {
  constructor() { this.reset(); }
  reset() {
    this.x = fireCanvas.width / 2 + (Math.random() - 0.5) * 60;
    this.y = fireCanvas.height - 20;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = -(Math.random() * 1.6 + 1.2) * fireIntensity;
    this.life = 1;
    this.decay = Math.random() * 0.015 + 0.012;
    this.size = Math.random() * 8 + 6;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy *= 0.98;
    this.life -= this.decay;
    if (this.life <= 0) this.reset();
  }
  draw(ctx) {
    const alpha = this.life;
    // 颜色从黄->橙->红->透明
    let color;
    if (this.life > 0.7)      color = `rgba(255, 240, 120, ${alpha})`;
    else if (this.life > 0.4) color = `rgba(255, 160, 40, ${alpha * 0.9})`;
    else                      color = `rgba(210, 50, 30, ${alpha * 0.6})`;

    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(200, 30, 10, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
for (let i = 0; i < 60; i++) fireParticles.push(new FireParticle());

function fireLoop() {
  fireCtx.globalCompositeOperation = 'source-over';
  fireCtx.fillStyle = 'rgba(10, 5, 0, 0.25)';
  fireCtx.fillRect(0, 0, fireCanvas.width, fireCanvas.height);
  fireCtx.globalCompositeOperation = 'lighter';
  fireParticles.forEach(p => { p.update(); p.draw(fireCtx); });
  // 强度缓慢回落
  if (fireIntensity > 1.0) fireIntensity -= 0.003;
  requestAnimationFrame(fireLoop);
}
fireLoop();

// 添柴按钮
document.getElementById('addLogBtn').addEventListener('click', () => {
  fireIntensity = Math.min(fireIntensity + 0.6, 2.2);
  // 喷出一批火星
  for (let i = 0; i < 20; i++) {
    const p = new FireParticle();
    p.vy *= 1.8;
    fireParticles.push(p);
  }
  if (fireParticles.length > 120) fireParticles.length = 120;
});

// ============================================================
// 场景二：圣诞树装饰（拖拽）
// ============================================================
const tree = document.getElementById('xmasTree');
const hungGroup = document.getElementById('hungOrnaments');
const ornaments = document.querySelectorAll('.ornament');
const toggleLightsBtn = document.getElementById('toggleLights');
const treeLights = document.getElementById('treeLights');
const clearOrnamentsBtn = document.getElementById('clearOrnaments');

let draggingType = null;

ornaments.forEach(o => {
  o.addEventListener('dragstart', (e) => {
    draggingType = o.dataset.type;
    e.dataTransfer.effectAllowed = 'copy';
    // 必须 setData 否则 Firefox 不触发
    e.dataTransfer.setData('text/plain', draggingType);
  });
});

tree.addEventListener('dragover', (e) => {
  e.preventDefault();
  tree.classList.add('drag-over');
});
tree.addEventListener('dragleave', () => {
  tree.classList.remove('drag-over');
});

tree.addEventListener('drop', (e) => {
  e.preventDefault();
  tree.classList.remove('drag-over');
  if (!draggingType) return;

  // 把屏幕坐标转换成 SVG viewBox 坐标
  const pt = tree.createSVGPoint();
  pt.x = e.clientX; pt.y = e.clientY;
  const ctm = tree.getScreenCTM().inverse();
  const svgPt = pt.matrixTransform(ctm);

  addOrnamentToTree(svgPt.x, svgPt.y, draggingType);
  draggingType = null;
});

function addOrnamentToTree(x, y, type) {
  // 限制在树形三角形大致区域内
  if (y < 30 || y > 285) return;
  if (x < 30 || x > 190) return;

  const emojiMap = {
    'ball-red': '🔴',
    'ball-gold': '🟡',
    'ball-blue': '🔵',
    'star': '⭐',
    'candy': '🍬',
    'bell': '🔔'
  };
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'central');
  text.setAttribute('font-size', '18');
  text.setAttribute('class', 'hung-ornament');
  text.textContent = emojiMap[type] || '✨';
  hungGroup.appendChild(text);
}

toggleLightsBtn.addEventListener('click', () => {
  const isOn = treeLights.classList.toggle('on');
  toggleLightsBtn.textContent = isOn ? '💡 关掉彩灯' : '🌑 点亮彩灯';
});

clearOrnamentsBtn.addEventListener('click', () => {
  hungGroup.innerHTML = '';
});

// ============================================================
// 场景三：拆礼物
// ============================================================
const giftsGrid = document.getElementById('giftsGrid');
const giftPopup = document.getElementById('giftPopup');
const popupIcon = document.getElementById('popupIcon');
const popupMsg = document.getElementById('popupMsg');
const popupClose = document.getElementById('popupClose');

const giftMessages = [
  { icon: '🎁', msg: '愿你新的一年，所求皆所愿，所行化坦途。' },
  { icon: '🌟', msg: '你是别人生命里的一束光，记得把它留给自己一点。' },
  { icon: '🍪', msg: '今晚圣诞老人会偷偷吃掉一块饼干，请备好牛奶。' },
  { icon: '❄️', msg: '下雪的夜晚，所有的愿望都会被温柔地听见。' },
  { icon: '🕯️', msg: '愿你被这个世界爱着，像壁炉旁的小猫一样安心。' },
  { icon: '🎄', msg: '慢一点也没关系，圣诞树也是从一颗种子开始的。' },
  { icon: '💌', msg: '彩蛋：来自小屋的拥抱 🤗 你今天辛苦啦。' },
  { icon: '🦌', msg: '驯鹿刚刚飞过你家屋顶，它说记得对自己好一点。' }
];

const giftColors = ['#d32f2f', '#2e7d32', '#1976d2', '#7b1fa2', '#e65100', '#00838f', '#c2185b', '#558b2f'];
const bowEmojis = ['🎀', '🌟', '💖', '🎄', '🔔', '✨', '🎁', '🌟'];

let giftsRendered = false;
function ensureGiftsRendered() {
  if (giftsRendered) return;
  giftsRendered = true;
  // 打乱祝福语顺序
  const shuffled = [...giftMessages].sort(() => Math.random() - 0.5);
  shuffled.forEach((data, i) => {
    const color = giftColors[i % giftColors.length];
    const bow = bowEmojis[i % bowEmojis.length];
    const box = document.createElement('div');
    box.className = 'gift-box';
    box.style.animationDelay = `${i * 0.15}s`;
    box.innerHTML = `
      <div class="box-shine"></div>
      <div class="box-body" style="background:${color}"></div>
      <div class="box-lid" style="background:${shade(color, -15)}"></div>
      <div class="box-ribbon-v"></div>
      <div class="box-ribbon-h"></div>
      <div class="box-bow">${bow}</div>
    `;
    box.addEventListener('click', () => {
      if (box.classList.contains('opened')) return;
      box.classList.add('opened');
      setTimeout(() => {
        popupIcon.textContent = data.icon;
        popupMsg.textContent = data.msg;
        giftPopup.classList.add('show');
      }, 600);
    });
    giftsGrid.appendChild(box);
  });
}

function shade(hex, percent) {
  // 简单颜色加深/变浅
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0xff) + percent;
  let b = (num & 0xff) + percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

popupClose.addEventListener('click', () => {
  giftPopup.classList.remove('show');
  // 检查是否全部拆完
  const allOpened = [...giftsGrid.children].every(b => b.classList.contains('opened'));
  if (allOpened) {
    setTimeout(() => goToScene(3), 600);
  }
});

// ============================================================
// 场景四：烟花（Canvas 粒子）
// ============================================================
const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
let fwParticles = [];
let fwAnimId = null;
let fwTimer = null;

function resizeFw() {
  fwCanvas.width = fwCanvas.offsetWidth;
  fwCanvas.height = fwCanvas.offsetHeight;
}

class Firework {
  constructor(x, y, color) {
    this.x = x; this.y = y;
    this.color = color;
    this.particles = [];
    const count = 60 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.012 + 0.008,
        size: Math.random() * 2 + 1.5
      });
    }
  }
  update() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;  // 重力
      p.vx *= 0.99;
      p.life -= p.decay;
    });
    this.particles = this.particles.filter(p => p.life > 0);
  }
  draw(ctx) {
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  get dead() { return this.particles.length === 0; }
}

const fwColors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4dabf7', '#da77f2', '#ff8787', '#ffe066'];

function launchFirework() {
  const x = Math.random() * fwCanvas.width * 0.8 + fwCanvas.width * 0.1;
  const y = Math.random() * fwCanvas.height * 0.5 + fwCanvas.height * 0.1;
  const color = fwColors[Math.floor(Math.random() * fwColors.length)];
  fwParticles.push(new Firework(x, y, color));
}

function fwLoop() {
  fwCtx.fillStyle = 'rgba(10, 8, 32, 0.2)';
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwParticles.forEach(f => { f.update(); f.draw(fwCtx); });
  fwParticles = fwParticles.filter(f => !f.dead);
  fwAnimId = requestAnimationFrame(fwLoop);
}

function startFireworks() {
  resizeFw();
  if (fwAnimId) return;
  fwLoop();
  // 启动时先放三发
  launchFirework();
  setTimeout(launchFirework, 300);
  setTimeout(launchFirework, 700);
  fwTimer = setInterval(launchFirework, 900);
}
function stopFireworks() {
  if (fwAnimId) {
    cancelAnimationFrame(fwAnimId);
    fwAnimId = null;
  }
  if (fwTimer) {
    clearInterval(fwTimer);
    fwTimer = null;
  }
  fwParticles = [];
  fwCtx && fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
}
window.addEventListener('resize', () => {
  if (currentScene === 3) resizeFw();
});

// 点击烟花画布也能放一发
fwCanvas.addEventListener('click', (e) => {
  const rect = fwCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const color = fwColors[Math.floor(Math.random() * fwColors.length)];
  fwParticles.push(new Firework(x, y, color));
});

// 重新开始
document.getElementById('restartBtn').addEventListener('click', () => {
  // 重置拆礼物状态
  giftsGrid.innerHTML = '';
  giftsRendered = false;
  // 回到第一幕
  goToScene(0);
});

// ============================================================
// 初始化
// ============================================================
console.log('%c 🎄 圣诞夜的小屋已启动 ', 'background:#c62828;color:#ffd93d;font-size:14px;padding:4px 10px;border-radius:4px;');
console.log('%c 提示：可以用方向键在场景间切换 ', 'color:#6bcf7f;');
