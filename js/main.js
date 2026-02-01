// js/main.js - финальная версия

import { initBurgerMenu } from "./components/burger-menu.js";
import { initLocationDropdown } from "./components/location-dropdown.js";
import { initServiceCards } from "./components/service-cards.js";
import { initFilters } from "./components/filters.js";
import { initQuickSelect } from "./components/quick-select.js";
import { initOrderCalculation } from "./components/order-calc.js"; // ДОБАВЛЯЕМ
import { initCart } from "./components/cart.js";

function initApp() {
  console.log("🚀 Запуск сайта веб-студии");

  try {
    // Основные компоненты
    initBurgerMenu();
    console.log("✅ Бургер-меню");

    // initLocationDropdown();
    // console.log("✅ Выбор города");

    initServiceCards();
    console.log("✅ Услуги загружены");

    initFilters();
    console.log("✅ Фильтры");

    initQuickSelect();
    console.log("✅ Быстрый выбор");

    initOrderCalculation(); // ДОБАВЛЯЕМ ЭТУ СТРОЧКУ
    console.log("✅ Заказ расчёта");

    initCart();
    console.log("✅ Корзина");

    console.log("🎉 Всё работает!");
  } catch (error) {
    console.error("❌ Ошибка:", error);
  }
}

// Запуск
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
