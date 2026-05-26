import { ingredients } from '../../data/ingredients.js';

export class IngredientDetailPage {
    constructor(parent, ingredientId) {
        this.parent = parent;
        this.ingredient = ingredients.find(i => i.id === ingredientId);
    }

    getHTML() {
        if (!this.ingredient) {
            return '<div class="alert alert-danger">Ингредиент не найден</div>';
        }

        return `
            <div class="container mt-4">  
                    <div class="card mb-4">
                    <div class="row g-0" style="min-height: 400px;">
                        <div class="col-md-5" style="display: flex; align-items: stretch;">
                            <img src="${this.ingredient.image}" 
                                class="img-fluid" 
                                alt="${this.ingredient.name}"
                                style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px 0 0 12px;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h2 class="card-title">${this.ingredient.name}</h2>
                                <p class="card-text">${this.ingredient.description}</p>
                                <hr>
                                
                                <h5>📋 Характеристики:</h5>
                                <ul class="list-group list-group-flush mb-3">
                                    <li class="list-group-item"><strong>📦 Категория:</strong> ${this.ingredient.category}</li>
                                    <li class="list-group-item"><strong>⚖️ Единица измерения:</strong> ${this.ingredient.unit}</li>
                                    <li class="list-group-item"><strong>💰 Цена за единицу:</strong> ${this.ingredient.price} ₽</li>
                                </ul>
                                
                                <div class="alert alert-info mt-3">
                                    <strong>💡 Совет:</strong> Хранить в сухом прохладном месте. 
                                    Использовать в течение 3 месяцев после открытия.
                                </div>
                                
                                <div class="mt-3">
                                    <button class="btn btn-danger" id="delete-ingredient">🗑️ Удалить ингредиент</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners() {
        document.getElementById('back-to-list')?.addEventListener('click', () => {
            const event = new CustomEvent('back-to-list', { bubbles: true });
            document.getElementById('app-content')?.dispatchEvent(event);
        });

        document.getElementById('delete-ingredient')?.addEventListener('click', () => {
            if (confirm(`Удалить ингредиент "${this.ingredient.name}"?`)) {
                const index = ingredients.findIndex(i => i.id === this.ingredient.id);
                if (index !== -1) {
                    ingredients.splice(index, 1);
                }
                const event = new CustomEvent('back-to-list', { bubbles: true });
                document.getElementById('app-content')?.dispatchEvent(event);
            }
        });
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners();
    }
}