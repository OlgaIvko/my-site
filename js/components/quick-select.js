// js/components/quick-select.js - ОБНОВЛЕННАЯ ВЕРСИЯ

// Импортируем функцию фильтрации из service-cards
import { filterServices } from "./service-cards.js";

let allServices = [];

export function initQuickSelect() {
  console.log("🎯 Инициализация быстрого выбора");

  const quickButtons = document.querySelectorAll(".quick-btn");
  if (!quickButtons.length) {
    console.warn("❌ Кнопки быстрого выбора не найдены");
    return;
  }

  // Получаем список всех услуг из service-cards
  const serviceContainer = document.querySelector(".catalog__list");
  if (serviceContainer) {
    const serviceItems = serviceContainer.querySelectorAll(".catalog__item");
    allServices = Array.from(serviceItems).map((item) => {
      return {
        id: item.dataset.id,
        type: item.dataset.type,
      };
    });
  }

  console.log(
    `✅ Найдено кнопок: ${quickButtons.length}, услуг: ${allServices.length}`,
  );

  // Обработчик кликов по кнопкам
  quickButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Снимаем активный класс у всех кнопок
      quickButtons.forEach((btn) => btn.classList.remove("active"));

      // Добавляем активный класс текущей кнопке
      this.classList.add("active");

      // Получаем тип фильтра
      const filterType = this.dataset.type;

      // Применяем фильтр
      applyQuickFilter(filterType);
    });
  });

  console.log("✅ Быстрый выбор инициализирован");
}

// Применение быстрого фильтра
function applyQuickFilter(filterType) {
  console.log("🎯 Применяем фильтр:", filterType);

  // Получаем все карточки услуг
  const serviceCards = document.querySelectorAll(".catalog__item");

  if (!serviceCards.length) {
    console.warn("❌ Карточки услуг не найдены");
    return;
  }

  // В зависимости от типа фильтра
  switch (filterType) {
    case "all":
      // Показываем ВСЕ услуги
      serviceCards.forEach((card) => {
        card.style.display = "";
        card.classList.remove("filtered-out");
      });
      break;

    case "popular":
      // Показываем только популярные (с иконкой 🔥)
      serviceCards.forEach((card) => {
        const isPopular = card.querySelector(".service-badge") !== null;
        if (isPopular) {
          card.style.display = "";
          card.classList.remove("filtered-out");
        } else {
          card.style.display = "none";
          card.classList.add("filtered-out");
        }
      });
      break;

    case "landing":
      // Показываем только лендинги
      serviceCards.forEach((card) => {
        const isLanding = card.dataset.type === "landing";
        if (isLanding) {
          card.style.display = "";
          card.classList.remove("filtered-out");
        } else {
          card.style.display = "none";
          card.classList.add("filtered-out");
        }
      });
      break;

    case "shop":
      // Показываем только магазины
      serviceCards.forEach((card) => {
        const isShop = card.dataset.type === "shop";
        if (isShop) {
          card.style.display = "";
          card.classList.remove("filtered-out");
        } else {
          card.style.display = "none";
          card.classList.add("filtered-out");
        }
      });
      break;

    case "corporate":
      // Показываем только корпоративные
      serviceCards.forEach((card) => {
        const isCorporate = card.dataset.type === "corporate";
        if (isCorporate) {
          card.style.display = "";
          card.classList.remove("filtered-out");
        } else {
          card.style.display = "none";
          card.classList.add("filtered-out");
        }
      });
      break;

    case "mobile":
      // Показываем только mobile
      serviceCards.forEach((card) => {
        const isMobile = card.dataset.type === "mobile";
        if (isMobile) {
          card.style.display = "";
          card.classList.remove("filtered-out");
        } else {
          card.style.display = "none";
          card.classList.add("filtered-out");
        }
      });
      break;
    case "business-card":
      // Показываем только business-card
      serviceCards.forEach((card) => {
        const isBusiness = card.dataset.type === "business-card";
        if (isBusiness) {
          card.style.display = "";
          card.classList.remove("filtered-out");
        } else {
          card.style.display = "none";
          card.classList.add("filtered-out");
        }
      });
      break;
  }

  // Обновляем счетчик
  updateVisibleCount();

  // Анимация появления
  animateFilteredCards();
}

// Обновление счетчика видимых карточек
function updateVisibleCount() {
  const visibleCards = document.querySelectorAll(
    '.catalog__item:not([style*="display: none"])',
  ).length;
  const totalCards = document.querySelectorAll(".catalog__item").length;

  // Можно вывести в консоль или обновить UI
  console.log(`📊 Показано: ${visibleCards} из ${totalCards} услуг`);

  // Если хотите показывать счетчик пользователям, раскомментируйте:
  // const counterElement = document.querySelector('.services-counter');
  // if (!counterElement) {
  //   const counter = document.createElement('div');
  //   counter.className = 'services-counter';
  //   counter.innerHTML = `<span>${visibleCards}</span> из <span>${totalCards}</span> услуг`;
  //   document.querySelector('.catalog__quick-select').appendChild(counter);
  // } else {
  //   counterElement.innerHTML = `<span>${visibleCards}</span> из <span>${totalCards}</span> услуг`;
  // }
}

// Анимация отфильтрованных карточек
function animateFilteredCards() {
  const visibleCards = document.querySelectorAll(
    '.catalog__item:not([style*="display: none"])',
  );

  visibleCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.05}s`;
    card.classList.add("fade-in");
  });
}

// Альтернативная версия - если хотите использовать функцию фильтрации из service-cards.js
function applyQuickFilterAlternative(filterType) {
  console.log("🎯 Применяем фильтр (альтернатива):", filterType);

  let selectedTypes = [];
  let selectedStatus = "all";

  switch (filterType) {
    case "all":
      selectedTypes = [
        "landing",
        "shop",
        "corporate",
        "mobile",
        "support",
        "design",
        "development",
        "branding",
        "apps",
      ];
      selectedStatus = "all";
      break;

    case "popular":
      selectedTypes = [
        "landing",
        "shop",
        "corporate",
        "mobile",
        "support",
        "design",
        "development",
        "branding",
        "apps",
      ];
      selectedStatus = "popular";
      break;

    case "landing":
      selectedTypes = ["landing"];
      selectedStatus = "all";
      break;

    case "shop":
      selectedTypes = ["shop"];
      selectedStatus = "all";
      break;

    case "corporate":
      selectedTypes = ["corporate"];
      selectedStatus = "all";
      break;
  }

  // Вызываем функцию фильтрации из service-cards.js
  filterServices(selectedTypes, selectedStatus);
}
