// Получаем данные из local storage и отображаем их на странице
document.addEventListener("DOMContentLoaded", function() {
    const leaderboardTableBody = document.querySelector('#leaderboard tbody');

    // Получаем данные пользователей из local storage
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Обработчик для сбора информации о лучших баллах
    const usersWithScores = users.map(user => {
        const bestScore = user.scorel1+ user.scorel2+ user.scorel3;
        return {
            username: user.username,
            bestScore: bestScore
        };
    });

    // Сортируем пользователей по лучшим баллам в порядке убывания
    usersWithScores.sort((a, b) => b.bestScore - a.bestScore);

    // Добавляем данные в таблицу
    usersWithScores.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td>${user.bestScore}</td>
        `;
        leaderboardTableBody.appendChild(row);
    });
});
