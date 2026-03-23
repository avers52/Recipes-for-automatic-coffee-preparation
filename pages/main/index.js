import { RecipeCardComponent } from '../../components/recipe-card/index.js';
import { RecipePage } from '../recipe/index.js';  
import { recipes } from '../../data/recipe.js';
import { convertRecipeIdsToRange, findPalindromeRecipes } from '../../utils/recipeUtils.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filteredRecipes = [...recipes];
        this.allRecipes = [...recipes];
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
        
        const mainContent = document.createElement('div');
        mainContent.className = 'container mt-4';
        this.parent.appendChild(mainContent);

        mainContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1>☕ Рецепты для кофемашины</h1>
                <div class="btn-group mt-2 mt-md-0">
                    <button class="btn btn-success" id="add-recipe-btn">+ Копия</button>
                    <button class="btn btn-info" id="show-ranges-btn">Показать диапазоны ID</button>
                    <button class="btn btn-warning" id="show-palindromes-btn">Показать палиндромы</button>
                </div>
            </div>
            <div class="mb-4">
                <input type="text" class="form-control" id="search-input" placeholder="Поиск рецептов...">
            </div>
            <div id="recipes-list" class="d-flex flex-column align-items-center"></div>
        `;

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