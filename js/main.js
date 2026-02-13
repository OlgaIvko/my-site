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
// Добавьте в ваш main.js
document.addEventListener("DOMContentLoaded", function () {
  // Анимация при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");

        // Добавляем классы анимации для дочерних элементов
        const children = entry.target.querySelectorAll("[data-animate]");
        children.forEach((child, index) => {
          setTimeout(() => {
            child.classList.add("animate-in");
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  // Наблюдаем за промо-карточкой
  const promoCard = document.querySelector(".promo-card");
  if (promoCard) {
    observer.observe(promoCard);
  }
});

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

// Функция для получения куки
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

document.addEventListener("DOMContentLoaded", function () {
  // Проверяем, есть ли кука consent
  if (!getCookie("cookieConsent")) {
    // Показываем баннер через 1 секунду
    setTimeout(function () {
      document.getElementById("cookie-consent-banner").style.display = "block";
    }, 1000);
  }

  // Кнопка "Принять"
  document
    .getElementById("cookie-accept")
    .addEventListener("click", function () {
      setCookie("cookieConsent", "accepted", 365); // хранится 365 дней
      document.getElementById("cookie-consent-banner").style.display = "none";

      // Здесь можно включить аналитику, если она есть
      console.log("Куки приняты");
    });

  // Кнопка "Отклонить"
  document
    .getElementById("cookie-decline")
    .addEventListener("click", function () {
      setCookie("cookieConsent", "declined", 7); // хранится 7 дней
      document.getElementById("cookie-consent-banner").style.display = "none";

      // Здесь можно отключить аналитику
      console.log("Куки отклонены");
    });
});
