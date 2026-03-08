// ЗАДАНИЕ 2.2: Преобразование ID рецептов в диапазоны
export function convertRecipeIdsToRange(idsArray) {
    if (!idsArray || idsArray.length === 0) return '';

    // Сортируем ID по возрастанию
    const sortedIds = [...idsArray].sort((a, b) => a - b);
    const ranges = [];
    let start = sortedIds[0];
    let end = sortedIds[0];

    // Используем цикл for...of для обхода коллекции (не по счетчику!)
    for (const currentId of sortedIds.slice(1)) {
        if (currentId === end + 1) {
            end = currentId; // Продолжаем диапазон
        } else {
            // Завершаем текущий диапазон
            ranges.push(start === end ? `${start}` : `${start}-${end}`);
            start = currentId;
            end = currentId;
        }
    }
    // Добавляем последний диапазон
    ranges.push(start === end ? `${start}` : `${start}-${end}`);

    return ranges.join(', ');
}

// ЗАДАНИЕ 3.8: Проверка, является ли название рецепта палиндромом 
export function isRecipeNamePalindrome(recipeName) {
    if (typeof recipeName !== 'string') return false;

    // Очищаем строку: убираем пробелы, знаки препинания, приводим к нижнему регистру
    const cleanedStr = recipeName.toLowerCase().replace(/[^а-яёa-z0-9]/gi, '');
    if (cleanedStr.length === 0) return false;

    // РЕШЕНИЕ 1: Через сравнение с перевернутой строкой 
    const reversedStr = cleanedStr.split('').reverse().join('');
    const isPalindromeSimple = cleanedStr === reversedStr;

    // РЕШЕНИЕ 2: Через цикл while (сравнение символов с начала и конца) 
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

//Дополнительная функция: найти все рецепты-палиндромы 
export function findPalindromeRecipes(recipesArray) {
    return recipesArray.filter(recipe => isRecipeNamePalindrome(recipe.title));
}