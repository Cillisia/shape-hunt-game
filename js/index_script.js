import { saveUserData, getUserData } from './storage.js';

// Получаем элементы
const startGameButton = document.getElementById('start-game');
const usernameInput = document.getElementById('username');
const rulesButton = document.getElementById('rulesMenuButton');
const rulesModal = document.getElementById('rules-banner');
const closeModal = document.getElementById('close-banner');

// Обработка кнопки "Начать игру"
startGameButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    let users = JSON.parse(localStorage.getItem('users')) || []; // Если в Local Storage пусто, создаем пустой массив
    // Проверяем, есть ли уже пользователь с таким именем
    const userData = users.some(user => user.username === username);
    if (username ) {
        if(!userData){
            // Создаем нового пользователя
            const newUser = {
                username: username,
                scorel1: 0, //лучший счет за первый уровень
                scorel2: 0,
                scorel3: 0,
                level: 1, // Начальный уровень
                difficulty: 'easy' // Начальная сложность
            };

            // Добавляем нового пользователя в массив
            users.push(newUser);

            // Сохраняем обновленный массив в Local Storage
            localStorage.setItem('users', JSON.stringify(users));

            // // Устанавливаем текущего пользователя
            // localStorage.setItem('currentUser', username);

            // // Переходим на игровую страницу
            // window.location.href = 'menu.html';
        }
        // Устанавливаем текущего пользователя
        localStorage.setItem('currentUser', username);
        // Переходим на игровую страницу
        window.location.href = 'menu.html';
        // else{
        //     alert('Пожалуйста, введите другой логин! Этот занят') ///ненене, тут надо короче писать привет братюня давно не виделись, это ж кент наш
        // }
    } else {
        alert('Пожалуйста, введите логин!');
    }
});

// Открытие модального окна с правилами
rulesButton.addEventListener('click', () => {
    rulesModal.classList.add('show-banner');
});

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    rulesModal.classList.remove('show-banner');
});

// // Закрытие модального окна при клике вне его
// window.addEventListener('click', (event) => {
//     if (event.target === rulesModal) {
//         rulesModal.style.display = 'none';
//     }
// });
