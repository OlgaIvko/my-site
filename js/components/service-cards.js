// js/components/service-cards.js

let allServices = [];
let currentModalService = null;

// Метка типа услуги - выносим вверх, чтобы была доступна
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
  };
  return labels[type] || type;
}

export function initServiceCards() {
  console.log("🛠️ Инициализация карточек услуг...");

  // Проверяем наличие контейнера
  const container = document.querySelector(".catalog__list");
  console.log("Найден контейнер:", container);

  if (!container) {
    console.error("❌ Контейнер .catalog__list не найден!");
    return;
  }

  const services = [
    {
      id: 1,
      title: "Разработка лендинга",
      description: "Одностраничный сайт для быстрого запуска бизнеса",
      type: "landing",
      price: "от 50 000 ₽",
      features: ["Дизайн и верстка", "Адаптивность", "SEO-оптимизация"],
      popular: true,
      images: ["images/prilojenie.png", "images/prilojenie.png"],
      details: {
        timeline: "2-3 недели",
        technologies: ["HTML5/CSS3", "JavaScript", "WordPress"],
        includes: ["UI/UX дизайн", "Мобильная версия", "SEO базовая"],
      },
    },
    {
      id: 2,
      title: "Интернет-магазин",
      description: "Полнофункциональный магазин с корзиной и оплатой",
      type: "shop",
      price: "от 150 000 ₽",
      features: ["Каталог товаров", "Корзина и оплата", "Личный кабинет"],
      popular: true,
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format&fit=crop&q=80",
      ],
      details: {
        timeline: "4-6 недель",
        technologies: ["React", "Node.js", "MongoDB"],
        includes: ["Каталог + фильтры", "Система оплаты", "Личный кабинет"],
      },
    },
    {
      id: 3,
      title: "Корпоративный сайт",
      description: "Многостраничный сайт для компаний",
      type: "corporate",
      price: "от 200 000 ₽",
      features: ["CMS система", "Новостной блок", "Админ-панель"],
      popular: false,
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      ],
      details: {
        timeline: "5-8 недель",
        technologies: ["PHP", "MySQL", "Laravel"],
        includes: ["Многостраничность", "Новостной блок", "Админ-панель"],
      },
    },
    {
      id: 4,
      title: "Мобильное приложение",
      description: "Приложение для iOS и Android",
      type: "mobile",
      price: "от 300 000 ₽",
      features: ["iOS и Android", "Push-уведомления", "API интеграция"],
      popular: true,
      images: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      ],
      details: {
        timeline: "6-10 недель",
        technologies: ["React Native", "iOS", "Android"],
        includes: ["Кроссплатформенность", "Push-уведомления", "API"],
      },
    },
    {
      id: 5,
      title: "UI/UX Дизайн",
      description: "Проектирование интерфейсов и пользовательского опыта",
      type: "ui/ux",
      price: "от 40 000 ₽",
      features: [
        "Прототипирование",
        "User Research",
        "Аналитика",
        "Wireframes",
      ],
      popular: true,
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      ],
      details: {
        timeline: "2-4 недели",
        technologies: ["Figma", "Adobe XD", "Sketch", "InVision"],
        includes: [
          "Прототипы экранов",
          "User Flow",
          "Анализ конкурентов",
          "Дизайн-система",
        ],
      },
    },
    {
      id: 6,
      title: "Дизайн в Figma",
      description: "Создание дизайна сайтов и приложений в Figma",
      type: "design",
      price: "от 30 000 ₽",
      features: ["Мокапы", "Интерактивные прототипы", "Дизайн-системы"],
      popular: false,
      images: [
        "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&h=400&fit=crop",
      ],
      details: {
        timeline: "1-3 недели",
        technologies: ["Figma", "Adobe Creative Suite"],
        includes: [
          "Полный дизайн проекта",
          "Мокапы для презентации",
          "Интерактивные прототипы",
          "Готовые компоненты",
        ],
      },
    },
    {
      id: 7,
      title: "Сайт-визитка",
      description: "Простой и эффективный сайт для персонального бренда",
      type: "business-card",
      price: "от 25 000 ₽",
      features: ["Контакты", "Портфолио", "Блог", "Социальные сети"],
      popular: true,
      images: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&h=400&fit=crop",
      ],
      details: {
        timeline: "1-2 недели",
        technologies: ["HTML/CSS", "JavaScript", "Static Site Generator"],
        includes: [
          "До 5 страниц",
          "Адаптивный дизайн",
          "Форма обратной связи",
          "SEO базовая настройка",
        ],
      },
    },
    {
      id: 8,
      title: "Техническая поддержка",
      description: "Постоянная поддержка и обслуживание сайтов",
      type: "support",
      price: "от 15 000 ₽/мес",
      features: [
        "Мониторинг",
        "Резервное копирование",
        "Обновления",
        "Консультации",
      ],
      popular: false,
      images: [
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      ],
      details: {
        timeline: "Постоянно",
        technologies: ["Мониторинг", "Backup системы", "Security"],
        includes: [
          "Ежемесячное обслуживание",
          "Технические консультации",
          "Обновление контента",
          "Резервное копирование",
        ],
      },
    },
  ];

  allServices = services;
  console.log("Сервисы загружены:", services.length);

  // Рендерим карточки
  renderServiceCards(services);

  // Создаем модальное окно
  createModal();

  // Настраиваем обработчики
  setupEventListeners();

  // Добавляем стили
  addSliderStyles();

  console.log("✅ Карточки инициализированы");
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

  // Рендерим каждую карточку
  services.forEach((service) => {
    const cardHTML = createServiceCardHTML(service);
    container.insertAdjacentHTML("beforeend", cardHTML);
  });

  console.log(`✅ Отрендерено ${services.length} карточек`);
}

