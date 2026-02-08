// js/main.js

import { initServiceCards, addSyncButton } from "./components/service-cards.js";
import { initFilters } from "./components/filters.js";
import { initQuickSelect } from "./components/quick-select.js";
import { initOrderCalculation } from "./components/order-calc.js";
import { initCart } from "./components/cart.js";
import { initFAQ } from "./components/faq.js";

// Главная функция инициализации
async function initApp() {
  console.log("🚀 Запуск сайта веб-студии");

  try {
    // Инициализируем компоненты
    await initServiceCards();
    console.log("✅ Услуги загружены");

    // Добавляем кнопку синхронизации
    addSyncButton();

    initFilters();
    console.log("✅ Фильтры");

    initQuickSelect();
    console.log("✅ Быстрый выбор");

    initOrderCalculation();
    console.log("✅ Заказ расчёта");

    initCart();
    console.log("✅ Корзина");

    initFAQ();
    console.log("✅ FAQ аккордеон");

    console.log("🎉 Всё работает!");
  } catch (error) {
    console.error("❌ Ошибка при инициализации:", error);

    // Показываем сообщение об ошибке
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            text-align: center;
        `;
    errorDiv.innerHTML = `
            <strong>⚠️ Внимание</strong>
            <p>Не удалось загрузить данные. Проверьте подключение к интернету.</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 15px; background: white; color: #ff6b6b; border: none; border-radius: 3px; cursor: pointer;">
                Обновить страницу
            </button>
        `;
    document.body.appendChild(errorDiv);
  }
}

// Запускаем при загрузке DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Глобальные функции для отладки
window.debugServices = function () {
  console.log("🔍 Отладка услуг:", window.allServices || "Нет данных");
  console.log("📊 Кэш:", localStorage.getItem("services_cache"));
  console.log("🕒 Кэш-время:", localStorage.getItem("cache_timestamp"));
};
