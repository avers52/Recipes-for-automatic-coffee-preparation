// ЗАДАНИЕ 2.2: Преобразование ID ингредиентов в диапазоны
export function convertIngredientIdsToRange(idsArray) {
    if (!idsArray || idsArray.length === 0) return '';

    // Сортируем ID по возрастанию
    const sortedIds = [...idsArray].sort((a, b) => a - b);
    const ranges = [];
    let start = sortedIds[0];
    let end = sortedIds[0];

    for (const currentId of sortedIds.slice(1)) {
        if (currentId === end + 1) {
            end = currentId; 
        } else {
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = currentId;
            end = currentId;
        }
    }
    // Добавляем последний диапазон
    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return ranges.join(', ');
}

// ЗАДАНИЕ 3.8: Проверка, является ли название ингредиента палиндромом 
export function isIngredientNamePalindrome(ingredientName) {
    if (typeof ingredientName !== 'string') return false;

    // Очищаем строку: убираем пробелы, знаки препинания, приводим к нижнему регистру
    const cleanedStr = ingredientName.toLowerCase().replace(/[^а-яёa-z0-9]/gi, '');  // ← было IngredientName (с большой буквы)
    if (cleanedStr.length === 0) return false;

    // Через сравнение с перевернутой строкой 
    const reversedStr = cleanedStr.split('').reverse().join('');
    const isPalindromeSimple = cleanedStr === reversedStr;

    // Через цикл while 
    let isPalindromeLoop = true;
    let left = 0;
    let right = cleanedStr.length - 1;

    while (left < right && isPalindromeLoop) {
        if (cleanedStr[left] !== cleanedStr[right]) {
            isPalindromeLoop = false;
        }
        left++;
        right--;
    }

    // Возвращаем результат (оба решения дают одинаковый ответ)
    return isPalindromeLoop;
}

// Дополнительная функция: найти все ингредиенты-палиндромы 
export function findPalindromeIngredients(ingredientsArray) {
    return ingredientsArray.filter(ingredient => isIngredientNamePalindrome(ingredient.name));  // ← было ingredient.title, нужно ingredient.name
}