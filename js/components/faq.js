// faq.js - FAQ аккордеон с защитой от повторной инициализации

// Флаг для отслеживания инициализации
let faqInitialized = false;

export function initFAQ() {
  // Проверяем, не инициализирован ли уже FAQ
  if (faqInitialized) {
    console.log("⚠️ FAQ уже инициализирован, пропускаем...");
    return;
  }

  console.log("📚 Инициализация нового FAQ аккордеона");

  // Ищем элементы
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) {
    console.warn("❌ Элементы FAQ не найдены");
    return;
  }

  console.log(`✅ Найдено ${faqItems.length} элементов`);

  // Инициализируем каждый элемент
  faqItems.forEach((item, index) => {
    setupFAQItem(item, index);
  });

  console.log("🎉 FAQ аккордеон инициализирован");
  faqInitialized = true;
}

function setupFAQItem(item, index) {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (!question || !answer) {
    console.warn(`⚠️ Элемент ${index} пропущен`);
    return;
  }

  // Устанавливаем начальные ARIA атрибуты
  question.setAttribute("aria-expanded", "false");
  answer.setAttribute("aria-hidden", "true");

  // Удаляем старые обработчики (если есть)
  question.removeEventListener("click", handleFAQClick);

  // Добавляем обработчик клика
  question.addEventListener("click", handleFAQClick);

  // Добавляем обработчик клавиатуры
  question.addEventListener("keydown", handleFAQKeydown);

  // Сохраняем ссылку на элемент
  question.dataset.faqIndex = index;

  function handleFAQClick() {
    toggleFAQItem(item);
  }

  function handleFAQKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQItem(item);
    }
  }
}

function toggleFAQItem(clickedItem) {
  // Получаем текущее состояние
  const isActive = clickedItem.classList.contains("active");

  // Закрываем все другие открытые элементы
  if (!isActive) {
    document.querySelectorAll(".faq-item.active").forEach((item) => {
      if (item !== clickedItem) {
        closeFAQItem(item);
      }
    });
  }

  // Переключаем текущий элемент
  if (isActive) {
    closeFAQItem(clickedItem);
  } else {
    openFAQItem(clickedItem);
  }
}

function openFAQItem(item) {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  // Добавляем класс active
  item.classList.add("active");

  // Обновляем ARIA атрибуты
  question.setAttribute("aria-expanded", "true");
  answer.setAttribute("aria-hidden", "false");

  console.log("📖 FAQ открыт");
}

function closeFAQItem(item) {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  // Убираем класс active
  item.classList.remove("active");

  // Обновляем ARIA атрибуты
  question.setAttribute("aria-expanded", "false");
  answer.setAttribute("aria-hidden", "true");

  console.log("📕 FAQ закрыт");
}

// Только одна инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
  if (!window.faqModuleInitialized) {
    setTimeout(() => {
      initFAQ();
      window.faqModuleInitialized = true;
    }, 100);
  }
});
