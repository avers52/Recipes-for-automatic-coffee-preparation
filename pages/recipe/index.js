import { HeaderComponent } from '../../components/header/index.js';
import { recipes } from '../../data/recipes.js';

export class RecipePage {
    constructor(parent, recipeId) {
        this.parent = parent;
        this.recipe = recipes.find(r => r.id === recipeId);
    }

    getHTML() {
        if (!this.recipe) {
            return '<div class="alert alert-danger">Рецепт не найден!</div>';
        }

        const ingredientsList = this.recipe.ingredients
            .map(ing => `<li class="list-group-item">${ing}</li>`)
            .join('');

        const stepsList = this.recipe.steps
            .map(step => `<li class="list-group-item">${step}</li>`)
            .join('');

        return (
            `
            <div class="container mt-4">
                <div class="card">
                    <img src="${this.recipe.image}" class="card-img-top" alt="${this.recipe.title}" style="max-height: 400px; object-fit: cover;">
                    <div class="card-body">
                        <h2 class="card-title">${this.recipe.title}</h2>
                        <p class="card-text">${this.recipe.description}</p>
                        <hr>
                        <h4>Ингредиенты:</h4>
                        <ul class="list-group list-group-flush mb-3">
                            ${ingredientsList}
                        </ul>
                        <h4>Приготовление:</h4>
                        <ol class="list-group list-group-flush list-group-numbered">
                            ${stepsList}
                        </ol>
                    </div>
                </div>
            </div>
            `
        );
    }

    render() {
        this.parent.innerHTML = ''; // полная очистка
        
        // Рендерим header
        const header = new HeaderComponent(this.parent);
        header.render();

        // Основной контент
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        // Слушатель для возврата домой
        this.parent.addEventListener('navigate-home', () => {
            // Это событие поймает MainPage, который должен быть перерендерен
        }, { once: true });
    }
}