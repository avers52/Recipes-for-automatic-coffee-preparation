import { ajax } from '../../modules/ajax.js';
import { ingredientUrls } from '../../modules/ingredientUrls.js';

export class IngredientDetailPage {
    constructor(parent, ingredientId) {
        this.parent = parent;
        this.ingredientId = ingredientId;
        this.ingredient = null;
    }

    loadIngredient() {
        ajax.get(ingredientUrls.getIngredientById(this.ingredientId), (data, status) => {
            if (status === 200 && data) {
                this.ingredient = data;
                this.renderData();
            } else {
                this.showError();
            }
        });
    }

    getHTML() {
        if (!this.ingredient) {
            return '<div class="alert alert-info">Загрузка...</div>';
        }

        return `
            <div class="container mt-4">
                <button class="btn btn-secondary mb-3" id="back-to-list">← Назад к списку</button>
                
                <div class="card mb-4">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${this.ingredient.image}" 
                                 class="img-fluid rounded-start" 
                                 alt="${this.ingredient.name}"
                                 style="width: 100%; max-height: 280px; object-fit: cover;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h2 class="card-title">${this.ingredient.name}</h2>
                                <p class="card-text">${this.ingredient.description}</p>
                                <hr>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><strong>📦 Категория:</strong> ${this.ingredient.category}</li>
                                    <li class="list-group-item"><strong>⚖️ Единица измерения:</strong> ${this.ingredient.unit}</li>
                                    <li class="list-group-item"><strong>💰 Цена:</strong> ${this.ingredient.price} ₽</li>
                                </ul>
                                <div class="mt-3">
                                    <button class="btn btn-warning" id="edit-ingredient">✏️ Редактировать</button>
                                    <button class="btn btn-danger" id="delete-ingredient">🗑️ Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showError() {
        const container = document.getElementById('ingredient-detail-container');
        if (container) {
            container.innerHTML = '<div class="alert alert-danger">Ингредиент не найден</div>';
        }
    }

    renderData() {
        const container = document.getElementById('ingredient-detail-container');
        if (container) {
            container.innerHTML = this.getHTML();
            this.addListeners();
        }
    }

    addListeners() {
        // Кнопка "Назад"
        const backBtn = document.getElementById('back-to-list');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // Просто переходим на главную страницу
                window.location.href = 'index.html';
            });
        }
    
        // Кнопка "Редактировать"
        const editBtn = document.getElementById('edit-ingredient');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                window.location.href = `ingredient-form.html?id=${this.ingredient.id}`;
            });
        }
    
        // Кнопка "Удалить"
        const deleteBtn = document.getElementById('delete-ingredient');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                if (confirm(`Удалить ингредиент "${this.ingredient.name}"?`)) {
                    await fetchClient.delete(ingredientUrls.deleteIngredientById(this.ingredient.id));
                    window.location.href = 'index.html';
                }
            });
        }
    }

    render() {
        this.parent.innerHTML = '<div id="ingredient-detail-container"></div>';
        this.loadIngredient();
    }
}