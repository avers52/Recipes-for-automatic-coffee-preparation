// main.js - точка входа с маршрутизацией
import { MainPage } from './pages/main/index.js';
import { initGallery } from './app.js';

const contentContainer = document.getElementById('app-content');

// Функция показа рецептов (ваша ЛР3)
function showRecipes() {
    contentContainer.innerHTML = '<div id="recipes-root"></div>';
    const recipesRoot = document.getElementById('recipes-root');
    const mainPage = new MainPage(recipesRoot);
    mainPage.render();
}

// Функция показа 3D галереи
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

showRecipes();