// Шаблон карточки
function createServiceCardHTML(service) {
  const title =
    service.title.length > 30
      ? service.title.substring(0, 30) + "..."
      : service.title;

  const description =
    service.description.length > 80
      ? service.description.substring(0, 80) + "..."
      : service.description;

  // Главное изображение для превью
  const mainImage = service.images[0];
  const moreImagesCount =
    service.images.length > 1 ? service.images.length - 1 : 0;

  const featuresHTML = service.features
    .slice(0, 2)
    .map(
      (feature) =>
        `<span class="service-feature">${feature.length > 15 ? feature.substring(0, 15) + "..." : feature}</span>`,
    )
    .join("");

  const moreFeaturesHTML =
    service.features.length > 2
      ? `<span class="service-feature-more">+${service.features.length - 2} ещё</span>`
      : "";

  const badgeHTML = service.popular
    ? '<span class="promo-badge">🔥 Популярно</span>'
    : "";

  return `
    <li class="catalog__item catalog__item--regular" data-type="${service.type}" data-id="${service.id}">
      <div class="promo-card promo-card--regular">
        <!-- Левая часть - текстовая -->
        <div class="promo-card__content promo-card__content--regular">
          ${badgeHTML}

          <h2 class="promo-card__title promo-card__title--regular" title="${service.title}">
            ${title}
          </h2>

          <p class="promo-card__description promo-card__description--regular" title="${service.description}">
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
              <div class="current-price">${service.price}</div>
              <span class="service-type">
                ${getServiceTypeLabel(service.type)}
              </span>
            </div>

            <div class="card-buttons">
              <button class="product-card__link btn btn--primary details-btn" data-id="${service.id}">
                <span class="btn__text">Подробнее</span>
              </button>

              <button class="telegram-order-btn" data-id="${service.id}" data-title="${service.title}">
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
          <div class="service-image-container" data-id="${service.id}">
            <img src="${mainImage}"
                 alt="${service.title}"
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
              <button class="zoom-btn" data-id="${service.id}" aria-label="Увеличить изображение">
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

// Создание модального окна
function createModal() {
  if (document.getElementById("serviceModal")) return;

  const modalHTML = `
    <div class="service-modal" id="serviceModal">
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <button class="modal-close" aria-label="Закрыть окно">
          <svg width="24" height="24">
            <use xlink:href="images/sprite.svg#icon-close"></use>
          </svg>
        </button>

        <div class="modal-content">
          <!-- Левая часть: Большое изображение -->
          <div class="modal-image-section">
            <div class="modal-main-image-container">
              <img src="" alt="" class="modal-main-image" id="modalMainImage">
              <button class="modal-prev" aria-label="Предыдущее изображение">
                <svg width="24" height="24">
                  <use xlink:href="images/sprite.svg#icon-arrow-left"></use>
                </svg>
              </button>
              <button class="modal-next" aria-label="Следующее изображение">
                <svg width="24" height="24">
                  <use xlink:href="images/sprite.svg#icon-arrow-right"></use>
                </svg>
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
  if (!service) return;

  const body = document.body;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  // Сохраняем позицию скролла
  body.dataset.scrollY = window.scrollY || document.documentElement.scrollTop;

  // Добавляем padding-right для компенсации полосы прокрутки
  const currentPaddingRight =
    parseInt(window.getComputedStyle(body).paddingRight, 10) || 0;
  body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;

  // Блокируем скролл
  body.classList.add("modal-open");
  body.style.position = "fixed";
  body.style.top = `-${body.dataset.scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.overflow = "hidden";

  // Открываем модалку

  currentModalService = service;
  const modal = document.getElementById("serviceModal");
  modal.classList.add("active");

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
  const featuresHTML = service.features
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
  document.getElementById("modalFeatures").innerHTML = featuresHTML;

  // Бейдж
  const badge = document.getElementById("modalBadge");
  if (service.popular) {
    badge.textContent = "🔥 Популярно";
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }

  // Изображения
  updateModalImages(service.images);

  // Кнопка заказа
  document.getElementById("modalOrderBtn").dataset.serviceId = service.id;

  // Показываем модалку
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Устанавливаем первое изображение
  showModalImage(0);
}

// Обновление изображений в модалке
function updateModalImages(images) {
  const thumbnailsContainer = document.getElementById("modalThumbnails");
  const mainImage = document.getElementById("modalMainImage");

  // Очищаем миниатюры
  thumbnailsContainer.innerHTML = "";

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
    mainImage.alt = currentModalService.title;
  }
}

// Показать конкретное изображение в модалке
let currentImageIndex = 0;
function showModalImage(index) {
  if (!currentModalService || !currentModalService.images[index]) return;

  const images = currentModalService.images;
  currentImageIndex = index;

  // Обновляем главное изображение
  const mainImage = document.getElementById("modalMainImage");

  // Добавляем эффект загрузки
  mainImage.style.opacity = "0.5";
  setTimeout(() => {
    mainImage.src = images[index];
    mainImage.alt = `${currentModalService.title} - изображение ${index + 1}`;
    mainImage.style.opacity = "1";
  }, 150);

  // Обновляем активную миниатюру
  document.querySelectorAll(".modal-thumbnail").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });

  // Показываем/скрываем кнопки навигации
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");
  prevBtn.style.display = index > 0 ? "flex" : "none";
  nextBtn.style.display = index < images.length - 1 ? "flex" : "none";
}

// Закрыть модальное окно
function closeModal() {
  const modal = document.getElementById("serviceModal");
  if (modal) {
    modal.classList.remove("active");

    // Восстанавливаем скролл страницы
    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    document.body.style.position = "";
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    // Восстанавливаем позицию скролла
    const scrollY = parseInt(document.body.dataset.scrollY || "0");
    if (scrollY) {
      window.scrollTo(0, scrollY);
      document.body.dataset.scrollY = "";
    }

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
    `📝 Описание: ${service.description.substring(0, 100)}...\n\n` +
    `👤 Клиент с сайта`;
  const encoded = encodeURIComponent(message);
  const telegramUrl = `https://t.me/+79997005798?text=${encoded}`;
  window.open(telegramUrl, "_blank", "noopener,noreferrer");
}

