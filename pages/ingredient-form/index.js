import { ajax } from '../../modules/ajax.js';
import { ingredientUrls } from '../../modules/ingredientUrls.js';

export class IngredientFormPage {
    constructor(parent, params) { 
        this.parent = parent;
        this.id = params?.id; 
    }

    getHTML() {
    }

    async loadIngredientData() {

    }

    onSubmit() {
        const formData = { };
        if (this.id) {
            // Режим редактирования
            ajax.patch(ingredientUrls.updateIngredientById(this.id), formData, (data, status) => {
                if (status === 200) alert('Ингредиент обновлен!');
            });
        } else {
            // Режим создания
            ajax.post(ingredientUrls.createIngredient(), formData, (data, status) => {
                if (status === 201) alert('Ингредиент создан!');
            });
        }
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.loadIngredientData(); // загрузить данные, если это редактирование
        document.getElementById('save-btn').onclick = () => this.onSubmit();
    }
}