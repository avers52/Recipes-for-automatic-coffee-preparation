export const recipes = [
    {
        id: 1,
        title: "Эспрессо",
        description: "Крепкий итальянский кофе",
        image: "https://img.ixbt.site/live/images/original/32/75/48/2024/10/16/13debe3369.jpg",
        ingredients: [
            { ingredientId: 1, name: "Кофейные зерна", quantity: 7, unit: "гр" },
            { ingredientId: 3, name: "Вода", quantity: 30, unit: "мл" }
        ],
        time: 2,
        price: 150
    },
    {
        id: 2,
        title: "Латте",
        description: "Нежный кофе с молоком",
        image: "https://avatars.mds.yandex.net/i?id=1bd600554304073140c5751455eabf38_l-9834975-images-thumbs&n=13",
        ingredients: [
            { ingredientId: 1, name: "Кофейные зерна", quantity: 7, unit: "гр" },
            { ingredientId: 2, name: "Молоко", quantity: 150, unit: "мл" },
            { ingredientId: 3, name: "Вода", quantity: 30, unit: "мл" }
        ],
        time: 4,
        price: 220
    },
    {
        id: 3,
        title: "Капучино",
        description: "Кофе с плотной молочной пенкой.",
        image: "https://mos-koff.ru/wp-content/uploads/2021/06/5-1024x682.jpeg",
        ingredients: [
            { ingredientId: 1, name: "Кофейные зерна", quantity: 7, unit: "гр" },
            { ingredientId: 2, name: "Молоко", quantity: 100, unit: "мл" },
            { ingredientId: 3, name: "Вода", quantity: 30, unit: "мл" },
            { ingredientId: 5, name: "Какао-порошок", quantity: 2, unit: "гр" }
        ],
        time: 3,
        price: 200
    },
    {
        id: 4,
        title: "Гляссе",
        description: "Кофе с мороженым.",
        image: "https://mos-koff.ru/wp-content/uploads/2021/06/6.jpeg",
        ingredients: [
            { ingredientId: 1, name: "Кофейные зерна", quantity: 7, unit: "гр" },
            { ingredientId: 6, name: "Мороженое", quantity: 50, unit: "гр" },
            { ingredientId: 4, name: "Сахар", quantity: 10, unit: "гр" }
        ],
        time: 5,
        price: 250
    }
];