import { MainPage } from './pages/main/index.js';

const contentContainer = document.getElementById('app-content');

function showRecipes() {
    contentContainer.innerHTML = '<div id="recipes-root"></div>';
    const mainPage = new MainPage(contentContainer.querySelector('#recipes-root'));
    mainPage.render();
    
    // Обработчик возврата на главную с детальной страницы
    contentContainer.addEventListener('back-to-list', () => {
        showRecipes();
    }, { once: true });
}

function showGallery() {
    contentContainer.innerHTML = '<div id="gallery-root"></div>';
    initGallery();
}

function showIngredientForm(params) { 
    contentContainer.innerHTML = '<div id="form-root"></div>';
    const formPage = new IngredientFormPage(contentContainer.querySelector('#form-root'), params);
    formPage.render();
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

document.getElementById('add-ingredient-btn').addEventListener('click', () => {
    showIngredientForm({}); 
});

// Проверяем параметр URL при загрузке
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('view') === 'gallery') {
    showGallery();
} else {
    showRecipes();
}

// npm install bootstrap