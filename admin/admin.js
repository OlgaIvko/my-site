// admin/admin.js
let currentData = {};
let currentType = "services";
let currentItemId = null;

// Загрузка данных
async function loadData(type) {
  try {
    const response = await fetch(`http://localhost:3001/api/${type}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    currentData[type] = await response.json();
    renderList(type);
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    currentData[type] = [];
    renderList(type);
  }
}

// Рендеринг списка
// Рендеринг списка
function renderList(type) {
  const container = document.getElementById(`${type}-list`);
  if (!container) return;

  const items = currentData[type] || [];

  container.innerHTML = items
    .map(
      (item, index) => `
      <div class="item-card">
        <!-- Превью изображений -->
        <div class="item-images-preview">
          ${
            item.images && item.images.length > 0
              ? item.images
                  .slice(0, 3)
                  .map(
                    (img) => `
                <img src="${img}"
                     alt="Превью"
                     class="item-image-thumb"
                     onerror="this.src='https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=70&fit=crop'">
              `,
                  )
                  .join("")
              : '<div class="no-images">Нет изображений</div>'
          }
          ${
            item.images && item.images.length > 3
              ? `<div class="more-images">+${item.images.length - 3}</div>`
              : ""
          }
        </div>

        <!-- Контент карточки -->
        <div class="item-title">
          ${item.title || "Без названия"}
          <span class="item-price">${item.price ? `${item.price}` : ""}</span>
        </div>
        <div class="item-desc">${item.description || ""}</div>
        <div class="item-actions">
          <button class="btn-edit" onclick="editItem('${type}', ${index})">
            <i class="fas fa-edit"></i> Редактировать
          </button>
          <button class="btn-delete" onclick="deleteItem('${type}', ${index})">
            <i class="fas fa-trash"></i> Удалить
          </button>
        </div>
      </div>
    `,
    )
    .join("");
}
// Показать модальное окно
function showModal(title, content) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").innerHTML = content;
  document.getElementById("modal").style.display = "flex";
}

// Закрыть модальное окно
function closeModal() {
  document.getElementById("modal").style.display = "none";
  currentItemId = null;
}

// Добавление услуги
function addService() {
  currentType = "services";
  currentItemId = null;
  showModal(
    "Новая услуга",
    `
        <div class="form-group">
            <label>Название услуги *</label>
            <input type="text" id="item-title" class="form-control" placeholder="Введите название" required>
        </div>
        <div class="form-group">
            <label>Описание</label>
            <textarea id="item-desc" class="form-control" placeholder="Описание услуги"></textarea>
        </div>
        <div class="form-group">
            <label>Цена *</label>
            <input type="text" id="item-price" class="form-control" placeholder="от 50 000 ₽" required>
        </div>
        <div class="form-group">
            <label>Тип услуги</label>
            <select id="item-type" class="form-control">
                <option value="landing">Лендинг</option>
                <option value="shop">Магазин</option>
                <option value="corporate">Корпоративный</option>
                <option value="mobile">Мобильное приложение</option>
                <option value="support">Техническая поддержка</option>
                <option value="design">Дизайн</option>
                <option value="development">Разработка</option>
                <option value="business-card">Сайт-визитка</option>
                <option value="ui/ux">UI/UX Дизайн</option>
            </select>
        </div>
        <div class="form-group">
            <label>Фичи (через запятую)</label>
            <textarea id="item-features" class="form-control" placeholder="Фича 1, Фича 2, Фича 3"></textarea>
        </div>
        <div class="form-group">
<label>Изображения (URL через запятую, максимум 3)</label>
<textarea id="item-images" class="form-control" placeholder="Ссылка 1, Ссылка 2, Ссылка 3"></textarea>
<small class="form-text text-muted">Можно добавить до 3 изображений через запятую</small>
        </div>
        <div class="form-group">
            <label>Срок выполнения</label>
            <input type="text" id="item-timeline" class="form-control" placeholder="2-4 недели">
        </div>
        <div class="form-group">
            <label>Технологии (через запятую)</label>
            <input type="text" id="item-tech" class="form-control" placeholder="HTML, CSS, JavaScript">
        </div>
        <div class="form-group">
            <label>Что входит (через запятую)</label>
            <textarea id="item-includes" class="form-control" placeholder="Включено 1, Включено 2"></textarea>
        </div>
        <div class="form-group checkbox">
            <label>
                <input type="checkbox" id="item-popular">
                Популярная услуга
            </label>
        </div>
    `,
  );
}

// Добавление товара
function addProduct() {
  currentType = "products";
  currentItemId = null;
  showModal(
    "Новый товар",
    `
        <div class="form-group">
            <label>Название товара *</label>
            <input type="text" id="item-title" class="form-control" placeholder="Введите название" required>
        </div>
        <div class="form-group">
            <label>Описание</label>
            <textarea id="item-desc" class="form-control" placeholder="Описание товара"></textarea>
        </div>
        <div class="form-group">
            <label>Цена *</label>
            <input type="text" id="item-price" class="form-control" placeholder="Стоимость товара" required>
        </div>
        <div class="form-group">
            <label>Категория</label>
            <input type="text" id="item-category" class="form-control" placeholder="Категория товара">
        </div>
        <div class="form-group">
            <label>Изображение (URL)</label>
            <input type="text" id="item-images" class="form-control" placeholder="Ссылка на изображение">
        </div>
    `,
  );
}

// Добавление страницы
function addPage() {
  currentType = "pages";
  currentItemId = null;
  showModal(
    "Новая страница",
    `
        <div class="form-group">
            <label>Заголовок страницы *</label>
            <input type="text" id="item-title" class="form-control" placeholder="Введите заголовок" required>
        </div>
        <div class="form-group">
            <label>URL страницы</label>
            <input type="text" id="item-slug" class="form-control" placeholder="например: about-us">
        </div>
        <div class="form-group">
            <label>Содержимое</label>
            <textarea id="item-content" class="form-control" placeholder="Текст страницы" rows="6"></textarea>
        </div>
        <div class="form-group">
            <label>Meta описание</label>
            <textarea id="item-meta" class="form-control" placeholder="Описание для SEO"></textarea>
        </div>
    `,
  );
}

// Редактирование элемента
function editItem(type, index) {
  currentType = type;
  currentItemId = index;
  const item = currentData[type][index];

  let formHtml = "";

  if (type === "services") {
    formHtml = `
            <div class="form-group">
                <label>Название услуги *</label>
                <input type="text" id="item-title" class="form-control" value="${item.title || ""}" required>
            </div>
            <div class="form-group">
                <label>Описание</label>
                <textarea id="item-desc" class="form-control">${item.description || ""}</textarea>
            </div>
            <div class="form-group">
                <label>Цена *</label>
                <input type="text" id="item-price" class="form-control" value="${item.price || ""}" required>
            </div>
            <div class="form-group">
                <label>Тип услуги</label>
                <select id="item-type" class="form-control">
                    <option value="landing" ${item.type === "landing" ? "selected" : ""}>Лендинг</option>
                    <option value="shop" ${item.type === "shop" ? "selected" : ""}>Магазин</option>
                    <option value="corporate" ${item.type === "corporate" ? "selected" : ""}>Корпоративный</option>
                    <option value="mobile" ${item.type === "mobile" ? "selected" : ""}>Мобильное приложение</option>
                    <option value="support" ${item.type === "support" ? "selected" : ""}>Техническая поддержка</option>
                    <option value="design" ${item.type === "design" ? "selected" : ""}>Дизайн</option>
                    <option value="development" ${item.type === "development" ? "selected" : ""}>Разработка</option>
                    <option value="business-card" ${item.type === "business-card" ? "selected" : ""}>Сайт-визитка</option>
                    <option value="ui/ux" ${item.type === "ui/ux" ? "selected" : ""}>UI/UX Дизайн</option>
                </select>
            </div>
            <div class="form-group">
                <label>Фичи (через запятую)</label>
                <textarea id="item-features" class="form-control">${Array.isArray(item.features) ? item.features.join(", ") : ""}</textarea>
            </div>
            <div class="form-group">
                <label>Изображения (URL через запятую, максимум 3)</label>
<textarea id="item-images" class="form-control" placeholder="Ссылка 1, Ссылка 2, Ссылка 3">${Array.isArray(item.images) ? item.images.join(", ") : item.image || ""}</textarea>
<small class="form-text text-muted">Можно добавить до 3 изображений через запятую</small>
            </div>
            <div class="form-group">
                <label>Срок выполнения</label>
                <input type="text" id="item-timeline" class="form-control" value="${item.details?.timeline || ""}">
            </div>
            <div class="form-group">
                <label>Технологии (через запятую)</label>
                <input type="text" id="item-tech" class="form-control" value="${item.details?.technologies ? (Array.isArray(item.details.technologies) ? item.details.technologies.join(", ") : item.details.technologies) : ""}">
            </div>
            <div class="form-group">
                <label>Что входит (через запятую)</label>
                <textarea id="item-includes" class="form-control">${item.details?.includes ? (Array.isArray(item.details.includes) ? item.details.includes.join(", ") : item.details.includes) : ""}</textarea>
            </div>
            <div class="form-group checkbox">
                <label>
                    <input type="checkbox" id="item-popular" ${item.popular ? "checked" : ""}>
                    Популярная услуга
                </label>
            </div>
        `;
  } else if (type === "products") {
    formHtml = `
            <div class="form-group">
                <label>Название товара *</label>
                <input type="text" id="item-title" class="form-control" value="${item.title || ""}" required>
            </div>
            <div class="form-group">
                <label>Описание</label>
                <textarea id="item-desc" class="form-control">${item.description || ""}</textarea>
            </div>
            <div class="form-group">
                <label>Цена *</label>
                <input type="text" id="item-price" class="form-control" value="${item.price || ""}" required>
            </div>
            <div class="form-group">
                <label>Категория</label>
                <input type="text" id="item-category" class="form-control" value="${item.category || ""}">
            </div>
            <div class="form-group">
                <label>Изображение (URL)</label>
                <input type="text" id="item-images" class="form-control" value="${item.image || ""}">
            </div>
        `;
  } else if (type === "pages") {
    formHtml = `
            <div class="form-group">
                <label>Заголовок страницы *</label>
                <input type="text" id="item-title" class="form-control" value="${item.title || ""}" required>
            </div>
            <div class="form-group">
                <label>URL страницы</label>
                <input type="text" id="item-slug" class="form-control" value="${item.slug || ""}">
            </div>
            <div class="form-group">
                <label>Содержимое</label>
                <textarea id="item-content" class="form-control" rows="6">${item.content || ""}</textarea>
            </div>
            <div class="form-group">
                <label>Meta описание</label>
                <textarea id="item-meta" class="form-control">${item.metaDescription || ""}</textarea>
            </div>
        `;
  }

  showModal("Редактирование", formHtml);
}

// Сохранить элемент (ОДНА ФУНКЦИЯ)
function saveItem() {
  console.log("Сохранение элемента...");

  let item = {};
  let isValid = true;

  // Проверка обязательных полей
  const titleEl = document.getElementById("item-title");
  const priceEl = document.getElementById("item-price");

  if (!titleEl || !titleEl.value.trim()) {
    alert("Заполните название!");
    titleEl?.focus();
    isValid = false;
    return;
  }

  if (priceEl && !priceEl.value.trim()) {
    alert("Укажите цену!");
    priceEl?.focus();
    isValid = false;
    return;
  }

  // Собираем данные в зависимости от типа
  if (currentType === "services") {
    // Преобразуем строки в массивы
    const features = document
      .getElementById("item-features")
      ?.value.split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0) || ["Базовый функционал"];

    const technologies = document
      .getElementById("item-tech")
      ?.value.split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0) || ["HTML/CSS", "JavaScript"];

    const includes = document
      .getElementById("item-includes")
      ?.value.split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0) || ["Базовый набор функций"];

    // Получаем массив изображений
    const imagesInput = document.getElementById("item-images")?.value || "";
    const images = imagesInput
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0)
      .slice(0, 3); // Берем только первые 3

    // Если нет изображений, используем стандартное
    if (images.length === 0) {
      images.push(
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      );
    }

    item = {
      id:
        currentItemId === null
          ? Date.now()
          : currentData[currentType][currentItemId]?.id || Date.now(),
      title: titleEl.value.trim(),
      description: document.getElementById("item-desc")?.value?.trim() || "",
      price: priceEl?.value?.trim() || "от 0 ₽",
      type: document.getElementById("item-type")?.value || "development",
      features: features,
      popular: document.getElementById("item-popular")?.checked || false,
      images: images, // ← ЗДЕСЬ ПРОИЗОШЛА ЗАМЕНА
      details: {
        timeline:
          document.getElementById("item-timeline")?.value?.trim() ||
          "2-4 недели",
        technologies: technologies,
        includes: includes,
      },
    };
  } else if (currentType === "products") {
    item = {
      title: titleEl.value.trim(),
      description: document.getElementById("item-desc")?.value?.trim() || "",
      price: priceEl?.value?.trim() || "0 ₽",
      category:
        document.getElementById("item-category")?.value?.trim() ||
        "Без категории",
      image: document.getElementById("item-images")?.value?.trim() || "",
    };
  } else if (currentType === "pages") {
    item = {
      title: titleEl.value.trim(),
      slug:
        document.getElementById("item-slug")?.value?.trim() ||
        titleEl.value.trim().toLowerCase().replace(/\s+/g, "-"),
      content: document.getElementById("item-content")?.value?.trim() || "",
      metaDescription:
        document.getElementById("item-meta")?.value?.trim() || "",
    };
  }

  if (!isValid) return;

  // Инициализируем массив если его нет
  if (!currentData[currentType]) {
    currentData[currentType] = [];
  }

  // Добавляем или обновляем
  if (currentItemId === null) {
    // Новая запись
    currentData[currentType].push(item);
    console.log("Добавлен новый элемент:", item);
  } else {
    // Редактирование существующей
    currentData[currentType][currentItemId] = item;
    console.log("Обновлен элемент:", item);
  }

  // Перерисовываем список
  renderList(currentType);

  // Закрываем модалку
  closeModal();

  // Обновляем статус
  updateStatus(
    `✅ ${currentItemId === null ? "Добавлено" : "Обновлено"}: "${item.title.substring(0, 30)}..."`,
  );

  // Отмечаем изменения
  trackChanges(currentType);
}

// Удаление элемента
function deleteItem(type, index) {
  if (confirm("Удалить этот элемент?")) {
    currentData[type].splice(index, 1);
    renderList(type);
    trackChanges(type);
    updateStatus("Элемент удален");
  }
}

// Сохранить все на сервер
async function saveAll() {
  if (!currentData || Object.keys(currentData).length === 0) {
    updateStatus("❌ Нет данных для сохранения");
    return;
  }

  updateStatus("Сохранение...");

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const type in currentData) {
      try {
        const response = await fetch(`http://localhost:3001/api/${type}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentData[type]),
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ ${type} сохранены`);
        } else {
          errorCount++;
          console.error(`❌ Ошибка сохранения ${type}:`, response.status);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Ошибка при сохранении ${type}:`, error);
      }
    }

    if (errorCount === 0) {
      updateStatus(`✅ Все данные сохранены (${successCount} категорий)`);

      // Сбрасываем флаг изменений
      if (window.unsavedChanges) {
        window.unsavedChanges = {};
        const saveBtn = document.querySelector(".btn-save");
        if (saveBtn) {
          saveBtn.innerHTML =
            '<i class="fas fa-save"></i> Сохранить все изменения';
          saveBtn.style.background = "#28a745";
        }
      }
    } else {
      updateStatus(
        `⚠️ Сохранено ${successCount} из ${successCount + errorCount} категорий`,
      );
    }
  } catch (error) {
    console.error("❌ Критическая ошибка:", error);
    updateStatus("❌ Ошибка сохранения. Проверьте консоль.");
  }
}

