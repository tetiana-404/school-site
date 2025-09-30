const fs = require("fs");
const path = require("path");
const { Post } = require("./models");
const { sequelize } = require("./models");

async function importNews() {
  try {
    const dataPath = path.join(__dirname, "news_after_2025.json"); // твій JSON
    const raw = fs.readFileSync(dataPath, "utf8");
    const newsArray = JSON.parse(raw);

    // Очищення таблиці і скидання лічильника ID
    await Post.destroy({ where: {} });
    await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Posts';");
    console.log("🗑️ Таблицю Posts очищено і лічильник ID скинуто!");

    // Підготовка даних
    const postsData = newsArray.map(news => {
      const dateParts = news.updateDate.split("."); // "19.09.2025"
      const updateDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      return {
        title: news.title,
        content: news.content,
        userId: 1,
        createdAt: updateDate,
        updatedAt: updateDate
      };
    });

    // Масовий імпорт
    await Post.bulkCreate(postsData, { fields: ["title", "content", "userId", "createdAt", "updatedAt"] });

    console.log(`✅ Імпорт завершено! Додано ${postsData.length} записів.`);
    await sequelize.close();
  } catch (err) {
    console.error("❌ Помилка імпорту:", err);
  }
}

importNews();
