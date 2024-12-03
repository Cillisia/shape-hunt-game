// Получаем текущего пользователя из Local Storage
const currentUsername = localStorage.getItem('currentUser'); // имя текущего пользователя
let users = JSON.parse(localStorage.getItem('users')) || []; // массив пользователей

// Находим текущего пользователя
const currentUser = users.find(user => user.username === currentUsername);
const curDifficulty = Number(currentUser.difficulty);
let curRound = 0;
let curScore = 0;
const numRounds=10;
const roundTime = 30-Number(currentUser.difficulty)*2;
let timeLeft = roundTime; // например, 30 секунд на раунд
let timer;
const winMessage = "Уровень пройден!";
const looseMessage = "Ты проиграл!";
const figuresForLeft = 2; // Количество фигур для левой стороны
const figuresForRight = 2; // Количество фигур для правой стороны
let isPaused = false;
let timerInterval;
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
const sizeDictionary = {
    "small": "маленький",
    "medium": "средний",
    "large": "большой"
};

const colors = ["red", "blue", "green", "yellow", "purple","pink","black" ];
const shapes = ["circle", "square", "triangle","rectangle", "oval"]; // Можно добавить больше фигур
const sizes = ['small', 'medium', 'large']; // Размеры фигур

let task = { left: {}, right: {} }; //массив с заданием
let targetCellIndex = 0; 
const baseRowNum = 3;
const baseColNum = 5;
const gridCells = (Number(currentUser.difficulty)+baseRowNum)*(Number(currentUser.difficulty)+baseColNum); // Общее количество ячеек в сетке

const leftSection = document.getElementById("left-container");
const rightSection = document.getElementById("right-container");

leftSection.addEventListener("dragover", (event) => event.preventDefault());
rightSection.addEventListener("dragover", (event) => event.preventDefault());

leftSection.addEventListener("drop", (event) => drop(event, leftSection,'left'));
rightSection.addEventListener("drop", (event) => drop(event, rightSection, 'right'));



function startTimer() {
    // Таймер будет отсчитывать каждую секунду
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            showGameOverModal(looseMessage);
            clearInterval(timer);  // Остановить таймер, если время вышло
            console.log("Время вышло!");
            // Можно добавить логику для окончания уровня или игры
        } else {
            if(!isPaused){
                timeLeft--;
                console.log("Оставшееся время:", timeLeft);
                // Обновляем отображение таймера на странице (например, в элементе с id="timer")
                document.getElementById("time-left").textContent = ` ${timeLeft} `;
                }   
         }
    }, 1000); 

    // Сбрасываем предыдущую анимацию
    const timerBar = document.getElementById("timer-bar");
    timerBar.style.animation = "none";
    timerBar.offsetHeight; 
    timerBar.style.animation = `shrink ${roundTime}s linear`;
}
// function pauseGame() {
//     isPaused = true;
//     clearInterval(timerInterval); // Останавливаем таймер
//     document.getElementById("timer-bar").style.animationPlayState = "paused"; // Останавливаем анимацию
// }
// function resumeGame() {
//     isPaused = false;
//     startTimer(); // Запускаем таймер заново
//     document.getElementById("timer-bar").style.animationPlayState = "running"; // Возобновляем анимацию
// }

// // Обработчики событий для кнопок
// document.getElementById('pause-btn').addEventListener('click', () => {
//     if (isPaused) {
//         resumeGame(); // Если игра на паузе, продолжаем
//     } else {
//         pauseGame(); // Иначе ставим игру на паузу
//     }
// });

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

// Старт
document.getElementById("start-button").addEventListener("click", () => {
    startGame();
});

//создаем задание
function generateTask() {
    //выбираем уровень сложности
    //const task = { left: {}, right: {} }; // Задание для игрока

    // Генерация задания в зависимости от сложности вот первые три ифа можно убрать наверн
    if (curDifficulty === 0) {
        // Сложность 0: только форма
        task.left.shape = getRandomItem(shapes); // Одна форма для левой стороны
        task.right.shape = getRandomItem(shapes.filter(s => s !== task.left.shape)); // Другая форма для правой
    } else if (curDifficulty === 1) {
        // Сложность 1: форма + цвет
        task.left.shape = getRandomItem(shapes);
        task.left.color = getRandomItem(colors);
        task.right.shape = getRandomItem(shapes.filter(s => s !== task.left.shape));
        task.right.color = getRandomItem(colors.filter(c => c !== task.left.color));
    } else if (curDifficulty === 2) {
        // Сложность 2: форма + цвет + размер
        task.left.shape = getRandomItem(shapes);
        task.left.color = getRandomItem(colors);
        task.left.size = getRandomItem(sizes);
        task.right.shape = getRandomItem(shapes.filter(s => s !== task.left.shape));
        task.right.color = getRandomItem(colors.filter(c => c !== task.left.color));
        task.right.size = getRandomItem(sizes.filter(sz => sz !== task.left.size));
    }

    writeTask();
}

