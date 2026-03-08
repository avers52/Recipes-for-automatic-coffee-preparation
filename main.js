import { MainPage } from './pages/main/index.js';

const root = document.getElementById('root');

// Функция для запуска приложения
function renderApp() {
    const mainPage = new MainPage(root);
    mainPage.render();
}

// Запуск
renderApp();

document.addEventListener('navigate-home', () => {
    renderApp();
});