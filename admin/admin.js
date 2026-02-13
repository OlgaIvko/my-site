// admin/admin.js
let currentData = {
  services: [],
  products: [],
  pages: [],
};
let currentType = "services";
let currentItemId = null;

// ============== ЗАГРУЗКА ДАННЫХ ==============

// Загрузка всех данных
async function loadAllData() {
  try {
    console.log("📦 Загрузка всех данных...");

    // Пробуем загрузить все данные сразу
    const response = await fetch("http://localhost:3001/api/all");

    if (response.ok) {
      const data = await response.json();
      currentData = {
        services: data.services || [],
        products: data.products || [],
        pages: data.pages || [],
      };
      console.log(
        `✅ Загружено: ${currentData.services.length} услуг, ${currentData.products.length} товаров, ${currentData.pages.length} страниц`,
      );
    } else {
      // Загружаем по отдельности
      await Promise.all([
        loadData("services"),
        loadData("products"),
        loadData("pages"),
      ]);
    }

    // Рендерим активную вкладку
    const activeTab =
      document.querySelector(".tab-btn.active")?.dataset.tab || "services";
    renderList(activeTab);
    updateStatus("✅ Данные загружены");
  } catch (error) {
    console.error("❌ Ошибка загрузки:", error);
    updateStatus("❌ Ошибка загрузки данных");
  }
}

// Загрузка конкретного типа данных
async function loadData(type) {
  try {
    const response = await fetch(`http://localhost:3001/api/${type}`);
    if (response.ok) {
      currentData[type] = await response.json();
      console.log(`✅ Загружено ${type}: ${currentData[type].length} записей`);
    } else {
      currentData[type] = [];
      console.log(`📭 ${type}: нет данных`);
    }
  } catch (error) {
    console.error(`❌ Ошибка загрузки ${type}:`, error);
    currentData[type] = [];
  }
}

// ============== РЕНДЕРИНГ ==============

// Рендеринг списка
function renderList(type) {
  const container = document.getElementById(`${type}-list`);
  if (!container) return;

  const items = currentData[type] || [];

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-folder-open"></i>
        <h3>Нет записей</h3>
        <p>Добавьте первую запись</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map(
      (item, index) => `
      <div class="item-card" data-index="${index}">
        <div class="item-preview">
          ${getPreviewImage(item)}
        </div>
        <div class="item-info">
          <div class="item-header">
            <h3 class="item-title">${escapeHtml(item.title || "Без названия")}</h3>
            <span class="item-price">${escapeHtml(item.price || "")}</span>
          </div>
          <div class="item-desc">${escapeHtml(truncateText(item.description || "Нет описания", 100))}</div>
          <div class="item-meta">
            ${getItemTypeBadge(item, type)}
            ${getItemStatusBadge(item)}
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="editItem('${type}', ${index})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete" onclick="deleteItem('${type}', ${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `,
    )
    .join("");
}

// Получить превью изображения
function getPreviewImage(item) {
  if (item.images && item.images.length > 0) {
    return `<img src="${escapeHtml(item.images[0])}" alt="Превью" class="item-thumb">`;
  }
  if (item.image) {
    return `<img src="${escapeHtml(item.image)}" alt="Превью" class="item-thumb">`;
  }
  return `<div class="item-thumb-placeholder"><i class="fas fa-image"></i></div>`;
}

// Получить бейдж типа
function getItemTypeBadge(item, type) {
  if (type === "services" && item.type) {
    const typeLabels = {
      landing: "Лендинг",
      shop: "Магазин",
      corporate: "Корпоративный",
      mobile: "Мобильное",
      design: "Дизайн",
      development: "Разработка",
      "business-card": "Визитка",
      "ui/ux": "UI/UX",
    };
    return `<span class="badge badge-type">${typeLabels[item.type] || item.type}</span>`;
  }
  if (type === "products" && item.category) {
    return `<span class="badge badge-category">${escapeHtml(item.category)}</span>`;
  }
  return "";
}