function generateFigures() {
    const gameField = document.getElementById("game-field");
    gameField.innerHTML = ""; // Очищаем поле перед каждым раундом

    let figuresArray = [];

    // Генерация фигур для левой стороны
    for (let i = 0; i < figuresForLeft; i++) {
        const figure = generateTaskFigure("left");
        figuresArray.push(figure);
    }

    // Генерация фигур для правой стороны
    for (let i = 0; i < figuresForRight; i++) {
        const figure = generateTaskFigure("right");
        figuresArray.push(figure);
    }
    // Генерация случайных фигур для оставшихся ячеек
    const randomCount = gridCells - figuresForLeft - figuresForRight;
    for (let i = 0; i < randomCount; i++) {
        const figure = generateRandomFigure();
        figuresArray.push(figure);
    }

    // Перемешиваем массив фигур
    figuresArray = shuffleArray(figuresArray);

    // Добавляем фигуры в сетку
    figuresArray.forEach(figure => {
        gameField.appendChild(figure);
    });

    // Сбрасываем таймер и запускаем его
    timeLeft = roundTime;
    startTimer()
}


function generateTaskFigure(side) {
    const figure = document.createElement("div"); //болванка
    figure.classList.add("figure");
    figure.classList.add(side, task[side].shape);
    //задаем цвет фигуре 
    if (task[side].shape === "triangle") {
        figure.style.borderBottomColor = curDifficulty >= 1 ? task[side].color : getRandomItem(colors); //если 1 или 2 сложность то указываем цвет из задания 
    } else {
        figure.style.backgroundColor = curDifficulty >= 1 ? task[side].color : getRandomItem(colors);;
    }
    //задаем размер
    figure.classList.add(curDifficulty === 2 ? task[side].size : 'medium');

    figure.setAttribute("data-side", side); //TODO что это такое 
    figure.setAttribute("draggable", true); // Включаем перетаскивание
    figure.addEventListener("dragstart", dragStart); // Обработчик перетаскивания
    if(chechCondition(figure, 'right')){
        figure.classList.add('goodRight');
    }
    if(chechCondition(figure, 'left')){
        figure.classList.add('goodLeft');
    }
    return figure;
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Функция генерации случайной фигуры
function generateRandomFigure() {
    const figure = document.createElement("div");
    figure.classList.add("figure");
    figure.classList.add(getRandomItem(shapes)); // Случайная форма
    if (figure.classList.contains("triangle")) {
        figure.style.borderBottomColor = getRandomItem(colors);
    } else {
        figure.style.backgroundColor =  getRandomItem(colors);
    }
    //figure.style.width = getRandomItem(sizes); // Случайный размер
    figure.classList.add(curDifficulty === 2 ? getRandomItem(sizes) : 'medium');
    figure.setAttribute("draggable", true); // Включаем перетаскивание
    figure.addEventListener("dragstart", dragStart); // Обработчик перетаскивания
    if(chechCondition(figure, 'right')){
        figure.classList.add('goodRight');
    }
    if(chechCondition(figure, 'left')){
        figure.classList.add('goodLeft');
    }
    return figure;
}

// Функция перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
function generateFeild(){
    const gridElement = document.querySelector('.grid');
    gridElement.style.gridTemplateColumns = 'repeat('+`${Number(currentUser.difficulty)+baseColNum}`+ ', 1fr)';
    gridElement.style.gridTemplateRows = 'repeat('+`${Number(currentUser.difficulty)+baseRowNum}`+ ', 1fr)';
}
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.outerHTML);
    event.target.classList.add("dragged");

     // Создаем заглушку
    // const placeholder = document.createElement("div");
    // placeholder.classList.add("placeholder");

//     // Заменяем фигуру на заглушку
//    event.target.parentNode.replaceChild(placeholder, event.target);
}
function dragOver(event) {
    event.preventDefault();
}

