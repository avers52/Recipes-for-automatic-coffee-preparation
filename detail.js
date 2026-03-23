// detail.js - детальный просмотр 3D модели
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- Получаем параметры из URL ---
const urlParams = new URLSearchParams(window.location.search);
const modelPath = urlParams.get('model');
const modelName = urlParams.get('name') || 'Кофейная чашка';

console.log('Загрузка модели:', modelPath);
console.log('Название:', modelName);

document.getElementById('model-title').textContent = modelName;

// --- Настройка сцены ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b1b0e);

// --- Камера ---
const container = document.getElementById('canvas-container');
const width = container.clientWidth;
const height = container.clientHeight;

const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
camera.position.set(3, 2, 4);
camera.lookAt(0, 0.5, 0);

// --- Рендерер ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// --- Освещение ---
const mainLight = new THREE.DirectionalLight(0xffffff, 1);
mainLight.position.set(3, 5, 2);
mainLight.castShadow = true;
scene.add(mainLight);

const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const fillLight = new THREE.PointLight(0xd4b48c, 0.5);
fillLight.position.set(1, 2, 2);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xffaa66, 0.4);
backLight.position.set(-2, 2, -3);
scene.add(backLight);

// --- Пол ---
const planeGeometry = new THREE.CircleGeometry(4, 32);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x443322, roughness: 0.6, metalness: 0.1 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.7;
plane.receiveShadow = true;
scene.add(plane);

// Вспомогательная сетка
const gridHelper = new THREE.GridHelper(8, 20, 0xaa8866, 0x664422);
gridHelper.position.y = -0.65;
scene.add(gridHelper);

// --- Управление ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.autoRotateSpeed = 1.5;
controls.enableZoom = true;
controls.enablePan = true;
controls.zoomSpeed = 1.2;
controls.target.set(0, 1, 0);

// --- Загрузка модели ---
const loader = new GLTFLoader();
const loadingEl = document.getElementById('loading');

function loadModel(modelUrl) {
    loadingEl.style.display = 'block';
    
    loader.load(
        modelUrl,
        (gltf) => {
            const model = gltf.scene;
            
            model.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 1.8;
            const scale = targetSize / maxDim;
            model.scale.set(scale, scale, scale);
            
            const scaledBox = new THREE.Box3().setFromObject(model);
            const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
            model.position.sub(scaledCenter);
            
            const minY = scaledBox.min.y * scale;
            model.position.y += -minY + 0.2;
            
            scene.add(model);
            loadingEl.style.display = 'none';
            
            console.log('✅ Модель загружена:', modelName);
        },
        (xhr) => {
            const percent = Math.floor((xhr.loaded / xhr.total) * 100);
            loadingEl.textContent = `⏳ Загрузка: ${percent}%`;
        },
        (error) => {
            console.error('❌ Ошибка загрузки модели:', error);
            loadingEl.innerHTML = '<span style="color: #ff8888;">❌ Ошибка загрузки модели</span>';
        }
    );
}

if (modelPath) {
    loadModel(modelPath);
} else {
    loadingEl.innerHTML = '<span style="color: #ff8888;">❌ Модель не найдена</span>';
}

// --- Анимация ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- Обработка изменения размера ---
window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});

// ============================================
// КНОПКИ УПРАВЛЕНИЯ
// ============================================

let currentFov = 45;
document.getElementById('zoom-in')?.addEventListener('click', () => {
    currentFov = Math.max(20, currentFov - 5);
    camera.fov = currentFov;
    camera.updateProjectionMatrix();
});

document.getElementById('zoom-out')?.addEventListener('click', () => {
    currentFov = Math.min(100, currentFov + 5);
    camera.fov = currentFov;
    camera.updateProjectionMatrix();
});

const distance = 3.5;
document.getElementById('view-front')?.addEventListener('click', () => {
    camera.position.set(0, 1.2, distance);
    controls.target.set(0, 0.8, 0);
    controls.update();
});

document.getElementById('view-back')?.addEventListener('click', () => {
    camera.position.set(0, 1.2, -distance);
    controls.target.set(0, 0.8, 0);
    controls.update();
});

document.getElementById('view-left')?.addEventListener('click', () => {
    camera.position.set(-distance, 1.2, 0);
    controls.target.set(0, 0.8, 0);
    controls.update();
});

document.getElementById('view-right')?.addEventListener('click', () => {
    camera.position.set(distance, 1.2, 0);
    controls.target.set(0, 0.8, 0);
    controls.update();
});

let autoRotateFlag = false;
const rotateBtn = document.getElementById('auto-rotate');
if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
        autoRotateFlag = !autoRotateFlag;
        controls.autoRotate = autoRotateFlag;
        rotateBtn.textContent = autoRotateFlag ? '🔄 Автовращение (вкл)' : '🔄 Автовращение (выкл)';
    });
}

document.getElementById('back-to-gallery')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'index.html?view=gallery';
});