// Сортировка товаров
import { getAllProducts, renderFilteredProducts } from "./product-cards.js";

let currentSort = "price-min";

export function initSorting() {
  console.log("🔄 Инициализация сортировки");

  const sortSelect = document.querySelector(".catalog__sort-select");

  if (!sortSelect) {
    console.error("❌ Элемент сортировки не найден");
    return;
  }

  // Устанавливаем обработчик изменения сортировки
  sortSelect.addEventListener("change", function () {
    currentSort = this.value;
    console.log("🎯 Изменена сортировка на:", currentSort);
    applySorting();
  });

  console.log("✅ Сортировка инициализирована");
}

// Функция применения сортировки
function applySorting() {
  const allProducts = getAllProducts();
  let sortedProducts = [...allProducts];

  // Применяем сортировку в зависимости от выбранного варианта
  switch (currentSort) {
    case "price-min":
      // Сначала дешёвые
      sortedProducts.sort((a, b) => a.price.new - b.price.new);
      break;
    case "price-max":
      // Сначала дорогие
      sortedProducts.sort((a, b) => b.price.new - a.price.new);
      break;
    case "rating-max":
      // Сначала популярные
      sortedProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      console.warn("❌ Неизвестный тип сортировки:", currentSort);
  }

  console.log(
    `📊 Отсортировано ${sortedProducts.length} товаров по: ${currentSort}`
  );

  // Отрисовываем отсортированные товары
  renderFilteredProducts(sortedProducts);
}

// Экспортируем функцию для применения сортировки извне
export function applyCurrentSorting() {
  applySorting();
}
