// Бургер-меню с управлением через классы
export function initBurgerMenu() {
  console.log("🚀 Инициализация бургер-меню");

  const burgerBtn = document.querySelector(".header__catalog-btn");
  const menu = document.querySelector(".main-menu"); // Используем класс .main-menu
  const closeBtn = document.querySelector(".main-menu__close");

  if (!burgerBtn || !menu || !closeBtn) {
    console.error("❌ Не все элементы бургер-меню найдены");
    return;
  }

  // Функция открытия меню
  function openMenu() {
    console.log("👉 Открываем меню - добавляем класс main-menu--active");
    menu.classList.add("main-menu--active");
    document.body.style.overflow = "hidden";
  }

  // Функция закрытия меню
  function closeMenu() {
    console.log("👈 Закрываем меню - удаляем класс main-menu--active");
    menu.classList.remove("main-menu--active");
    document.body.style.overflow = "";
  }

  // Обработчики событий
  burgerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openMenu();
  });

  closeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    closeMenu();
  });

  // Закрытие по клику на оверлей
  menu.addEventListener("click", function (e) {
    if (e.target === menu) {
      closeMenu();
    }
  });

  // Закрытие по ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("main-menu--active")) {
      closeMenu();
    }
  });

  console.log("✅ Бургер-меню инициализировано");
}
