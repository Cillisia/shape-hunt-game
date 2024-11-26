// Загружаем данные пользователя из Local Storage
const currentUser = localStorage.getItem('currentUser');
const users = JSON.parse(localStorage.getItem('users')) || [];

// Найти данные текущего игрока
const userData = users.find(user => user.username === currentUser);
// Если данные пользователя есть, обновляем интерфейс  странно оч, убрать
if (userData) {
    document.getElementById('player-name').textContent = `Игрок: ${userData.username}`;
    document.getElementById('player-score').textContent = `Очки: ${userData.score}`;
} else {
    // Если пользователя не найдено, отправляем на страницу регистрации
    alert('Пользователь не найден. Пожалуйста, войдите снова.');
    window.location.href = 'index.html';
}

// Добавляем обработчики событий на кнопки выбора уровня
document.getElementById('level1').addEventListener('click', () => {
    // Переходим на игровую страницу
    window.location.href = '../level1.html';
});
document.getElementById('mediumLevel').addEventListener('click', () => {
    startGame('medium');
});
document.getElementById('hardLevel').addEventListener('click', () => {
    startGame('hard');
});

// Кнопка с правилами
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
