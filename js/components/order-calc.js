// Файл: js/components/order-calc.js
// МИНИМАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ С ВЫБОРОМ УСЛУГ

export function initOrderCalculation() {
  console.log("🚀 Инициализация формы заказа");

  // 1. Настраиваем основную форму
  setupMainForm();

  // 2. Добавляем выбор услуг
  addServicesSelection();

  // 3. Дебаг кнопка
  addDebugButton();
}

// === ОСНОВНЫЕ НАСТРОЙКИ ===
const TELEGRAM_CONFIG = {
  BOT_TOKEN: "8449188564:AAH0dbfYidu3z3SgYKsZtN6H4fioI7MDErM",
  CHAT_ID: "1856676466",
};

// === НАСТРОЙКА ФОРМЫ ===
function setupMainForm() {
  const form = document.getElementById("order-calculation-form");

  if (!form) {
    console.error("❌ Форма не найдена!");
    return;
  }

  console.log("✅ Форма найдена");

  // Обработчик отправки формы
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("📝 Форма отправляется...");

    // Получаем данные формы
    const formData = new FormData(this);
    const data = {
      name: formData.get("name") || "",
      phone: formData.get("phone") || "",
      email: formData.get("email") || "",
      description: formData.get("description") || "",
      agreement: formData.get("agreement") || "",
    };

    // Получаем выбранные услуги
    const services = getSelectedServices();

    // Валидация
    if (!data.name.trim()) {
      alert("❌ Введите ваше имя");
      document.getElementById("client-name").focus();
      return;
    }

    if (!data.phone.trim()) {
      alert("❌ Введите телефон");
      document.getElementById("client-phone").focus();
      return;
    }

    if (services.length === 0) {
      alert("❌ Выберите хотя бы одну услугу");
      document
        .getElementById("services-selection")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!data.agreement) {
      alert("❌ Подтвердите согласие с политикой конфиденциальности");
      return;
    }

    // Показываем загрузку
    showLoading();

    try {
      // Отправляем в Telegram
      const success = await sendToTelegram(data, services);

      if (success) {
        alert("✅ Заявка отправлена! Мы свяжемся с вами в Telegram.");
        form.reset();
        clearSelectedServices();
      } else {
        alert("⚠️ Открываем Telegram для отправки...");
        openTelegramFallback(data, services);
      }
    } catch (error) {
      console.error("❌ Ошибка:", error);
      alert("❌ Ошибка отправки. Попробуйте ещё раз.");
    } finally {
      hideLoading();
    }
  });

  // Форматирование телефона
  const phoneInput = document.getElementById("client-phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");

      if (value.startsWith("7")) {
        value = "+7" + value.substring(1);
      } else if (value.startsWith("8")) {
        value = "+7" + value.substring(1);
      } else if (!value.startsWith("+")) {
        value = "+7" + value;
      }

      // Форматирование
      if (value.length > 2)
        value = value.substring(0, 2) + " (" + value.substring(2);
      if (value.length > 7)
        value = value.substring(0, 7) + ") " + value.substring(7);
      if (value.length > 12)
        value = value.substring(0, 12) + "-" + value.substring(12);
      if (value.length > 15)
        value = value.substring(0, 15) + "-" + value.substring(15);

      this.value = value.substring(0, 18);
    });
  }
}

