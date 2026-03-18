const recipesService = require('../services/recipesService');

// GET /recipes - получить все рецепты (с опциональной фильтрацией)
const getAllRecipes = (req, res) => {
    const { title } = req.query;
    const recipes = recipesService.findAll(title);
    res.json(recipes);
};

// GET /recipes/:id - получить рецепт по ID
const getRecipeById = (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = recipesService.findOne(id);

    if (!recipe) {
        return res.status(404).json({ error: 'Рецепт не найден' });
    }

    res.json(recipe);
};

// POST /recipes - создать новый рецепт
const createRecipe = (req, res) => {
    const { src, title, description, ingredients, steps, time } = req.body;

    // Простая валидация обязательных полей
    if (!title || !description) {
        return res.status(400).json({ error: 'Название и описание обязательны' });
    }

    const newRecipe = recipesService.create({ 
        src, 
        title, 
        description, 
        ingredients: ingredients || [], 
        steps: steps || [], 
        time: time || 0 
    });
    
    res.status(201).json(newRecipe);
};

// PATCH /recipes/:id - обновить рецепт
const updateRecipe = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedRecipe = recipesService.update(id, req.body);

    if (!updatedRecipe) {
        return res.status(404).json({ error: 'Рецепт не найден' });
    }

    res.json(updatedRecipe);
};

// DELETE /recipes/:id - удалить рецепт
const deleteRecipe = (req, res) => {
    const id = parseInt(req.params.id);
    const success = recipesService.remove(id);

    if (!success) {
        return res.status(404).json({ error: 'Рецепт не найден' });
    }

    res.status(204).send(); 
};

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
};