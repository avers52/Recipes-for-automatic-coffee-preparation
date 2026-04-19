import { ajax } from '../../modules/ajax.js';
import { ingredientUrls } from '../../modules/ingredientUrls.js';

export class IngredientFormPage {
    constructor(parent, params = {}) {
        this.parent = parent;
        this.id = params.id;
        this.isEdit = !!this.id;
    }

    getHTML() {
        return `
            <div class="container mt-4">
                <button class="btn btn-secondary mb-3" id="back-btn">← Назад</button>
                <div class="card">
                    <div class="card-body">
                        <h2>${this.isEdit ? '✏️ Редактировать' : '➕ Добавить'} ингредиент</h2>
                        <form id="ingredient-form">
                            <div class="mb-3">
                                <label>Название</label>
                                <input type="text" class="form-control" id="name" required>
                            </div>
                            <div class="mb-3">
                                <label>Описание</label>
                                <textarea class="form-control" id="description"></textarea>
                            </div>
                            <div class="mb-3">
                                <label>URL изображения</label>
                                <input type="text" class="form-control" id="image">
                            </div>
                            <div class="mb-3">
                                <label>Категория</label>
                                <input type="text" class="form-control" id="category">
                            </div>
                            <div class="mb-3">
                                <label>Единица измерения</label>
                                <input type="text" class="form-control" id="unit">
                            </div>
                            <div class="mb-3">
                                <label>Цена</label>
                                <input type="number" class="form-control" id="price">
                            </div>
                            <button type="submit" class="btn btn-primary">💾 Сохранить</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners() {
        document.getElementById('back-btn')?.addEventListener('click', () => {
            window.location.hash = '';
        });

        document.getElementById('ingredient-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                image: document.getElementById('image').value,
                category: document.getElementById('category').value,
                unit: document.getElementById('unit').value,
                price: parseInt(document.getElementById('price').value) || 0
            };

            if (this.isEdit) {
                ajax.patch(ingredientUrls.updateIngredientById(this.id), formData, () => {
                    window.location.hash = '';
                });
            } else {
                ajax.post(ingredientUrls.createIngredient(), formData, () => {
                    window.location.hash = '';
                });
            }
        });
    }

    loadData() {
        if (this.isEdit) {
            ajax.get(ingredientUrls.getIngredientById(this.id), (data) => {
                if (data) {
                    document.getElementById('name').value = data.name || '';
                    document.getElementById('description').value = data.description || '';
                    document.getElementById('image').value = data.image || '';
                    document.getElementById('category').value = data.category || '';
                    document.getElementById('unit').value = data.unit || '';
                    document.getElementById('price').value = data.price || '';
                }
            });
        }
    }

    render() {
        this.parent.innerHTML = this.getHTML();
        this.addListeners();
        this.loadData();
    }
}