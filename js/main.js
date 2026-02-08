// js/main.js

import { initServiceCards } from "./components/service-cards.js";
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

    // Не показываем ошибку пользователю, сайт продолжает работать
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
  console.log("🔍 Данные услуг:", window.allServices || "Нет данных");
};
