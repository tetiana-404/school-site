// import necessary modules
const fs = require("fs");
const path = require("path");
const { Sequelize, Op } = require("sequelize");
const { Post } = require("./models"); // твоя модель Post

// Шляхи
const JSON_FILE = path.join(__dirname, "news_after_2025.json");
const IMAGES_FOLDER = path.join(__dirname, "..", "client", "Images");

// Функція для заміни URL зображень на локальні шляхи
function replaceImageUrls(htmlContent) {
  return htmlContent.replace(/<img\s+src="([^"]+)"/g, (match, src) => {
    const filename = src.split("/").pop(); // беремо ім'я файлу
    const localPath = path.join(IMAGES_FOLDER, filename).replace(/\\/g, "/");
    return `<img src="${localPath}"`;
  });
}

async function importNews() {
  try {
    const data = fs.readFileSync(JSON_FILE, "utf-8");
    const newsList = JSON.parse(data);

    for (const post of newsList) {
      const title = post.title || "Без заголовка";
      let content = post.full_text || "";
      content = replaceImageUrls(content);
      const updatedAt = post.updateDate || new Date();
      const userId = 1; // можна підставити свого користувача

      // Створюємо запис у БД
      await Post.create({
        title,
        content,
        userId,
        updatedAt,
      });

      console.log(`✅ Додано пост: ${title}`);
    }

    console.log("🎉 Усі новини успішно імпортовані!");
  } catch (err) {
    console.error("❌ Помилка імпорту:", err);
  }
}

importNews();
