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
const API_BASE_URL = 'https://6de84d0b9739dadb6cac6f2c7a075551.serveo.net'; // Убедитесь, что этот IP и порт верны и доступны с устройства, где открыт браузер

async function fetchCategoryCounts() {
    const breakfastCountSpan = document.getElementById('breakfast-count');
    const drinkCountSpan = document.getElementById('drink-count');     // Убедитесь, что id верный
    const dessertCountSpan = document.getElementById('dessert-count');   // Убедитесь, что id верный
    const errorMessageP = document.getElementById('category-counts-error');

    try {
        const response = await fetch(`${API_BASE_URL}/orders/statistics/category-counts`);
        console.log("Category Counts - Response status:", response.status);
        console.log("Category Counts - Response ok?:", response.ok);
        console.log("Category Counts - Response headers:", response.headers.get('Content-Type'));

        if (!response.ok) {
            const errorTextFromServer = await response.text();
            console.error("Category Counts - Server error response text:", errorTextFromServer);
            throw new Error(`Ошибка сети: ${response.status} ${response.statusText} - ${errorTextFromServer}`);
        }

        const responseText = await response.text();
        console.log("Category Counts - Raw response text:", responseText);

        const data = JSON.parse(responseText);
        console.log("Category Counts - Parsed data:", data);

        // Обновляем завтраки
        if (breakfastCountSpan) {
            console.log("Updating breakfastCountSpan. Element found:", breakfastCountSpan, "Value:", data.breakfastOrders);
            breakfastCountSpan.textContent = data.breakfastOrders !== undefined ? data.breakfastOrders : 'N/A';
        } else {
            console.error("Element with id 'breakfast-count' not found!");
        }

        // Обновляем напитки
        if (drinkCountSpan) {
            console.log("Updating drinkCountSpan. Element found:", drinkCountSpan, "Value:", data.drinkOrders);
            drinkCountSpan.textContent = data.drinkOrders !== undefined ? data.drinkOrders : 'N/A';
        } else {
            console.error("Element with id 'drink-count' not found!");
        }

        // Обновляем десерты
        if (dessertCountSpan) {
            console.log("Updating dessertCountSpan. Element found:", dessertCountSpan, "Value:", data.dessertOrders);
            dessertCountSpan.textContent = data.dessertOrders !== undefined ? data.dessertOrders : 'N/A';
        } else {
            console.error("Element with id 'dessert-count' not found!");
        }
        
        if (errorMessageP) errorMessageP.style.display = 'none';

    } catch (error) {
        console.error('Ошибка в fetchCategoryCounts:', error);
        if (breakfastCountSpan) breakfastCountSpan.textContent = 'ошибка';
        if (drinkCountSpan) drinkCountSpan.textContent = 'ошибка';
        if (dessertCountSpan) dessertCountSpan.textContent = 'ошибка';
        if (errorMessageP) {
            errorMessageP.textContent = `Не удалось загрузить статистику по категориям. ${error.message}`;
            errorMessageP.style.display = 'block';
        }
    }
}

async function fetchTopDrinks() {
    const topDrinksList = document.getElementById('top-drinks-list');
    const errorMessageP = document.getElementById('top-drinks-error');

    try {
        // Правильное использование шаблонной строки с обратными кавычками
        const response = await fetch(`${API_BASE_URL}/orders/statistics/top-drinks`);

        if (!response.ok) {
            let errorText = `Ошибка сети: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.text();
                if (errorData) {
                    errorText += ` - ${errorData}`;
                }
            } catch (e) {
                // не удалось получить тело ошибки
            }
            throw new Error(errorText);
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
            errorMessageP.textContent = `Не удалось загрузить топ напитков. ${error.message}`;
            errorMessageP.style.display = 'block';
        }
    }
}