// === ВЫБОР УСЛУГ ===
function addServicesSelection() {
  const form = document.getElementById("order-calculation-form");
  if (!form) return;

  // Если уже добавлено - выходим
  if (document.getElementById("services-selection")) return;

  // HTML для выбора услуг
  const html = `
    <div class="form-group" id="services-selection" style="margin-bottom: 25px;">
      <label class="form-label" style="display: block; margin-bottom: 15px; font-weight: 600; color: #1f2937;">
        📋 Выберите нужные услуги *
      </label>

      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
        <label style="
          padding: 12px 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        ">
          <input type="checkbox" name="service" value="Лендинг" style="display: none;">
          <span style="font-size: 18px;">🚀</span>
          <span style="font-weight: 500;">Лендинг</span>
        </label>

        <label style="
          padding: 12px 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        ">
          <input type="checkbox" name="service" value="Интернет-магазин" style="display: none;">
          <span style="font-size: 18px;">🛒</span>
          <span style="font-weight: 500;">Интернет-магазин</span>
        </label>

        <label style="
          padding: 12px 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        ">
          <input type="checkbox" name="service" value="Корпоративный сайт" style="display: none;">
          <span style="font-size: 18px;">🏢</span>
          <span style="font-weight: 500;">Корпоративный сайт</span>
        </label>

        <label style="
          padding: 12px 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        ">
          <input type="checkbox" name="service" value="Редизайн" style="display: none;">
          <span style="font-size: 18px;">📱</span>
          <span style="font-weight: 500;">  Мобильные приложения</span>
        </label>
         <label style="
          padding: 12px 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        ">
          <input type="checkbox" name="service" value="Редизайн" style="display: none;">
          <span style="font-size: 18px;">🎨</span>
          <span style="font-weight: 500;">Дизайн в Figma</span>
        </label>
         <label style="
          padding: 12px 18px;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        ">
          <input type="checkbox" name="service" value="Редизайн" style="display: none;">
          <span style="font-size: 18px;">📇</span>
          <span style="font-weight: 500;">  Сайт-визитка</span>
        </label>
      </div>

      <!-- Своя услуга -->
      <div style="margin-bottom: 15px;">
        <input type="text"
               id="custom-service-input"
               placeholder="Другая услуга (напишите и нажмите Enter)"
               style="
                 width: 100%;
                 padding: 12px 16px;
                 border: 2px solid #e2e8f0;
                 border-radius: 10px;
                 font-size: 14px;
                 transition: all 0.2s;
               "
               onfocus="this.style.borderColor='#3499ff'"
               onblur="this.style.borderColor='#e2e8f0'">
      </div>

      <!-- Выбранные услуги -->
      <div id="selected-services-display" style="
        margin-top: 20px;
        padding: 20px;
        background: #f8fafc;
        border-radius: 12px;
        border: 2px solid #e2e8f0;
        display: none;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <strong style="color: #1f2937;">✅ Выбрано услуг: <span id="services-count">0</span></strong>
          <button type="button" id="clear-services-btn" style="
            background: transparent;
            border: none;
            color: #64748b;
            cursor: pointer;
            font-size: 14px;
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s;
          ">
            Очистить все
          </button>
        </div>
        <div id="selected-services-list"></div>
      </div>
    </div>
  `;

  // Вставляем перед полем описания
  const descField = document.getElementById("project-desc");
  if (descField) {
    descField.insertAdjacentHTML("beforebegin", html);

    // Настраиваем обработчики
    setupServicesHandlers();

    // Добавляем CSS
    addServicesStyles();
  }
}

// НАСТРОЙКА ОБРАБОТЧИКОВ УСЛУГ
function setupServicesHandlers() {
  // Чекбоксы услуг
  document.querySelectorAll("#services-selection label").forEach((label) => {
    label.addEventListener("click", function () {
      const checkbox = this.querySelector('input[type="checkbox"]');
      const serviceName = checkbox.value;

      checkbox.checked = !checkbox.checked;

      if (checkbox.checked) {
        this.style.background = "#3499ff";
        this.style.borderColor = "#3499ff";
        this.style.color = "white";
        this.style.boxShadow = "0 4px 12px rgba(52, 153, 255, 0.2)";

        addServiceToList(serviceName);
      } else {
        this.style.background = "white";
        this.style.borderColor = "#e2e8f0";
        this.style.color = "inherit";
        this.style.boxShadow = "none";

        removeServiceFromList(serviceName);
      }
    });
  });

  // Поле для своей услуги
  const customInput = document.getElementById("custom-service-input");
  if (customInput) {
    customInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const serviceName = this.value.trim();

        if (serviceName) {
          addServiceToList(serviceName);
          this.value = "";
        }
      }
    });
  }

  // Кнопка очистки
  const clearBtn = document.getElementById("clear-services-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearSelectedServices);
  }
}

