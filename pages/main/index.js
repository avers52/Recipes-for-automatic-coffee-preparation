import { RecipeCardComponent } from '../../components/recipe-card/index.js';
import { HeaderComponent } from '../../components/header/index.js';
import { RecipePage } from '../recipe/index.js';  
import { recipes } from '../../data/recipe.js';
import { convertRecipeIdsToRange, findPalindromeRecipes } from '../../utils/recipeUtils.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filteredRecipes = [...recipes];
    }

    showRecipeRanges() {
        const ids = recipes.map(r => r.id);
        const rangeString = convertRecipeIdsToRange(ids);
        alert(`ID рецептов в наличии: ${rangeString}`);
        console.log('ID рецептов:', rangeString);
    }

    showPalindromeRecipes() {
        const palindromes = findPalindromeRecipes(recipes);
        if (palindromes.length === 0) {
            alert('Рецептов-палиндромов не найдено!');
        } else {
            const names = palindromes.map(r => r.title).join(', ');
            alert(`Найдены рецепты-палиндромы: ${names}`);
            this.filteredRecipes = palindromes;
            this.renderRecipes();
        }
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
        controlsDiv.className = 'd-flex justify-content-between align-items-center mb-4 flex-wrap';
        controlsDiv.innerHTML = `
            <h1>☕ Рецепты для кофемашины</h1>
            <div class="btn-group mt-2 mt-md-0">
                <button class="btn btn-success" id="add-recipe-btn">+ Копия</button>
                <button class="btn btn-info" id="show-ranges-btn">Показать диапазоны ID</button>
                <button class="btn btn-warning" id="show-palindromes-btn">Показать палиндромы</button>
            </div>
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

        document.getElementById('show-ranges-btn').addEventListener('click', () => {
            this.showRecipeRanges();
        });

        document.getElementById('show-palindromes-btn').addEventListener('click', () => {
            this.showPalindromeRecipes();
        });

        this.parent.addEventListener('navigate-home', () => {
            this.render();
        });
    }
}