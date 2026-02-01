// components/favorites.js

export function initFavorites() {
  console.log("❤️ Инициализация избранного");

  // Инициализация кнопки избранного в шапке
  const favoritesButton = document.querySelector(".header__user-btn");
  if (favoritesButton) {
    favoritesButton.addEventListener("click", toggleFavoritesDropdown);
  }

  // Загрузка избранного из localStorage
  loadFavorites();

  // Обработчик для глобальных событий
  window.addEventListener("toggle-favorite", (e) => {
    updateFavoritesDisplay();
  });
}

function toggleFavoritesDropdown() {
  const dropdown = document.querySelector(".header__basket");
  if (dropdown) {
    dropdown.classList.toggle("basket--active");
  }
}

function loadFavorites() {
  const favorites = JSON.parse(
    localStorage.getItem("service-favorites") || "[]",
  );
  updateFavoritesCounter(favorites.length);
  renderFavoritesList(favorites);
}

function renderFavoritesList(favoriteIds) {
  const container = document.querySelector(".basket__list");
  if (!container) return;

  // Очищаем контейнер
  container.innerHTML = "";

  if (favoriteIds.length === 0) {
    container.innerHTML = `
      <div class="basket__empty-block">
        В избранном пока ничего нет
      </div>
    `;
    return;
  }

  // Загружаем данные об услугах и отображаем избранные
  fetch("./data/services.json")
    .then((response) => response.json())
    .then((services) => {
      const favoriteServices = services.filter((service) =>
        favoriteIds.includes(service.id.toString()),
      );

      favoriteServices.forEach((service) => {
        const favoriteItem = createFavoriteItemHTML(service);
        container.insertAdjacentHTML("beforeend", favoriteItem);
      });

      // Добавляем обработчики
      attachFavoriteItemListeners();
    });
}

function createFavoriteItemHTML(service) {
  return `
    <li class="basket__item" data-id="${service.id}">
      <div class="basket__img">
        <img src="${service.image}"
             alt="${service.title}"
             height="60"
             width="60">
      </div>
      <span class="basket__name">${service.title}</span>
      <span class="basket__price">${service.price}</span>
      <button class="basket__item-close"
              type="button"
              data-action="remove-favorite">
        <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
          <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
    </li>
  `;
}

function attachFavoriteItemListeners() {
  // Кнопки удаления из избранного
  document
    .querySelectorAll('[data-action="remove-favorite"]')
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = button.closest(".basket__item");
        const serviceId = item.dataset.id;
        removeFromFavorites(serviceId);
      });
    });

  // Клик по элементу открывает детали
  document.querySelectorAll(".basket__item").forEach((item) => {
    item.addEventListener("click", (e) => {
      if (!e.target.closest("[data-action]")) {
        const serviceId = item.dataset.id;
        window.dispatchEvent(
          new CustomEvent("open-service-details", {
            detail: { serviceId },
          }),
        );
      }
    });
  });
}

function removeFromFavorites(serviceId) {
  let favorites = JSON.parse(localStorage.getItem("service-favorites") || "[]");
  favorites = favorites.filter((id) => id !== serviceId.toString());
  localStorage.setItem("service-favorites", JSON.stringify(favorites));

  // Обновляем отображение
  renderFavoritesList(favorites);
  updateFavoritesCounter(favorites.length);

  // Обновляем кнопки на карточках услуг
  document
    .querySelectorAll(`[data-service-id="${serviceId}"]`)
    .forEach((btn) => {
      if (btn.dataset.action === "favorite") {
        btn.textContent = "♡";
        btn.classList.remove("active");
      }
    });
}

function updateFavoritesCounter(count) {
  const counter = document.querySelector(".header__user-count");
  if (counter) {
    counter.textContent = count;
    counter.style.display = count > 0 ? "flex" : "none";
  }
}
