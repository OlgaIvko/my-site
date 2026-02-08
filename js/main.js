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
    console.log("✅ Модуль услуг загружен");

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

    console.log("🎉 Приложение запущено!");
  } catch (error) {
    console.error("❌ Ошибка при инициализации:", error);

    // Не показываем сообщение об ошибке, так как initServiceCards
    // сам показывает сообщение при отсутствии данных
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