// Получить бейдж статуса
function getItemStatusBadge(item) {
  if (item.popular) {
    return `<span class="badge badge-popular">🔥 Популярное</span>`;
  }
  return "";
}

// ============== МОДАЛЬНОЕ ОКНО ==============

// Показать модальное окно
function showModal(title, content) {
  const modal = document.getElementById("modal");
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = content;
  modal.style.display = "flex";
}

// Закрыть модальное окно
function closeModal() {
  document.getElementById("modal").style.display = "none";
  currentItemId = null;
}

// ============== ДОБАВЛЕНИЕ ==============

// Добавление услуги
function addService() {
  currentType = "services";
  currentItemId = null;

  const form = `
    <div class="form-group">
      <label>Название услуги *</label>
      <input type="text" id="item-title" class="form-control" placeholder="Введите название" required>
    </div>
    <div class="form-group">
      <label>Описание</label>
      <textarea id="item-desc" class="form-control" placeholder="Описание услуги" rows="3"></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Цена *</label>
        <input type="text" id="item-price" class="form-control" placeholder="от 50 000 ₽" required>
      </div>
      <div class="form-group">
        <label>Тип услуги</label>
        <select id="item-type" class="form-control">
          <option value="landing">Лендинг</option>
          <option value="shop">Интернет-магазин</option>
          <option value="corporate">Корпоративный сайт</option>
          <option value="mobile">Мобильное приложение</option>
          <option value="support">Техподдержка</option>
          <option value="design">Дизайн</option>
          <option value="development">Разработка</option>
          <option value="business-card">Сайт-визитка</option>
          <option value="ui/ux">UI/UX Дизайн</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Фичи (через запятую)</label>
      <textarea id="item-features" class="form-control" placeholder="Адаптивность, SEO, Админка" rows="2"></textarea>
    </div>
    <div class="form-group">
      <label>Изображения (URL через запятую, макс. 3)</label>
      <textarea id="item-images" class="form-control" placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" rows="2"></textarea>
      <small class="form-text">Добавьте до 3 ссылок на изображения через запятую</small>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Срок выполнения</label>
        <input type="text" id="item-timeline" class="form-control" placeholder="2-4 недели">
      </div>
      <div class="form-group">
        <label>Технологии (через запятую)</label>
        <input type="text" id="item-tech" class="form-control" placeholder="HTML, CSS, JavaScript">
      </div>
    </div>
    <div class="form-group">
      <label>Что входит (через запятую)</label>
      <textarea id="item-includes" class="form-control" placeholder="Дизайн, Верстка, Адаптивность" rows="2"></textarea>
    </div>
    <div class="form-checkbox">
      <label>
        <input type="checkbox" id="item-popular">
        Популярная услуга
      </label>
    </div>
  `;

  showModal("➕ Новая услуга", form);
}

// Добавление товара
function addProduct() {
  currentType = "products";
  currentItemId = null;

  const form = `
    <div class="form-group">
      <label>Название товара *</label>
      <input type="text" id="item-title" class="form-control" placeholder="Введите название" required>
    </div>
    <div class="form-group">
      <label>Описание</label>
      <textarea id="item-desc" class="form-control" placeholder="Описание товара" rows="3"></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Цена *</label>
        <input type="text" id="item-price" class="form-control" placeholder="5 000 ₽" required>
      </div>
      <div class="form-group">
        <label>Категория</label>
        <input type="text" id="item-category" class="form-control" placeholder="Категория товара">
      </div>
    </div>
    <div class="form-group">
      <label>Изображение (URL)</label>
      <input type="text" id="item-image" class="form-control" placeholder="https://example.com/image.jpg">
    </div>
  `;

  showModal("➕ Новый товар", form);
}