// Обработчики событий
function setupEventListeners() {
  document.addEventListener("click", function (e) {
    // Подробнее в карточке
    if (e.target.closest(".details-btn")) {
      const button = e.target.closest(".details-btn");
      const serviceId = button.dataset.id;
      showServiceDetails(serviceId);
    }

    // Зум изображения в карточке
    if (
      e.target.closest(".zoom-btn") ||
      e.target.closest(".service-image-container")
    ) {
      const button = e.target.closest("[data-id]");
      if (button) {
        const serviceId = button.dataset.id;
        showServiceDetails(serviceId);
      }
    }

    // Telegram заказ
    if (
      e.target.closest(".telegram-order-btn") ||
      e.target.closest("#modalOrderBtn")
    ) {
      const button = e.target.closest("button");
      const serviceId = button.dataset.serviceId || button.dataset.id;
      const serviceTitle =
        button.dataset.title ||
        allServices.find((s) => s.id == serviceId)?.title;
      if (serviceId && serviceTitle) {
        openTelegramForService(serviceId, serviceTitle);
        if (e.target.closest("#modalOrderBtn")) {
          closeModal();
        }
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
        currentImageIndex < currentModalService.images.length - 1
      ) {
        showModalImage(currentImageIndex + 1);
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

    .price-wrapper {
      display: flex;
     flex-direction: column;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e5e7eb;
    }

    .current-price {
      font-size: 32px;
      font-weight: bold;
      padding-top: 10px;
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
      margin-top: auto;
    }

    .card-buttons .btn {
      flex: 1;
      padding: 10px;
      font-size: 13px;
    }

    .telegram-order-btn {
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

    /* Бейдж */
    .promo-badge {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      display: inline-block;
      margin-bottom: 15px;
      align-self: flex-start;
    }

     .promo-badge--input {
      background: linear-gradient(54.12deg, #FFFFFF 1.42%, #3499FF 88.51%);
;
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
      display: block;
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
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 1000px;
      max-height: 90vh;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    }

    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.3s ease;
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
      overflow: hidden;
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

    .modal-prev,
    .modal-next {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2;
      transition: all 0.3s ease;
    }

    .modal-prev:hover,
    .modal-next:hover {
      background: white;
      transform: translateY(-50%) scale(1.1);
    }

    .modal-prev {
      left: 15px;
    }

    .modal-next {
      right: 15px;
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
      padding: 14px 20px;
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

// Экспорт функций фильтрации (если они вам нужны)
export function filterServices(selectedTypes, selectedStatus) {
  let filtered = allServices;

  if (selectedTypes.length > 0) {
    filtered = filtered.filter((service) =>
      selectedTypes.includes(service.type),
    );
  }

  if (selectedStatus === "popular") {
    filtered = filtered.filter((service) => service.popular);
  }

  renderServiceCards(filtered);
}

export default initServiceCards;
