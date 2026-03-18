export class RecipeCardComponent {
    constructor(parent, callbacks = {}) {
        this.parent = parent;
        this.onDelete = callbacks.onDelete || (() => {}); // callback удаления
    }

    getHTML(data) {
        return (
            `
            <div class="card mb-3" style="max-width: 600px; width: 100%;" id="recipe-card-${data.id}">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${data.image}" class="img-fluid rounded-start" alt="${data.title}" style="height: 100%; object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-text">${data.description}</p>
                            <p class="card-text"><small class="text-body-secondary">⏱️ ${data.time} мин.</small></p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-primary" id="view-recipe-${data.id}">Смотреть рецепт</button>
                                <button class="btn btn-danger" id="delete-recipe-${data.id}">Удалить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        );
    }

    addListeners(data) {
        // Кнопка просмотра рецепта
        document.getElementById(`view-recipe-${data.id}`)
            .addEventListener('click', (e) => {
                e.preventDefault();
                const event = new CustomEvent('recipe-selected', { 
                    detail: { recipeId: data.id },
                    bubbles: true,
                    composed: true
                });
                e.target.dispatchEvent(event);
            });

        // Кнопка удаления
        document.getElementById(`delete-recipe-${data.id}`)
            .addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm(`Удалить рецепт "${data.title}"?`)) {
                    this.onDelete(data.id);
                }
            });
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data);
    }
}