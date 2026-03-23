// main.js
import { MainPage } from './pages/main/index.js';
import { initGallery } from './app.js';

const contentContainer = document.getElementById('app-content');

function showRecipes() {
    contentContainer.innerHTML = '<div id="recipes-root"></div>';
    const mainPage = new MainPage(contentContainer.querySelector('#recipes-root'));
    mainPage.render();
}

function showGallery() {
    contentContainer.innerHTML = '<div id="gallery-root"></div>';
    initGallery();
}

// Навигация
document.getElementById('nav-recipes')?.addEventListener('click', (e) => {
    e.preventDefault();
    showRecipes();
});

document.getElementById('nav-gallery')?.addEventListener('click', (e) => {
    e.preventDefault();
    showGallery();
});

document.getElementById('home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    showRecipes();
});

// Проверяем параметр URL при загрузке
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('view') === 'gallery') {
    showGallery();
} else {
    showRecipes();
}

// npm install bootstrap