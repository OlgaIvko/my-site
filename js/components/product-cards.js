// // Отрисовка карточек товаров с использованием существующих классов
// let allProducts = [];
// import { addToCart } from "./cart.js";

// export function initProductCards() {
//   console.log("🛍️ Инициализация карточек товаров");

//   const catalogList = document.querySelector(".catalog__list");

//   if (!catalogList) {
//     console.error("❌ Не найден элемент .catalog__list");
//     return;
//   }

//   // Очищаем существующие карточки (удаляем пример из HTML)
//   catalogList.innerHTML = "";

//   // Загружаем данные товаров
//   loadProducts();
// }

// // Функция загрузки товаров из JSON
// async function loadProducts() {
//   try {
//     console.log("📥 Загружаем данные товаров...");

//     const response = await fetch("./data/data.json");

//     if (!response.ok) {
//       throw new Error(`Ошибка загрузки: ${response.status}`);
//     }

//     const products = await response.json();
//     console.log("✅ Данные загружены:", products.length, "товаров");

//     // Сохраняем все товары
//     allProducts = products;

//     // ОБНОВЛЯЕМ СЧЕТЧИКИ ФИЛЬТРОВ
//     updateFilterCounts(allProducts);

//     // Отрисовываем карточки товаров
//     renderProductCards(allProducts);
//   } catch (error) {
//     console.error("❌ Ошибка при загрузке товаров:", error);
//     showError();
//   }
// }

// // Функция для обновления счетчиков товаров в фильтрах
// function updateFilterCounts(products) {
//   console.log("🔢 Обновляем счетчики фильтров");

//   // Объект для подсчета товаров по категориям
//   const categoryCounts = {
//     pendant: 0, // Подвесные
//     ceiling: 0, // Потолочные
//     overhead: 0, // Накладные
//     point: 0, // Точечные
//   };

//   // Подсчитываем товары по категориям
//   products.forEach((product) => {
//     if (product.type && Array.isArray(product.type)) {
//       product.type.forEach((type) => {
//         if (categoryCounts.hasOwnProperty(type)) {
//           categoryCounts[type]++;
//         }
//       });
//     }
//   });

//   console.log("📊 Результаты подсчета:", categoryCounts);

//   // Обновляем счетчики в DOM для существующих фильтров
//   Object.keys(categoryCounts).forEach((filterType) => {
//     updateFilterCountInDOM(filterType, categoryCounts[filterType]);
//   });
// }

// // Функция для обновления конкретного счетчика в DOM
// function updateFilterCountInDOM(filterType, count) {
//   // Находим чекбокс по ID
//   const checkbox = document.getElementById(filterType);
//   if (!checkbox) {
//     console.warn(`❌ Чекбокс с id "${filterType}" не найден`);
//     return;
//   }

//   // Находим элемент счетчика внутри родительского контейнера
//   const countElement = checkbox
//     .closest(".custom-checkbox")
//     .querySelector(".custom-checkbox__count");
//   if (countElement) {
//     countElement.textContent = count;
//     console.log(`✅ Обновлен счетчик для ${filterType}: ${count}`);
//   } else {
//     console.warn(`❌ Элемент счетчика для ${filterType} не найден`);
//   }
// }

// // Функция отрисовки карточек товаров
// function renderProductCards(products) {
//   const catalogList = document.querySelector(".catalog__list");

//   if (!products || products.length === 0) {
//     catalogList.innerHTML = `
//       <li class="catalog__item">
//         <div class="product-card">
//           <div class="product-card__info">
//             <h2 class="product-card__title">Товары не найдены</h2>
//           </div>
//         </div>
//       </li>
//     `;
//     return;
//   }

//   console.log(`🎨 Отрисовываем ${products.length} товаров`);

//   // Создаем HTML для всех товаров
//   const productsHTML = products
//     .map((product) => createProductCard(product))
//     .join("");

//   // Добавляем карточки в список
//   catalogList.innerHTML = productsHTML;

//   // Инициализируем обработчики событий для кнопок
//   initProductCardEvents();
// }

