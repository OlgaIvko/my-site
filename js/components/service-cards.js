let allServices = [];
let currentModalService = null;
let currentImageIndex = 0;

// Метка типа услуги
function getServiceTypeLabel(type) {
  const labels = {
    landing: "Лендинг",
    shop: "Магазин",
    corporate: "Корпоративный",
    mobile: "Мобильное",
    support: "Поддержка",
    design: "Дизайн",
    development: "Разработка",
    branding: "Брендинг",
    apps: "Приложения",
    "business-card": "Сайт-визитка",
    "ui/ux": "UI/UX Дизайн",
  };
  return labels[type] || type;
}

// Загрузка данных (без сервера)
async function loadServicesData() {
  console.log("📦 Загружаю данные услуг...");

  try {
    // Пробуем загрузить из локального файла
    const response = await fetch("/data/services.json");

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Данные загружены из файла: ${data.length} услуг`);
      return data;
    }

    // Если файла нет, создаем пустой массив
    console.log("📭 Файл данных не найден");
    return [];
  } catch (error) {
    console.error("❌ Ошибка загрузки данных:", error);
    return [];
  }
}

// Шаблон карточки услуги
function createServiceCardHTML(service) {
  const title =
    service.title && service.title.length > 30
      ? service.title.substring(0, 30) + "..."
      : service.title || "Новая услуга";

  const description =
    service.description && service.description.length > 80
      ? service.description.substring(0, 80) + "..."
      : service.description || "";

  // Главное изображение для превью
  const mainImage =
    (Array.isArray(service.images) && service.images[0]) ||
    service.image ||
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop";

  // Количество дополнительных изображений
  const allImages = Array.isArray(service.images)
    ? service.images
    : service.image
      ? [service.image]
      : [];
  const moreImagesCount = allImages.length > 1 ? allImages.length - 1 : 0;

  const featuresHTML =
    service.features && service.features.length > 0
      ? service.features
          .slice(0, 2)
          .map(
            (feature) =>
              `<span class="service-feature">${feature && feature.length > 15 ? feature.substring(0, 15) + "..." : feature || "Фича"}</span>`,
          )
          .join("")
      : '<span class="service-feature">Базовый функционал</span>';

  const moreFeaturesHTML =
    service.features && service.features.length > 2
      ? `<span class="service-feature-more">+${service.features.length - 2} ещё</span>`
      : "";

  const badgeHTML = service.popular
    ? '<span class="promo-badge">🔥 Популярно</span>'
    : "";

  return `
    <li class="catalog__item catalog__item--regular" data-type="${service.type || "development"}" data-id="${service.id || Date.now()}">
      <div class="promo-card promo-card--regular">
        <!-- Левая часть - текстовая -->
        <div class="promo-card__content promo-card__content--regular">
          ${badgeHTML}

          <h2 class="promo-card__title promo-card__title--regular" title="${service.title || "Услуга"}">
            ${title}
          </h2>

          <p class="promo-card__description promo-card__description--regular" title="${service.description || ""}">
            ${description}
          </p>

          <div class="promo-features promo-features--regular">
            <div class="service-features-wrapper">
              <div class="service-features">
                ${featuresHTML}
                ${moreFeaturesHTML}
              </div>
            </div>
          </div>

          <div class="promo-card__cta promo-card__cta--regular">
            <div class="price-wrapper">
              <div class="current-price">${service.price || "от 0 ₽"}</div>
              <span class="service-type">
                ${getServiceTypeLabel(service.type || "development")}
              </span>
            </div>

            <div class="card-buttons">
              <button class="product-card__link btn btn--primary details-btn" data-id="${service.id || Date.now()}">
                <span class="btn__text">Подробнее</span>
              </button>

              <button class="telegram-order-btn" data-id="${service.id || Date.now()}" data-title="${service.title || "Услуга"}">
                <svg width="14" height="14">
                  <use xlink:href="images/sprite.svg#icon-telegram"></use>
                </svg>
                <span>Заказать</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Правая часть - большое изображение -->
        <div class="promo-card__visual promo-card__visual--regular">
          <div class="service-image-container" data-id="${service.id || Date.now()}">
            <img src="${mainImage}"
                 alt="${service.title || "Услуга"}"
                 class="service-main-image"
                 loading="lazy"
                 onerror="this.src='https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop'">

           ${
             moreImagesCount > 0
               ? `
  <div class="image-counter">
    <svg width="16" height="16">
      <use xlink:href="images/sprite.svg#icon-images"></use>
    </svg>
    +${moreImagesCount}
  </div>
`
               : ""
           }

            <div class="image-overlay">
              <button class="zoom-btn" data-id="${service.id || Date.now()}" aria-label="Увеличить изображение">
                <svg width="24" height="24">
                  <use xlink:href="images/sprite.svg#icon-zoom"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  `;
}

// Рендеринг карточек
function renderServiceCards(services) {
  const container = document.querySelector(".catalog__list");
  if (!container) {
    console.error("❌ Контейнер .catalog__list не найден при рендеринге!");
    return;
  }

  console.log(`🔄 Рендеринг ${services.length} карточек...`);

  // Очищаем контейнер
  container.innerHTML = "";

  // Если нет услуг, показываем сообщение
  if (services.length === 0) {
    container.innerHTML = `
      <div class="no-services-message" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
        <h3>📭 Пока нет услуг</h3>
        <p>Добавьте услуги через админку и экспортируйте данные для сайта</p>
        <p><small>Запустите админку: <code>node admin/server.js</code></small></p>
      </div>
    `;
    return;
  }

  // Рендерим каждую карточку
  services.forEach((service) => {
    const cardHTML = createServiceCardHTML(service);
    container.insertAdjacentHTML("beforeend", cardHTML);
  });

  console.log(`✅ Отрендерено ${services.length} карточек`);
}

// Обновленная initServiceCards (без сервера)
export async function initServiceCards() {
  console.log("🛠️ Инициализация карточек услуг...");

  const container = document.querySelector(".catalog__list");
  console.log("Найден контейнер:", container);

  if (!container) {
    console.error("❌ Контейнер .catalog__list не найден!");
    return;
  }

  // Показываем индикатор загрузки
  container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Загрузка услуг...</p>
        </div>
    `;

  // Загружаем данные ТОЛЬКО из локального файла
  allServices = await loadServicesData();

  console.log("Сервисы загружены:", allServices.length);

  // Рендерим карточки
  renderServiceCards(allServices);

  // Создаем модальное окно
  createModal();

  // Настраиваем обработчики
  setupEventListeners();

  // Добавляем стили
  addSliderStyles();

  console.log("✅ Карточки инициализированы");
}
function createModal() {
  if (document.getElementById("serviceModal")) return;

  const modalHTML = `
    <div class="service-modal" id="serviceModal">
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <button class="modal-close" aria-label="Закрыть окно">
          х
        </button>

        <div class="modal-content">
          <!-- Левая часть: Большое изображение -->
        <div class="modal-image-section">
  <div class="modal-main-image-container">
    <img src="" alt="" class="modal-main-image" id="modalMainImage">

    <!-- Кнопка "Назад" с простым символом -->
    <button class="modal-prev" aria-label="Предыдущее изображение">
      ←
    </button>

    <!-- Кнопка "Вперед" с простым символом -->
    <button class="modal-next" aria-label="Следующее изображение">
      →
    </button>
  </div>

  <div class="modal-thumbnails" id="modalThumbnails">
    <!-- Миниатюры будут добавлены динамически -->
  </div>
</div>

          <!-- Правая часть: Описание и детали -->
          <div class="modal-info-section">
            <div class="modal-header">
              <span class="modal-badge" id="modalBadge"></span>
              <h2 class="modal-title" id="modalTitle"></h2>
              <div class="modal-price" id="modalPrice"></div>
            </div>

            <div class="modal-description" id="modalDescription"></div>

            <div class="modal-details">
              <div class="detail-item">
                <svg width="20" height="20" class="detail-icon">
                  <use xlink:href="images/sprite.svg#icon-calendar"></use>
                </svg>
                <div>
                  <div class="detail-label">Срок выполнения</div>
                  <div class="detail-value" id="modalTimeline"></div>
                </div>
              </div>

              <div class="detail-item">
                <svg width="20" height="20" class="detail-icon">
                  <use xlink:href="images/sprite.svg#icon-code"></use>
                </svg>
                <div>
                  <div class="detail-label">Технологии</div>
                  <div class="detail-tech" id="modalTechnologies"></div>
                </div>
              </div>
            </div>

            <div class="modal-features">
              <h3>Что входит в услугу:</h3>
              <div class="features-list" id="modalFeatures"></div>
            </div>

            <div class="modal-actions">
              <button class="btn btn--primary modal-order-btn" id="modalOrderBtn">
                <svg width="18" height="18">
                  <use xlink:href="images/sprite.svg#icon-telegram"></use>
                </svg>
                Заказать в Telegram
              </button>
              <button class="btn btn--secondary modal-close-btn">
                Вернуться к выбору
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Показать детали услуги в модальном окне
function showServiceDetails(serviceId) {
  const service = allServices.find((s) => s.id == serviceId);
  if (!service) {
    console.error("❌ Услуга не найдена:", serviceId);
    return;
  }

  currentModalService = service;
  const modal = document.getElementById("serviceModal");

  if (!modal) {
    console.error("❌ Модальное окно не найдено");
    return;
  }

  // Устанавливаем данные
  document.getElementById("modalTitle").textContent = service.title;
  document.getElementById("modalPrice").textContent = service.price;
  document.getElementById("modalDescription").textContent = service.description;
  document.getElementById("modalTimeline").textContent =
    service.details?.timeline || "2-4 недели";

  // Технологии
  const techHTML = (service.details?.technologies || [])
    .map((tech) => `<span class="tech-tag">${tech}</span>`)
    .join("");
  document.getElementById("modalTechnologies").innerHTML =
    techHTML || '<span class="tech-tag">Индивидуально</span>';

  // Фичи
  const featuresHTML = (service.features || [])
    .map(
      (feature) =>
        `<div class="feature-item">
      <svg width="16" height="16">
        <use xlink:href="images/sprite.svg#icon-check"></use>
      </svg>
      ${feature}
    </div>`,
    )
    .join("");
  document.getElementById("modalFeatures").innerHTML =
    featuresHTML || '<div class="feature-item">Базовый функционал</div>';

  // Бейдж
  const badge = document.getElementById("modalBadge");
  if (service.popular) {
    badge.textContent = "🔥 Популярно";
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }

  // Изображения
  updateModalImages(service.images || []);

  // Кнопка заказа
  document.getElementById("modalOrderBtn").dataset.serviceId = service.id;

  // Показываем модалку
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Устанавливаем первое изображение
  currentImageIndex = 0;
  showModalImage(0);
}

// Обновление изображений в модалке
function updateModalImages(images) {
  const thumbnailsContainer = document.getElementById("modalThumbnails");
  const mainImage = document.getElementById("modalMainImage");

  if (!thumbnailsContainer || !mainImage) return;

  // Очищаем миниатюры
  thumbnailsContainer.innerHTML = "";

  // Если нет изображений, показываем заглушку
  if (!images || images.length === 0) {
    images = [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556741533-6e6a62bd4b19?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
    ];
  }

  // Создаем миниатюры
  images.forEach((img, index) => {
    const thumbnail = document.createElement("div");
    thumbnail.className = `modal-thumbnail ${index === 0 ? "active" : ""}`;
    thumbnail.dataset.index = index;

    thumbnail.innerHTML = `
      <img src="${img}"
           alt="Миниатюра ${index + 1}"
           loading="lazy"
           onerror="this.src='https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&h=150&fit=crop'">
    `;

    thumbnail.addEventListener("click", () => showModalImage(index));
    thumbnailsContainer.appendChild(thumbnail);
  });

  // Обновляем главное изображение
  if (images[0]) {
    mainImage.src = images[0];
    mainImage.alt = currentModalService?.title || "Изображение услуги";
  }
}

// Показать конкретное изображение в модалке
function showModalImage(index) {
  if (
    !currentModalService ||
    !currentModalService.images ||
    !currentModalService.images[index]
  ) {
    return;
  }

  const images = currentModalService.images;
  currentImageIndex = index;

  // Обновляем главное изображение
  const mainImage = document.getElementById("modalMainImage");

  // Добавляем эффект загрузки
  if (mainImage) {
    mainImage.style.opacity = "0.5";
    setTimeout(() => {
      mainImage.src = images[index];
      mainImage.alt = `${currentModalService.title} - изображение ${index + 1}`;
      mainImage.style.opacity = "1";
    }, 150);
  }

  // Обновляем активную миниатюру
  document.querySelectorAll(".modal-thumbnail").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });

  // Показываем/скрываем кнопки навигации
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");

  if (prevBtn) {
    prevBtn.style.display = index > 0 ? "flex" : "none";
  }

  if (nextBtn) {
    nextBtn.style.display = index < images.length - 1 ? "flex" : "none";
  }
}

// Закрыть модальное окно
function closeModal() {
  const modal = document.getElementById("serviceModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    currentModalService = null;
    currentImageIndex = 0;
  }
}

// Функция открытия Telegram
function openTelegramForService(serviceId, serviceTitle) {
  const service = allServices.find((s) => s.id == serviceId);
  if (!service) return;

  const message =
    `🎯 Интересует услуга: ${serviceTitle}\n\n` +
    `💰 Цена: ${service.price}\n` +
    `📝 Описание: ${(service.description || "").substring(0, 100)}...\n\n` +
    `👤 Клиент с сайта`;
  const encoded = encodeURIComponent(message);
  const telegramUrl = `https://t.me/+79997005798?text=${encoded}`;
  window.open(telegramUrl, "_blank", "noopener,noreferrer");
}

// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============

// Обработчики событий
function setupEventListeners() {
  // Используем делегирование для динамически созданных элементов
  document.addEventListener("click", function (e) {
    // Подробнее в карточке
    if (e.target.closest(".details-btn")) {
      const button = e.target.closest(".details-btn");
      const serviceId = button.dataset.id;
      showServiceDetails(serviceId);
    }

    // Telegram заказ из карточки
    if (e.target.closest(".telegram-order-btn")) {
      const button = e.target.closest(".telegram-order-btn");
      const serviceId = button.dataset.id;
      const serviceTitle = button.dataset.title;
      openTelegramForService(serviceId, serviceTitle);
    }

    // Telegram заказ из модального окна
    if (e.target.closest("#modalOrderBtn")) {
      const button = e.target.closest("#modalOrderBtn");
      const serviceId = button.dataset.serviceId;
      const service = allServices.find((s) => s.id == serviceId);
      if (service) {
        openTelegramForService(serviceId, service.title);
        closeModal();
      }
    }

    // Закрытие модалки
    if (
      e.target.closest(".modal-close") ||
      e.target.closest(".modal-close-btn") ||
      e.target.closest(".modal-overlay")
    ) {
      closeModal();
    }

    // Навигация по изображениям в модалке
    if (e.target.closest(".modal-prev")) {
      if (currentImageIndex > 0) {
        showModalImage(currentImageIndex - 1);
      }
    }

    if (e.target.closest(".modal-next")) {
      if (
        currentModalService &&
        currentModalService.images &&
        currentImageIndex < currentModalService.images.length - 1
      ) {
        showModalImage(currentImageIndex + 1);
      }
    }

    // Клик по изображению в карточке для открытия модалки
    if (
      e.target.closest(".service-image-container") ||
      e.target.closest(".zoom-btn")
    ) {
      const container = e.target.closest("[data-id]");
      if (container) {
        const serviceId = container.dataset.id;
        showServiceDetails(serviceId);
      }
    }
  });

  // Закрытие по ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

// ============ СТИЛИ ============

// Добавление CSS стилей
function addSliderStyles() {
  if (document.getElementById("slider-styles")) return;

  const style = document.createElement("style");
  style.id = "slider-styles";
  style.textContent = `
    /* Основные стили для сетки карточек */
    .catalog__list {
      display: grid;
      grid-template-columns: repeat(2, minmax(350px, 1fr));
      gap: 25px;
      padding: 0;
      margin: 0;
      list-style: none;
    }

    @media (max-width: 1024px) {
      .catalog__list {
        grid-template-columns: 1fr;
      }
    }

    /* Обычные карточки в стиле промо */
    .catalog__item--regular {
      display: flex;
      flex-direction: column;
    }

    .promo-card--regular {
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 100%;
      min-height: 350px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      background: white;
      border-radius: 12px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .promo-card--regular:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    }

    /* Левая часть - контент */
    .promo-card__content--regular {
      padding: 25px;
      display: flex;
      flex-direction: column;
    }

    .promo-card__title--regular {
      font-size: 18px;
      line-height: 1.3;
      margin-bottom: 12px;
      color: #333;
      font-weight: 600;
    }

    .promo-card__description--regular {
      font-size: 14px;
      line-height: 1.4;
      color: #666;
      margin-bottom: 15px;
      flex: 1;
    }

    /* Фичи */
    .promo-features--regular {
      margin-bottom: 20px;
    }

    .service-features-wrapper {
      margin-bottom: 15px;
    }

    .service-features {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .service-feature {
      background: #f0f7ff;
      color: #3b82f6;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 12px;
      white-space: nowrap;
    }

    .service-feature-more {
      background: #f3f4f6;
      color: #6b7280;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 12px;
    }

    /* Цена и кнопки */
    .promo-card__cta--regular {
      margin-top: auto;
    }




    .service-type {
      font-size: 12px;
      color: #6b7280;
      background: #f3f4f6;
      padding: 4px 10px;
      border-radius: 10px;
    }

    .card-buttons {
      display: flex;
      gap: 10px;
    }

    .card-buttons .btn {
      flex: 1;
      padding: 10px;
      font-size: 13px;
    }

    .telegram-order-btn {
      background: #0088cc;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 10px;
      transition: background 0.3s ease;
    }

    .telegram-order-btn:hover {
      background: #0077b3;
    }

    /* Правая часть - изображение */
    .promo-card__visual--regular {
      position: relative;
      overflow: hidden;
      background: #f8f9fa;
    }

    .service-image-container {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 350px;
      overflow: hidden;
      cursor: pointer;
    }

    .service-main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .service-image-container:hover .service-main-image {
      transform: scale(1.05);
    }

    .image-counter {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 2;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.3), transparent 30%);
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 2;
    }

    .service-image-container:hover .image-overlay {
      opacity: 1;
    }

    .zoom-btn {
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .zoom-btn:hover {
      background: white;
      transform: scale(1.1);
    }



    /* Стили для модального окна */
    .service-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
    }

    .service-modal.active {
      display: flex;
  align-items: center;
  justify-content: center;
    }

    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
    }

    .modal-container {
        position: relative;
      // top: 50%;
      // left: 50%;
      // transform: translate(-50%, -50%);
      width: 90%;
      max-width: 1000px;
      max-height: 90vh;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
      margin: 0 auto;
    }


    .modal-close:hover {
      background: white;
      transform: rotate(90deg);
    }

    .modal-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: 100%;
      max-height: 90vh;
    }

    /* Левая часть модалки - изображение */
    .modal-image-section {
      padding: 30px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      background: #f8f9fa;
    }

    .modal-main-image-container {
      position: relative;
      flex: 1;
      border-radius: 12px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .modal-main-image {
      width: 100%;
      height: 100%;
      min-height: 400px;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }

    ./* Контейнер главного изображения */
.modal-main-image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  aspect-ratio: 4/3; /* Фиксированное соотношение сторон */
}

/* Главное изображение */
.modal-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

/* Кнопки навигации - УНИВЕРСАЛЬНЫЙ ВАРИАНТ */
.modal-prev,
.modal-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6); /* Темный фон для контраста */
  color: white; /* Белый текст */
  border: 2px solid rgba(255, 255, 255, 0.3);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-prev {
  left: 15px;
}

.modal-next {
  right: 15px;
}

.modal-prev:hover,
.modal-next:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
  border-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.modal-prev:active,
.modal-next:active {
  transform: translateY(-50%) scale(0.95);
}

/* Для мобильных устройств - увеличиваем область нажатия */
@media (max-width: 768px) {
  .modal-prev,
  .modal-next {
    width: 48px;
    height: 48px;
    font-size: 28px;
  }

  .modal-prev {
    left: 10px;
  }

  .modal-next {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .modal-prev,
  .modal-next {
    width: 44px;
    height: 44px;
    font-size: 24px;
  }
}

/* Крестик закрытия - тоже через символ */
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
  border-color: white;
}

/* Миниатюры */
.modal-thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 5px;
  scrollbar-width: thin;
  scrollbar-color: #3499ff #e0e0e0;
}

.modal-thumbnails::-webkit-scrollbar {
  height: 6px;
}

.modal-thumbnails::-webkit-scrollbar-track {
  background: #e0e0e0;
  border-radius: 10px;
}

.modal-thumbnails::-webkit-scrollbar-thumb {
  background: #3499ff;
  border-radius: 10px;
}

.modal-thumbnail {
  flex: 0 0 auto;
  width: 80px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.modal-thumbnail:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.modal-thumbnail.active {
  opacity: 1;
  border-color: #3499ff;
  box-shadow: 0 0 10px rgba(52, 153, 255, 0.5);
}

.modal-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
    .modal-thumbnails {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 10px 5px;
    }

    .modal-thumbnail {
      flex: 0 0 auto;
      width: 80px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .modal-thumbnail:hover {
      opacity: 0.8;
    }

    .modal-thumbnail.active {
      opacity: 1;
      border-color: #3b82f6;
    }

    .modal-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Правая часть модалки - информация */
    .modal-info-section {
      padding: 30px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .modal-header {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 20px;
    }

    .modal-badge {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 10px;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .modal-price {
      font-size: 28px;
      font-weight: 800;
      color: #3b82f6;
    }

    .modal-description {
      font-size: 15px;
      line-height: 1.6;
      color: #4b5563;
    }

    .modal-details {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .detail-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .detail-icon {
      color: #3b82f6;
      flex-shrink: 0;
    }

    .detail-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .detail-value {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .detail-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 5px;
    }

    .tech-tag {
      background: #e0f2fe;
      color: #0369a1;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
    }

    .modal-features h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 15px;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #374151;
    }

    .feature-item svg {
      color: #10b981;
      flex-shrink: 0;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    .modal-actions .btn {
      flex: 1;
      font-size: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
      .promo-card--regular {
        grid-template-columns: 1fr;
        height: auto;
      }

      .service-image-container {
        min-height: 250px;
      }

      .promo-card__content--regular {
        padding: 20px;
      }

      .modal-container {
        width: 95%;
        max-height: 95vh;
      }

      .modal-content {
        grid-template-columns: 1fr;
        max-height: 95vh;
      }

      .modal-image-section {
        height: 300px;
        padding: 20px;
      }

      .modal-info-section {
        max-height: calc(95vh - 300px);
        overflow-y: auto;
      }

      .modal-thumbnails {
        display: none;
      }

      .modal-prev,
      .modal-next {
        display: flex;
      }
    }

    @media (max-width: 480px) {
      .catalog__list {
        grid-template-columns: 1fr;
      }

      .promo-card__visual--regular {
        height: 200px;
      }

      .promo-card__content--regular {
        padding: 15px;
      }

      .modal-actions {
        flex-direction: column;
      }

      .modal-title {
        font-size: 20px;
      }

      .modal-price {
        font-size: 24px;
      }
    }
  `;

  document.head.appendChild(style);
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============

// Показать статус подключения
function showConnectionStatus() {
  // Удаляем старый статус если есть
  const oldStatus = document.getElementById("connection-status");
  if (oldStatus) oldStatus.remove();

  const cacheSource = localStorage.getItem("cache_source");
  const isCached = cacheSource === "server" || cacheSource === "cache";
  const isDemo = cacheSource === "demo" || !cacheSource;

  const status = document.createElement("div");
  status.id = "connection-status";
  status.className = isDemo ? "offline" : "online";

  document.body.appendChild(status);
}

// Показать уведомление
function showNotification(message, type = "info") {
  // Удаляем старые уведомления
  const oldNotifications = document.querySelectorAll(".custom-notification");
  oldNotifications.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `custom-notification ${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color:white; font-size:20px; cursor:pointer; margin-left:15px;">×</button>
        </div>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
            .custom-notification .notification-content {
                padding: 15px 20px;
                border-radius: 5px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-width: 300px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }
            .custom-notification.success .notification-content {
                background: #4caf50;
                color: white;
            }
            .custom-notification.error .notification-content {
                background: #f44336;
                color: white;
            }
            .custom-notification.info .notification-content {
                background: #2196f3;
                color: white;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Автоудаление через 5 секунд
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Функция для принудительного обновления (синхронизации)
export async function refreshServices() {
  console.log("🔄 Принудительное обновление услуг...");

  try {
    // Очищаем кэш для принудительной перезагрузки
    localStorage.removeItem("services_cache");
    localStorage.removeItem("cache_timestamp");

    const newServices = await loadServicesFromAdmin();
    allServices = newServices;

    // Обновляем отображение
    renderServiceCards(allServices);

    // Обновляем статус
    showConnectionStatus();

    // Показываем уведомление
    showNotification(`✅ Обновлено: ${newServices.length} услуг`, "success");

    return true;
  } catch (error) {
    console.error("❌ Ошибка обновления:", error);
    showNotification("❌ Не удалось обновить данные", "error");
    return false;
  }
}

// Функция для добавления кнопки синхронизации
export function addSyncButton() {
  // Проверяем, не добавлена ли уже кнопка
  if (document.getElementById("admin-sync-btn")) return;

  // Создаем кнопку
  const syncBtn = document.createElement("button");
  syncBtn.id = "admin-sync-btn";
  syncBtn.className = "admin-sync-btn";
  syncBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Синхронизировать
  `;

  // Стили для кнопки
  const style = document.createElement("style");
  style.textContent = `
    .admin-sync-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      z-index: 999;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transition: all 0.3s ease;
    }

    .admin-sync-btn:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .admin-sync-btn:active {
      transform: translateY(0);
    }

    .admin-sync-btn.loading {
      opacity: 0.8;
      cursor: not-allowed;
    }

    .admin-sync-btn.loading svg {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(syncBtn);

  // Обработчик клика
  syncBtn.addEventListener("click", async () => {
    syncBtn.classList.add("loading");
    syncBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="spin">
        <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Обновление...
    `;

    try {
      const newServices = await loadServicesFromAdmin();
      allServices = newServices;
      renderServiceCards(allServices);

      syncBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Обновлено!
      `;

      setTimeout(() => {
        syncBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Синхронизировать
        `;
        syncBtn.classList.remove("loading");
      }, 2000);
    } catch (error) {
      console.error("❌ Ошибка синхронизации:", error);
      syncBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Ошибка
      `;

      setTimeout(() => {
        syncBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Синхронизировать
        `;
        syncBtn.classList.remove("loading");
      }, 2000);
    }
  });
}

