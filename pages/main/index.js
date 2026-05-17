import { IngredientCardComponent } from '../../components/ingredient-card/index.js';
import { IngredientDetailPage } from '../ingredient-detail/index.js';
import { fetchClient } from '../../modules/fetch.js';
import { ingredientUrls } from '../../modules/ingredientUrls.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filteredIngredients = [];
        this.allIngredients = [];
    }

    // Загрузка данных с сервера
    async loadIngredients() {
        const data = await fetchClient.get(ingredientUrls.getIngredients());
        this.allIngredients = data;
        this.filteredIngredients = [...this.allIngredients];
        this.renderIngredients();
    }

    // Фильтрация
    async filterIngredients(searchTerm) {
        const url = ingredientUrls.getIngredients(searchTerm);
        const data = await fetchClient.get(url);
        this.allIngredients = data;
        this.filteredIngredients = [...this.allIngredients];
        this.renderIngredients();
    }

    // Добавление нового ингредиента (POST)
    async addNewIngredient() {
        const newIngredient = {
            name: "Новый ингредиент",
            description: "Введите описание",
            image: "https://via.placeholder.com/200",
            category: "основной",
            unit: "гр",
            price: 0
        };
        
        await fetchClient.post(ingredientUrls.createIngredient(), newIngredient);
        this.loadIngredients();
    }

    // Удаление (DELETE)
    async deleteIngredient(ingredientId) {
        await fetchClient.delete(ingredientUrls.deleteIngredientById(ingredientId));
        this.loadIngredients();
    }

    // Показать детальную страницу
    showIngredientDetail(ingredientId) {
        const detailPage = new IngredientDetailPage(this.parent, ingredientId);
        detailPage.render();
    }

    // Рендер списка карточек
    renderIngredients() {
        const listContainer = document.getElementById('ingredients-list');
        if (listContainer) listContainer.remove();

        const container = document.createElement('div');
        container.id = 'ingredients-list';
        container.className = 'ingredients-grid';
        this.parent.appendChild(container);

        if (this.filteredIngredients.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Ингредиенты не найдены</div>';
            return;
        }

        this.filteredIngredients.forEach(ingredientData => {
            const ingredientCard = new IngredientCardComponent(container, {
                onDelete: (id) => this.deleteIngredient(id),
                onView: (id) => this.showIngredientDetail(id),
                onEdit: (id) => window.location.hash = `ingredient-form/edit/${id}`  
            });
            ingredientCard.render(ingredientData);
        });
    }

    // ГЛАВНЫЙ РЕНДЕР
    render() {
        this.parent.innerHTML = '';
        
        const mainContent = document.createElement('div');
        mainContent.className = 'container mt-4';
        this.parent.appendChild(mainContent);
    
        mainContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1>📦 Ингредиенты для кофе</h1>
                <div class="btn-group mt-2 mt-md-0">
                    <button class="btn btn-success" id="add-ingredient-btn">+ Добавить ингредиент</button>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-md-8">
                    <input type="text" class="form-control" id="search-input" placeholder="Поиск ингредиентов...">
                </div>
                <div class="col-md-4">
                    <button class="btn btn-primary w-100" id="search-btn">🔍 Поиск</button>
                </div>
            </div>
            <div id="stats-message" class="mb-3"></div>
            <div id="ingredients-list" class="ingredients-grid"></div>
        `;
    
        this.loadIngredients();
    
        // Поиск по кнопке
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = document.getElementById('search-input').value;
                this.filterIngredients(searchTerm);
            });
        }
    
        // Добавление нового ингредиента
        const addBtn = document.getElementById('add-ingredient-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.addNewIngredient();
            });
        }
    
        this.parent.addEventListener('navigate-home', () => {
            this.render();
        });
    }   
}