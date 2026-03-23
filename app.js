// app.js - с 3D превью в карточках
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const standardRecipes = [
    { id: 'espresso', name: '☕ Эспрессо', modelPath: 'models/espresso_cup.glb', description: 'Классическая чашка для эспрессо (40-60 мл)' },
    { id: 'glace', name: '🍨 Глясе', modelPath: 'models/glace_cup.glb', description: 'Высокий бокал для кофе с мороженым' },
    { id: 'cappuccino', name: '🥛 Капучино', modelPath: 'models/cappuccino_cup.glb', description: 'Широкая чашка для капучино (150-180 мл)' },
    { id: 'latte', name: '🥤 Латте', modelPath: 'models/latte_cup.glb', description: 'Высокий стакан для латте (200-250 мл)' }
];

// Функция создания 3D превью
function createModelPreview(modelPath, container) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3d2a17);
    
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(2, 1.5, 2);
    camera.lookAt(0, 0.5, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(200, 200);
    renderer.setClearColor(0x3d2a17);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xfff0e0, 1);
    mainLight.position.set(2, 3, 2);
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0xd4b48c, 0.4);
    fillLight.position.set(1, 1.5, 1);
    scene.add(fillLight);
    
    const loader = new GLTFLoader();
    
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        
        // Вычисляем bounding box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        
        // Масштабируем до одинакового размера
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 1.2;
        const scale = targetSize / maxDim;
        model.scale.set(scale, scale, scale);
        
        // Центрируем
        const newBox = new THREE.Box3().setFromObject(model);
        const center = newBox.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        scene.add(model);
        
        // Рендерим один кадр
        renderer.render(scene, camera);
    }, undefined, (error) => {
        console.error('Ошибка загрузки превью:', error);
        container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#b89a7a;">☕</div>';
    });
}

export async function initGallery() {
    const container = document.getElementById('gallery-root');
    if (!container) return;
    
    container.innerHTML = `
        <div style="padding:20px">
            <h1 style="text-align:center;color:#d4a574;margin-bottom:20px;">☕ 3D Модели кофейных чашек</h1>
            <p style="text-align:center;color:#b89a7a;margin-bottom:30px;">Нажмите на карточку для детального просмотра</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;max-width:1200px;margin:0 auto;padding:0 20px" id="models-grid"></div>
        </div>
    `;
    
    const grid = document.getElementById('models-grid');
    
    standardRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.style.background = '#3d2a17';
        card.style.borderRadius = '12px';
        card.style.padding = '15px';
        card.style.cursor = 'pointer';
        card.style.textAlign = 'center';
        card.style.transition = 'transform 0.2s';
        
        card.onmouseenter = () => card.style.transform = 'translateY(-5px)';
        card.onmouseleave = () => card.style.transform = 'translateY(0)';
        
        const preview = document.createElement('div');
        preview.style.width = '100%';
        preview.style.aspectRatio = '1/1';
        preview.style.background = '#2b1b0e';
        preview.style.borderRadius = '8px';
        preview.style.marginBottom = '12px';
        preview.style.overflow = 'hidden';
        
        const title = document.createElement('h3');
        title.textContent = recipe.name;
        title.style.color = '#f0e6d2';
        title.style.margin = '10px 0 5px';
        title.style.fontSize = '1.1rem';
        
        const desc = document.createElement('p');
        desc.textContent = recipe.description;
        desc.style.color = '#b89a7a';
        desc.style.fontSize = '0.75rem';
        desc.style.margin = '0';
        
        card.appendChild(preview);
        card.appendChild(title);
        card.appendChild(desc);
        
        // Создаем 3D превью
        createModelPreview(recipe.modelPath, preview);
        
        card.onclick = () => {
            window.location.href = `detail.html?model=${encodeURIComponent(recipe.modelPath)}&name=${encodeURIComponent(recipe.name)}`;
        };
        
        grid.appendChild(card);
    });
}