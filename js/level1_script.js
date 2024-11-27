let curRound = 0;
let curScore = 0;
const numRounds=10;
const roundTime = 5000;
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

const colors = ["red", "blue", "green", "yellow", "purple"];
const shapes = ["circle", "square", "triangle"]; // Можно добавить больше фигур

const gridCells = 8; // Общее количество ячеек в сетке

let targetColor = 'blue'; //дефолтные значения
let targetShape = 'curcle';
let targetCellIndex = 0; 

//создаем задание
function generateTask() {
    targetColor = colors[Math.floor(Math.random() * colors.length)];
    targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    targetCellIndex = Math.floor(Math.random() * gridCells); 

    //подписали задание
    document.getElementById("task-label").textContent = `Найди ${colorDictionary[targetColor]} ${figureDictionary[targetShape]}`; //хз

}


// Генерация фигур в сетке
function generateFigures() {
    const gameField = document.getElementById("game-field");
    gameField.innerHTML = ""; // Очищаем поле перед каждым раундом

    for (let i = 0; i < gridCells; i++) {
        const figure = document.createElement("div");
        figure.classList.add("figure");

        // Если это ячейка для правильной фигуры
        if (i === targetCellIndex) {
            figure.classList.add("target", targetShape);
            
            if (targetShape === "triangle") {
                figure.style.borderBottomColor = targetColor;
            } else {
                figure.style.backgroundColor = targetColor;
            }

            // Добавляем обработчик для правильного клика
            figure.addEventListener("click", () => {
                console.log("Правильная фигура найдена!");
                // Тут будет логика перехода к следующему раунду
                checkFigure(figure);
            });
        } else {
            // Генерируем случайную фигуру и цвет, отличные от целевой
            let randomColor, randomShape;
            do {
                randomColor = colors[Math.floor(Math.random() * colors.length)];
                randomShape = shapes[Math.floor(Math.random() * shapes.length)];
            } while (randomColor === targetColor && randomShape === targetShape);

            figure.classList.add(randomShape);
            if (randomShape === "triangle") {
                figure.style.borderBottomColor = randomColor;
            } else {
                figure.style.backgroundColor = randomColor;
            }

            // Добавляем обработчик для неправильного клика
            figure.addEventListener("click", () => {
                console.log("Неправильная фигура!");
                // Тут можно добавить логику штрафа потом отд функцию наклипать
                checkFigure(figure);
            });
        }
        gameField.appendChild(figure);
    }
}

// Генерация случайного цвета
function getRandomColor() {
    const colors = ["red", "blue", "green", "yellow", "purple"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Проверка выбранной фигуры
function checkFigure(figure) {
    // Логика проверки: сравнить свойства фигуры с текущим заданием
    console.log("Фигура выбрана:", figure);
    if(figure.classList.contains('target')){
        curScore+=50; //TODO сделать зависимость от времени
        // и еще обновить счет на экране

        //начать следующий раунд, типа вызвать функцию перезагрузки стола и тд 
        if(curRound<numRounds){
            generateTask();
            generateFigures();
        }
        else{
            //кайфы, расход
        }
        curRound+=1; //обновить на доске что типа новый раунд TODO
    }
    else{
        curScore-=10;
        //и пусть на экране будет вылетать где-то сбоку красная надпись -10
        //ну или фигура неприкольно трясется угрожающе
        //для всех фигур он ховер прописать смешнявки
    }
}

// Инициализация первого раунда цикл навесить TODO
generateTask();
generateFigures();