// В начале service-cards.js добавьте:
const API_BASE_URL =
  window.location.hostname === "localhost" ? "http://localhost:3001" : "/api"; // Для продакшена

// Обновите функцию getServicesData:
async function getServicesData() {
  console.log("📦 Получаю данные услуг...");

  // 1. Пробуем кэш СНАЧАЛА (для скорости на мобильных)
  const cachedData = getCachedServicesData();
  if (cachedData && cachedData.length > 0) {
    console.log(`✅ Данные из кэша: ${cachedData.length} услуг`);

    // Загружаем с сервера в фоне для обновления
    setTimeout(() => this.loadFromServerInBackground(), 1000);

    return cachedData;
  }

  // 2. Пробуем основной сервер
  try {
    console.log("🔄 Пробую основной сервер...");
    const response = await fetch(`${API_BASE_URL}/api/services`, {
      signal: AbortSignal.timeout(10000), // 10 секунд для мобильных
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Данные с сервера: ${data.length} услуг`);

      // Сохраняем в кэш
      cacheServicesData(data);

      return data;
    }
  } catch (error) {
    console.log("❌ Ошибка загрузки с сервера:", error.message);
  }

  // 3. Нет данных
  console.log("📭 Нет данных в сервере и кэше");
  return [];
}

// Функция для фоновой загрузки
function loadFromServerInBackground() {
  fetch(`${API_BASE_URL}/api/services`, {
    priority: "low", // Низкий приоритет
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Network response was not ok");
    })
    .then((data) => {
      if (data && data.length > 0) {
        cacheServicesData(data);
        console.log("🔄 Фоновая синхронизация: данные обновлены");
      }
    })
    .catch((error) => {
      console.log("🔄 Фоновая синхронизация не удалась:", error.message);
    });
}

// Экспорт функций

window.initServiceCards = initServiceCards;
window.refreshServices = refreshServices;
window.syncData = refreshServices;
window.allServices = allServices;
window.addSyncButton = addSyncButton;
