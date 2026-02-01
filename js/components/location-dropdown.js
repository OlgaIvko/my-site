// Выпадающий список городов
export function initLocationDropdown() {
  console.log("📍 Инициализация выбора города");

  const locationBtn = document.querySelector(".location__city");
  const locationList = document.querySelector(".location__sublist");
  const cityName = document.querySelector(".location__city-name");
  const cityButtons = document.querySelectorAll(".location__sublink");

  if (!locationBtn || !locationList || !cityName) {
    console.error("❌ Не найдены элементы выбора города");
    return;
  }

  // Функция открытия списка городов
  function openLocationList() {
    console.log("📖 Открываем список городов");
    locationBtn.classList.add("location__city--active");
    locationBtn.setAttribute("aria-expanded", "true");
  }

  // Функция закрытия списка городов
  function closeLocationList() {
    console.log("📕 Закрываем список городов");
    locationBtn.classList.remove("location__city--active");
    locationBtn.setAttribute("aria-expanded", "false");
  }

  // Функция смены города
  function changeCity(newCity) {
    console.log("🏙️ Меняем город на:", newCity);
    cityName.textContent = newCity;
    closeLocationList();
  }

  // Обработчик клика по кнопке выбора города
  locationBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (locationBtn.classList.contains("location__city--active")) {
      closeLocationList();
    } else {
      openLocationList();
    }
  });

  // Обработчики клика по городам в списке
  cityButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      changeCity(this.textContent.trim());
    });
  });

  // Закрытие списка при клике вне области
  document.addEventListener("click", function (e) {
    const isClickInside =
      locationBtn.contains(e.target) || locationList.contains(e.target);
    if (
      !isClickInside &&
      locationBtn.classList.contains("location__city--active")
    ) {
      closeLocationList();
    }
  });

  // Закрытие по ESC
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      locationBtn.classList.contains("location__city--active")
    ) {
      closeLocationList();
    }
  });

  console.log("✅ Выбор города инициализирован");
}
