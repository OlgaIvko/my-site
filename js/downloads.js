// ========== СКРИПТЫ ДЛЯ СТРАНИЦЫ СКАЧИВАНИЯ ==========
// ВНИМАНИЕ: Все файлы - ТОЛЬКО ШАБЛОНЫ!
// Пользователь заполняет их самостоятельно на своем компьютере

// Скачивание готового DOCX файла (шаблон)
function downloadPrivacyPolicyDocx() {
  // Просто скачиваем готовый файл из папки downloads
  const link = document.createElement("a");
  link.href = "/downloads/privacy-policy.docx";
  link.download = "Политика_конфиденциальности_TerraCode.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification(
    "📄 Шаблон политики скачивается. Заполните его на своем компьютере.",
    "info",
  );
}

// Скачивание готового TXT файла (шаблон)
function downloadPrivacyPolicyTxt() {
  const link = document.createElement("a");
  link.href = "/downloads/privacy-policy.txt";
  link.download = "Политика_конфиденциальности_TerraCode.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification(
    "📃 Шаблон скачивается. Откройте в Блокноте и заполните.",
    "info",
  );
}

// Скачивание формы согласия (шаблон)
function downloadConsentForm() {
  const link = document.createElement("a");
  link.href = "/downloads/consent-form.docx";
  link.download = "Согласие_на_обработку_персональных_данных.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showNotification(
    "✍️ Шаблон согласия скачивается. Распечатайте и заполните от руки.",
    "success",
  );
}

// УДАЛЯЕМ функцию generatePersonalConsent() - она НЕ НУЖНА!
// УДАЛЯЕМ форму с полями ввода - она НЕ НУЖНА!
// Пользователь сам заполняет документ на своем компьютере

// Показать уведомление
function showNotification(message, type = "info") {
  // Удаляем старые уведомления
  const oldNotifications = document.querySelectorAll(".download-notification");
  oldNotifications.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `download-notification ${type}`;
  notification.innerHTML = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideInRight 0.3s reverse";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Инициализация
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 Страница скачивания документов загружена");

  // Добавляем обработчики для всех кнопок скачивания
  const downloadBtns = document.querySelectorAll("[data-download]");
  downloadBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      console.log(`📥 Скачивание: ${this.dataset.download}`);
    });
  });
});
// ========== СКРИПТЫ ДЛЯ СТРАНИЦЫ СКАЧИВАНИЯ ==========

