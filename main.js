import { MainPage } from './pages/main/index.js';
import { IngredientFormPage } from './pages/ingredient-form/index.js';
import { IngredientDetailPage } from './pages/ingredient-detail/index.js';

const contentContainer = document.getElementById('app-content');

function showMainPage() {
    contentContainer.innerHTML = '<div id="main-root"></div>';
    const mainPage = new MainPage(contentContainer.querySelector('#main-root'));
    mainPage.render();
}

function showIngredientForm(params = {}) {
    contentContainer.innerHTML = '<div id="form-root"></div>';
    const formPage = new IngredientFormPage(contentContainer.querySelector('#form-root'), params);
    formPage.render();
}

function showIngredientDetail(ingredientId) {
    contentContainer.innerHTML = '<div id="detail-root"></div>';
    const detailPage = new IngredientDetailPage(contentContainer.querySelector('#detail-root'), ingredientId);
    detailPage.render();
}

// Навигация
const navRecipes = document.getElementById('nav-recipes');
const homeLink = document.getElementById('home-link');

if (navRecipes) {
    navRecipes.addEventListener('click', (e) => {
        e.preventDefault();
        showMainPage();
        window.location.hash = '';
    });
}

if (homeLink) {
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showMainPage();
        window.location.hash = '';
    });
}

// Обработка hash URL
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#ingredient-form/edit/')) {
        const id = hash.split('/').pop();
        showIngredientForm({ id });
    } else if (hash === '#ingredient-form/new') {
        showIngredientForm({});
    } else if (hash.startsWith('#ingredient-detail/')) {
        const id = hash.split('/').pop();
        showIngredientDetail(id);
    } else {
        showMainPage();
    }
});

// Старт
showMainPage();