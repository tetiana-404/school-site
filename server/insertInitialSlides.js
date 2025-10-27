require("dotenv").config();
const { sequelize, HomeSlider } = require("./models");

const initialSlides = [
  {
    image: "/img/1.jpg",
    title: "Нові горизонти знань",
    subtitle: "Якісне навчання",
    text: "Ми створюємо освітнє середовище, де знання стають основою впевненого майбутнього.",
  },
  {
    image: "/img/11.png",
    title: "Простір для зростання",
    subtitle: "Комфортне навчальне середовище",
    text: "Ми дбаємо про затишок і безпеку, щоб кожна дитина навчалася з радістю та натхненням.",
  },
  {
    image: "/img/6.jpg",
    title: "Відкритий світ можливостей",
    subtitle: "Участь у конкурсах і проєктах",
    text: "Наші учні реалізовують свій потенціал у творчих проєктах, олімпіадах і змаганнях — впевнено крокуючи до успіху.",
  },
  {
    image: "/img/7.jpeg",
    title: "Навчання з натхненням",
    subtitle: "Яскраве шкільне життя",
    text: "Ми поєднуємо навчання з активним і пізнавальним дозвіллям, щоб кожен день у школі був захопливим та пам’ятним.",
  },
  {
    image: "/img/teachers.jpg",
    title: "Професіоналізм і турбота",
    subtitle: "Вчителі, які надихають",
    text: "Наші педагоги — це досвідчені й віддані своїй справі наставники, які допомагають дітям розкривати свій потенціал та впевнено крокувати до успіху",
  },
];

const insertSlides = async () => {
  try {
    await sequelize.sync();

    const count = await HomeSlider.count();
    if (count === 0) {
      await HomeSlider.bulkCreate(initialSlides);
      console.log("✅ Initial slides inserted successfully.");
    } else {
      console.log("ℹ️ Slides already exist, nothing inserted.");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Failed to insert initial slides:", err);
    process.exit(1);
  }
};

insertSlides();
