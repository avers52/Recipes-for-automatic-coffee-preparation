const ingredientsService = require('../services/ingredientsService');

const getAll = (req, res) => {
    const items = ingredientsService.findAll();
    res.json(items);
};

const getById = (req, res) => {
    const id = parseInt(req.params.id);
    const item = ingredientsService.findOne(id);
    if (!item) return res.status(404).json({ error: 'Ингредиент не найден' });
    res.json(item);
};

const create = (req, res) => {
    const { name, description, image, category, unit, price } = req.body;
    if (!name) return res.status(400).json({ error: 'Название обязательно' });
    const newItem = ingredientsService.create({ name, description, image, category, unit, price });
    res.status(201).json(newItem);
};

const update = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = ingredientsService.update(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Ингредиент не найден' });
    res.json(updated);
};

const remove = (req, res) => {
    const id = parseInt(req.params.id);
    const success = ingredientsService.remove(id);
    if (!success) return res.status(404).json({ error: 'Ингредиент не найден' });
    res.status(204).send();
};

module.exports = { getAll, getById, create, update, remove };