// ДОБАВЛЕНИЕ УСЛУГИ В СПИСОК
function addServiceToList(serviceName) {
  const display = document.getElementById("selected-services-display");
  const list = document.getElementById("selected-services-list");
  const countSpan = document.getElementById("services-count");

  // Проверяем, не добавлена ли уже
  if (document.querySelector(`[data-service="${serviceName}"]`)) return;

  // Показываем блок
  display.style.display = "block";

  // Создаем элемент
  const item = document.createElement("div");
  item.dataset.service = serviceName;
  item.style.cssText = `
    padding: 10px 15px;
    margin-bottom: 8px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    animation: fadeIn 0.3s ease;
  `;

  item.innerHTML = `
    <span>${serviceName}</span>
    <button type="button" onclick="removeService('${serviceName}')" style="
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 20px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    ">
      ×
    </button>
  `;

  list.appendChild(item);

  // Обновляем счетчик
  const currentCount = parseInt(countSpan.textContent) || 0;
  countSpan.textContent = currentCount + 1;
}

// УДАЛЕНИЕ УСЛУГИ ИЗ СПИСКА
window.removeService = function (serviceName) {
  const item = document.querySelector(`[data-service="${serviceName}"]`);
  if (!item) return;

  item.style.animation = "fadeOut 0.3s ease";
  setTimeout(() => {
    item.remove();

    // Обновляем счетчик
    const countSpan = document.getElementById("services-count");
    const display = document.getElementById("selected-services-display");
    const currentCount = parseInt(countSpan.textContent);
    const newCount = currentCount - 1;

    countSpan.textContent = newCount;

    if (newCount === 0) {
      display.style.display = "none";
    }

    // Сбрасываем чекбокс если это стандартная услуга
    const checkbox = document.querySelector(`input[value="${serviceName}"]`);
    if (checkbox) {
      checkbox.checked = false;
      const label = checkbox.closest("label");
      if (label) {
        label.style.background = "white";
        label.style.borderColor = "#e2e8f0";
        label.style.color = "inherit";
        label.style.boxShadow = "none";
      }
    }
  }, 300);
};

// ПОЛУЧЕНИЕ ВЫБРАННЫХ УСЛУГ
function getSelectedServices() {
  const services = [];

  // Стандартные услуги
  document
    .querySelectorAll('#services-selection input[type="checkbox"]:checked')
    .forEach((cb) => {
      services.push(cb.value);
    });

  // Свои услуги
  document
    .querySelectorAll("#selected-services-list [data-service]")
    .forEach((item) => {
      const serviceName = item.dataset.service;
      if (!services.includes(serviceName)) {
        services.push(serviceName);
      }
    });

  return services;
}

// ОЧИСТКА ВСЕХ УСЛУГ
function clearSelectedServices() {
  // Сбрасываем чекбоксы
  document
    .querySelectorAll('#services-selection input[type="checkbox"]')
    .forEach((cb) => {
      cb.checked = false;
      const label = cb.closest("label");
      if (label) {
        label.style.background = "white";
        label.style.borderColor = "#e2e8f0";
        label.style.color = "inherit";
        label.style.boxShadow = "none";
      }
    });

  // Очищаем список
  const list = document.getElementById("selected-services-list");
  if (list) {
    list.innerHTML = "";
  }

  // Скрываем блок
  const display = document.getElementById("selected-services-display");
  if (display) {
    display.style.display = "none";
  }

  // Сбрасываем счетчик
  const countSpan = document.getElementById("services-count");
  if (countSpan) {
    countSpan.textContent = "0";
  }
}

// === ОТПРАВКА В TELEGRAM ===
async function sendToTelegram(data, services) {
  console.log("📤 Отправка в Telegram...");

  // Создаем сообщение
  const message = `
🎯 <b>НОВАЯ ЗАЯВКА С САЙТА</b>
━━━━━━━━━━━━━━━━
👤 <b>Имя:</b> ${data.name}
📞 <b>Телефон:</b> ${data.phone}
${data.email ? `📧 <b>Email:</b> ${data.email}\n` : ""}━━━━━━━━━━━━━━━━
📋 <b>Услуги (${services.length}):</b>
${services.map((s) => `• ${s}`).join("\n")}
━━━━━━━━━━━━━━━━
${data.description ? `📝 <b>Описание проекта:</b>\n${data.description}\n━━━━━━━━━━━━━━━━\n` : ""}⏰ <b>Время:</b> ${new Date().toLocaleString("ru-RU")}
🌐 <b>Источник:</b> Сайт веб-студии`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CONFIG.CHAT_ID,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );

    const result = await response.json();
    console.log("📨 Ответ Telegram:", result.ok ? "✅ Успешно" : "❌ Ошибка");

    return result.ok === true;
  } catch (error) {
    console.error("❌ Ошибка сети:", error);
    return false;
  }
}

