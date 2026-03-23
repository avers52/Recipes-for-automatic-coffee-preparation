import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getAllModelsFromDB, saveModel } from './idb.js';

const COFFEE_CUPS = [
    { 
        id: 'espresso', 
        name: '☕ Эспрессо', 
        modelPath: 'models/espresso_cup.glb',  
        description: 'Классическая чашка для эспрессо (40-60 мл)'
    },
    { 
        id: 'glace', 
        name: '🍨 Глясе', 
        modelPath: 'models/glace_cup.glb',     
        description: 'Высокий бокал для кофе с мороженым'
    },
    { 
        id: 'cappuccino', 
        name: '🥛 Капучино', 
        modelPath: 'models/cappuccino_cup.glb', 
        description: 'Широкая чашка для капучино (150-180 мл)'
    },
    { 
        id: 'latte', 
        name: '🥤 Латте', 
        modelPath: 'models/latte_cup.glb',      
        description: 'Высокий стакан для латте (200-250 мл)'
    }
];

let userModels = [];

export async function initGallery() {
    userModels = await getAllModelsFromDB();
    renderGallery();
    setupUploadListener();
}

function renderGallery() {
    const container = document.getElementById('gallery-root');
    if (!container) return;
    
    container.innerHTML = `
        <div class="gallery-container">
            <div class="gallery-header">
                <h1>☕ 3D Модели кофейных чашек</h1>
                <p>Изучайте 3D-модели чашек для разных кофейных напитков</p>
            </div>
            <div class="upload-section">
                <h3>✨ Загрузить свою модель чашки</h3>
                <input type="file" id="model-upload" accept=".glb,.gltf">
                <p class="text-muted mt-2">Поддерживаются форматы .glb и .gltf</p>
            </div>
            <div class="models-grid" id="models-grid"></div>
        </div>
    `;
    
    const grid = document.getElementById('models-grid');
    
    COFFEE_CUPS.forEach(cup => {
        const card = createModelCard(cup, false);
        grid.appendChild(card);
    });
    
    userModels.forEach(model => {
        const card = createModelCard(model, true);
        grid.appendChild(card);
    });
}

function createModelCard(model, isUser) {
    const card = document.createElement('div');
    card.className = 'model-card';
    const safeId = (model.id || model.modelPath || Date.now()).replace(/[\/\.]/g, '-');
    card.dataset.id = safeId;
    
    card.innerHTML = `
        <div class="model-preview" id="preview-${safeId}"></div>
        <div class="model-info">
            <h3>${model.name || 'Кофейная чашка'}</h3>
            <p>${model.description || (isUser ? 'Загружено пользователем' : '3D модель кофейной чашки')}</p>
        </div>
    `;
    
    card.onclick = () => {
        const modelId = encodeURIComponent(model.id || model.modelPath || safeId);
        window.location.href = `detail.html?id=${modelId}&type=${isUser ? 'user' : 'preset'}&name=${encodeURIComponent(model.name || 'Кофейная чашка')}`;
    };
    
    setTimeout(() => createPreview(model, isUser, `preview-${safeId}`), 100);
    
    return card;
}

function createPreview(model, isUser, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('❌ Контейнер не найден:', containerId);
        return;
    }
    
    console.log('📏 Контейнер', containerId, 'размер:', container.clientWidth, 'x', container.clientHeight);
    
    if (container.clientWidth === 0 || container.clientHeight === 0) {
        console.warn('⚠️ Контейнер имеет нулевой размер, устанавливаю принудительно');
        container.style.width = '140px';
        container.style.height = '140px';
    }
    
    function loadAndAnimate(modelUrl) {
        console.log('Загрузка модели:', modelUrl);
        
        loader.load(modelUrl, (gltf) => {
            console.log('✅ Модель загружена:', model.name);
            const obj = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(obj);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            obj.position.sub(center);
            obj.position.y += size.y / 2;
            
            if (maxDim > 0) {
                obj.scale.multiplyScalar(1.2 / maxDim);
            }
            
            scene.add(obj);
            
            function animate() {
                requestAnimationFrame(animate);
                obj.rotation.y += 0.005;
                renderer.render(scene, camera);
            }
            animate();
            
            console.log('🎬 Анимация запущена для:', model.name);
        }, undefined, (error) => {
            console.error('❌ Ошибка загрузки модели:', error);
            showFallback(container, model.name || 'Чашка');
        });
    }
    
    if (isUser && model.buffer) {
        const blobUrl = URL.createObjectURL(new Blob([model.buffer]));
        loadAndAnimate(blobUrl);
    } else if (model.modelPath) {
        loadAndAnimate(model.modelPath);
    } else {
        showFallback(container, model.name || 'Чашка');
    }
}

function showFallback(container, cupName = 'Чашка') {
    container.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#b89a7a;">
        <span style="font-size:48px;">☕</span>
        <span style="font-size:12px;margin-top:8px;">${cupName}</span>
        <span style="font-size:10px;">3D модель не загружена</span>
    </div>`;
}

function setupUploadListener() {
    const uploadInput = document.getElementById('model-upload');
    if (!uploadInput) return;
    
    uploadInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const arrayBuffer = await file.arrayBuffer();
        const modelId = `user_${Date.now()}`;
        const fileName = file.name.replace(/\.(glb|gltf)$/i, '');
        
        await saveModel({
            id: modelId,
            name: fileName,
            description: 'Загружено пользователем',
            buffer: arrayBuffer,
            filename: file.name
        });
        
        userModels = await getAllModelsFromDB();
        renderGallery();
        setupUploadListener();
    });
}

