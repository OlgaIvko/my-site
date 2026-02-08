const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
// Добавьте эти маршруты после существующих
// В admin/server.js

// Получить ВСЕ данные сразу (для удобства)
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
    res.status(500).json({ error: error.message });
  }
});

// Обновить данные
// В admin/server.js обновите обработчик POST:

app.post("/api/:type", async (req, res) => {
  try {
    console.log("=== СОХРАНЕНИЕ ДАННЫХ ===");
    console.log("Тип:", req.params.type);
    console.log("Данные:", JSON.stringify(req.body, null, 2));

    const filePath = path.join(dataPath, `${req.params.type}.json`);
    console.log("Путь к файлу:", filePath);

    // Проверяем существование папки
    await fs.mkdir(dataPath, { recursive: true });

    // Сохраняем данные
    const dataToSave = JSON.stringify(req.body, null, 2);
    await fs.writeFile(filePath, dataToSave, "utf8");

    // Проверяем что сохранилось
    const savedData = await fs.readFile(filePath, "utf8");
    console.log("✅ Сохранено успешно!");
    console.log("Размер файла:", savedData.length, "байт");

    res.json({
      success: true,
      message: `Сохранено ${req.body.length} записей`,
      saved: JSON.parse(savedData).length,
    });
  } catch (error) {
    console.error("❌ Ошибка сохранения:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});

// Получить данные для конкретного блока сайта
app.get("/api/for-site", (req, res) => {
  // Здесь мы будем возвращать данные в формате для вашего сайта
  // Покажите структуру вашего сайта, я подстрою под нее
});

const dataPath = path.join(__dirname, "../data");

// API для данных
app.get("/api/:type", async (req, res) => {
  try {
    const filePath = path.join(dataPath, `${req.params.type}.json`);
    const data = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.json([]);
  }
});

app.post("/api/:type", async (req, res) => {
  try {
    const filePath = path.join(dataPath, `${req.params.type}.json`);
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Админка запущена: http://localhost:${PORT}`);
  console.log(`📁 Данные хранятся в: ${dataPath}`);
});
