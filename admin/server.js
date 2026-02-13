const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname)));

// Путь к папке с данными
const dataPath = path.join(__dirname, "../data");

// Создаем папку data, если её нет
async function ensureDataFolder() {
  try {
    await fs.mkdir(dataPath, { recursive: true });
    console.log(`✅ Папка данных: ${dataPath}`);
  } catch (error) {
    console.error("❌ Ошибка создания папки:", error);
  }
}

// Инициализация JSON файлов
async function initializeDataFiles() {
  const files = ["services.json", "products.json", "pages.json"];

  for (const file of files) {
    const filePath = path.join(dataPath, file);
    try {
      await fs.access(filePath);
      console.log(`✅ Файл существует: ${file}`);
    } catch {
      // Файл не существует, создаем с пустым массивом
      await fs.writeFile(filePath, JSON.stringify([], null, 2));
      console.log(`📄 Создан файл: ${file}`);
    }
  }
}

// ============== API МАРШРУТЫ ==============

// ПОЛУЧИТЬ все данные
app.get("/api/all", async (req, res) => {
  try {
    const [services, products, pages] = await Promise.all([
      fs
        .readFile(path.join(dataPath, "services.json"), "utf8")
        .then(JSON.parse)
        .catch(() => []),
      fs
        .readFile(path.join(dataPath, "products.json"), "utf8")
        .then(JSON.parse)
        .catch(() => []),
      fs
        .readFile(path.join(dataPath, "pages.json"), "utf8")
        .then(JSON.parse)
        .catch(() => []),
    ]);

    res.json({ services, products, pages });
  } catch (error) {
    console.error("❌ Ошибка загрузки всех данных:", error);
    res.status(500).json({ error: error.message });
  }
});

// ПОЛУЧИТЬ данные по типу
app.get("/api/:type", async (req, res) => {
  try {
    const type = req.params.type;

    // Разрешенные типы
    if (!["services", "products", "pages"].includes(type)) {
      return res.status(400).json({ error: "Неверный тип данных" });
    }

    const filePath = path.join(dataPath, `${type}.json`);
    const data = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.log(
      `📭 Файл ${req.params.type}.json не найден, возвращаем пустой массив`,
    );
    res.json([]);
  }
});

// СОХРАНИТЬ данные по типу
app.post("/api/:type", async (req, res) => {
  try {
    const type = req.params.type;
    console.log(`\n=== СОХРАНЕНИЕ ${type.toUpperCase()} ===`);

    // Разрешенные типы
    if (!["services", "products", "pages"].includes(type)) {
      return res.status(400).json({ error: "Неверный тип данных" });
    }

    const filePath = path.join(dataPath, `${type}.json`);
    console.log("📁 Путь к файлу:", filePath);

    // Убеждаемся что папка существует
    await fs.mkdir(dataPath, { recursive: true });

    // Сохраняем данные
    const dataToSave = JSON.stringify(req.body, null, 2);
    await fs.writeFile(filePath, dataToSave, "utf8");

    console.log(`✅ Сохранено ${req.body.length} записей в ${type}.json`);

    res.json({
      success: true,
      message: `Сохранено ${req.body.length} записей`,
      type: type,
      count: req.body.length,
    });
  } catch (error) {
    console.error("❌ Ошибка сохранения:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ДАННЫЕ ДЛЯ САЙТА (с кэшированием)
app.get("/api/site/services", async (req, res) => {
  try {
    const filePath = path.join(dataPath, "services.json");
    const data = await fs.readFile(filePath, "utf8");
    const services = JSON.parse(data);

    // Добавляем заголовки кэширования
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 минут
    res.setHeader("Content-Type", "application/json");
    res.json(services);
  } catch (error) {
    console.error("❌ Ошибка загрузки услуг для сайта:", error);
    res.status(500).json([]);
  }
});

// ПОЛУЧИТЬ конкретную услугу по ID
app.get("/api/services/:id", async (req, res) => {
  try {
    const filePath = path.join(dataPath, "services.json");
    const data = await fs.readFile(filePath, "utf8");
    const services = JSON.parse(data);

    const service = services.find((s) => s.id == req.params.id);

    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Услуга не найдена" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// УДАЛИТЬ услугу
app.delete("/api/services/:id", async (req, res) => {
  try {
    const filePath = path.join(dataPath, "services.json");
    const data = await fs.readFile(filePath, "utf8");
    const services = JSON.parse(data);

    const filteredServices = services.filter((s) => s.id != req.params.id);

    await fs.writeFile(filePath, JSON.stringify(filteredServices, null, 2));

    res.json({
      success: true,
      message: "Услуга удалена",
      count: filteredServices.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============== СТАТИЧЕСКИЕ ФАЙЛЫ ==============

// Главная страница админки
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// CSS для админки
app.get("/admin.css", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.css"));
});

// JS для админки
app.get("/admin.js", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.js"));
});

// ============== ЗАПУСК СЕРВЕРА ==============

async function startServer() {
  await ensureDataFolder();
  await initializeDataFiles();

  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log(`✅ АДМИНКА ЗАПУЩЕНА: http://localhost:${PORT}`);
    console.log("=".repeat(50));
    console.log(`📁 Данные хранятся: ${dataPath}`);
    console.log(`📄 Файлы услуг: services.json`);
    console.log(`📄 Файлы товаров: products.json`);
    console.log(`📄 Файлы страниц: pages.json`);
    console.log("=".repeat(50) + "\n");
  });
}

startServer().catch((error) => {
  console.error("❌ Ошибка запуска сервера:", error);
  process.exit(1);
});
