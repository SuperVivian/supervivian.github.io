import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';

const isMobile = window.matchMedia('(pointer: coarse)').matches;
const CONFIG = {
  petalCount: isMobile ? 500 : 1000,
  groundPetalCount: isMobile ? 120 : 250,
  groundClusterCount: isMobile ? 4 : 8,
  shadowMapSize: isMobile ? 1024 : 2048,
  treeDetail: isMobile ? 6 : 8,
  lampCount: isMobile ? 1 : 2,
};

const loadingEl = document.getElementById('loading');
function hideLoading() {
  if (!loadingEl) return;
  loadingEl.classList.add('hidden');
  setTimeout(() => loadingEl.remove(), 500);
}

// 场景设置
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8d8f0);
scene.fog = new THREE.Fog(0xe8d8f0, 20, 80);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 3, 12);

const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.SoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.target.set(0, 2, 0);

// 光照
const ambientLight = new THREE.AmbientLight(0xfff0e0, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfff8e0, 1.2);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = CONFIG.shadowMapSize;
dirLight.shadow.mapSize.height = CONFIG.shadowMapSize;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.bottom = -20;
scene.add(dirLight);

const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0xe8d8f0, 0.4);
scene.add(hemiLight);

// 地面道路
const roadGeometry = new THREE.PlaneGeometry(40, 100);
const roadMaterial = new THREE.MeshStandardMaterial({
  color: 0xd0c8c0,
  roughness: 0.9,
  metalness: 0.0,
});
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.receiveShadow = true;
scene.add(road);

// 道路中间线
const lineGeometry = new THREE.PlaneGeometry(0.2, 100);
const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const line = new THREE.Mesh(lineGeometry, lineMaterial);
line.rotation.x = -Math.PI / 2;
line.position.y = 0.01;
scene.add(line);

// 路缘石
function createCurb(x) {
  const curbGeo = new THREE.BoxGeometry(0.3, 0.15, 100);
  const curbMat = new THREE.MeshStandardMaterial({ color: 0xb0a8a0 });
  const curb = new THREE.Mesh(curbGeo, curbMat);
  curb.position.set(x, 0.075, 0);
  curb.receiveShadow = true;
  scene.add(curb);
}
createCurb(-3.5);
createCurb(3.5);

// 右侧围墙
function createWall() {
  const wallGroup = new THREE.Group();

  const wallGeo = new THREE.BoxGeometry(0.5, 4, 60);
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.8 });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(6, 2, 0);
  wall.receiveShadow = true;
  wall.castShadow = true;
  wallGroup.add(wall);

  const topGeo = new THREE.BoxGeometry(0.6, 0.2, 60);
  const topMat = new THREE.MeshStandardMaterial({ color: 0xe8ddd0 });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.set(6, 4.1, 0);
  wallGroup.add(top);

  const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, CONFIG.treeDetail);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x4a8a4a });
  const railGeo = new THREE.BoxGeometry(0.05, 0.05, 60);
  const railMat = new THREE.MeshStandardMaterial({ color: 0x4a8a4a });

  for (let z = -30; z <= 30; z += 1.5) {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(5.5, 4.5, z);
    wallGroup.add(post);
  }
  const rail = new THREE.Mesh(railGeo, railMat);
  rail.position.set(5.5, 4.9, 0);
  wallGroup.add(rail);

  scene.add(wallGroup);
}
createWall();

// 围墙旁的建筑
function createBuilding() {
  const buildingGeo = new THREE.BoxGeometry(8, 6, 12);
  const buildingMat = new THREE.MeshStandardMaterial({ color: 0xf0ebe3 });
  const building = new THREE.Mesh(buildingGeo, buildingMat);
  building.position.set(10, 3, 0);
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);

  const roofGeo = new THREE.ConeGeometry(6, 2, 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x6b8fbf });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(10, 7, 0);
  roof.rotation.y = Math.PI / 4;
  scene.add(roof);
}
createBuilding();

// 左侧护栏
function createLeftFence() {
  const fenceGroup = new THREE.Group();
  const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, CONFIG.treeDetail);
  const postMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
  const railGeo = new THREE.BoxGeometry(0.04, 0.04, 60);
  const railMat = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });

  for (let z = -30; z <= 30; z += 2) {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(-3.8, 0.3, z);
    fenceGroup.add(post);
  }
  const rail1 = new THREE.Mesh(railGeo, railMat);
  rail1.position.set(-3.8, 0.5, 0);
  fenceGroup.add(rail1);
  const rail2 = new THREE.Mesh(railGeo, railMat);
  rail2.position.set(-3.8, 0.2, 0);
  fenceGroup.add(rail2);

  scene.add(fenceGroup);
}
createLeftFence();