// Отслеживание изменений
function trackChanges(type) {
  if (!window.unsavedChanges) window.unsavedChanges = {};
  window.unsavedChanges[type] = true;

  const saveBtn = document.querySelector(".btn-save");
  if (saveBtn) {
    saveBtn.innerHTML =
      '<i class="fas fa-exclamation-triangle"></i> Сохранить все изменения';
    saveBtn.style.background = "#ff9800";
  }
}

// Обновить статус
function updateStatus(text) {
  const statusEl = document.getElementById("status");
  if (statusEl) {
    statusEl.textContent = text;
    if (text.includes("✅")) {
      statusEl.style.color = "#28a745";
    } else if (text.includes("❌")) {
      statusEl.style.color = "#dc3545";
    } else if (text.includes("⚠️")) {
      statusEl.style.color = "#ff9800";
    } else {
      statusEl.style.color = "#6c757d";
    }
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", function () {
  console.log("Админка загружена");

  // Загрузка данных
  loadData("services");
  loadData("products");
  loadData("pages");

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
    });
  });

  // Закрытие модального окна по клику на фон
  document.getElementById("modal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Автосохранение при закрытии
  window.addEventListener("beforeunload", function (e) {
    if (
      window.unsavedChanges &&
      Object.keys(window.unsavedChanges).length > 0
    ) {
      e.preventDefault();
      e.returnValue =
        "Есть несохраненные изменения. Вы уверены, что хотите уйти?";
      saveAll();
    }
  });

  // Автосохранение каждые 5 минут
  setInterval(
    () => {
      if (
        window.unsavedChanges &&
        Object.keys(window.unsavedChanges).length > 0
      ) {
        saveAll();
      }
    },
    5 * 60 * 1000,
  );
});

