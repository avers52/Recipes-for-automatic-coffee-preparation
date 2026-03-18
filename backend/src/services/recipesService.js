const fileService = require('./fileService');

// Переменная для хранения пути к файлу данных
let dataFilePath;

// Функция инициализации сервиса с путем к файлу данных
const init = (filePath) => {
    dataFilePath = filePath;
};

// Получение всех рецептов с возможностью фильтрации по названию
const findAll = (title) => {
    const recipes = fileService.readData(dataFilePath);
    if (title) {
        return recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return recipes;
};

// Получение одного рецепта по ID
const findOne = (id) => {
    const recipes = fileService.readData(dataFilePath);
    return recipes.find(recipe => recipe.id === id);
};

// Создание нового рецепта
const create = (recipeData) => {
    const recipes = fileService.readData(dataFilePath);

    // Генерация ID: берем максимальный ID + 1
    const newId = recipes.length > 0 
        ? Math.max(...recipes.map(r => r.id)) + 1 
        : 1;

    const newRecipe = { id: newId, ...recipeData };
    recipes.push(newRecipe);
    fileService.writeData(dataFilePath, recipes);

    return newRecipe;
};

// Обновление рецепта
const update = (id, recipeData) => {
    const recipes = fileService.readData(dataFilePath);
    const index = recipes.findIndex(r => r.id === id);

    if (index === -1) return null;

    recipes[index] = { ...recipes[index], ...recipeData };
    fileService.writeData(dataFilePath, recipes);

    return recipes[index];
};

// Удаление рецепта
const remove = (id) => {
    const recipes = fileService.readData(dataFilePath);
    const filteredRecipes = recipes.filter(r => r.id !== id);

    if (filteredRecipes.length === recipes.length) {
        return false; // Ничего не удалили
    }

    fileService.writeData(dataFilePath, filteredRecipes);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };