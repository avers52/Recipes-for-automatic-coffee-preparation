import { MainPage } from './pages/main/index.js';

const root = document.getElementById('root');

function renderApp() {
    const mainPage = new MainPage(root);
    mainPage.render();
}

renderApp();

document.addEventListener('navigate-home', () => {
    renderApp();
});

// npm install bootstrap 