// admin.js - добавьте эту функцию

function exportDataForSite() {
  console.log("📤 Экспорт данных для сайта...");

  const data = {
    services: currentData.services || [],
    products: currentData.products || [],
    pages: currentData.pages || [],
  };

  // Создаем JSON файл для скачивания
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const dataUrl = URL.createObjectURL(dataBlob);

  const downloadLink = document.createElement("a");
  downloadLink.href = dataUrl;
  downloadLink.download = "site-data.json";
  downloadLink.click();

  console.log("✅ Данные экспортированы для сайта");
  alert(
    "Данные экспортированы. Сохраните файл как /data/services.json на вашем сайте.",
  );
}

// Добавьте кнопку в админку
function addExportButton() {
  const header = document.querySelector(".admin-header");
  if (!header) return;

  const exportBtn = document.createElement("button");
  exportBtn.className = "btn-export";
  exportBtn.innerHTML = '<i class="fas fa-download"></i> Экспорт для сайта';
  exportBtn.onclick = exportDataForSite;

  header.appendChild(exportBtn);

  // Стили для кнопки
  const style = document.createElement("style");
  style.textContent = `
    .btn-export {
      background: #6f42c1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-export:hover {
      background: #5a32a3;
    }
  `;
  document.head.appendChild(style);
}

// Вызовите в конце init
addExportButton();
