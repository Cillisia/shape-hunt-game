// Получаем текущего пользователя из Local Storage
const currentUsername = localStorage.getItem('currentUser'); // имя текущего пользователя
let users = JSON.parse(localStorage.getItem('users')) || []; // массив пользователей

// Находим текущего пользователя
const currentUser = users.find(user => user.username === currentUsername);

let curRound = 0;
let curScore = 0;
const numRounds=10;
const roundTime = 30-Number(currentUser.difficulty)*2;
let timeLeft = 30-Number(currentUser.difficulty)*2; // например, 30 секунд на раунд
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
const alphabet = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";

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
            document.getElementById("time-left").textContent = ` ${timeLeft} `;
        }
    }, 1000); 
    resetTimebarAnimation();
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
    //startTimer();

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
                keyboardVerification();
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
            figure.addEventListener("dblclick", () => {
                console.log("Неправильная фигура!");
                feedback.textContent = "Неправильно! Попробуй еще";
                curScore-=10; 
                document.getElementById('score-info').textContent = ` ${curScore}`;
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
    startTimer();

}



function keyboardVerification(){
    feedback.textContent = `Нажми на клавишу клавиатуры с буквой на фигуре`;
    const handleKeyPress = (event) => {
        if (event.key.toUpperCase() === targetChar) {
            feedback.textContent = "Правильно! Буква совпала.";
            document.removeEventListener("keydown", handleKeyPress); // Удаляем обработчик
            curScore+=30+Math.round(0.5*timeLeft)+4*Number(currentUser.difficulty); 
            startNextRound();
        } else {
            feedback.textContent = `Неправильно! Нажато "${event.key.toUpperCase()}". Кликай заново :) `;
            document.removeEventListener("keydown", handleKeyPress); // Удаляем обработчик
            curScore-=10; 
        }
        document.getElementById('score-info').textContent = ` ${curScore}`;
    };

    // Добавляем обработчик события клавиатуры
    document.addEventListener("keydown", handleKeyPress);
}

function startNextRound(){
    //начать следующий раунд, типа вызвать функцию перезагрузки стола и тд 
    if(curRound<numRounds-1){
        generateTask();
        generateFigures();
        resetTimebarAnimation()
        curRound+=1; //обновить на доске что типа новый раунд TODO убрать это в отд функ
        document.getElementById('round-info').textContent = ` ${curRound+1} / ${numRounds}`;
        document.getElementById("time-left").textContent = ` ${roundTime} `;
        feedback.textContent = "Дважды кликни на фигуру";
    }
    else{
        showGameOverModal(winMessage);
        if(curScore>currentUser.scorel2){
            currentUser.scorel2 = curScore;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

function resetTimebarAnimation(){
     // Сбрасываем предыдущую анимацию
     const timerBar = document.getElementById("timer-bar");
     timerBar.style.animation = "none";
     timerBar.offsetHeight; 
     timerBar.style.animation = `shrink ${roundTime}s linear`; //АНИМАЦИЯ ПОЛОСКИ ТАЙМЕРА
}

document.getElementById('menu-btn').addEventListener('click', () => {
    alert("Ваши очки не сохранятся")
    window.location.href = "menu.html"; // Переход в меню
});