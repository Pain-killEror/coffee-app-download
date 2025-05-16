// Устанавливаем текущий год в подвале
document.addEventListener('DOMContentLoaded', (event) => {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Загружаем статистику
    fetchCategoryCounts();
    fetchTopDrinks();
});

// API URL (если HTML открывается не с того же домена, что и API)
const API_BASE_URL = 'http://192.168.0.154:8080'; // Раскомментируйте и измените, если нужно

async function fetchCategoryCounts() {
    const breakfastCountSpan = document.getElementById('breakfast-count');
    const drinkCountSpan = document.getElementById('drink-count');
    const dessertCountSpan = document.getElementById('dessert-count');
    const errorMessageP = document.getElementById('category-counts-error');

    try {
        // const response = await fetch(`${API_BASE_URL}/orders/statistics/category-counts`); // Если используете API_BASE_URL
        
        const response = await fetch('${API_BASE_URL}/orders/statistics/category-counts'); // Для относительного пути

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        breakfastCountSpan.textContent = data.breakfastOrders !== undefined ? data.breakfastOrders : 'N/A';
        drinkCountSpan.textContent = data.drinkOrders !== undefined ? data.drinkOrders : 'N/A';
        dessertCountSpan.textContent = data.dessertOrders !== undefined ? data.dessertOrders : 'N/A';
        if (errorMessageP) errorMessageP.style.display = 'none';

    } catch (error) {
        console.error('Ошибка при загрузке статистики по категориям:', error);
        if (breakfastCountSpan) breakfastCountSpan.textContent = 'ошибка';
        if (drinkCountSpan) drinkCountSpan.textContent = 'ошибка';
        if (dessertCountSpan) dessertCountSpan.textContent = 'ошибка';
        if (errorMessageP) {
            errorMessageP.textContent = 'Не удалось загрузить статистику по категориям.';
            errorMessageP.style.display = 'block';
        }
    }
}

async function fetchTopDrinks() {
    const topDrinksList = document.getElementById('top-drinks-list');
    const errorMessageP = document.getElementById('top-drinks-error');

    try {
        // const response = await fetch(`${API_BASE_URL}/orders/statistics/top-drinks`); // Если используете API_BASE_URL
        const response = await fetch('${API_BASE_URL}/orders/statistics/top-drinks'); // Для относительного пути

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        topDrinksList.innerHTML = ''; // Очищаем предыдущие элементы (например, "Загрузка...")

        if (data && data.length > 0) {
            data.forEach(drinkName => {
                const listItem = document.createElement('li');
                listItem.textContent = drinkName;
                topDrinksList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = 'Пока нет данных о популярных напитках.';
            topDrinksList.appendChild(listItem);
        }
        if (errorMessageP) errorMessageP.style.display = 'none';

    } catch (error) {
        console.error('Ошибка при загрузке топ напитков:', error);
        topDrinksList.innerHTML = ''; // Очищаем в случае ошибки
        const errorItem = document.createElement('li');
        errorItem.textContent = 'Ошибка загрузки';
        errorItem.style.color = '#c0392b';
        topDrinksList.appendChild(errorItem);
        if (errorMessageP) {
            errorMessageP.textContent = 'Не удалось загрузить топ напитков.';
            errorMessageP.style.display = 'block';
        }
    }
}