// ЗАПАСНОЙ ВАРИАНТ ОТПРАВКИ
function openTelegramFallback(data, services) {
  const message = `🎯 НОВАЯ ЗАЯВКА С САЙТА\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}\n${data.email ? `📧 Email: ${data.email}\n` : ""}\n📋 Услуги (${services.length}):\n${services.map((s) => `• ${s}`).join("\n")}\n${data.description ? `\n📝 Описание проекта:\n${data.description}\n` : ""}\n⏰ Время: ${new Date().toLocaleString("ru-RU")}\n🌐 Источник: Сайт веб-студии`;

  const encoded = encodeURIComponent(message);
  const telegramUrl = `https://t.me/+79997005798?text=${encoded}`;

  window.open(telegramUrl, "_blank", "noopener,noreferrer");
}

// === УТИЛИТЫ ===
// ПОКАЗАТЬ ЗАГРУЗКУ
function showLoading() {
  const loader = document.createElement("div");
  loader.id = "loader";
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(3px);
  `;

  loader.innerHTML = `
    <div style="
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      text-align: center;
    ">
      <div style="
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3499ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
      "></div>
      <p style="margin: 0; color: #333; font-weight: 500;">Отправляем заявку...</p>
    </div>
  `;

  document.body.appendChild(loader);
}

// СКРЫТЬ ЗАГРУЗКУ
function hideLoading() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.remove();
  }
}

// ДОБАВИТЬ CSS
function addServicesStyles() {
  if (document.getElementById("services-styles")) return;

  const style = document.createElement("style");
  style.id = "services-styles";
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-10px); }
    }

    #clear-services-btn:hover {
      background: #f1f5f9;
      color: #ef4444;
    }
  `;

  document.head.appendChild(style);
}

// ДЕБАГ КНОПКА
function addDebugButton() {
  // Только для локальной разработки
  if (
    !window.location.hostname.includes("localhost") &&
    !window.location.hostname.includes("127.0.0.1")
  ) {
    return;
  }

  const btn = document.createElement("button");
  // btn.innerHTML = "🧪 Тест формы";
  // btn.style.cssText = `
  //   position: fixed;
  //   bottom: 20px;
  //   right: 20px;
  //   z-index: 9999;
  //   background: #8b5cf6;
  //   color: white;
  //   border: none;
  //   padding: 12px 20px;
  //   border-radius: 10px;
  //   cursor: pointer;
  //   font-weight: bold;
  //   box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  // `;

  btn.onclick = function () {
    console.log("=== ТЕСТ ФОРМЫ ===");

    // Заполняем тестовыми данными
    document.getElementById("client-name").value = "Тест Клиент";
    document.getElementById("client-phone").value = "+7 (999) 123-45-67";
    document.getElementById("client-email").value = "test@example.com";
    document.getElementById("project-desc").value = "Тестовый проект";

    // Выбираем услуги
    clearSelectedServices();
    addServiceToList("Лендинг");
    addServiceToList("Интернет-магазин");

    // Ставим галочку согласия
    document.querySelector('input[name="agreement"]').checked = true;

    console.log("✅ Тестовые данные заполнены");
    alert(
      '✅ Тестовые данные заполнены\nНажмите "Заказать расчёт" для отправки',
    );
  };

  document.body.appendChild(btn);
}

// АВТОМАТИЧЕСКИЙ ЗАПУСК
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 DOM загружен, запускаем инициализацию...");
  setTimeout(initOrderCalculation, 500);
});

console.log("✅ order-calc.js загружен");

document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".promo-card video");

  if (video) {
    // Ждем загрузки метаданных видео
    video.addEventListener("loadedmetadata", function () {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const videoRatio = videoWidth / videoHeight;

      const container = video.closest(".video-wrapper");
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const containerRatio = containerWidth / containerHeight;

      // Определяем как лучше масштабировать
      if (videoRatio > containerRatio) {
        // Видео шире контейнера - масштабируем по высоте
        video.style.width = "auto";
        video.style.height = "100%";
      } else {
        // Видео уже контейнера - масштабируем по ширине
        video.style.width = "100%";
        video.style.height = "auto";
      }
    });

    // Пересчитываем при изменении размера окна
    window.addEventListener("resize", function () {
      video.dispatchEvent(new Event("loadedmetadata"));
    });
  }
});
