import { IngredientCardComponent } from '../../components/ingredient-card/index.js';
import { IngredientDetailPage } from '../ingredient-detail/index.js';
import { ajax } from '../../modules/ajax.js';
import { ingredientUrls } from '../../modules/ingredientUrls.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filteredIngredients = [];
        this.allIngredients = [];
    }

    // Загрузка данных с сервера
    loadIngredients() {
        ajax.get(ingredientUrls.getIngredients(), (data, status) => {
            if (status === 200 && data) {
                this.allIngredients = data;
                this.filteredIngredients = [...this.allIngredients];
                this.renderIngredients();
            }
        });
    }

    // Фильтрация
    filterIngredients(searchTerm) {
        console.log('🔍 filterIngredients вызван с:', searchTerm);  
        const url = ingredientUrls.getIngredients(searchTerm);
        console.log('📡 URL запроса:', url);  
        
        ajax.get(url, (data, status) => {
            console.log('📦 Ответ сервера, статус:', status, 'данные:', data);  
            if (status === 200 && data) {
                this.allIngredients = data;
                this.filteredIngredients = [...this.allIngredients];
                this.renderIngredients();
            }
        });
    }

    // Добавление копии (POST)
    addFirstCardCopy() {
        if (this.allIngredients.length > 0) {
            const first = this.allIngredients[0];
            const newIngredient = {
                name: `${first.name} (копия)`,
                description: first.description,
                image: first.image,
                category: first.category,
                unit: first.unit,
                price: first.price
            };
            ajax.post(ingredientUrls.createIngredient(), newIngredient, (data, status) => {
                if (status === 201) this.loadIngredients();
            });
        }
    }

    // Удаление (DELETE)
    deleteIngredient(ingredientId) {
        ajax.delete(ingredientUrls.deleteIngredientById(ingredientId), (data, status) => {
            if (status === 204 || status === 200) this.loadIngredients();
        });
    }

    // Показать детальную страницу
    showIngredientDetail(ingredientId) {
        const detailPage = new IngredientDetailPage(this.parent, ingredientId);
        detailPage.render();
    }

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
            <div class="mb-4">
                <input type="text" class="form-control" id="search-input" placeholder="Поиск ингредиентов...">
            </div>
            <div id="stats-message" class="mb-3"></div>
            <div id="ingredients-list" class="ingredients-grid"></div>
        `;

        this.loadIngredients();

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterIngredients(e.target.value);
        });

        document.getElementById('add-ingredient-btn').addEventListener('click', () => {
            this.addFirstCardCopy();
        });

        this.parent.addEventListener('navigate-home', () => {
            this.render();
        });

    }
}