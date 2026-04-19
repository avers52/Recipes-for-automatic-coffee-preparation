const fileService = require('./fileService');
let dataFilePath;

const init = (filePath) => { 
    dataFilePath = filePath; 
};

const findAll = (name) => {  
    const ingredients = fileService.readData(dataFilePath);
    if (name) {
        return ingredients.filter(ing => 
            ing.name.toLowerCase().includes(name.toLowerCase())
        );
    }
    return ingredients;
};

const findOne = (id) => {
    const ingredients = fileService.readData(dataFilePath);
    return ingredients.find(i => i.id === id);
};

const create = (data) => {
    const ingredients = fileService.readData(dataFilePath);
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    const newItem = { id: newId, ...data };
    ingredients.push(newItem);
    fileService.writeData(dataFilePath, ingredients);
    return newItem;
};

const update = (id, data) => {
    const ingredients = fileService.readData(dataFilePath);
    const index = ingredients.findIndex(i => i.id === id);
    if (index === -1) return null;
    ingredients[index] = { ...ingredients[index], ...data };
    fileService.writeData(dataFilePath, ingredients);
    return ingredients[index];
};

const remove = (id) => {
    const ingredients = fileService.readData(dataFilePath);
    const filtered = ingredients.filter(i => i.id !== id);
    if (filtered.length === ingredients.length) return false;
    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };