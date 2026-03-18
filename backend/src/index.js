const express = require('express');
const path = require('path');
const recipesRouter = require('./routes/recipes');
const recipesService = require('./services/recipesService');

const app = express();
const PORT = 3000;

// Определяем путь к файлу данных
const DATA_FILE_PATH = path.join(__dirname, 'data/recipes.json');

// Инициализируем сервис с путем к файлу данных
recipesService.init(DATA_FILE_PATH);

// 1. Встроенный middleware для парсинга JSON
app.use(express.json());

// 2. Логирующий middleware (как в методичке)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Обязательно вызываем next(), иначе запрос зависнет
});

// 3. Подключение маршрутов (все начинаются с /api/recipes)
app.use('/api/recipes', recipesRouter);

// 4. Глобальная обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// 5. Обработчик ошибок (error handler)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// 6. Запуск сервера
app.listen(PORT, () => {
    console.log(`🍵 Сервер рецептов запущен по адресу http://localhost:${PORT}`);
    console.log(`📋 Доступные эндпоинты:`);
    console.log(`   GET    /api/recipes - получить все рецепты`);
    console.log(`   GET    /api/recipes/:id - получить рецепт по ID`);
    console.log(`   POST   /api/recipes - создать рецепт`);
    console.log(`   PATCH  /api/recipes/:id - обновить рецепт`);
    console.log(`   DELETE /api/recipes/:id - удалить рецепт`);
});