// Получаем текущего пользователя из Local Storage
const currentUsername = localStorage.getItem('currentUser'); // имя текущего пользователя
let users = JSON.parse(localStorage.getItem('users')) || []; // массив пользователей

// Находим текущего пользователя
const currentUser = users.find(user => user.username === currentUsername);

let curRound = 0;
let curScore = 0;
const numRounds=10;
const roundTime = 40-Number(currentUser.difficulty)*2;
let timeLeft = 40-Number(currentUser.difficulty)*2; // например, 30 секунд на раунд
let timer;
const winMessage = "Уровень пройден!";
const looseMessage = "Ты проиграл!";

const colorDictionary = {
    "red": "красный",
    "blue": "синий",
    "green": "зелёный",
    "yellow": "жёлтый",
    "orange": "оранжевый",
    "purple": "фиолетовый",
    "pink": "розовый",
    "black": "чёрный",
    "white": "белый"
};
const figureDictionary = {
    "circle": "круг",
    "square": "квадрат",
    "triangle": "треугольник",
    "rectangle": "прямоугольник",
    "oval": "овал"
};

const colors = ["red", "blue", "green", "yellow", "purple","pink","black" ];
const shapes = ["circle", "square", "triangle","rectangle", "oval"]; // Можно добавить больше фигур

let targetColor = 'blue'; //дефолтные значения
let targetShape = 'curcle';
let targetChar = 'A';
let targetCellIndex = 0; 
const baseRowNum = 3;
const baseColNum = 5;
const gridCells = (Number(currentUser.difficulty)+baseRowNum)*(Number(currentUser.difficulty)+baseColNum); // Общее количество ячеек в сетке
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

//создаем задание
function generateTask() {
    targetColor = colors[Math.floor(Math.random() * (colors.length-(2-currentUser.difficulty)))];
    targetShape = shapes[Math.floor(Math.random() * (shapes.length-(2-currentUser.difficulty)))]; //пока так, потом больше фигур
    targetCellIndex = Math.floor(Math.random() * gridCells); 

    //подписали задание
    document.getElementById("task-label").textContent = `Найди ${colorDictionary[targetColor]} ${figureDictionary[targetShape]} и введи буквы с фигуры`; //хз

}

function generateFeild(){
    const gridElement = document.querySelector('.grid');
    gridElement.style.gridTemplateColumns = 'repeat('+`${Number(currentUser.difficulty)+baseColNum}`+ ', 1fr)';
    gridElement.style.gridTemplateRows = 'repeat('+`${Number(currentUser.difficulty)+baseRowNum}`+ ', 1fr)';
}

function startTimer() {
    // Таймер будет отсчитывать каждую секунду
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            showGameOverModal(looseMessage);
            clearInterval(timer);  // Остановить таймер, если время вышло
            console.log("Время вышло!");
            // Можно добавить логику для окончания уровня или игры
        } else {
            timeLeft--;
            console.log("Оставшееся время:", timeLeft);
            // Обновляем отображение таймера на странице (например, в элементе с id="timer")
            document.getElementById("time-left").textContent = ` ${timeLeft} `;
        }
    }, 1000); 

    // Сбрасываем предыдущую анимацию
    const timerBar = document.getElementById("timer-bar");
    timerBar.style.animation = "none";
    timerBar.offsetHeight; 
    timerBar.style.animation = `shrink ${roundTime}s linear`; //АНИМАЦИЯ ПОЛОСКИ ТАЙМЕРА
}

function stopTimer() {
    clearInterval(timer); 
    console.log("Таймер остановлен");
}

function showGameOverModal(message) {
    const modal = document.getElementById("game-over-modal");
    const finalRasDetails = document.getElementById("final-res-details");
    const gameOverMessage = document.getElementById("game-over-message");

    gameOverMessage.textContent = message;
    if(message == winMessage){
        finalRasDetails.textContent = 'Вы набрали:' +` ${curScore}`+ ' очков';
        //тут подтянуть лучший счет игрока за этот уровень из локал TODO
    }
    else{
        finalRasDetails.textContent = 'Пройдено раундов:' +` ${curRound}`+ '/10 ';
    }

    // Показываем модальное окно
    modal.classList.remove("hidden");
}

// Кнопка "Меню"
document.getElementById("menu-button").addEventListener("click", () => {
    window.location.href = "../menu.html"; // Переход на страницу меню
});

// Кнопка "Заново"
document.getElementById("retry-button").addEventListener("click", () => {
    window.location.reload(); //    Перезагрузка текущей страницы
});

// Стар
document.getElementById("start-button").addEventListener("click", () => {
    startGame();
});

//кладем фигурки на поле 
function generateFigures() {
    const gameField = document.getElementById("game-field");
    gameField.innerHTML = ""; // Очищаем поле перед каждым раундом
    timeLeft = roundTime; // сбрасываем время на начало
    // Запускаем таймер
    startTimer();

    for (let i = 0; i < gridCells; i++) {
        const figure = document.createElement("div");
        figure.classList.add("figure");

        // Если это ячейка для правильной фигуры //TODO добавить бквы рандомно раскиданные
        if (i === targetCellIndex) {
            figure.classList.add("target", targetShape);
            
            if (targetShape === "triangle") {
                figure.style.borderBottomColor = targetColor;
            } else {
                figure.style.backgroundColor = targetColor;
            }

            // Генерируем случайную букву
            const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            const label = document.createElement("span");
            label.textContent = randomChar;
            targetChar=randomChar;
            label.classList.add("figure-label");

            // Добавляем букву внутрь фигуры
            figure.appendChild(label);

            // Добавляем обработчик для правильного клика
            figure.addEventListener("dblclick", () => {
                console.log("Правильная фигура найдена!");
                // Тут запустить ввод с клавы надписи
                checkFigure(figure);
            });
        } else {
            // Генерируем случайную фигуру и цвет, отличные от целевой
            let randomColor, randomShape;
            do {
                randomColor = colors[Math.floor(Math.random() * (colors.length-(2-currentUser.difficulty)))];
                randomShape = shapes[Math.floor(Math.random() * (shapes.length-(2-currentUser.difficulty)))];
            } while (randomColor === targetColor && randomShape === targetShape);

            figure.classList.add(randomShape);
            if (randomShape === "triangle") {
                figure.style.borderBottomColor = randomColor;
            } else {
                figure.style.backgroundColor = randomColor;
            }
            // Генерируем случайную букву
            const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            const label = document.createElement("span");
            label.textContent = randomChar;
            label.classList.add("figure-label");

            // Добавляем букву внутрь фигуры
            figure.appendChild(label);

            // Добавляем обработчик для неправильного клика
            figure.addEventListener("click", () => {
                console.log("Неправильная фигура!");
                // Тут можно добавить логику штрафа потом отд функцию наклипать
                //checkFigure(figure);
            });
        }
        gameField.appendChild(figure);
    }
}


function startGame() {
    // Скрываем окно правил
    document.getElementById("rules-modal").classList.add("hidden");
    // Инициализация п  ервого раунда 
    //Генерим поле в зависимости от сложности
    generateFeild()
    generateTask();
    generateFigures();

}

// Проверка правильности выбора фигуры
function checkFigure(figure) {
    const userInput = prompt("Введите букву, указанную на фигуре:");
    if (userInput && userInput.toUpperCase() === targetChar) {
        alert("Правильно! Переход к следующему раунду.");
       // generateFigures(); // Генерация новых фигур
    } else {
        alert("Неправильно. Попробуйте снова.");
    }
}