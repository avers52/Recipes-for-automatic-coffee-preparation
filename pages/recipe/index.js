import { HeaderComponent } from '../../components/header/index.js';
import { recipes } from '../../data/recipe.js';

export class RecipePage {
    constructor(parent, recipeId) {
        this.parent = parent;
        this.recipe = recipes.find(r => r.id === recipeId);
        console.log('Загружен рецепт:', this.recipe); // для отладки
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
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${this.recipe.image}"  
                                 class="img-fluid rounded-start" 
                                 alt="${this.recipe.title}" 
                                 style="height: 100%; width: 100%; object-fit: cover;"
                                 onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=600'">  
                        </div>
                        <div class="col-md-7">
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
                </div>
            </div>
            `
        );
    }

    render() {
        this.parent.innerHTML = '';
        
        const header = new HeaderComponent(this.parent);
        header.render();

        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.parent.addEventListener('navigate-home', () => {
            // Событие для возврата домой
        }, { once: true });
    }
}
