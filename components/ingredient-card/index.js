export class IngredientCardComponent {
    constructor(parent, callbacks = {}) {
        this.parent = parent;
        this.onDelete = callbacks.onDelete || (() => {});
        this.onView = callbacks.onView || (() => {});
        this.onEdit = callbacks.onEdit || (() => {});  
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
                        <button class="btn-view" id="view-ingredient-${data.id}">🔍 Подробнее</button>
                        <button class="btn-edit" id="edit-ingredient-${data.id}">✏️ Редактировать</button>  // 🆕
                        <button class="btn-delete" id="delete-ingredient-${data.id}">🗑️ Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(data) {
        // Кнопка "Подробнее"
        const viewBtn = document.getElementById(`view-ingredient-${data.id}`);
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                this.onView(data.id);
            });
        }

        //  Кнопка "Редактировать"
        const editBtn = document.getElementById(`edit-ingredient-${data.id}`);
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.onEdit(data.id);
            });
        }

        // Кнопка "Удалить"
        const deleteBtn = document.getElementById(`delete-ingredient-${data.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Удалить ингредиент "${data.name}"?`)) {
                    this.onDelete(data.id);
                }
            });
        }
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data);
    }
}