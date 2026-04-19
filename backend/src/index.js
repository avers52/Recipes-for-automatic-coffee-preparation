const express = require('express');
const path = require('path');
const cors = require('cors');
const ingredientsRouter = require('./routes/ingredients');
const ingredientsService = require('./services/ingredientsService');

const app = express();
const PORT = 3000;

// CORS (для работы с фронтендом на другом порту)
app.use(cors());
app.use(express.json());

// Путь к файлу данных
const INGREDIENTS_DATA_PATH = path.join(__dirname, 'data', 'ingredients.json');

// Инициализация сервиса
ingredientsService.init(INGREDIENTS_DATA_PATH);

// Логирующий middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Подключение маршрутов
app.use('/api/ingredients', ingredientsRouter);

// Глобальная обработка 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🍵 Сервер ингредиентов запущен по адресу http://localhost:${PORT}`);
    console.log(`📋 Доступные эндпоинты:`);
    console.log(`   GET    /api/ingredients`);
    console.log(`   GET    /api/ingredients/:id`);
    console.log(`   POST   /api/ingredients`);
    console.log(`   PATCH  /api/ingredients/:id`);
    console.log(`   DELETE /api/ingredients/:id`);
});