// Добавление страницы
function addPage() {
  currentType = "pages";
  currentItemId = null;

  const form = `
    <div class="form-group">
      <label>Заголовок страницы *</label>
      <input type="text" id="item-title" class="form-control" placeholder="Введите заголовок" required>
    </div>
    <div class="form-group">
      <label>URL (slug)</label>
      <input type="text" id="item-slug" class="form-control" placeholder="about-us">
    </div>
    <div class="form-group">
      <label>Содержимое</label>
      <textarea id="item-content" class="form-control" placeholder="Текст страницы..." rows="6"></textarea>
    </div>
    <div class="form-group">
      <label>Meta описание</label>
      <textarea id="item-meta" class="form-control" placeholder="Описание для поисковых систем" rows="2"></textarea>
    </div>
  `;

  showModal("➕ Новая страница", form);
}

// ============== РЕДАКТИРОВАНИЕ ==============

function editItem(type, index) {
  currentType = type;
  currentItemId = index;
  const item = currentData[type][index];

  let form = "";

  if (type === "services") {
    form = `
      <div class="form-group">
        <label>Название услуги *</label>
        <input type="text" id="item-title" class="form-control" value="${escapeHtml(item.title || "")}" required>
      </div>
      <div class="form-group">
        <label>Описание</label>
        <textarea id="item-desc" class="form-control" rows="3">${escapeHtml(item.description || "")}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Цена *</label>
          <input type="text" id="item-price" class="form-control" value="${escapeHtml(item.price || "")}" required>
        </div>
        <div class="form-group">
          <label>Тип услуги</label>
          <select id="item-type" class="form-control">
            ${generateTypeOptions(item.type || "landing")}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Фичи (через запятую)</label>
        <textarea id="item-features" class="form-control" rows="2">${escapeHtml(arrayToString(item.features))}</textarea>
      </div>
      <div class="form-group">
        <label>Изображения (URL через запятую)</label>
        <textarea id="item-images" class="form-control" rows="2">${escapeHtml(arrayToString(item.images || [item.image]))}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Срок выполнения</label>
          <input type="text" id="item-timeline" class="form-control" value="${escapeHtml(item.details?.timeline || "")}">
        </div>
        <div class="form-group">
          <label>Технологии (через запятую)</label>
          <input type="text" id="item-tech" class="form-control" value="${escapeHtml(arrayToString(item.details?.technologies))}">
        </div>
      </div>
      <div class="form-group">
        <label>Что входит (через запятую)</label>
        <textarea id="item-includes" class="form-control" rows="2">${escapeHtml(arrayToString(item.details?.includes))}</textarea>
      </div>
      <div class="form-checkbox">
        <label>
          <input type="checkbox" id="item-popular" ${item.popular ? "checked" : ""}>
          Популярная услуга
        </label>
      </div>
    `;
  } else if (type === "products") {
    form = `
      <div class="form-group">
        <label>Название товара *</label>
        <input type="text" id="item-title" class="form-control" value="${escapeHtml(item.title || "")}" required>
      </div>
      <div class="form-group">
        <label>Описание</label>
        <textarea id="item-desc" class="form-control" rows="3">${escapeHtml(item.description || "")}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Цена *</label>
          <input type="text" id="item-price" class="form-control" value="${escapeHtml(item.price || "")}" required>
        </div>
        <div class="form-group">
          <label>Категория</label>
          <input type="text" id="item-category" class="form-control" value="${escapeHtml(item.category || "")}">
        </div>
      </div>
      <div class="form-group">
        <label>Изображение (URL)</label>
        <input type="text" id="item-image" class="form-control" value="${escapeHtml(item.image || "")}">
      </div>
    `;
  } else if (type === "pages") {
    form = `
      <div class="form-group">
        <label>Заголовок страницы *</label>
        <input type="text" id="item-title" class="form-control" value="${escapeHtml(item.title || "")}" required>
      </div>
      <div class="form-group">
        <label>URL (slug)</label>
        <input type="text" id="item-slug" class="form-control" value="${escapeHtml(item.slug || "")}">
      </div>
      <div class="form-group">
        <label>Содержимое</label>
        <textarea id="item-content" class="form-control" rows="6">${escapeHtml(item.content || "")}</textarea>
      </div>
      <div class="form-group">
        <label>Meta описание</label>
        <textarea id="item-meta" class="form-control" rows="2">${escapeHtml(item.metaDescription || "")}</textarea>
      </div>
    `;
  }

  showModal(`✏️ Редактирование`, form);
}

