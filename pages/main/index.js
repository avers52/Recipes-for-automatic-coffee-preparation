import { RecipeCardComponent } from '../../components/recipe-card/index.js';
import { HeaderComponent } from '../../components/header/index.js';
import { RecipePage } from '../recipe/index.js';
import { recipes } from '../../data/recipes.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filteredRecipes = [...recipes]; // копия для фильтрации
    }

    // Метод для фильтрации
    filterRecipes(searchTerm) {
        if (!searchTerm) {
            this.filteredRecipes = [...recipes];
        } else {
            this.filteredRecipes = recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        this.renderRecipes(); // перерисовываем список
    }

    // Метод для добавления копии первой карточки
    addFirstCardCopy() {
        if (recipes.length > 0) {
            const firstRecipe = recipes[0];
            const newRecipe = {
                ...firstRecipe,
                id: Math.max(...recipes.map(r => r.id)) + 1, // новый id
                title: `${firstRecipe.title} (копия)`
            };
            recipes.push(newRecipe);
            this.filteredRecipes = [...recipes];
            this.renderRecipes();
        }
    }

    // Метод для удаления карточки
    deleteRecipe(recipeId) {
        const index = recipes.findIndex(r => r.id === recipeId);
        if (index !== -1) {
            recipes.splice(index, 1);
            this.filteredRecipes = [...recipes];
            this.renderRecipes();
        }
    }

    renderRecipes() {
        // Очищаем контейнер для списка (но оставляем header)
        const listContainer = document.getElementById('recipes-list');
        if (listContainer) {
            listContainer.remove();
        }

        // Создаем новый контейнер для списка
        const container = document.createElement('div');
        container.id = 'recipes-list';
        container.className = 'd-flex flex-column align-items-center';
        this.parent.appendChild(container);

        // Если нет рецептов, показываем сообщение
        if (this.filteredRecipes.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Рецепты не найдены</div>';
            return;
        }

        // Рендерим карточки
        this.filteredRecipes.forEach(recipeData => {
            const recipeCard = new RecipeCardComponent(container, {
                onDelete: (id) => this.deleteRecipe(id) // передаем callback удаления
            });
            recipeCard.render(recipeData);
        });
    }

    render() {
        this.parent.innerHTML = ''; // полная очистка
        
        // Рендерим header
        const header = new HeaderComponent(this.parent);
        header.render();

        // Контейнер для основного контента
        const mainContent = document.createElement('div');
        mainContent.className = 'container';
        this.parent.appendChild(mainContent);

        // Заголовок и кнопка добавления
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'd-flex justify-content-between align-items-center mb-4';
        controlsDiv.innerHTML = `
            <h1>☕ Рецепты для кофемашины</h1>
            <button class="btn btn-success" id="add-recipe-btn">+ Добавить копию первой карточки</button>
        `;
        mainContent.appendChild(controlsDiv);

        // Поле поиска
        const searchDiv = document.createElement('div');
        searchDiv.className = 'mb-4';
        searchDiv.innerHTML = `
            <input type="text" class="form-control" id="search-input" placeholder="Поиск рецептов...">
        `;
        mainContent.appendChild(searchDiv);

        // Контейнер для списка рецептов
        const listContainer = document.createElement('div');
        listContainer.id = 'recipes-list';
        listContainer.className = 'd-flex flex-column align-items-center';
        mainContent.appendChild(listContainer);

        // Рендерим рецепты
        this.filteredRecipes = [...recipes];
        this.renderRecipes();

        // Обработчик поиска
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterRecipes(e.target.value);
        });

        // Обработчик добавления
        document.getElementById('add-recipe-btn').addEventListener('click', () => {
            this.addFirstCardCopy();
        });

        // Обработчик навигации домой
        this.parent.addEventListener('navigate-home', () => {
            this.render();
        });
    }
}