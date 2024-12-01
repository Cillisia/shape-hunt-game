// Получаем текущего пользователя из Local Storage
const currentUsername = localStorage.getItem('currentUser'); // имя текущего пользователя
let users = JSON.parse(localStorage.getItem('users')) || []; // массив пользователей

// Находим текущего пользователя
const currentUser = users.find(user => user.username === currentUsername);

document.getElementById('player-name').textContent = `Игрок: ${currentUser.username}`;
document.getElementById('player-score').textContent = `Очки: ${currentUser.scorel1+currentUser.scorel2+currentUser.scorel3}`; ///очки как сложение 

// Добавляем обработчики событий на кнопки выбора уровня
document.getElementById('level1').addEventListener('click', () => {
    uploadData();
    window.location.href = '../level1.html';
});

document.getElementById('level3').addEventListener('click', () => {
    uploadData();
    window.location.href = '../level3.html';
});

// Кнопка с правилами TODO
document.getElementById('rulesMenuButton').addEventListener('click', () => {
    alert('Правила игры: Найдите нужные фигуры, следуя инструкциям. Уровни сложности увеличивают скорость и сложность задач!');
});

// Функция для запуска игры
function startGame(level) {
    // Сохраняем выбранный уровень сложности
    userData.difficulty = level;
    localStorage.setItem('users', JSON.stringify(users));

    // Переходим на игровую страницу
    window.location.href = 'game.html';
}

function uploadData(){
    //сохраняем сложность,, которую выставил игрок
    const selectedDifficulty = document.getElementById('difficulty-select').value;
    currentUser.difficulty = selectedDifficulty;
    // Сохраняем обновленный массив пользователей обратно в Local Storage
    localStorage.setItem('users', JSON.stringify(users));
}



