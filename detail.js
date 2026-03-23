// detail.js - детальный просмотр 3D модели
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getModelById } from './idb.js';

// Пресеты для кофейных чашек
const COFFEE_CUPS = {
    'espresso': { name: '☕ Эспрессо', model: 'models/espresso_cup.glb', volume: '40-60 мл' },
    'glace': { name: '🍨 Глясе', model: 'models/glace_cup.glb', volume: '250-300 мл' },
    'cappuccino': { name: '🥛 Капучино', model: 'models/cappuccino_cup.glb', volume: '150-180 мл' },
    'latte': { name: '🥤 Латте', model: 'models/latte_cup.glb', volume: '200-250 мл' }
};

let scene, camera, renderer, controls, currentModel;

const params = new URLSearchParams(window.location.search);
const modelId = params.get('id');
const modelType = params.get('type');
const modelName = params.get('name');

async function init() {
    const canvas = document.getElementById('detail-canvas');
    if (!canvas) return;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 2, 4);
    
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.2;
    controls.enablePan = true;
    controls.target.set(0, 1, 0);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 1);
    mainLight.position.set(3, 5, 2);
    mainLight.castShadow = true;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0xd4b48c, 0.5);
    fillLight.position.set(1, 2, 2);
    scene.add(fillLight);
    
    const backLight = new THREE.DirectionalLight(0xffaa66, 0.4);
    backLight.position.set(-2, 1, -3);
    scene.add(backLight);
    
    const gridHelper = new THREE.GridHelper(8, 20, 0xaa9977, 0x665544);
    gridHelper.position.y = -0.8;
    scene.add(gridHelper);
    
    await loadModel();
    animate();
    setupControls();
}

async function loadModel() {
    let modelUrl;
    let title = modelName || '';
    
    if (modelType === 'preset' && COFFEE_CUPS[modelId]) {
        const preset = COFFEE_CUPS[modelId];
        modelUrl = preset.model;
        title = preset.name;
        document.getElementById('model-title').innerHTML = `${title} <span style="font-size:0.8rem;color:#aaa;">${preset.volume}</span>`;
    } else if (modelType === 'user') {
        const userModel = await getModelById(modelId);
        if (userModel && userModel.buffer) {
            modelUrl = URL.createObjectURL(new Blob([userModel.buffer]));
            title = userModel.name;
            document.getElementById('model-title').textContent = title || 'Кофейная чашка';
        }
    } else {
        document.getElementById('model-title').textContent = title || 'Кофейная чашка';
    }
    
    if (!modelUrl) {
        console.error('Модель не найдена');
        return;
    }
    
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
        if (currentModel) scene.remove(currentModel);
        
        currentModel = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(currentModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        currentModel.position.sub(center);
        currentModel.position.y += size.y / 2;
        
        if (maxDim > 0) {
            currentModel.scale.multiplyScalar(1.5 / maxDim);
        }
        
        scene.add(currentModel);
        controls.target.set(0, size.y / 2, 0);
        controls.update();
    }, undefined, (error) => {
        console.error('Ошибка загрузки модели:', error);
    });
}

function setupControls() {
    const zoomStep = 0.5;
    
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        camera.position.addScaledVector(direction, -zoomStep);
        controls.update();
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', () => {
        const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        camera.position.addScaledVector(direction, zoomStep);
        controls.update();
    });
    
    const setView = (x, z) => {
        const dist = Math.max(3, camera.position.distanceTo(controls.target));
        camera.position.set(x, 1.5, z);
        controls.target.set(0, 1, 0);
        controls.update();
    };
    
    document.getElementById('view-front')?.addEventListener('click', () => setView(0, 3));
    document.getElementById('view-back')?.addEventListener('click', () => setView(0, -3));
    document.getElementById('view-left')?.addEventListener('click', () => setView(-3, 0));
    document.getElementById('view-right')?.addEventListener('click', () => setView(3, 0));
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();

// Обработчик кнопки "Назад в галерею"
document.getElementById('back-to-gallery')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Возвращаемся на главную страницу с галереей
    window.location.href = 'index.html?view=gallery';
});