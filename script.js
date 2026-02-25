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


    // стирание последней цифры
    document.getElementById("btn_op_backspace").onclick = function() {
        if (!selectedOperation) {
            if (a.length > 0) {
                a = a.slice(0,-1);
                outputElement.innerHTML = a || '0';
            }
        } else {
            if (b.length > 0) {
                b = b.slice(0,-1);
                outputElement.innerHTML = b || '0';
            }
        }
    }

    // квадрат
    document.getElementById("btn_op_square").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') {
                const num = parseFloat(a);
                a = (num * num).toString();
                outputElement.innerHTML = a;
            }
        } else {
            if (b !== '') {
                const num = parseFloat(b);
                b = (num * num).toString();
                outputElement.innerHTML = b;
            }
        }
    }

    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // факториал
    document.getElementById("btn_op_factorail").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') {
              const num = parseFloat(a);
              // Проверка: целое неотрицательное число
              if (num >= 0 && num % 1 === 0 && num <= 20) {
                a = factorial(num).toString();
                outputElement.innerHTML = a;
              } else {
                outputElement.innerHTML = 'Error';
              }
            }
          } else {
            if (b !== '') {
              const num = parseFloat(b);
              if (num >= 0 && num % 1 === 0 && num <= 20) {
                b = factorial(num).toString();
                outputElement.innerHTML = b;
              } else {
                outputElement.innerHTML = 'Error';
              }
            }
          }
        };
           


    const originalBgColor = '#ffffff'; 
    const coffeeBgColor = '#6F4E37';   

    
    let isCoffeeTheme = false;

    document.getElementById("btn_coffee_theme").onclick = function() {
    if (isCoffeeTheme) {
        // Возвращаем исходный фон
        document.body.style.backgroundColor = originalBgColor;
        isCoffeeTheme = false;
    } else {
        // Меняем на кофейный фон
        document.body.style.backgroundColor = coffeeBgColor;
        isCoffeeTheme = true;
    }
    };

    document.getElementById("btn_op_000").onclick = function() {
        onDigitButtonClicked('0'); 
        onDigitButtonClicked('0');
        onDigitButtonClicked('0');
    }



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