// 左侧绿篱
function createHedge() {
  const hedgeGeo = new THREE.BoxGeometry(1, 0.8, 60);
  const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x5a9a5a });
  const hedge = new THREE.Mesh(hedgeGeo, hedgeMat);
  hedge.position.set(-4.5, 0.4, 0);
  hedge.receiveShadow = true;
  scene.add(hedge);
}
createHedge();

// 樱花树
function createSakuraTree(x, z, scale = 1) {
  const treeGroup = new THREE.Group();

  const trunkGeo = new THREE.CylinderGeometry(0.15 * scale, 0.25 * scale, 2.5 * scale, CONFIG.treeDetail);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3a20, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1.25 * scale;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  for (let i = 0; i < 4; i++) {
    const branchGeo = new THREE.CylinderGeometry(0.05 * scale, 0.08 * scale, 1.2 * scale, 6);
    const branch = new THREE.Mesh(branchGeo, trunkMat);
    const angle = (i / 4) * Math.PI * 2 + 0.5;
    branch.position.set(
      Math.cos(angle) * 0.5 * scale,
      2.2 * scale,
      Math.sin(angle) * 0.5 * scale,
    );
    branch.rotation.z = Math.cos(angle) * 0.5;
    branch.rotation.x = Math.sin(angle) * 0.5;
    treeGroup.add(branch);
  }

  const crownColors = [0xffb7d5, 0xffd0e0, 0xffe0ec, 0xf8c8dc];
  const crownGeo = new THREE.SphereGeometry(1, CONFIG.treeDetail, CONFIG.treeDetail);
  for (let i = 0; i < 8; i++) {
    const size = (0.8 + Math.random() * 0.6) * scale;
    const crownMat = new THREE.MeshStandardMaterial({
      color: crownColors[Math.floor(Math.random() * crownColors.length)],
      roughness: 0.9,
      transparent: true,
      opacity: 0.95,
    });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.scale.setScalar(size);
    crown.position.set(
      (Math.random() - 0.5) * 1.5 * scale,
      (2.5 + Math.random() * 1.5) * scale,
      (Math.random() - 0.5) * 1.5 * scale,
    );
    crown.scale.y = 0.7 + Math.random() * 0.3;
    crown.castShadow = true;
    treeGroup.add(crown);
  }

  treeGroup.position.set(x, 0, z);
  scene.add(treeGroup);
  return treeGroup;
}

createSakuraTree(-5, -2, 1.8);
createSakuraTree(-4, 8, 1.5);
createSakuraTree(-6, -8, 1.6);
createSakuraTree(-5.5, 18, 1.2);
createSakuraTree(-4.5, -18, 1.3);
if (!isMobile) {
  createSakuraTree(-7, 28, 1.0);
  createSakuraTree(-6, -28, 1.1);
}

for (let z = -25; z <= 25; z += 10) {
  createSakuraTree(8, z + 5, 0.8);
}

// 花瓣粒子系统
const petalCount = CONFIG.petalCount;
const petalGeometry = new THREE.BufferGeometry();
const petalPositions = new Float32Array(petalCount * 3);
const petalVelocities = [];

for (let i = 0; i < petalCount; i++) {
  petalPositions[i * 3] = (Math.random() - 0.5) * 40;
  petalPositions[i * 3 + 1] = Math.random() * 15 + 2;
  petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

  petalVelocities.push({
    x: (Math.random() - 0.5) * 0.02,
    y: -0.01 - Math.random() * 0.03,
    z: (Math.random() - 0.5) * 0.02,
  });
}

petalGeometry.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

function createPetalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffb7d5';
  ctx.beginPath();
  ctx.ellipse(16, 16, 6, 10, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffd0e0';
  ctx.beginPath();
  ctx.ellipse(16, 16, 4, 7, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

const petalMaterial = new THREE.PointsMaterial({
  color: 0xffb7d5,
  size: 0.25,
  map: createPetalTexture(),
  transparent: true,
  opacity: 0.8,
  alphaTest: 0.1,
  sizeAttenuation: true,
});

const petals = new THREE.Points(petalGeometry, petalMaterial);
scene.add(petals);

// 地面散落花瓣
const groundPetalCount = CONFIG.groundPetalCount;
const groundPetalGeo = new THREE.BufferGeometry();
const groundPetalPos = new Float32Array(groundPetalCount * 3);
for (let i = 0; i < groundPetalCount; i++) {
  groundPetalPos[i * 3] = (Math.random() - 0.5) * 30;
  groundPetalPos[i * 3 + 1] = 0.02;
  groundPetalPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
}
groundPetalGeo.setAttribute('position', new THREE.BufferAttribute(groundPetalPos, 3));
const groundPetalMat = new THREE.PointsMaterial({
  color: 0xffd0e0,
  size: 0.15,
  transparent: true,
  opacity: 0.6,
});
const groundPetals = new THREE.Points(groundPetalGeo, groundPetalMat);
scene.add(groundPetals);

// 地面圆形花瓣贴花
const clusterGeo = new THREE.PlaneGeometry(1, 1);
const clusterMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color().setHSL(0.95, 0.6, 0.85),
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.7,
});

function createGroundPetalCluster(x, z, count) {
  const instanced = new THREE.InstancedMesh(clusterGeo, clusterMat, count);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 2;
    dummy.position.set(x + Math.cos(angle) * radius, 0.01, z + Math.sin(angle) * radius);
    dummy.rotation.x = -Math.PI / 2;
    dummy.rotation.z = Math.random() * Math.PI;
    const s = 0.05 + Math.random() * 0.08;
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    instanced.setMatrixAt(i, dummy.matrix);
  }
  scene.add(instanced);
}

for (let z = -20; z < 20; z += 5) {
  createGroundPetalCluster(-2 + Math.random() * 4, z, CONFIG.groundClusterCount);
}

// 远景树木
function createGreenTree(x, z, scale) {
  const treeGroup = new THREE.Group();
  const trunkGeo = new THREE.CylinderGeometry(0.1 * scale, 0.15 * scale, 1.5 * scale, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3020 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0.75 * scale;
  treeGroup.add(trunk);

  const leavesGeo = new THREE.SphereGeometry(0.8 * scale, CONFIG.treeDetail, CONFIG.treeDetail);
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x4a8a4a });
  const leaves = new THREE.Mesh(leavesGeo, leavesMat);
  leaves.position.y = 1.8 * scale;
  treeGroup.add(leaves);

  treeGroup.position.set(x, 0, z);
  scene.add(treeGroup);
}

for (let z = -30; z <= 30; z += 8) {
  createGreenTree(-8, z, 0.6 + Math.random() * 0.4);
}

// 路灯
function createLampPost(x, z) {
  const lampGroup = new THREE.Group();
  const poleGeo = new THREE.CylinderGeometry(0.05, 0.06, 3, CONFIG.treeDetail);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = 1.5;
  lampGroup.add(pole);

  const lampGeo = new THREE.SphereGeometry(0.2, CONFIG.treeDetail, CONFIG.treeDetail);
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xfff8e0,
    emissive: 0xfff8e0,
    emissiveIntensity: 0.5,
  });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.position.y = 3.1;
  lampGroup.add(lamp);

  lampGroup.position.set(x, 0, z);
  scene.add(lampGroup);
}

if (CONFIG.lampCount >= 2) {
  createLampPost(-2.5, 5);
  createLampPost(-2.5, -5);
} else {
  createLampPost(-2.5, 0);
}

// 动画
let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  const positions = petals.geometry.attributes.position.array;
  for (let i = 0; i < petalCount; i++) {
    positions[i * 3] += petalVelocities[i].x + Math.sin(time + i * 0.1) * 0.005;
    positions[i * 3 + 1] += petalVelocities[i].y;
    positions[i * 3 + 2] += petalVelocities[i].z + Math.cos(time + i * 0.1) * 0.005;
    positions[i * 3] += Math.sin(time * 2 + i * 0.5) * 0.002;

    if (positions[i * 3 + 1] < 0) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = 10 + Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
  }
  petals.geometry.attributes.position.needsUpdate = true;

  groundPetals.rotation.y = Math.sin(time * 0.2) * 0.01;

  controls.update();
  renderer.render(scene, camera);
}

// 首帧渲染后隐藏 loading
requestAnimationFrame(() => {
  renderer.render(scene, camera);
  hideLoading();
});

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
