import { IngredientCardComponent } from '../../components/ingredient-card/index.js';
import { ingredients } from '../../data/ingredients.js';  
import { IngredientDetailPage } from '../ingredient-detail/index.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.filteredIngredients = [...ingredients];
        this.allIngredients = [...ingredients];
    }

    // Показать детальную страницу ингредиента
    showIngredientDetail(ingredientId) {
        const detailPage = new IngredientDetailPage(this.parent, ingredientId);
        detailPage.render();
    }


    // Показать сообщение 
    showMessage(text, type = 'info') {
        const msgDiv = document.getElementById('stats-message');
        if (msgDiv) {
            msgDiv.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${text}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>`;
            setTimeout(() => {
                msgDiv.innerHTML = '';
            }, 3000);
        }
    }

    // Фильтрация ингредиентов
    filterIngredients(searchTerm) {
        if (!searchTerm) {
            this.filteredIngredients = [...this.allIngredients];
        } else {
            const term = searchTerm.toLowerCase();
            this.filteredIngredients = this.allIngredients.filter(ing => 
                ing.name.toLowerCase().includes(term) ||
                ing.description.toLowerCase().includes(term) ||
                ing.category.toLowerCase().includes(term)
            );
        }
        this.renderIngredients();
    }

    // Добавление копии первого ингредиента
    addFirstCardCopy() {
        if (this.allIngredients.length > 0) {
            const first = this.allIngredients[0];
            const newIngredient = {
                ...first,
                id: Math.max(...this.allIngredients.map(i => i.id)) + 1,
                name: `${first.name} (копия)`
            };
            this.allIngredients.push(newIngredient);
            this.filteredIngredients = [...this.allIngredients];
            this.renderIngredients();
        }
    }

    // Удаление ингредиента
    deleteIngredient(ingredientId) {
        const index = this.allIngredients.findIndex(i => i.id === ingredientId);
        if (index !== -1) {
            this.allIngredients.splice(index, 1);
            this.filteredIngredients = [...this.allIngredients];
            this.renderIngredients();
        }
    }

    renderIngredients() {
        const listContainer = document.getElementById('ingredients-list');
        if (listContainer) {
            listContainer.remove();
        }

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
                onView: (id) => this.showIngredientDetail(id)   
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
            <div class="mb-4">
                <input type="text" class="form-control" id="search-input" placeholder="Поиск ингредиентов...">
            </div>
            <div id="stats-message" class="mb-3"></div>
            <div id="ingredients-list" class="ingredients-grid"></div>
        `;

        this.filteredIngredients = [...this.allIngredients];
        this.renderIngredients();

        // Обработчики событий
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterIngredients(e.target.value);
        });

        document.getElementById('add-ingredient-btn').addEventListener('click', () => {
            this.addFirstCardCopy();
        });

        document.getElementById('show-ranges-btn').addEventListener('click', () => {
            this.showIngredientRanges();
        });


        this.parent.addEventListener('navigate-home', () => {
            this.render();
        });
    }
}