// Генерация опций для select
function generateTypeOptions(selectedType) {
  const types = [
    ["landing", "Лендинг"],
    ["shop", "Интернет-магазин"],
    ["corporate", "Корпоративный сайт"],
    ["mobile", "Мобильное приложение"],
    ["support", "Техподдержка"],
    ["design", "Дизайн"],
    ["development", "Разработка"],
    ["business-card", "Сайт-визитка"],
    ["ui/ux", "UI/UX Дизайн"],
  ];

  return types
    .map(
      ([value, label]) =>
        `<option value="${value}" ${selectedType === value ? "selected" : ""}>${label}</option>`,
    )
    .join("");
}

// ============== СОХРАНЕНИЕ ==============

function saveItem() {
  console.log("💾 Сохранение элемента...");

  let item = {};

  if (currentType === "services") {
    const images = document
      .getElementById("item-images")
      ?.value.split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .slice(0, 3);

    const features =
      document
        .getElementById("item-features")
        ?.value.split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0) || [];

    const technologies =
      document
        .getElementById("item-tech")
        ?.value.split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0) || [];

    const includes =
      document
        .getElementById("item-includes")
        ?.value.split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0) || [];

    item = {
      id:
        currentItemId === null
          ? Date.now()
          : currentData.services[currentItemId]?.id || Date.now(),
      title:
        document.getElementById("item-title")?.value?.trim() || "Новая услуга",
      description: document.getElementById("item-desc")?.value?.trim() || "",
      price: document.getElementById("item-price")?.value?.trim() || "от 0 ₽",
      type: document.getElementById("item-type")?.value || "development",
      features: features.length ? features : ["Базовый функционал"],
      popular: document.getElementById("item-popular")?.checked || false,
      images: images.length
        ? images
        : [
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
          ],
      details: {
        timeline:
          document.getElementById("item-timeline")?.value?.trim() ||
          "2-4 недели",
        technologies: technologies.length
          ? technologies
          : ["HTML/CSS", "JavaScript"],
        includes: includes.length ? includes : ["Базовый функционал"],
      },
    };
  } else if (currentType === "products") {
    item = {
      id:
        currentItemId === null
          ? Date.now()
          : currentData.products[currentItemId]?.id || Date.now(),
      title:
        document.getElementById("item-title")?.value?.trim() || "Новый товар",
      description: document.getElementById("item-desc")?.value?.trim() || "",
      price: document.getElementById("item-price")?.value?.trim() || "0 ₽",
      category:
        document.getElementById("item-category")?.value?.trim() ||
        "Без категории",
      image: document.getElementById("item-image")?.value?.trim() || "",
    };
  } else if (currentType === "pages") {
    const title =
      document.getElementById("item-title")?.value?.trim() || "Новая страница";
    item = {
      id:
        currentItemId === null
          ? Date.now()
          : currentData.pages[currentItemId]?.id || Date.now(),
      title: title,
      slug:
        document.getElementById("item-slug")?.value?.trim() ||
        title.toLowerCase().replace(/\s+/g, "-"),
      content: document.getElementById("item-content")?.value?.trim() || "",
      metaDescription:
        document.getElementById("item-meta")?.value?.trim() || "",
    };
  }

  // Добавляем или обновляем
  if (currentItemId === null) {
    currentData[currentType].push(item);
    console.log(`✅ Добавлен новый элемент в ${currentType}`);
  } else {
    currentData[currentType][currentItemId] = item;
    console.log(`✅ Обновлен элемент в ${currentType}`);
  }

  // Перерисовываем и закрываем
  renderList(currentType);
  closeModal();

  // Отмечаем изменения
  trackChanges();
  updateStatus(`✅ ${currentItemId === null ? "Добавлено" : "Обновлено"}`);
}