function drop(event, section, side) {
    event.preventDefault();
    const draggedHTML = event.dataTransfer.getData("text/plain");

    // Создаем DOM-элемент из строки HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = draggedHTML;
    const draggedElement = tempDiv.firstChild;

    // Проверяем соответствие условиям секции
    if (chechCondition(draggedElement, side)) {
        // Если фигура подходит
        section.appendChild(draggedElement);
        section.classList.add("correct");
        curScore+=1+ Math.round(0.3*timeLeft)+4*curDifficulty;
        console.log("правильная фигура кайф")
        // Удаляем исходную фигуру из поля
        const dragged = document.getElementById('game-field').querySelector(".dragged");
        if (dragged) {
            dragged.style.opacity = "0"; // Прозрачность
            dragged.style.pointerEvents = "none"; // Отключаем взаимодействие
            dragged.setAttribute("draggable", "false"); // Отключаем возможность перетаскивания
            dragged.classList.remove("dragged", 'goodLeft','goodRight');
        }
    } else {
        // Если фигура не подходит
        section.classList.add("wrong");
        setTimeout(() => section.classList.remove("wrong"), 1000); // Убираем подсветку через 1 сек
        curScore -= 5; // Снимаем очки
        console.log("неверно фигура")
        const dragged = document.getElementById('game-field').querySelector(".dragged");
        dragged.classList.remove("dragged");
        
    }
    document.getElementById('score-info').textContent = ` ${curScore}`;
    checkRoundEnd();
}

function writeTask(){
    // Получаем элементы для отображения задания
    const taskLabelLeft = document.getElementById("task-label-left");
    const taskLabelRight = document.getElementById("task-label-right");
      // Формируем текст задания на основе сложности
      let leftTaskText = `Слева: ${figureDictionary[task.left.shape]}`;
      let rightTaskText = `Справа: ${figureDictionary[task.right.shape]}`;
  
      if (curDifficulty === 1 ) {
          leftTaskText = `Слева: ${colorDictionary[task.left.color]} ${figureDictionary[task.left.shape]}`;
          rightTaskText = `Справа: ${colorDictionary[task.right.color]} ${figureDictionary[task.right.shape]}`;
      }
  
      if (curDifficulty === 2) {
          leftTaskText = `Слева: ${sizeDictionary[task.left.size]} ${colorDictionary[task.left.color]} ${figureDictionary[task.left.shape]}`;
          rightTaskText = `Справа: ${sizeDictionary[task.right.size]} ${colorDictionary[task.right.color]} ${figureDictionary[task.right.shape]}`;
      }
  
      // Обновляем текст задания
      taskLabelLeft.textContent = `${leftTaskText}`;
      taskLabelRight.textContent = `${rightTaskText}`;
      
}

function chechCondition(figure, side){
    // проверка на правильность фигуры на основе сложности
    if (curDifficulty === 0){
        if(side === 'left'){
            return (figure.classList.contains(task.left.shape))
        }
        return (figure.classList.contains(task.right.shape))
    }

    if (curDifficulty === 1 ) {
        if(side === 'left'){
            return (figure.classList.contains(task.left.shape) && (figure.style.backgroundColor === task.left.color || figure.style.borderBottomColor ===task.left.color ))
        }
        return (figure.classList.contains(task.right.shape) && (figure.style.backgroundColor === task.right.color || figure.style.borderBottomColor ===task.right.color ))
    }

    if (curDifficulty === 2) {
        if(side === 'left'){
            return (figure.classList.contains(task.left.shape) && (figure.style.backgroundColor === task.left.color || figure.style.borderBottomColor ===task.left.color ) && figure.classList.contains(task.left.size))
        }
        return (figure.classList.contains(task.right.shape) && (figure.style.backgroundColor === task.right.color || figure.style.borderBottomColor ===task.right.color ) && figure.classList.contains(task.right.size) )
    }
}

function checkRoundEnd(){
    const goodFigL = document.getElementById('game-field').querySelector(".goodLeft");
    const goodFigR = document.getElementById('game-field').querySelector(".goodRight");
    if(!(goodFigL || goodFigR)){
        if(curRound<numRounds-1){
            stopTimer();
            generateTask();
            generateFigures();
            curRound+=1; //обновить на доске что типа новый раунд TODO убрать это в отд функ
            document.getElementById('round-info').textContent = ` ${curRound+1} / ${numRounds}`;
            document.getElementById("time-left").textContent = ` ${roundTime} `;
            document.getElementById('left-container').innerHTML = ""; 
            document.getElementById('right-container').innerHTML = "";
        }
        else{
            showGameOverModal(winMessage);
            if(curScore>currentUser.scorel3){
                currentUser.scorel3 = curScore;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    }
}

document.getElementById('menu-btn').addEventListener('click', () => {
    alert("Ваши очки не сохранятся")
    window.location.href = "menu.html"; // Переход в меню
});