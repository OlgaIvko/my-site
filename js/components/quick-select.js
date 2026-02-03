// js/components/quick-select.js - ОБНОВЛЕННАЯ ВЕРСИЯ С EMAIL

export function initQuickSelect() {
  console.log("🎯 Инициализация быстрого выбора");

  const quickButtons = document.querySelectorAll(".quick-btn");
  if (!quickButtons.length) {
    console.warn("❌ Кнопки быстрого выбора не найдены");
    return;
  }

  console.log(`✅ Найдено кнопок: ${quickButtons.length}`);

  // Инициализируем кнопку "Начать проект"
  initPromoOrderButton();

  // Инициализируем форму расчета
  initCalculationForm();

  // Обработчик кликов по кнопкам фильтрации
  quickButtons.forEach((button) => {
    button.addEventListener("click", function () {
      quickButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      applyQuickFilter(this.dataset.type);
    });
  });

  console.log("✅ Быстрый выбор инициализирован");
}

// Инициализация кнопки "Начать проект"
function initPromoOrderButton() {
  const promoButton = document.querySelector(".promo-order-btn");
  if (promoButton) {
    promoButton.addEventListener("click", function (e) {
      e.preventDefault();
      openPromoOrderForm();
    });
  }
}

// Функция открытия формы заказа промо-услуги
function openPromoOrderForm() {
  console.log("🚀 Открытие формы заказа промо-услуги");

  // Получаем данные из промо-карточки
  const title = "Запуск доставки еды";
  const price = "от 200 000 ₽";
  const oldPrice = "от 250 000 ₽";
  const description =
    "Создаем уникальные онлайн-магазины под ключ с полным циклом разработки";

  // Открываем модальное окно для ввода контактов
  showPromoContactForm({
    title,
    price,
    oldPrice,
    description,
    serviceType: "promo",
  });
}

// Показать форму для ввода контактов
function showPromoContactForm(serviceData) {
  // Создаем модальное окно
  const modalHTML = `
    <div class="contact-modal" id="contactModal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #333;">Оставить заявку на спецпредложение</h3>
          <button class="modal-close" style="
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
          ">×</button>
        </div>

        <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: bold;">${serviceData.title}</p>
          <p style="margin: 0; color: #666;">Цена: <span style="text-decoration: line-through; color: #999;">${serviceData.oldPrice}</span> <span style="color: #e74c3c; font-weight: bold;">${serviceData.price}</span></p>
        </div>

        <form id="promoContactForm">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #333;">Ваше имя *</label>
            <input type="text" name="name" required style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              box-sizing: border-box;
            " placeholder="Иван Иванов">
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; color: #333;">Телефон *</label>
            <input type="tel" name="phone" required style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              box-sizing: border-box;
            " placeholder="+7 (999) 123-45-67">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #333;">Email</label>
            <input type="email" name="email" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              box-sizing: border-box;
            " placeholder="example@mail.ru">
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #333;">Комментарий (необязательно)</label>
            <textarea name="comment" style="
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 6px;
              box-sizing: border-box;
              min-height: 80px;
              resize: vertical;
            " placeholder="Дополнительная информация..."></textarea>
          </div>

          <input type="hidden" name="service_title" value="${serviceData.title}">
          <input type="hidden" name="service_price" value="${serviceData.price}">
          <input type="hidden" name="service_type" value="${serviceData.serviceType}">

          <div style="margin-bottom: 20px;">
            <label style="display: flex; align-items: flex-start; gap: 10px; cursor: pointer;">
              <input type="checkbox" name="agreement" required style="margin-top: 3px;">
              <span style="font-size: 14px; color: #666;">
                Согласен с обработкой персональных данных
              </span>
            </label>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" style="
              flex: 1;
              padding: 12px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
              transition: background 0.3s;
            " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
              Отправить заявку
            </button>

            <button type="button" class="modal-close" style="
              padding: 12px 20px;
              background: #f3f4f6;
              color: #666;
              border: 1px solid #ddd;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
            ">
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Добавляем модальное окно в DOM
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  const modal = document.getElementById("contactModal");
  const form = document.getElementById("promoContactForm");

  // Закрытие модального окна
  modal.querySelectorAll(".modal-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  });

  // Обработка отправки формы
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    submitPromoRequest(formData);
    document.body.removeChild(modal);
  });

  // Закрытие по клику вне модального окна
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Отправка заявки на промо-услугу
function submitPromoRequest(formData) {
  const data = Object.fromEntries(formData.entries());

  // Валидация
  if (!data.name || !data.phone) {
    showNotification("Пожалуйста, заполните обязательные поля", "error");
    return;
  }

  // Формируем данные для отправки
  const emailData = {
    to: "olyaly1589@yandex.ru",
    subject: `Заявка на спецпредложение: ${data.service_title}`,
    body: `
      НОВАЯ ЗАЯВКА НА СПЕЦПРЕДЛОЖЕНИЕ
      ==================================

      Услуга: ${data.service_title}
      Цена: ${data.service_price}
      Тип: ${data.service_type}

      КОНТАКТЫ КЛИЕНТА:
      Имя: ${data.name}
      Телефон: ${data.phone}
      Email: ${data.email || "не указан"}

      КОММЕНТАРИЙ:
      ${data.comment || "нет комментария"}

      ==================================
      Заявка отправлена с сайта
      Дата: ${new Date().toLocaleString()}
    `,
  };

  // Отправляем на почту
  sendToEmail(emailData);

  // Показываем уведомление
  showNotification(
    "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
    "success",
  );
}

// Функция отправки на почту
function sendToEmail(emailData) {
  console.log("📧 Отправляем на почту:", emailData);

  // Формируем mailto ссылку
  const subject = encodeURIComponent(emailData.subject);
  const body = encodeURIComponent(emailData.body);
  const mailtoLink = `mailto:${emailData.to}?subject=${subject}&body=${body}`;

  // Открываем почтовый клиент пользователя
  window.location.href = mailtoLink;

  // Также можно сделать fetch запрос на сервер для отправки
  // sendToServer(emailData);
}

// Альтернатива: отправка через Formspree или другой сервис
async function sendToServer(emailData) {
  try {
    const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _replyto: emailData.to,
        _subject: emailData.subject,
        message: emailData.body,
        service: emailData.service_type,
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      console.log("✅ Заявка отправлена на сервер");
    } else {
      console.warn("⚠️ Не удалось отправить на сервер, используем mailto");
      sendToEmail(emailData); // Фолбэк на mailto
    }
  } catch (error) {
    console.error("❌ Ошибка отправки:", error);
    sendToEmail(emailData); // Фолбэк на mailto
  }
}

// Показать уведомление
function showNotification(text, type = "info") {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;

  notification.textContent = text;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      notification.parentNode?.removeChild(notification);
    }, 300);
  }, 3000);
}

// Добавляем CSS анимации
(function addStyles() {
  if (document.getElementById("quick-select-styles")) return;

  const style = document.createElement("style");
  style.id = "quick-select-styles";
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in {
      animation: fadeInUp 0.3s ease forwards;
    }
  `;

  document.head.appendChild(style);
})();

// Остальные функции остаются без изменений...
