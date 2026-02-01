// Корзина товаров
let cartItems = [];
let cartOpen = false;

export function initCart() {
  console.log("🛒 Инициализация корзины");

  const cartButton = document.querySelector(".header__user-btn");
  const cartDropdown = document.querySelector(".basket");
  const cartCount = document.querySelector(".header__user-count");

  if (!cartButton || !cartDropdown) {
    console.error("❌ Элементы корзины не найдены");
    return;
  }

  // Загружаем корзину из localStorage
  loadCartFromStorage();

  // Обработчик клика по кнопке корзины
  cartButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleCart();
  });

  // Закрытие корзины при клике вне области
  document.addEventListener("click", function (e) {
    if (
      !cartDropdown.contains(e.target) &&
      !cartButton.contains(e.target) &&
      cartOpen
    ) {
      closeCart();
    }
  });

  // Закрытие корзины по ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && cartOpen) {
      closeCart();
    }
  });

  console.log("✅ Корзина инициализирована");
}

// Функция переключения отображения корзины
function toggleCart() {
  if (cartOpen) {
    closeCart();
  } else {
    openCart();
  }
}

// Функция открытия корзины
function openCart() {
  const cartDropdown = document.querySelector(".basket");
  cartDropdown.classList.add("basket--active");
  cartOpen = true;
  console.log("📦 Открываем корзину");
}

// Функция закрытия корзины
function closeCart() {
  const cartDropdown = document.querySelector(".basket");
  cartDropdown.classList.remove("basket--active");
  cartOpen = false;
  console.log("📦 Закрываем корзину");
}

// Функция добавления товара в корзину
export function addToCart(product) {
  console.log("➕ Добавляем товар в корзину:", product.id, product.name);

  // Проверяем, есть ли товар уже в корзине
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    // Увеличиваем количество существующего товара
    existingItem.quantity += 1;
  } else {
    // Добавляем новый товар
    cartItems.push({
      ...product,
      quantity: 1,
    });
  }

  // Обновляем отображение корзины
  updateCartDisplay();

  // Сохраняем в localStorage
  saveCartToStorage();

  console.log("✅ Товар добавлен в корзину");
}

// Функция удаления товара из корзины
function removeFromCart(productId) {
  console.log("➖ Удаляем товар из корзины:", productId);

  // Находим индекс товара
  const itemIndex = cartItems.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    // Удаляем товар из массива
    cartItems.splice(itemIndex, 1);

    // Обновляем отображение корзины
    updateCartDisplay();

    // Сохраняем в localStorage
    saveCartToStorage();

    console.log("✅ Товар удален из корзины");
  }
}

// Функция обновления отображения корзины
function updateCartDisplay() {
  const cartCount = document.querySelector(".header__user-count");
  const cartList = document.querySelector(".basket__list");
  const emptyBlock = document.querySelector(".basket__empty-block");
  const checkoutLink = document.querySelector(".basket__link");

  // Обновляем счетчик товаров
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";
  }

  // Обновляем содержимое корзины
  if (cartList && emptyBlock) {
    if (cartItems.length === 0) {
      // Корзина пуста
      cartList.innerHTML = "";
      emptyBlock.style.display = "block";
      if (checkoutLink) checkoutLink.style.display = "none";
    } else {
      // Корзина не пуста
      emptyBlock.style.display = "none";
      if (checkoutLink) checkoutLink.style.display = "block";

      // Отрисовываем товары в корзине
      cartList.innerHTML = cartItems
        .map((item) => createCartItemHTML(item))
        .join("");

      // Добавляем обработчики для кнопок удаления
      const removeButtons = cartList.querySelectorAll(".basket__item-close");
      removeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productId = parseInt(
            this.closest(".basket__item").dataset.productId
          );
          removeFromCart(productId);
        });
      });
    }
  }
}

// Функция создания HTML для товара в корзине
function createCartItemHTML(item) {
  return `
    <li class="basket__item" data-product-id="${item.id}">
      <div class="basket__img">
        <img src="${item.image}" alt="${item.name}" height="60" width="60">
      </div>
      <span class="basket__name">${item.name}</span>
      <span class="basket__price">${formatPrice(item.price.new)} руб</span>
      <span class="basket__quantity">${item.quantity} шт</span>
      <button class="basket__item-close" type="button">
        <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
          <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
    </li>
  `;
}

// Функция форматирования цены
function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

// Функция сохранения корзины в localStorage
function saveCartToStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  console.log("💾 Корзина сохранена в localStorage");
}

// Функция загрузки корзины из localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cartItems");
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    console.log(
      "📥 Корзина загружена из localStorage:",
      cartItems.length,
      "товаров"
    );
    updateCartDisplay();
  }
}

// Функция очистки корзины
export function clearCart() {
  cartItems = [];
  updateCartDisplay();
  saveCartToStorage();
  console.log("🗑️ Корзина очищена");
}