// ============== УДАЛЕНИЕ ==============

function deleteItem(type, index) {
  if (confirm("🗑️ Удалить эту запись?")) {
    currentData[type].splice(index, 1);
    renderList(type);
    trackChanges();
    updateStatus("✅ Элемент удален");
  }
}

// ============== СОХРАНЕНИЕ ВСЕГО ==============

async function saveAll() {
  updateStatus("💾 Сохранение...");

  try {
    let successCount = 0;

    for (const type of ["services", "products", "pages"]) {
      try {
        const response = await fetch(`http://localhost:3001/api/${type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentData[type] || []),
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ ${type} сохранены`);
        }
      } catch (error) {
        console.error(`❌ Ошибка сохранения ${type}:`, error);
      }
    }

    if (successCount === 3) {
      updateStatus("✅ Все данные сохранены");
      window.unsavedChanges = false;

      // Меняем кнопку
      const saveBtn = document.querySelector(".btn-save");
      if (saveBtn) {
        saveBtn.innerHTML =
          '<i class="fas fa-save"></i> Сохранить все изменения';
        saveBtn.style.background = "";
      }

      // Автоэкспорт
      setTimeout(exportDataForSite, 500);
    } else {
      updateStatus("⚠️ Сохранено не полностью");
    }
  } catch (error) {
    console.error("❌ Ошибка:", error);
    updateStatus("❌ Ошибка сохранения");
  }
}

// ============== ЭКСПОРТ ==============

function exportDataForSite() {
  console.log("📤 Экспорт данных для сайта...");

  const data = {
    services: currentData.services || [],
    products: currentData.products || [],
    pages: currentData.pages || [],
  };

  // Создаем JSON файл
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const dataUrl = URL.createObjectURL(dataBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = dataUrl;
  downloadLink.download = "site-data.json";
  downloadLink.click();

  URL.revokeObjectURL(dataUrl);

  updateStatus("✅ Данные экспортированы");
  showNotification(
    "Данные экспортированы. Скопируйте файл на сайт.",
    "success",
  );
}

// ============== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==============

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncateText(text, length) {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
}

function arrayToString(arr) {
  if (!arr) return "";
  if (Array.isArray(arr)) return arr.join(", ");
  return String(arr);
}

function trackChanges() {
  window.unsavedChanges = true;
  const saveBtn = document.querySelector(".btn-save");
  if (saveBtn) {
    saveBtn.innerHTML =
      '<i class="fas fa-exclamation-triangle"></i> Сохранить все изменения (!)';
    saveBtn.style.background = "#ff9800";
  }
}

function updateStatus(text) {
  const statusEl = document.getElementById("status");
  if (statusEl) {
    statusEl.textContent = text;
  }
}

function showNotification(message, type = "info") {
  // Удаляем старые уведомления
  const oldNotifications = document.querySelectorAll(".admin-notification");
  oldNotifications.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `admin-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// ============== ИНИЦИАЛИЗАЦИЯ ==============

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Админка инициализация...");

  // Загружаем данные
  loadAllData();

  // Переключение вкладок
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((c) => c.classList.remove("active"));

      this.classList.add("active");
      const tab = this.dataset.tab;
      document.getElementById(tab).classList.add("active");
      renderList(tab);
    });
  });

  // Закрытие модалки по клику на фон
  const modal = document.getElementById("modal");
  modal.addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Предупреждение при закрытии
  window.addEventListener("beforeunload", function (e) {
    if (window.unsavedChanges) {
      e.preventDefault();
      e.returnValue = "Есть несохраненные изменения!";
      return "Есть несохраненные изменения!";
    }
  });

  // Автосохранение каждые 5 минут
  setInterval(
    () => {
      if (window.unsavedChanges) {
        console.log("🔄 Автосохранение...");
        saveAll();
      }
    },
    5 * 60 * 1000,
  );

  console.log("✅ Админка готова");
});
