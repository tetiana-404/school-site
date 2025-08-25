const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("dotenv").config();
const { Post } = require("./models"); // ваша модель Sequelize

const JSON_FILE = path.join(__dirname, "downloaded_news/yevshan_news.json");
const IMAGES_DIR = path.join(__dirname, "uploads/images"); // папка для збереження зображень
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// URL бекенду з .env
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// Функція завантаження зображення
async function downloadImage(url) {
  try {
    const filename = path.basename(url);
    const filepath = path.join(IMAGES_DIR, filename);

    if (!fs.existsSync(filepath)) {
      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });
      console.log(`✔ Завантажено: ${filename}`);
    }

    return filename;
  } catch (err) {
    console.error(`⚠ Помилка при завантаженні ${url}: ${err.message}`);
    return null;
  }
}

function parseDateDMY(dateStr) {
  const [day, month, year] = dateStr.split(".");
  return new Date(`${year}-${month}-${day}`); // формат ISO
}

// Основна функція імпорту
async function importNews() {
  const data = JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));
  console.log(`${process.env.REACT_APP_BACKEND_URL}`)
  for (const news of data) {
    try {
      let contentWithImages = news.full_text;

      // Додаємо теги <img> для кожного зображення
      if (news.images && news.images.length) {
        for (const imgUrl of news.images) {
          const filename = await downloadImage(imgUrl);
          if (filename) {
            contentWithImages += `<br><img src="${BACKEND_URL}/uploads/images/${filename}" alt="${news.title}">`;
          }
        }
      }

      // створюємо запис у Post
      await Post.create({
        id: news.id,
        title: news.title,
        content: contentWithImages,
        updatedAt: parseDateDMY(news.date),
        userId: 1, // дефолтний користувач
      });

      console.log(`✅ Імпортовано новину: ${news.title}`);
    } catch (err) {
      console.error(`⚠ Помилка при імпорті новини "${news.title}": ${err.message}`);
    }
  }

  console.log("✅ Імпорт усіх новин завершено!");
}


// Запускаємо
importNews();