// Генерация и скачивание DOCX файла с политикой
function downloadPrivacyPolicyDocx() {
  const content = generatePolicyText();
  downloadFile(
    content,
    "Политика_конфиденциальности_TerraCode.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  showNotification("📄 Скачивание документа началось...", "info");
}

// Генерация и скачивание TXT файла
function downloadPrivacyPolicyTxt() {
  const content = generatePolicyTextShort();
  downloadFile(
    content,
    "Политика_конфиденциальности_TerraCode.txt",
    "text/plain",
  );
  showNotification("📃 Текстовый файл скачивается...", "info");
}

// Генерация полного текста политики
function generatePolicyText() {
  const today = new Date().toLocaleDateString("ru-RU");

  return `ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
ООО «TerraCode»

г. Липецк                                            «${today}»

1. ОБЩИЕ ПОЛОЖЕНИЯ

1.1. Настоящая Политика обработки персональных данных (далее – Политика)
разработана в соответствии с Федеральным законом от 27.07.2006. №152-ФЗ
«О персональных данных» (далее – Закон о персональных данных).

1.2. Настоящая Политика определяет порядок обработки персональных данных
и меры по обеспечению безопасности персональных данных, предпринимаемые
ООО «TerraCode» (ИНН 4826123456, ОГРН 1234800012345, адрес: г. Липецк,
ул. Гагарина, д. 93) (далее – Оператор).

... (здесь полный текст политики из предыдущего сообщения) ...

12. КОНТАКТНАЯ ИНФОРМАЦИЯ

12.1. Наименование: Общество с ограниченной ответственностью «TerraCode»
12.2. Юридический адрес: 398001, Российская Федерация, г. Липецк, ул. Гагарина, д. 93
12.3. ИНН/КПП: 4826123456 / 482601001
12.4. ОГРН: 1234800012345
12.5. Телефон: +7 (999) 700-57-98
12.6. Email: info@terracode.ru
12.7. Email для запросов по персональным данным: privacy@terracode.ru

---

ПРИЛОЖЕНИЕ №1
СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ

Я, ___________________________________________________________,
паспорт: серия ______ номер __________, выдан _________________________
______________________________________ «____» ______________ ____ г.,
адрес регистрации: __________________________________________________,
номер телефона: ____________________________________________________,
адрес электронной почты: ___________________________________________,

даю согласие ООО «TerraCode» на обработку моих персональных данных.

Подпись: _____________
Дата: «___» __________ 20___ г.`;
}

// Сокращенная версия для TXT
function generatePolicyTextShort() {
  return `ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ TERACODE

ООО "TerraCode"
Адрес: г. Липецк, ул. Гагарина, д. 93
Телефон: +7 (999) 700-57-98
Email: info@terracode.ru

Полная версия документа доступна на сайте:
https://terracode.ru/privacy-policy

Дата публикации: ${new Date().toLocaleDateString("ru-RU")}`;
}

// Генерация формы согласия
function downloadConsentForm() {
  const today = new Date().toLocaleDateString("ru-RU");
  const content = `СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ

Я, ___________________________________________________________________,
паспорт: серия _____ номер ______, выдан ______________________________
______________________________________ "${today}" г.,
адрес регистрации: ___________________________________________________,
номер телефона: ______________________,
адрес электронной почты: _____________________________________________,

даю согласие Обществу с ограниченной ответственностью «TerraCode»
(ИНН 4826123456, ОГРН 1234800012345) на обработку моих персональных
данных в соответствии с Политикой конфиденциальности, размещенной на
сайте https://terracode.ru/privacy-policy.

Согласие действует с даты подписания до достижения целей обработки
либо до отзыва согласия.

Подпись: _____________
Дата: «___» __________ 20___ г.`;

  downloadFile(
    content,
    "Согласие_на_обработку_персональных_данных.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  showNotification("✍️ Форма согласия скачивается...", "success");
}

// Персонализированная форма согласия
function generatePersonalConsent() {
  // Получаем данные из формы
  const name =
    document.getElementById("consent-name")?.value || "____________________";
  const passport =
    document.getElementById("consent-passport")?.value || "_____ ______";
  const issued =
    document.getElementById("consent-issued")?.value || "________________";
  const date =
    document.getElementById("consent-date")?.value ||
    new Date().toISOString().split("T")[0];
  const address =
    document.getElementById("consent-address")?.value || "________________";
  const phone =
    document.getElementById("consent-phone")?.value || "________________";
  const email =
    document.getElementById("consent-email")?.value || "________________";

  // Форматируем дату
  const formattedDate = date.split("-").reverse().join(".");
  const today = new Date().toLocaleDateString("ru-RU");

  const content = `СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ

Я, ${name},
паспорт: серия ${passport}, выдан ${issued}
"${formattedDate}" г.,
адрес регистрации: ${address},
номер телефона: ${phone},
адрес электронной почты: ${email},

даю согласие Обществу с ограниченной ответственностью «TerraCode»
(ИНН 4826123456, ОГРН 1234800012345, адрес: г. Липецк, ул. Гагарина, д. 93)
на обработку моих персональных данных на следующих условиях:

1. Цель обработки: рассмотрение обращения, расчет стоимости услуг,
   заключение и исполнение договора.

2. Перечень обрабатываемых данных: фамилия, имя, отчество; контактные
   телефоны; адрес электронной почты; паспортные данные; адрес регистрации.

3. Способы обработки: сбор, запись, систематизация, накопление, хранение,
   уточнение, использование, передача (только для исполнения договора),
   обезличивание, блокирование, удаление, уничтожение.

4. Согласие действует с даты подписания до достижения целей обработки
   либо до отзыва согласия.

5. Согласие может быть отозвано путем направления письменного заявления
   по адресу: 398001, г. Липецк, ул. Гагарина, д. 93, или по электронной
   почте: privacy@terracode.ru.

6. Подтверждаю, что ознакомлен(а) с Политикой обработки персональных данных
   ООО «TerraCode», размещенной на сайте https://terracode.ru/privacy-policy.

Подпись: _____________
Дата: «${today}»

---
* Заполните документ, распечатайте и подпишите.`;

  downloadFile(
    content,
    `Согласие_${name.replace(/\s+/g, "_")}.docx`,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  );
  showNotification("✅ Персонализированное согласие сформировано!", "success");
}

// Универсальная функция скачивания файла
function downloadFile(content, filename, type) {
  // Показываем прогресс
  showProgress();

  setTimeout(() => {
    const blob = new Blob([content], { type: type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Скрываем прогресс
    hideProgress();
  }, 500);
}

// Показать прогресс-бар
function showProgress() {
  let progressBar = document.querySelector(".download-progress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.className = "download-progress";
    progressBar.innerHTML =
      '<div class="download-progress__bar" style="width: 0%"></div>';
    document.body.appendChild(progressBar);
  }

  const bar = progressBar.querySelector(".download-progress__bar");
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        progressBar.remove();
      }, 500);
    } else {
      width += 20;
      bar.style.width = width + "%";
    }
  }, 100);
}

// Скрыть прогресс
function hideProgress() {
  const progressBar = document.querySelector(".download-progress");
  if (progressBar) {
    setTimeout(() => {
      progressBar.remove();
    }, 300);
  }
}

// Показать уведомление
function showNotification(message, type = "info") {
  // Удаляем старые уведомления
  const oldNotifications = document.querySelectorAll(".download-notification");
  oldNotifications.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `download-notification ${type}`;
  notification.innerHTML = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideInRight 0.3s reverse";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Валидация формы
function validateConsentForm() {
  const name = document.getElementById("consent-name")?.value;
  const passport = document.getElementById("consent-passport")?.value;
  const checkbox = document.getElementById("consent-checkbox")?.checked;

  if (!name || name.length < 2) {
    showNotification("⚠️ Пожалуйста, введите ФИО", "error");
    return false;
  }

  if (!passport || passport.length < 10) {
    showNotification("⚠️ Пожалуйста, введите паспортные данные", "error");
    return false;
  }

  if (!checkbox) {
    showNotification("⚠️ Необходимо согласие на обработку данных", "error");
    return false;
  }

  return true;
}

// Инициализация страницы
document.addEventListener("DOMContentLoaded", function () {
  console.log("📄 Страница скачивания документов загружена");

  // Добавляем обработчики для всех кнопок скачивания
  const downloadButtons = document.querySelectorAll("[data-download]");
  downloadButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const type = this.dataset.download;

      // Аналитика (если нужна)
      if (typeof gtag !== "undefined") {
        gtag("event", "download", {
          event_category: "document",
          event_label: type,
        });
      }

      console.log(`📥 Скачивание: ${type}`);
    });
  });

  // Добавляем анимацию для карточек
  const cards = document.querySelectorAll(".download-card");
  cards.forEach((card, index) => {
    card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
    card.style.opacity = "0";
  });
});

// Анимация появления
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