// // Функция создания HTML для одной карточки товара
// function createProductCard(product) {
//   return `
//     <li class="catalog__item">
//       <div class="product-card">
//         <div class="product-card__visual">
//           <img class="product-card__img"
//                src="${product.image}"
//                height="436"
//                width="290"
//                alt="${product.name}"
//                onerror="this.src='images/placeholder.jpg'">
//           <div class="product-card__more">
//             <button class="product-card__link btn btn--icon add-to-cart-btn" type="button" data-product-id="${
//               product.id
//             }">
//               <span class="btn__text">В корзину</span>
//               <svg width="24" height="24" aria-hidden="true">
//                 <use xlink:href="images/sprite.svg#icon-basket"></use>
//               </svg>
//             </button>
//             <a href="#" class="product-card__link btn btn--secondary">
//               <span class="btn__text">Подробнее</span>
//             </a>
//           </div>
//         </div>
//         <div class="product-card__info">
//           <h2 class="product-card__title">${product.name}</h2>
//           ${
//             product.price.old
//               ? `
//             <span class="product-card__old">
//               <span class="product-card__old-number">${formatPrice(
//                 product.price.old
//               )}</span>
//               <span class="product-card__old-add">₽</span>
//             </span>
//           `
//               : ""
//           }
//           <span class="product-card__price">
//             <span class="product-card__price-number">${formatPrice(
//               product.price.new
//             )}</span>
//             <span class="product-card__price-add">₽</span>
//           </span>
//           ${createTooltipHTML(product.availability)}
//         </div>
//       </div>
//     </li>
//   `;
// }

// // Функция создания HTML для тултипа с наличием
// function createTooltipHTML(availability) {
//   if (!availability) return "";

//   // Преобразуем объект availability в массив для отображения
//   const availabilityArray = [
//     { city: "Москва", count: availability.moscow || 0 },
//     { city: "Оренбург", count: availability.orenburg || 0 },
//     { city: "Санкт-Петербург", count: availability.saintPetersburg || 0 },
//   ];

//   const availabilityItems = availabilityArray
//     .map(
//       (item) => `
//     <li class="tooltip__item">
//       <span class="tooltip__text">
//         ${item.city}: <span class="tooltip__count">${item.count}</span>
//       </span>
//     </li>
//   `
//     )
//     .join("");

//   return `
//     <div class="product-card__tooltip tooltip">
//       <button class="tooltip__btn" aria-label="Показать подсказку">
//         <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
//           <use xlink:href="images/sprite.svg#icon-i"></use>
//         </svg>
//       </button>
//       <div class="tooltip__content">
//         <span class="tooltip__text">Наличие товара по городам:</span>
//         <ul class="tooltip__list">
//           ${availabilityItems}
//         </ul>
//       </div>
//     </div>
//   `;
// }

// // Функция форматирования цены (добавляем пробелы для тысяч)
// function formatPrice(price) {
//   return new Intl.NumberFormat("ru-RU").format(price);
// }

// // Функция инициализации обработчиков событий для карточек
// function initProductCardEvents() {
//   // Обработчики для кнопок "В корзину"
//   const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
//   addToCartButtons.forEach((button) => {
//     button.addEventListener("click", function (e) {
//       e.preventDefault();
//       const productId = parseInt(this.dataset.productId);
//       const product = allProducts.find((p) => p.id === productId);

//       if (product) {
//         addToCart(product);
//         console.log("🛒 Добавляем товар в корзину:", product.name);

//         // Показываем уведомление (опционально)
//         showAddToCartNotification(product.name);
//       }
//     });
//   });
// }

// // Функция показа уведомления о добавлении в корзину (опционально)
// function showAddToCartNotification(productName) {
//   // Создаем временное уведомление
//   const notification = document.createElement("div");
//   notification.style.cssText = `
//     position: fixed;
//     top: 20px;
//     right: 20px;
//     background: #4CAF50;
//     color: white;
//     padding: 15px 20px;
//     border-radius: 5px;
//     z-index: 10000;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//   `;
//   notification.textContent = `Товар "${productName}" добавлен в корзину!`;

//   document.body.appendChild(notification);

//   // Удаляем уведомление через 3 секунды
//   setTimeout(() => {
//     notification.remove();
//   }, 3000);
// }

// // Функция показа ошибки
// function showError() {
//   const catalogList = document.querySelector(".catalog__list");
//   catalogList.innerHTML = `
//     <li class="catalog__item">
//       <div class="product-card">
//         <div class="product-card__info">
//           <h2 class="product-card__title">Не удалось загрузить товары</h2>
//           <button class="btn retry-btn">Попробовать снова</button>
//         </div>
//       </div>
//     </li>
//   `;

//   // Обработчик для кнопки повтора
//   const retryBtn = document.querySelector(".retry-btn");
//   if (retryBtn) {
//     retryBtn.addEventListener("click", initProductCards);
//   }
// }

// // Экспортируем функцию для фильтрации
// export function renderFilteredProducts(products) {
//   console.log("🎨 Отрисовываем отфильтрованные товары:", products.length);
//   renderProductCards(products);
// }

// // Экспортируем все товары для фильтрации
// export function getAllProducts() {
//   return allProducts;
// }
