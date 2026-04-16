export class IngredientUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    getIngredients() {
        return `${this.baseUrl}/ingredients`;
    }

    getIngredientById(id) {
        return `${this.baseUrl}/ingredients/${id}`;
    }

    createIngredient() {
        return `${this.baseUrl}/ingredients`;
    }

    updateIngredientById(id) {
        return `${this.baseUrl}/ingredients/${id}`;
    }

    deleteIngredientById(id) {
        return `${this.baseUrl}/ingredients/${id}`;
    }
}

export const ingredientUrls = new IngredientUrls();