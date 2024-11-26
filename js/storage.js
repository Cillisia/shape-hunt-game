// Функции для работы с Local Storage

// Сохранение данных пользователя
function saveUserData(username, data) {
    let users = JSON.parse(localStorage.getItem('users')) || {};
    users[username] = { ...users[username], ...data };
    localStorage.setItem('users', JSON.stringify(users));
}

// Получение данных пользователя
function getUserData(username) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    return users[username] || null;
}

// Получение всех пользователей
function getAllUsers() {
    return JSON.parse(localStorage.getItem('users')) || {};
}

// Экспорт функций, чтобы их можно было использовать в других модулях
export { saveUserData, getUserData, getAllUsers };
