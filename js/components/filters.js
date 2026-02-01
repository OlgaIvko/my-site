// // Фильтрация товаров
// import { getAllProducts, renderFilteredProducts } from "./product-cards.js";
// import { applyCurrentSorting } from "./sorting.js";

// let currentFilters = {
//   types: [],
//   status: "all-item",
// };

// export function initFilters() {
//   console.log("🔍 Инициализация фильтров");

//   // Получаем элементы фильтров
//   const typeCheckboxes = document.querySelectorAll(
//     '.custom-checkbox__field[name="type"]',
//   );
//   const statusRadios = document.querySelectorAll(
//     '.custom-radio__field[name="status"]',
//   );
//   const resetButton = document.querySelector(".catalog-form__reset");

//   if (!typeCheckboxes.length || !statusRadios.length) {
//     console.error("❌ Элементы фильтров не найдены");
//     return;
//   }

//   console.log("✅ Элементы фильтров найдены");

//   // Обработчики для чекбоксов типов
//   typeCheckboxes.forEach((checkbox) => {
//     checkbox.addEventListener("change", function () {
//       updateTypeFilters(this.value, this.checked);
//       applyFilters();
//     });
//   });

//   // Обработчики для радиокнопок статуса
//   statusRadios.forEach((radio) => {
//     radio.addEventListener("change", function () {
//       if (this.checked) {
//         currentFilters.status = this.value;
//         applyFilters();
//       }
//     });
//   });

//   // Обработчик для кнопки сброса
//   if (resetButton) {
//     resetButton.addEventListener("click", function (e) {
//       e.preventDefault();
//       resetFilters();
//     });
//   }

//   console.log("✅ Фильтры инициализированы");
// }

// // Обновление фильтров по типам
// function updateTypeFilters(type, isChecked) {
//   if (isChecked) {
//     // Добавляем тип в фильтры
//     if (!currentFilters.types.includes(type)) {
//       currentFilters.types.push(type);
//     }
//   } else {
//     // Удаляем тип из фильтров
//     currentFilters.types = currentFilters.types.filter((t) => t !== type);
//   }

//   console.log("🎛️ Обновлены фильтры типов:", currentFilters.types);
// }

// // Применение фильтров
// function applyFilters() {
//   console.log("🔄 Применяем фильтры:", currentFilters);

//   const allProducts = getAllProducts();
//   let filteredProducts = [...allProducts];

//   // Фильтрация по типам
//   if (currentFilters.types.length > 0) {
//     filteredProducts = filteredProducts.filter((product) => {
//       // Проверяем, есть ли у товара хотя бы один из выбранных типов
//       return product.type.some((type) => currentFilters.types.includes(type));
//     });
//   }

//   // Фильтрация по наличию
//   if (currentFilters.status === "instock") {
//     filteredProducts = filteredProducts.filter((product) => {
//       // Товар в наличии, если хотя бы в одном городе количество > 0
//       return Object.values(product.availability).some((count) => count > 0);
//     });
//   }

//   console.log(`📊 Результат фильтрации: ${filteredProducts.length} товаров`);

//   // Отрисовываем отфильтрованные товары
//   renderFilteredProducts(filteredProducts);

//   // Применяем текущую сортировку к отфильтрованным товарам
//   applyCurrentSorting();
// }

// // Сброс фильтров
// function resetFilters() {
//   console.log("🔄 Сбрасываем фильтры");

//   // Сбрасываем состояние фильтров
//   currentFilters.types = [];
//   currentFilters.status = "all-item";

//   // Сбрасываем чекбоксы
//   const typeCheckboxes = document.querySelectorAll(
//     '.custom-checkbox__field[name="type"]',
//   );
//   typeCheckboxes.forEach((checkbox) => {
//     checkbox.checked = false;
//   });

//   // Сбрасываем радиокнопки
//   const statusRadios = document.querySelectorAll(
//     '.custom-radio__field[name="status"]',
//   );
//   statusRadios.forEach((radio) => {
//     radio.checked = radio.value === "all-item";
//   });

//   // Применяем фильтры (показываем все товары)
//   applyFilters();
// }

// function setupFilters(services) {
//   const checkboxes = document.querySelectorAll('input[name="type"]');
//   const sortSelect = document.querySelector(".services__sort select");

//   function updateServices() {
//     let filtered = [...services];

