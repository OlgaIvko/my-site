// js/components/goals-selector.js

export function initGoalsSelector() {
  console.log("🎯 Инициализация выбора целей");

  // Проверяем, есть ли блок выбора целей на странице
  const goalsContainer = document.querySelector(".goals-selector");
  if (!goalsContainer) {
    console.log("Блок выбора целей не найден, пропускаем");
    return;
  }

  const goalCards = document.querySelectorAll(".goal-card");
  const resetBtn = document.getElementById("reset-goals");
  const applyBtn = document.getElementById("apply-goals");
  const selectedList = document.getElementById("selected-goals-list");

  let selectedGoals = new Set();

  // 1. Обработчик кликов по карточкам целей
  goalCards.forEach((card) => {
    card.addEventListener("click", function () {
      const goal = this.dataset.goal;

      if (goal === "all") {
        // Если кликнули на "Все", очищаем остальные
        selectedGoals.clear();
        goalCards.forEach((c) => c.classList.remove("selected"));

        if (!this.classList.contains("selected")) {
          this.classList.add("selected");
          selectedGoals.add("all");
        }
      } else {
        // Убираем "Все" если выбран конкретный вариант
        const allCard = document.querySelector('.goal-card[data-goal="all"]');
        if (allCard) {
          allCard.classList.remove("selected");
          selectedGoals.delete("all");
        }

        // Переключаем выбранную цель
        if (this.classList.contains("selected")) {
          this.classList.remove("selected");
          selectedGoals.delete(goal);
        } else {
          this.classList.add("selected");
          selectedGoals.add(goal);
        }
      }

      updateSelectedList();
      updateSelectedCount();
    });
  });

  // 2. Кнопка сброса
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      goalCards.forEach((card) => card.classList.remove("selected"));
      selectedGoals.clear();
      updateSelectedList();
      updateSelectedCount();
    });
  }

  // 3. Кнопка применения
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      if (selectedGoals.size === 0) {
        showMessage("Выберите хотя бы одну цель", "warning");
        return;
      }

      const serviceTypes = getServiceTypesFromGoals(Array.from(selectedGoals));
      applyServiceFilter(serviceTypes);

      // Плавная прокрутка к услугам
      const servicesSection = document.querySelector(".catalog__list");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // 4. Функция обновления списка выбранных
  function updateSelectedList() {
    if (!selectedList) return;

    selectedList.innerHTML = "";

    selectedGoals.forEach((goal) => {
      const goalCard = document.querySelector(
        `.goal-card[data-goal="${goal}"]`,
      );
      if (goalCard) {
        const goalName = goalCard.querySelector(".goal-title").textContent;
        const item = document.createElement("div");
        item.className = "selected-goal-item";
        item.style.cssText = `
          background: #eff6ff;
          color: #1d4ed8;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 4px;
        `;

        item.innerHTML = `
          ${goalName}
          <button class="remove-goal"
                  data-goal="${goal}"
                  style="background:none; border:none; color:#666; cursor:pointer; font-size:18px; padding:0; width:20px; height:20px; display:flex; align-items:center; justify-content:center;">
            ×
          </button>
        `;

        selectedList.appendChild(item);
      }
    });

    // Обработчики удаления
    document.querySelectorAll(".remove-goal").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const goal = this.dataset.goal;
        selectedGoals.delete(goal);
        document
          .querySelector(`.goal-card[data-goal="${goal}"]`)
          ?.classList.remove("selected");
        updateSelectedList();
        updateSelectedCount();
      });
    });
  }

  // 5. Обновление счетчика
  function updateSelectedCount() {
    const countElement = document.querySelector(".selected-count strong");
    if (countElement) {
      countElement.textContent = selectedGoals.size;
    }
  }

  // 6. Преобразование целей в типы услуг
  function getServiceTypesFromGoals(goals) {
    const goalToServiceMap = {
      launch: ["landing"],
      sales: ["shop", "landing"],
      brand: ["corporate", "landing"],
      mobile: ["mobile"],
      support: ["support"],
      all: ["landing", "shop", "corporate", "mobile", "support"],
    };

    let serviceTypes = [];
    goals.forEach((goal) => {
      if (goalToServiceMap[goal]) {
        serviceTypes.push(...goalToServiceMap[goal]);
      }
    });

    // Убираем дубликаты
    return [...new Set(serviceTypes)];
  }

  // 7. Применение фильтра услуг
  function applyServiceFilter(serviceTypes) {
    console.log("Применяем фильтр для типов услуг:", serviceTypes);

    // Снимаем все старые чекбоксы
    const allCheckboxes = document.querySelectorAll('input[name="type"]');
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Ставим нужные чекбоксы
    serviceTypes.forEach((type) => {
      const checkbox = document.querySelector(
        `input[name="type"][value="${type}"]`,
      );
      if (checkbox) {
        checkbox.checked = true;
      }
    });

    // Выбираем "Все услуги" в статусе
    const allRadio = document.querySelector(
      'input[name="status"][value="all"]',
    );
    if (allRadio) allRadio.checked = true;

    // Триггерим событие изменения фильтров
    const filterForm = document.querySelector(".catalog-form");
    if (filterForm) {
      const changeEvent = new Event("change", { bubbles: true });
      filterForm.dispatchEvent(changeEvent);
    }

    showMessage(
      `Показаны услуги для ${selectedGoals.size} выбранных целей`,
      "success",
    );
  }

  // 8. Всплывающие сообщения
  function showMessage(text, type) {
    // Удаляем старое сообщение
    const oldMessage = document.querySelector(".goal-message");
    if (oldMessage) oldMessage.remove();

    const message = document.createElement("div");
    message.className = `goal-message goal-message--${type}`;
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      background: ${type === "success" ? "#10b981" : "#f59e0b"};
      color: white;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    message.textContent = text;
    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = "slideOut 0.3s ease";
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  // Добавляем CSS анимации
  if (!document.querySelector("#goals-animations")) {
    const style = document.createElement("style");
    style.id = "goals-animations";
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
      }
      .goal-card {
        transition: all 0.3s ease;
      }
      .goal-card.selected {
        transform: scale(1.02);
      }
    `;
    document.head.appendChild(style);
  }

  console.log("✅ Выбор целей инициализирован");
}
