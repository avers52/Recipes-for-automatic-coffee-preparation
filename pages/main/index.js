import { RecipeCardComponent } from '../../components/recipe-card/index.js';
import { HeaderComponent } from '../../components/header/index.js';
import { RecipePage } from '../recipe/index.js';  
import { recipes } from '../../data/recipe.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filteredRecipes = [...recipes];
    }

    filterRecipes(searchTerm) {
        if (!searchTerm) {
            this.filteredRecipes = [...recipes];
        } else {
            this.filteredRecipes = recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        this.renderRecipes();
    }

    addFirstCardCopy() {
        if (recipes.length > 0) {
            const firstRecipe = recipes[0];
            const newRecipe = {
                ...firstRecipe,
                id: Math.max(...recipes.map(r => r.id)) + 1,
                title: `${firstRecipe.title} (копия)`
            };
            recipes.push(newRecipe);
            this.filteredRecipes = [...recipes];
            this.renderRecipes();
        }
    }

    deleteRecipe(recipeId) {
        const index = recipes.findIndex(r => r.id === recipeId);
        if (index !== -1) {
            recipes.splice(index, 1);
            this.filteredRecipes = [...recipes];
            this.renderRecipes();
        }
    }

    // ⬇️ МЕТОД, КОТОРЫЙ ИСПОЛЬЗУЕТ RecipePage
    showRecipe(recipeId) {
        console.log('Showing recipe:', recipeId);
        const recipePage = new RecipePage(this.parent, recipeId);
        recipePage.render();
    }

    renderRecipes() {
        const listContainer = document.getElementById('recipes-list');
        if (listContainer) {
            listContainer.remove();
        }

        const container = document.createElement('div');
        container.id = 'recipes-list';
        container.className = 'd-flex flex-column align-items-center';
        this.parent.appendChild(container);

        if (this.filteredRecipes.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Рецепты не найдены</div>';
            return;
        }

        this.filteredRecipes.forEach(recipeData => {
            const recipeCard = new RecipeCardComponent(container, {
                onDelete: (id) => this.deleteRecipe(id)
            });
            recipeCard.render(recipeData);
        });

        // ⬇️ ОБРАБОТЧИК СОБЫТИЯ, КОТОРЫЙ ВЫЗЫВАЕТ showRecipe
        container.addEventListener('recipe-selected', (e) => {
            console.log('Recipe selected event caught:', e.detail.recipeId);
            this.showRecipe(e.detail.recipeId);
        });
    }

    render() {
        this.parent.innerHTML = '';
        
        const header = new HeaderComponent(this.parent);
        header.render();

        const mainContent = document.createElement('div');
        mainContent.className = 'container';
        this.parent.appendChild(mainContent);

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'd-flex justify-content-between align-items-center mb-4';
        controlsDiv.innerHTML = `
            <h1>☕ Рецепты для кофемашины</h1>
            <button class="btn btn-success" id="add-recipe-btn">+ Добавить копию первой карточки</button>
        `;
        mainContent.appendChild(controlsDiv);

        const searchDiv = document.createElement('div');
        searchDiv.className = 'mb-4';
        searchDiv.innerHTML = `
            <input type="text" class="form-control" id="search-input" placeholder="Поиск рецептов...">
        `;
        mainContent.appendChild(searchDiv);

        const listContainer = document.createElement('div');
        listContainer.id = 'recipes-list';
        listContainer.className = 'd-flex flex-column align-items-center';
        mainContent.appendChild(listContainer);

        this.filteredRecipes = [...recipes];
        this.renderRecipes();

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterRecipes(e.target.value);
        });

        document.getElementById('add-recipe-btn').addEventListener('click', () => {
            this.addFirstCardCopy();
        });

        this.parent.addEventListener('navigate-home', () => {
            this.render();
        });
    }
}