//     // Фильтрация по типу
//     const checkedTypes = Array.from(checkboxes)
//       .filter((cb) => cb.checked)
//       .map((cb) => cb.value);

//     if (checkedTypes.length > 0) {
//       filtered = filtered.filter((service) =>
//         checkedTypes.includes(service.type),
//       );
//     }

//     // Сортировка
//     const sortValue = sortSelect.value;
//     if (sortValue === "price-low") {
//       filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
//     } else if (sortValue === "price-high") {
//       filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
//     } else if (sortValue === "popular") {
//       filtered.sort((a, b) => b.popular - a.popular);
//     }

//     renderServices(filtered);
//   }

//   checkboxes.forEach((cb) => cb.addEventListener("change", updateServices));
//   sortSelect.addEventListener("change", updateServices);
// }

// // components/filters.js

// export function initFilters() {
//   console.log("🎛️ Инициализация фильтров услуг");

//   const filterForm = document.querySelector(".catalog-form");
//   if (!filterForm) return;

//   // Обработчик сброса фильтров
//   const resetButton = filterForm.querySelector(".catalog-form__reset");
//   if (resetButton) {
//     resetButton.addEventListener("click", () => {
//       // Сбрасываем все чекбоксы
//       filterForm
//         .querySelectorAll('input[type="checkbox"]')
//         .forEach((cb) => (cb.checked = false));
//       filterForm
//         .querySelectorAll('input[type="radio"][value="all-item"]')
//         .forEach((rb) => (rb.checked = true));

//       // Триггерим событие фильтрации
//       filterForm.dispatchEvent(new Event("change"));
//     });
//   }

//   // Обработчик изменений в фильтрах
//   filterForm.addEventListener("change", handleFilterChange);
// }

// function handleFilterChange() {
//   console.log("🔄 Изменение фильтров");

//   // Получаем выбранные типы услуг
//   const selectedTypes = Array.from(
//     document.querySelectorAll('input[name="type"]:checked'),
//   ).map((cb) => cb.value);

//   // Получаем выбранный статус
//   const selectedStatus = document.querySelector(
//     'input[name="status"]:checked',
//   )?.value;

//   // Фильтруем услуги
//   filterServices(selectedTypes, selectedStatus);
// }

// function filterServices(selectedTypes, selectedStatus) {
//   // Получаем все карточки услуг
//   const allCards = document.querySelectorAll(".service-card");
//   let visibleCount = 0;

//   allCards.forEach((card) => {
//     const cardType = card.dataset.type;
//     const isPopular = card.querySelector(".service-card__badge") !== null;

//     // Проверяем соответствие фильтрам
//     let isVisible = true;

//     // Фильтр по типу
//     if (selectedTypes.length > 0 && !selectedTypes.includes(cardType)) {
//       isVisible = false;
//     }

//     // Фильтр по статусу (популярные/все)
//     if (selectedStatus === "instock" && !isPopular) {
//       isVisible = false;
//     }

//     // Показываем/скрываем карточку
//     card.style.display = isVisible ? "" : "none";
//     if (isVisible) visibleCount++;
//   });

//   // Показываем сообщение если ничего не найдено
//   const emptyState = document.querySelector(".empty-state");
//   if (visibleCount === 0 && !emptyState) {
//     const container = document.querySelector(".services__list");
//     if (container) {
//       container.innerHTML += `
//         <div class="empty-state">
//           <p>😔 Услуг по выбранным фильтрам не найдено</p>
//           <button class="btn btn--secondary" id="reset-filters">Сбросить фильтры</button>
//         </div>
//       `;
//     }
//   } else if (emptyState && visibleCount > 0) {
//     emptyState.remove();
//   }
// }

// // filters.js
// export function initFilters() {
//   const filterForm = document.querySelector(".catalog-form");
//   if (!filterForm) return;

//   // Обработчик изменений в фильтрах
//   filterForm.addEventListener("change", handleFilterChange);
// }

// function handleFilterChange() {
//   // Получаем выбранные типы услуг
//   const selectedTypes = Array.from(
//     document.querySelectorAll('input[name="type"]:checked'),
//   ).map((cb) => cb.value);

//   // Получаем выбранный статус
//   const selectedStatus = document.querySelector(
//     'input[name="status"]:checked',
//   )?.value;

//   // Вызываем функцию фильтрации из service-cards.js
//   if (window.filterServices) {
//     window.filterServices(selectedTypes, selectedStatus);
//   }
// }

