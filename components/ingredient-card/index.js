// components/ingredient-card/index.js
export class IngredientCardComponent {
    constructor(parent, callbacks = {}) {
        this.parent = parent;
        this.onDelete = callbacks.onDelete || (() => {});
        this.onView = callbacks.onView || (() => {});
        this.onEdit = callbacks.onEdit || (() => {});  // ← ДОБАВИТЬ
    }

    getHTML(data) {
        return `
            <div class="ingredient-card" id="ingredient-card-${data.id}">
                <img src="${data.image}" class="ingredient-card-img" alt="${data.name}">
                <div class="ingredient-card-body">
                    <h3 class="ingredient-card-title">${data.name}</h3>
                    <p class="ingredient-card-desc">${data.description}</p>
                    <div class="ingredient-card-info">
                        <span>📦 ${data.category}</span>
                        <span>⚖️ ${data.unit}</span>
                        <span>💰 ${data.price} ₽</span>
                    </div>
                    <div class="ingredient-card-buttons">
                        <button class="btn-view" id="view-${data.id}">🔍 Подробнее</button>
                        <button class="btn-edit" id="edit-${data.id}">✏️ Редактировать</button>
                        <button class="btn-delete" id="delete-${data.id}">🗑️ Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data) {
        // Кнопка "Подробнее"
        document.getElementById(`view-${data.id}`)?.addEventListener('click', () => {
            this.onView(data.id);
        });

        // Кнопка "Редактировать" ← ДОБАВИТЬ
        document.getElementById(`edit-${data.id}`)?.addEventListener('click', () => {
            this.onEdit(data.id);
        });

        // Кнопка "Удалить"
        document.getElementById(`delete-${data.id}`)?.addEventListener('click', () => {
                this.onDelete(data.id);
        });
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data);
    }
}