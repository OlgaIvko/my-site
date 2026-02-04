// js/main.js - исправленная версия

import { initServiceCards } from "./components/service-cards.js";
import { initFilters } from "./components/filters.js";
import { initQuickSelect } from "./components/quick-select.js";
import { initOrderCalculation } from "./components/order-calc.js";
import { initCart } from "./components/cart.js";
import { initFAQ } from "./components/faq.js";

function initApp() {
  console.log("🚀 Запуск сайта веб-студии");

  try {
    initServiceCards();
    console.log("✅ Услуги загружены");

    initFilters();
    console.log("✅ Фильтры");

    initQuickSelect();
    console.log("✅ Быстрый выбор");

    initOrderCalculation();
    console.log("✅ Заказ расчёта");

    initCart();
    console.log("✅ Корзина");

    initFAQ(); // ИСПРАВЛЕНО: должен быть FAQ а не Корзина
    console.log("✅ FAQ аккордеон");

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
