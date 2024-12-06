// Получаем текущего пользователя из Local Storage
const currentUsername = localStorage.getItem('currentUser'); // имя текущего пользователя
let users = JSON.parse(localStorage.getItem('users')) || []; // массив пользователей

// Находим текущего пользователя
const currentUser = users.find(user => user.username === currentUsername);

document.getElementById('player-name').textContent = `Игрок: ${currentUser.username}`;
document.getElementById('player-score').textContent = `Очки: ${currentUser.scorel1+currentUser.scorel2+currentUser.scorel3}`; ///очки как сложение 

function checkLevelAccess() {
    // Условия (пример: переменная должна быть true)
    if(currentUser.scorel1 < 600){
        document.getElementById('level2').classList.add("disabled");
    }
    if(currentUser.scorel2 < 300){
        document.getElementById('level3').classList.add("disabled");
    }
    
}

// Добавляем обработчики событий на кнопки выбора уровня
document.getElementById('level1').addEventListener('click', () => {
    uploadData();
    window.location.href = '../level1.html';
});
document.getElementById('level2').addEventListener('click', () => {
    if(currentUser.scorel1 >600){
        uploadData();
        window.location.href = '../level2.html';
    }else{
        showBanner('Этот уровень вам пока недоступен. Наберите на 1 уровне 600 очков');
    }
    
});
document.getElementById('level3').addEventListener('click', () => {
    if(!document.getElementById('level3').classList.contains('disabled')){
        uploadData();
        window.location.href = '../level3.html';
    }else{
        showBanner('Этот уровень вам пока недоступен. Наберите на 2 уровне 300 очков');
    }
});

function showBanner(message) {
    const banner = document.getElementById('not-banner')
    banner.textContent = message;
    banner.classList.add("show-banner");
    setTimeout(() => banner.classList.remove("show-banner"), 2500); // Скрытие баннера через 3 сек
}


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

checkLevelAccess();

// Элемент баннера и кнопка закрытия
const rulesBanner = document.getElementById('rules-banner');
const closeBannerButton = document.getElementById('close-banner');
// const bannerMessage = document.getElementById('banner-message');

// Функция для отображения баннера
function showRulesBanner(message) {
    // bannerMessage.textContent = message;
    rulesBanner.classList.add('show-banner');
}

// Функция для скрытия баннера
function hideRulesBanner() {
    rulesBanner.classList.remove('show-banner');
}

// Обработчик клика по кнопке "крестик"
closeBannerButton.addEventListener('click', hideRulesBanner);

// Обработчик клика по кнопке меню TODO
document.getElementById('rulesMenuButton').addEventListener('click', () => {
    showRulesBanner('Правила игры: Найдите нужные фигуры, следуя инструкциям. Уровни сложности увеличивают скорость и сложность задач!');
});

document.getElementById('rating').addEventListener('click', () => {
    window.location.href = '../rating.html';
});

document.getElementById('unlogButton').addEventListener('click', () => {
    window.location.href = '../index_game.html';
});