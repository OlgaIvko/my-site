// Функция для создания карточки услуги
function createServiceCard(service) {
  return `
    <li class="service-card" data-type="${service.type}">
      <div class="service-card__image">
        <img src="${service.image}" alt="${service.title}">
      </div>
      <h3 class="service-card__title">${service.title}</h3>
      <p class="service-card__description">${service.description}</p>
      <span class="service-card__price">${service.price}</span>
      <ul class="service-card__features">
        ${service.features.map((feature) => `<li>${feature}</li>`).join("")}
      </ul>
      <button class="service-card__btn btn"
              type="button"
              data-service="${service.id}">
        Заказать услугу
      </button>
    </li>
  `;
}

// Функция отрисовки всех услуг
function renderServices(services) {
  const container = document.getElementById("services-list");
  container.innerHTML = "";

  services.forEach((service) => {
    container.insertAdjacentHTML("beforeend", createServiceCard(service));
  });

  // Добавляем обработчики на кнопки
  document.querySelectorAll(".service-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const serviceId = btn.dataset.service;
      openServiceModal(serviceId);
    });
  });
}

// Загрузка данных и первоначальная отрисовка
fetch("./data/services.json") // переименуйте data.json
  .then((response) => response.json())
  .then((services) => {
    renderServices(services);
    setupFilters(services); // функция для фильтрации
  });

function openServiceModal(serviceId) {
  // Найти услугу по ID
  const service = services.find((s) => s.id == serviceId);

  // Создать модальное окно с детальной информацией
  const modalHTML = `
    <div class="modal-overlay">
      <div class="modal">
        <button class="modal__close">×</button>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <h4>Что входит в услугу:</h4>
        <ul>${service.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        <button class="btn">Обсудить проект</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}
