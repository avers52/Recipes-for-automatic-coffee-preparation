import { fetchClient } from '../../modules/fetch.js';
import { ingredientUrls } from '../../modules/ingredientUrls.js';

export class IngredientDetailPage {
    constructor(parent, ingredientId) {
        this.parent = parent;
        this.ingredientId = ingredientId;
        this.ingredient = null;
    }

    async loadIngredient() {
        try {
            const url = ingredientUrls.getIngredientById(this.ingredientId);
            const data = await fetchClient.get(url);
            this.ingredient = data;
            this.renderData();
        } catch (error) {
            console.error('Ошибка загрузки ингредиента:', error);
            this.showError();
        }
    }

    getHTML() {
        if (!this.ingredient) {
            return '<div class="alert alert-info">Загрузка...</div>';
        }

        return `
            <div class="container mt-4">
                <button class="btn btn-secondary mb-3" id="back-to-list">← Назад к списку</button>
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${this.ingredient.image}" class="img-fluid rounded-start" 
                                 alt="${this.ingredient.name}" style="width: 100%; max-height: 300px; object-fit: cover;">
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
        document.getElementById('back-to-list')?.addEventListener('click', () => {
            window.location.hash = '';  
            window.location.reload();   
        });

        // Кнопка "Удалить"
        document.getElementById('delete-ingredient')?.addEventListener('click', async () => {
            if (confirm(`Удалить ингредиент "${this.ingredient.name}"?`)) {
                try {
                    await fetchClient.delete(ingredientUrls.deleteIngredientById(this.ingredientId));
                    window.location.hash = '';
                } catch (error) {
                    console.error('Ошибка удаления:', error);
                }
            }
        });
    }

    render() {
        this.parent.innerHTML = '<div id="ingredient-detail-container"></div>';
        this.loadIngredient();
    }
}