window.onload = function() {
    // Переменные для хранения чисел и операций
    let a = '';                    // Первое число
    let b = '';                    // Второе число
    let expressionResult = '';     // Результат вычисления
    let selectedOperation = null;  // Выбранная операция

    // Получаем доступ к экрану калькулятора
    const outputElement = document.getElementById("result");

    // Получаем все кнопки с цифрами (id начинаются с "btn_digit_")
    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

    // Функция обработки нажатия на цифру или точку
    function onDigitButtonClicked(digit) {
        if (!selectedOperation) {
            // Работаем с первым числом
            if ((digit !== '.') || (digit === '.' && !a.includes('.'))) {
                if (a === '0') a = ''; // Заменяем начальный "0" на пустую строку
                a += digit;
            }
            outputElement.innerHTML = a || '0';
        } else {
            // Работаем со вторым числом
            if ((digit !== '.') || (digit === '.' && !b.includes('.'))) {
                if (b === '0') b = '';
                b += digit;
            }
            outputElement.innerHTML = b || '0';
        }
    }

    // Настраиваем обработчики для цифровых кнопок
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        }
    });

    // Обработчики для операций
    document.getElementById("btn_op_mult").onclick = function() {
        if (a === '') return;
        selectedOperation = 'x';
    };
    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return;
        selectedOperation = '+';
    };
    document.getElementById("btn_op_minus").onclick = function() {
        if (a === '') return;
        selectedOperation = '-';
    };
    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return;
        selectedOperation = '/';
    };

    // Запрограммируйте операцию смены знака +/-;
    // Для смены знака используйте умножение на -1
    document.getElementById("btn_op_sign").onclick = function() {
        if (!selectedOperation) {
            // Меняем знак первого числа
            if (a !== '') {
                a = (parseFloat(a) * -1).toString();
                outputElement.innerHTML = a;
            }
        } else {
            // Меняем знак второго числа
            if (b !== '') {
                b = (parseFloat(b) * -1).toString();
                outputElement.innerHTML = b;
            }
        }
    };

    // Процент
    document.getElementById("btn_op_percent").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') {
                a = (parseFloat(a) / 100).toString();
                outputElement.innerHTML = a;
            }
        } else {
            if (b !== '') {
                b = (parseFloat(b) / 100).toString();
                outputElement.innerHTML = b;
            }
        }
    };

    // Вычисление при нажатии на "="
    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || !selectedOperation) return;

        switch(selectedOperation) {
            case 'x':
                expressionResult = (+a) * (+b);
                break;
            case '+':
                expressionResult = (+a) + (+b);
                break;
            case '-':
                expressionResult = (+a) - (+b);
                break;
            case '/':
                if (+b === 0) {
                    outputElement.innerHTML = 'Error';
                    a = '';
                    b = '';
                    selectedOperation = null;
                    return;
                }
                expressionResult = (+a) / (+b);
                break;
            default:
                return;
        }

        // Сохраняем результат как новое первое число
        a = expressionResult.toString();
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    };

    // Очистка при нажатии на "C"
    document.getElementById("btn_op_clear").onclick = function() {
        a = '';
        b = '';
        selectedOperation = null;
        expressionResult = '';
        outputElement.innerHTML = '0';
    };

    // Кнопка GitHub: открывает репозиторий в новой вкладке
    document.getElementById("btn_github").onclick = function() {
        window.open('https://github.com/avers52', '_blank');
    };
};