// js/components/filters.js - ОЧИЩЕННАЯ ВЕРСИЯ

let currentFilters = {
  types: [],
  status: "all",
};

export function initFilters() {
  console.log("🎛️ Инициализация фильтров");

  const filterForm = document.querySelector(".catalog-form");
  if (!filterForm) {
    console.warn("Форма фильтров не найдена");
    return;
  }

  // Загружаем начальные фильтры
  loadInitialFilters();

  // Обработчик сброса фильтров
  const resetButton = filterForm.querySelector(".catalog-form__reset");
  if (resetButton) {
    resetButton.addEventListener("click", handleResetFilters);
  }

  // Обработчик изменений в фильтрах
  filterForm.addEventListener("change", handleFilterChange);

  // Инициализируем первый раз
  applyFilters();
}

// Загрузка начальных фильтров
function loadInitialFilters() {
  // Получаем все выбранные чекбоксы
  const checkboxes = document.querySelectorAll('input[name="type"]:checked');
  currentFilters.types = Array.from(checkboxes).map((cb) => cb.value);

  // Получаем выбранный статус
  const statusRadio = document.querySelector('input[name="status"]:checked');
  currentFilters.status = statusRadio ? statusRadio.value : "all";
}

// Сброс фильтров
function handleResetFilters(e) {
  e.preventDefault();

  // Снимаем все чекбоксы
  document
    .querySelectorAll('input[name="type"]')
    .forEach((cb) => (cb.checked = false));

  // Устанавливаем "Все" в статусе
  const allRadio = document.querySelector('input[name="status"][value="all"]');
  if (allRadio) allRadio.checked = true;

  // Обновляем фильтры
  currentFilters.types = [];
  currentFilters.status = "all";

  // Применяем фильтры
  applyFilters();
}

// Изменение фильтров
function handleFilterChange() {
  // Обновляем выбранные типы
  const checkboxes = document.querySelectorAll('input[name="type"]:checked');
  currentFilters.types = Array.from(checkboxes).map((cb) => cb.value);

  // Обновляем статус
  const statusRadio = document.querySelector('input[name="status"]:checked');
  currentFilters.status = statusRadio ? statusRadio.value : "all";

  // Применяем фильтры
  applyFilters();
}

// Применение фильтров
function applyFilters() {
  console.log("Применение фильтров:", currentFilters);

  // Получаем все карточки
  const cards = document.querySelectorAll(".catalog__item");
  let visibleCount = 0;

  cards.forEach((card) => {
    const cardType = card.dataset.type;
    const cardId = card.dataset.id;

    // Проверяем фильтры
    let isVisible = true;

    // Фильтр по типу
    if (
      currentFilters.types.length > 0 &&
      !currentFilters.types.includes(cardType)
    ) {
      isVisible = false;
    }

    // Фильтр по статусу (популярные)
    if (currentFilters.status === "popular") {
      const isPopular = card.querySelector(".service-badge") !== null;
      if (!isPopular) {
        isVisible = false;
      }
    }

    // Показываем/скрываем
    card.style.display = isVisible ? "" : "none";
    if (isVisible) visibleCount++;
  });

  // Показываем сообщение если ничего не найдено
  showNoResultsMessage(visibleCount);
}

// Сообщение "Ничего не найдено"
function showNoResultsMessage(visibleCount) {
  const container = document.querySelector(".catalog__list");
  if (!container) return;

  let message = container.querySelector(".no-results-message");

  if (visibleCount === 0) {
    if (!message) {
      message = document.createElement("li");
      message.className = "catalog__item no-results-message";
      message.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        display: flex !important;
        flex-direction: column;
        align-items: center;
      `;

      message.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">😔</div>
        <p style="font-size: 18px; color: #666; margin-bottom: 20px; max-width: 400px;">
          Услуг по выбранным фильтрам не найдено
        </p>
        <button class="btn btn--secondary" id="reset-filters-btn">
          Сбросить фильтры
        </button>
      `;

      container.appendChild(message);

      // Обработчик кнопки сброса
      document
        .getElementById("reset-filters-btn")
        .addEventListener("click", () => {
          const filterForm = document.querySelector(".catalog-form");
          if (filterForm) {
            filterForm.reset();
            handleFilterChange();
          }
        });
    }
  } else if (message) {
    message.remove();
  }
}

// Экспортируем функцию для сброса извне
export function resetFilters() {
  handleResetFilters(new Event("click"));
}
