require('dotenv').config({ path: '../.env' });
const express = require("express");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize, User, Post, Document, Comment, HomeAbout, HomeSlider, HomeCounter, HomeMeta, TeamMember, AboutInfo } = require("./models");
const { HomeAboutPage, HomeAboutCounter, HomeHistory, HomeDocuments, HomeAnthem, HomeStrategy, HomeReports, HomeTeachers, HomeWorkPlan } = require('./models');
const { RegDocuments, InternalDocument, Area, Language, Facilities, Services, FamilyEducation, Rules, Instructions, Bullying, Programs, Certifications, Criteria } = require('./models');
const { SchoolRating, SchoolMedals, Olympiads } = require('./models');
const { SchoolBells, SchoolTimetable, SchoolClubsTimetable, Donations } = require('./models');
const { Admission, Finance, Contact } = require('./models');

const app = express();
app.use(express.json({ limit: "10mb" })); // Default is 100kb, now increased to 50MB
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const upload = multer({ dest: "uploads/" });



// Enable CORS for all origins (you can specify specific origins if needed)
app.use(cors());

// Створення відповідних директорій для медіа
const createFolderIfNotExist = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

const cyrillicToLatin = (str) => {
  return str
    .replace(/а/g, "a").replace(/б/g, "b").replace(/в/g, "v").replace(/г/g, "h")
    .replace(/ґ/g, "g").replace(/д/g, "d").replace(/е/g, "e").replace(/є/g, "ie")
    .replace(/ж/g, "zh").replace(/з/g, "z").replace(/и/g, "y").replace(/і/g, "i")
    .replace(/ї/g, "i").replace(/й/g, "i").replace(/к/g, "k").replace(/л/g, "l")
    .replace(/м/g, "m").replace(/н/g, "n").replace(/о/g, "o").replace(/п/g, "p")
    .replace(/р/g, "r").replace(/с/g, "s").replace(/т/g, "t").replace(/у/g, "u")
    .replace(/ф/g, "f").replace(/х/g, "kh").replace(/ц/g, "ts").replace(/ч/g, "ch")
    .replace(/ш/g, "sh").replace(/щ/g, "shch").replace(/ь/g, "").replace(/ю/g, "iu")
    .replace(/я/g, "ia")
    .replace(/[^a-z0-9]/gi, '_')  // пробіли, спецсимволи → _
    .toLowerCase();
};


// Налаштування роута для завантаження файлів
app.post("/api/upload", upload.single("file"), (req, res) => {
  const { type, postId } = req.body;  // Отримуємо тип файлу та постId (якщо є)
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  // Визначаємо директорію для збереження файлу
  let folder;
  if (type === "image") {
    folder = "uploads/images";
  } else if (type === "video") {
    folder = "uploads/videos";
  } else if (type === "document") {
    folder = "uploads/documents";
  }

  createFolderIfNotExist(folder); // Переконуємось, що папка існує

  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const uniqueId = postId || timestamp;  // Використовуємо postId, якщо він є, або timestamp
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `${uniqueId}-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${type}s/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  res.json({ url: fileUrl });
});

// Статична роздача папки uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
      }
    },
  })
);


// 🟢 User Registration
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// 🟢 User Login (JWT Auth)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // ✅ Find user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password valid.")
      return res.status(401).json({ message: "Password incorrect" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } }); // Send the token to the client

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Middleware to Verify JWT Token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 🟢 CRUD Operations for Posts
app.get("/posts", async (req, res) => {
  try {
    const { search } = req.query;

    // Побудова where умови
    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },   // або iLike, якщо Postgres
          { content: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const posts = await Post.findAll({
      where,
      order: [["updatedAt", "DESC"]],
    });

    res.json({ posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  // Отримання поста за id з бази даних
  Post.findByPk(postId)
    .then(post => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

app.post("/posts", authenticateToken, async (req, res) => {
  const { title, content, updatedAt } = req.body;

  const post = await Post.create({ title, content, userId: req.user.id, updatedAt: updatedAt || new Date(), });
  res.status(201).json(post);
});

app.put("/posts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, updatedAt } = req.body;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Пост не знайдено" });
    }

    // Перевіряємо, чи користувач має право редагувати
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: "Ви не маєте права редагувати цей пост" });
    }

    post.title = title;
    post.content = content;
    post.updatedAt = updatedAt || new Date();

    await post.save();

    res.json(post);
  } catch (error) {
    console.error("❌ Помилка оновлення поста:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.delete("/posts/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    // Шукаємо пост за ID
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Пост не знайдено" });
    }

    // Перевіряємо, чи авторизований користувач є власником поста
    //if (post.userId !== req.user.userId) {
    //return res.status(403).json({ error: "Ви не маєте прав видаляти цей пост" });
    //}

    // Видаляємо пост
    await post.destroy();
    console.log('Пост видалено:', post)
    res.json({ message: "Пост видалено" });
  } catch (error) {
    console.error("Помилка видалення поста:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.get("/posts/:year", async (req, res) => {
  const { year } = req.params;
  const { page = 1, limit = 15 } = req.query;

  const offset = (page - 1) * limit;

  const { rows, count } = await Post.findAndCountAll({
    where: sequelize.where(
      sequelize.fn("YEAR", sequelize.col("createdAt")),
      year
    ),
    order: [["updatedAt", "DESC"]],
    offset,
    limit: parseInt(limit),
  });

  res.json({
    news: rows,
    total: count,
    page: parseInt(page),
    totalPages: Math.ceil(count / limit),
  });
});

// 🟢 CRUD Operations for Documents
app.get("/documents", async (req, res) => {
  const documents = await Document.findAll({ include: User });
  res.json(documents);
});

app.post("/documents", authenticateToken, async (req, res) => {
  const { name, url } = req.body;
  const document = await Document.create({ name, url, userId: req.user.userId });
  res.status(201).json(document);
});

// 🟢 CRUD Operations for Comments
app.post("/comments", authenticateToken, async (req, res) => {
  const { content, postId } = req.body;
  const comment = await Comment.create({ content, userId: req.user.userId, postId });
  res.status(201).json(comment);
});

// 🏫 GET /api/home_about — Отримати дані
app.get('/api/home_about', async (req, res) => {
  try {
    let about = await HomeAbout.findOne();
    if (!about) {
      // Якщо запису ще немає — створюємо з порожніми значеннями
      about = await HomeAbout.create({
        title: '',
        content: '',
        subText: '',
      });
    }
    res.json(about);
  } catch (err) {
    console.error('GET /api/home_about error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✏️ PUT /api/home_about — Оновити дані
app.put('/api/home_about', async (req, res) => {
  const { title, content, subText, image } = req.body;
  try {
    let about = await HomeAbout.findOne();
    if (!about) {
      about = await HomeAbout.create({ title, content, subText });
    } else {
      about.title = title;
      about.content = content;
      about.subText = subText;
      await about.save();
    }
    res.json(about);
  } catch (err) {
    console.error('PUT /api/home_about error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get("/api/home_sliders", async (req, res) => {
  const sliders = await HomeSlider.findAll({ order: [["createdAt", "ASC"]] });
  res.json(sliders);
});

// Додати слайд
app.post("/api/home_sliders", async (req, res) => {
  const { image, title, subtitle, text } = req.body;
  const slider = await HomeSlider.create({ image, title, subtitle, text });
  res.status(201).json(slider);
});

// Оновити слайд
app.put("/api/home_sliders/:id", async (req, res) => {
  const { id } = req.params;
  const { image, title, subtitle, text } = req.body;
  const slider = await HomeSlider.findByPk(id);
  if (!slider) return res.status(404).json({ error: "Слайд не знайдено" });

  slider.image = image;
  slider.title = title;
  slider.subtitle = subtitle;
  slider.text = text;
  await slider.save();
  res.json(slider);
});

// Видалити слайд
app.delete("/api/home_sliders/:id", async (req, res) => {
  const { id } = req.params;
  const slider = await HomeSlider.findByPk(id);
  if (!slider) return res.status(404).json({ error: "Слайд не знайдено" });

  await slider.destroy();
  res.json({ message: "Слайд видалено" });
});

// GET all counters
app.get('/api/counters', async (req, res) => {
  const counters = await HomeCounter.findAll();
  res.json(counters);
});

// PUT all counters
app.put('/api/counters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const counter = await HomeCounter.findByPk(id);
    if (!counter) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    await counter.update(req.body);
    res.json(counter);
  } catch (err) {
    console.error('❌ Failed to update counter:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// GET subtitle
app.get('/api/home-meta', async (req, res) => {
  let meta = await HomeMeta.findOne();

  if (!meta) {
    meta = await HomeMeta.create({
      subtitle: 'Наші досягнення за 2023 - 2024 навчальний рік'
    });
  }

  res.json({ subtitle: meta?.subtitle || '' });
});

// PUT subtitle
app.put('/api/home-meta', async (req, res) => {
  try {
    const { subtitle } = req.body;

    let meta = await HomeMeta.findOne();
    if (!meta) {
      meta = await HomeMeta.create({ subtitle });
    } else {
      await meta.update({ subtitle });
    }

    res.json(meta);
  } catch (err) {
    console.error('❌ Failed to save subtitle:', err);
    res.status(500).json({ error: 'Subtitle save failed' });
  }
});

// GET all team members
app.get('/api/team-members', async (req, res) => {
  try {
    const members = await TeamMember.findAll({
      where: { isActive: true },
    });
    res.json(members);
  } catch (err) {
    console.error('❌ Failed to get team members:', err);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// PUT update or create team member
app.put('/api/team-members/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const member = await TeamMember.findByPk(id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    await member.update(updateData);
    res.json(member);
  } catch (err) {
    console.error('❌ Error updating team member:', err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// DELETE team member
app.delete('/api/team-members/:id', async (req, res) => {
  try {
    await TeamMember.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Team member deleted' });
  } catch (err) {
    console.error('❌ Failed to delete team member:', err);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// GET — отримати контент "Про школу"
app.get('/api/home_about_page', async (req, res) => {
  try {
    const about = await HomeAboutPage.findOne({ where: { id: 1 } });
    res.json(about);
  } catch (error) {
    console.error('GET /api/home_about_page error:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('Full error object:', error);
    res.status(500).json({ error: 'Помилка при завантаженні розширена.' });
  }
});

// PUT — зберегти / оновити контент
app.put('/api/home_about_page', async (req, res) => {
  try {
    const { content } = req.body;
    let about = await HomeAboutPage.findByPk(1);

    if (about) {
      await about.update({ content });

      //await about.update({ content });
    } else {
      about = await HomeAboutPage.create({ id: 1, content });
    }

    res.json(about);
  } catch (error) {
    console.error('❌ PUT /api/home_about_page error:', error.message, error.stack);
    res.status(500).json({ error: 'Помилка при збереженні.' });
  }
});

// GET
app.get("/contact", async (req, res) => {
  const info = await AboutInfo.findOne({ where: { id: 1 } });
  if (!info) {
    return res.status(404).json({ message: "No info found" });
  }
  res.json(info);
});

// PUT (update)
app.put("/contact", async (req, res) => {
  const { fullName, address, phone, email, schedule, image } = req.body;
  let info = await AboutInfo.findOne({ where: { id: 1 } });
  
  if (info) {
    await info.update({ fullName, address, phone, email, schedule, image });
  } else {
    info = await AboutInfo.create({ fullName, address, contacts: { phone, email }, schedule, image });
  }
  
  res.json(info);
});


app.get('/api/home_counter', async (req, res) => {
  try {
    const counters = await HomeAboutCounter.findAll();
    res.json(counters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch counters' });
  }
});

// PUT — оновити всі лічильники
app.put('/api/home_counter', async (req, res) => {
  const updates = req.body;
  try {
    const updated = [];

    for (const item of updates) {
      const counter = await HomeAboutCounter.findByPk(item.id);
      if (counter) {
        await counter.update({
          value: item.value,
          text: item.text,
        });
        updated.push(counter);
      }
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update counters' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await HomeHistory.findOne();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.put('/api/history', async (req, res) => {
  try {
    const { title, content } = req.body;

    let history = await HomeHistory.findOne();
    if (history) {
      await history.update({ title, content });
    } else {
      history = await HomeHistory.create({ title, content });
    }
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update history' });
  }
});

app.get('/api/documents', async (req, res) => {
  try {
    const docs = await HomeDocuments.findOne({ where: { isActive: 'true' } });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.get('/api/documents/all', async (req, res) => {
  try {
    const documents = await HomeDocuments.findAll();
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST – додати новий документ
app.post('/api/documents', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `doc-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await HomeDocuments.create({ title, file: newFileName, isActive });

  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/documents/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await HomeDocuments.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/documents/:id', async (req, res) => {
  const doc = await HomeDocuments.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/anthem', async (req, res) => {
  try {
    const anthem = await HomeAnthem.findOne();
    res.json(anthem);
  } catch (err) {
    console.error('❌ Error updating anthem:', err);
    res.status(500).json({ error: 'Failed to update anthem' });
  }
});

app.put('/api/anthem', async (req, res) => {
  try {
    const { title, content } = req.body;

    let anthem = await HomeAnthem.findOne();
    if (anthem) {
      await anthem.update({ title, content });
    } else {
      anthem = await HomeAnthem.create({ title, content });
    }
    res.json(anthem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update anthem' });
  }
});

app.get('/api/strategy', async (req, res) => {
  try {
    const strategy = await HomeStrategy.findOne();
    res.json(strategy);
  } catch (err) {
    console.error('❌ Error updating strategy:', err);
    res.status(500).json({ error: 'Failed to update strategy' });
  }
});

app.put('/api/strategy', async (req, res) => {
  try {
    const { title, content } = req.body;

    let strategy = await HomeStrategy.findOne();
    if (strategy) {
      await strategy.update({ title, content });
    } else {
      strategy = await HomeStrategy.create({ title, content });
    }
    res.json(strategy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update strategy' });
  }
});

app.get('/api/work-plan', async (req, res) => {
  try {
    const workPlan = await HomeWorkPlan.findOne();
    res.json(workPlan);
  } catch (err) {
    console.error('❌ Error updating workPlan:', err);
    res.status(500).json({ error: 'Failed to update workPlan' });
  }
});

app.put('/api/work-plan', async (req, res) => {
  try {
    const { title, content } = req.body;

    let workPlan = await HomeWorkPlan.findOne();
    if (workPlan) {
      await workPlan.update({ title, content });
    } else {
      workPlan = await HomeWorkPlan.create({ title, content });
    }
    res.json(workPlan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workPlan' });
  }
});

// ==================== REPORTS API ====================

// Отримати один активний звіт (якщо треба)
app.get('/api/reports', async (req, res) => {
  try {
    const report = await HomeReports.findOne({ where: { isActive: true } });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Отримати всі звіти
app.get('/api/reports/all', async (req, res) => {
  try {
    const reports = await HomeReports.findAll({ order: [['year', 'DESC']] });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch all reports' });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { year, title, url } = req.body;
    const report = await HomeReports.create({ year, title, url });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.put('/api/reports/:id', async (req, res) => {
  try {
    const { year, title, url } = req.body;
    const report = await HomeReports.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });

    report.year = year;
    report.title = title;
    report.url = url;

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

app.delete('/api/reports/:id', async (req, res) => {
  try {
    const report = await HomeReports.findByPk(req.params.id);
    if (!report) return res.status(404).json({ error: 'Not found' });

    await report.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});


app.get('/api/teachers', async (req, res) => {
  try {
    const teachers = await HomeTeachers.findOne();
    res.json(teachers);
  } catch (err) {
    console.error('❌ Error updating teachers:', err);
    res.status(500).json({ error: 'Failed to update teachers' });
  }
});

app.put('/api/teachers', async (req, res) => {
  try {
    const { title, content } = req.body;

    let teachers = await HomeTeachers.findOne();
    if (teachers) {
      await teachers.update({ title, content });
    } else {
      teachers = await HomeTeachers.create({ title, content });
    }
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update teachers' });
  }
});

app.get('/api/reg-documents', async (req, res) => {
  try {
    const regdocuments = await RegDocuments.findOne();
    res.json(regdocuments);
  } catch (err) {
    console.error('❌ Error updating regdocuments:', err);
    res.status(500).json({ error: 'Failed to update regdocuments' });
  }
});

app.put('/api/reg-documents', async (req, res) => {
  try {
    const { title, content } = req.body;

    let regdocuments = await RegDocuments.findOne();
    if (regdocuments) {
      await regdocuments.update({ title, content });
    } else {
      regdocuments = await RegDocuments.create({ title, content });
    }
    res.json(regdocuments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update regdocuments' });
  }
});

// GET – тільки активні для користувача
app.get('/api/internal-documents', async (req, res) => {
  const docs = await InternalDocument.findAll({ where: { isActive: 'true' } });
  res.json(docs);
});

app.get('/api/internal-documents/all', async (req, res) => {
  try {
    const documents = await InternalDocument.findAll();
    res.json(documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// POST – додати новий документ
app.post('/api/internal-documents', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `doc-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await InternalDocument.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/internal-documents/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await InternalDocument.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/internal-documents/:id', async (req, res) => {
  const doc = await InternalDocument.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/area', async (req, res) => {
  try {
    const area = await Area.findOne();
    res.json(area);
  } catch (err) {
    console.error('❌ Error updating area:', err);
    res.status(500).json({ error: 'Failed to update area' });
  }
});

app.put('/api/area', async (req, res) => {
  try {
    const { title, content } = req.body;

    let area = await Area.findOne();
    if (area) {
      await area.update({ title, content });
    } else {
      area = await Area.create({ title, content });
    }
    res.json(area);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update area' });
  }
});

app.get('/api/language', async (req, res) => {
  try {
    const language = await Language.findOne();
    res.json(language);
  } catch (err) {
    console.error('❌ Error updating language:', err);
    res.status(500).json({ error: 'Failed to update language' });
  }
});

app.put('/api/language', async (req, res) => {
  try {
    const { title, content } = req.body;

    let language = await Language.findOne();
    if (language) {
      await language.update({ title, content });
    } else {
      language = await Language.create({ title, content });
    }
    res.json(language);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update area' });
  }
});

app.get('/api/facilities', async (req, res) => {
  try {
    const facilities = await Facilities.findOne();
    res.json(facilities);
  } catch (err) {
    console.error('❌ Error updating facilities:', err);
    res.status(500).json({ error: 'Failed to update facilities' });
  }
});

app.put('/api/facilities', async (req, res) => {
  try {
    const { title, content } = req.body;

    let facilities = await Facilities.findOne();
    if (facilities) {
      await facilities.update({ title, content });
    } else {
      facilities = await Facilities.create({ title, content });
    }
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update facilities' });
  }
});

app.get('/api/family-education', async (req, res) => {
  try {
    const familyEducation = await FamilyEducation.findAll();
    res.json(familyEducation);
  } catch (err) {
    console.error('❌ Error updating services:', err);
    res.status(500).json({ error: 'Failed to update services' });
  }
});

// POST – додати новий документ
app.post('/api/family-education', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `doc-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await FamilyEducation.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/family-education/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await FamilyEducation.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/family-education/:id', async (req, res) => {
  const doc = await FamilyEducation.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await Services.findAll();
    res.json(services);
  } catch (err) {
    console.error('❌ Error updating services:', err);
    res.status(500).json({ error: 'Failed to update services' });
  }
});

// POST – додати новий документ
app.post('/api/services', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `doc-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await Services.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/services/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await Services.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/services/:id', async (req, res) => {
  const doc = await Services.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});


app.get('/api/rules', async (req, res) => {
  try {
    const rules = await Rules.findAll();
    res.json(rules);
  } catch (err) {
    console.error('❌ Error updating rules:', err);
    res.status(500).json({ error: 'Failed to update rules' });
  }
});

// POST – додати новий документ
app.post('/api/rules', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `rules-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await Rules.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/rules/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await Rules.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/rules/:id', async (req, res) => {
  const doc = await Rules.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/instructions', async (req, res) => {
  try {
    const instructions = await Instructions.findAll();
    res.json(instructions);
  } catch (err) {
    console.error('❌ Error updating instructions:', err);
    res.status(500).json({ error: 'Failed to update instructions' });
  }
});

// POST – додати новий документ
app.post('/api/instructions', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `instr-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await Instructions.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/instructions/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await Instructions.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/instructions/:id', async (req, res) => {
  const doc = await Instructions.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/bullying', async (req, res) => {
  try {
    const bullying = await Bullying.findAll();
    res.json(bullying);
  } catch (err) {
    console.error('❌ Error updating bullying:', err);
    res.status(500).json({ error: 'Failed to update bullying' });
  }
});

// POST – додати новий документ
app.post('/api/bullying', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `doc-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await Bullying.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/bullying/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await Bullying.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/bullying/:id', async (req, res) => {
  const doc = await Bullying.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/programs', async (req, res) => {
  try {
    const programs = await Programs.findAll();
    res.json(programs);
  } catch (err) {
    console.error('❌ Error updating programs:', err);
    res.status(500).json({ error: 'Failed to update programs' });
  }
});

// POST – додати новий документ
app.post('/api/programs', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const baseName = path.basename(file.originalname, fileExtension);
  baseName = cyrillicToLatin(baseName);  // транслітерація
  const newFileName = `${baseName}-${timestamp}${fileExtension}`;

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await Programs.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/programs/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await Programs.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/programs/:id', async (req, res) => {
  const doc = await Programs.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/certifications', async (req, res) => {
  try {
    const certifications = await Certifications.findAll();
    res.json(certifications);
  } catch (err) {
    console.error('❌ Error updating certifications:', err);
    res.status(500).json({ error: 'Failed to update certifications' });
  }
});

// POST – додати новий документ
app.post('/api/certifications', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const baseName = path.basename(file.originalname, fileExtension);
  const newFileName = `${baseName}-${timestamp}${fileExtension}`;

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await Certifications.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/certifications/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await Certifications.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/certifications/:id', async (req, res) => {
  const doc = await Certifications.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/criteria', async (req, res) => {
  try {
    const criteria = await Criteria.findAll();
    res.json(criteria);
  } catch (err) {
    console.error('❌ Error updating criteria:', err);
    res.status(500).json({ error: 'Failed to update criteria' });
  }
});

// POST – додати новий документ
app.post('/api/criteria', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const baseName = path.basename(file.originalname, fileExtension);
  const newFileName = `${baseName}-${timestamp}${fileExtension}`;

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await Criteria.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/criteria/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await Criteria.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/criteria/:id', async (req, res) => {
  const doc = await Criteria.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

// GET all ratings
app.get('/api/school-ratings', async (req, res) => {
  const ratings = await SchoolRating.findAll({ order: [['year', 'DESC']] });
  res.json(ratings);
});

// POST new rating
app.post('/api/school-ratings', async (req, res) => {
  try {
    const newRating = await SchoolRating.create(req.body);
    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create rating' });
  }
});

// PUT update
app.put('/api/school-ratings/:id', async (req, res) => {
  try {
    const rating = await SchoolRating.findByPk(req.params.id);
    if (!rating) return res.status(404).json({ error: 'Not found' });
    await rating.update(req.body);
    res.json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update rating' });
  }
});

app.delete('/api/school-ratings/:id', async (req, res) => {
  try {
    const rating = await SchoolRating.findByPk(req.params.id);
    if (!rating) return res.status(404).json({ error: 'Not found' });
    await rating.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete rating' });
  }
});

// Отримати всі роки в порядку спадання
app.get('/api/school-medals', async (req, res) => {
  try {
    const medals = await SchoolMedals.findAll({
      order: [['year', 'DESC']],
    });
    res.json(medals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Додати новий запис
app.post('/api/school-medals', async (req, res) => {
  try {
    const { year, gold, silver } = req.body;
    const newEntry = await SchoolMedals.create({ year, gold, silver });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: 'Could not create entry', details: err });
  }
});

// Оновити запис
app.put('/api/school-medals/:id', async (req, res) => {
  try {
    const { gold, silver } = req.body;
    const updated = await SchoolMedals.update(
      { gold, silver },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Could not update', details: err });
  }
});

app.put('/api/school-medals/:year', async (req, res) => {
  const { year } = req.params;
  const { newYear, gold, silver } = req.body;

  const entry = await SchoolMedals.findOne({ where: { year } });
  if (!entry) return res.status(404).json({ error: 'Not found' });

  // Оновлюємо поля
  entry.year = newYear || entry.year;
  entry.gold = gold || entry.gold;
  entry.silver = silver || entry.silver;
  await entry.save();

  res.json(entry);
});

// Видалити запис
app.delete('/api/school-medals/:id', async (req, res) => {
  try {
    await SchoolMedals.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete', details: err });
  }
});

// Отримати всі роки в порядку спадання
app.get('/api/olympiads', async (req, res) => {
  try {
    const winner = await Olympiads.findAll({
      order: [['year', 'DESC']],
    });
    console.log('✅ Winners found:', winner);
    res.json(winner);
  } catch (err) {
    console.error('❌ Error in /api/olympiads:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Додати новий запис
app.post('/api/olympiads', async (req, res) => {
  try {
    const { year, content } = req.body;
    const newEntry = await Olympiads.create({ year, content });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ error: 'Could not create entry', details: err });
  }
});

// Оновити запис
app.put('/api/olympiads/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await Olympiads.update(
      { content },
      { where: { id: req.params.id } }
    );
    res.json({ message: 'Updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Could not update', details: err });
  }
});

// Видалити запис
app.delete('/api/olympiads/:id', async (req, res) => {
  try {
    await Olympiads.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete', details: err });
  }
});

// Отримати розклад дзвінків
app.get("/api/school-bells", async (req, res) => {
  try {
    const bells = await SchoolBells.findOne();
    res.json(bells);
  } catch (err) {
    console.error("❌ Error fetching school bells:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Оновити розклад дзвінків
app.put("/api/school-bells", async (req, res) => {
  try {
    const { content } = req.body;
    let bells = await SchoolBells.findOne();

    if (!bells) {
      bells = await SchoolBells.create({ content });
    } else {
      bells.content = content;
      await bells.save();
    }

    res.json(bells);
  } catch (err) {
    console.error("❌ Error updating school bells:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/api/school-timetable', async (req, res) => {
  try {
    const schoolTimetable = await SchoolTimetable.findAll();
    res.json(schoolTimetable);
  } catch (err) {
    console.error('❌ Error updating services:', err);
    res.status(500).json({ error: 'Failed to update services' });
  }
});

// POST – додати новий документ
app.post('/api/school-timetable', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `doc-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await SchoolTimetable.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/school-timetable/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await SchoolTimetable.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/school-timetable/:id', async (req, res) => {
  const doc = await SchoolTimetable.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/school-clubs-timetable', async (req, res) => {
  try {
    const schoolClubsTimetable = await SchoolClubsTimetable.findAll();
    res.json(schoolClubsTimetable);
  } catch (err) {
    console.error('❌ Error updating services:', err);
    res.status(500).json({ error: 'Failed to update services' });
  }
});

// POST – додати новий документ
app.post('/api/school-clubs-timetable', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const { type } = req.body;
  let folder = "uploads/documents";
  const file = req.file;
  const isActive = req.body.isActive === 'true';


  // Створюємо нове ім'я файлу з поточною датою та ID посту
  const timestamp = Date.now();  // Поточна дата у мілісекундах
  const fileExtension = path.extname(file.originalname);  // Отримуємо розширення файлу
  const newFileName = `doc-${timestamp}${fileExtension}`;  // Формуємо нове ім'я файлу

  // Шлях для збереженого файлу
  const filePath = path.join(folder, newFileName);

  // Переміщаємо файл у відповідну папку
  fs.renameSync(file.path, filePath);

  // Повертаємо URL файлу
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/documents/${newFileName}`;
  console.log("File uploaded:", fileUrl);

  const doc = await SchoolClubsTimetable.create({ title, file: newFileName, isActive });
  res.json({ url: fileUrl });
});

// PUT – оновити документ
app.put('/api/school-clubs-timetable/:id', upload.single('file'), async (req, res) => {
  const { title, isActive } = req.body;
  const file = req.file?.filename;
  const doc = await SchoolClubsTimetable.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  doc.title = title;
  doc.isActive = isActive === 'true';
  if (file) doc.file = file;

  await doc.save();
  res.json(doc);
});

// DELETE – видалити
app.delete('/api/school-clubs-timetable/:id', async (req, res) => {
  const doc = await SchoolClubsTimetable.findByPk(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  await doc.destroy();
  res.json({ message: 'Deleted' });
});

app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donations.findOne();
    res.json(donations);
  } catch (err) {
    console.error('❌ Error updating donations:', err);
    res.status(500).json({ error: 'Failed to update donations' });
  }
});

app.put('/api/donations', async (req, res) => {
  try {
    const { title, content } = req.body;

    let donations = await Donations.findOne();
    if (donations) {
      await donations.update({ title, content });
    } else {
      donations = await Donations.create({ title, content });
    }
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update donations' });
  }
});

app.get("/api/admission", async (req, res) => {
  try {
    const data = await Admission.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admission sections" });
  }
});

// PUT update by section
app.put("/api/admission/:section", async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;

    const record = await Admission.findOne({ where: { section } });
    if (record) {
      await record.update({ content });
      res.json(record);
    } else {
      // Якщо секції ще нема — створюємо
      const newRec = await Admission.create({ section, title: section, content });
      res.json(newRec);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update admission section" });
  }
});

// Отримати всі секції у порядку спадання років
app.get("/api/finance", async (req, res) => {
  try {
    const data = await Finance.findAll({
      order: [["year", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch finance sections" });
  }
});

// Додати нову секцію
app.post("/api/finance", async (req, res) => {
  try {
    const { year, title, content } = req.body;
    if (!year) {
      return res.status(400).json({ error: "Year is required" });
    }

    // Створюємо title автоматично, якщо не передано
    const newSection = await Finance.create({
      year,
      title: title || `Рік ${year}`,
      content: content || "",
    });

    res.json(newSection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create finance section" });
  }
});

// Оновити секцію
app.put("/api/finance/:id", async (req, res) => {
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) return res.status(404).json({ error: "Section not found" });

    const { year, title, content } = req.body;

    await finance.update({
      year: year !== undefined ? year : finance.year,
      title: title !== undefined ? title : finance.title,
      content: content !== undefined ? content : finance.content,
    });

    res.json(finance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update finance section" });
  }
});

// Видалити секцію
app.delete("/api/finance/:id", async (req, res) => {
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) return res.status(404).json({ error: "Section not found" });

    await finance.destroy();
    res.json({ message: "Section deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete finance section" });
  }
});

// GET всі контакти
app.get('/api/contact333', async (req, res) => {
  const contacts = await Contact.findAll();
  res.json(contacts);
});

// GET контактів
app.get("/api/contact", async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      // Якщо запису ще немає, створимо за замовчуванням
      contact = await Contact.create({
        name: "Гімназія №1",
        address: "м.Львів, вул.Любінська, 93А",
        email: "yevshan79@gmail.com",
        phone: "+38(032)262-20-36",
        mobilePhone: "",
        director: "Директор"
      });
    }
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contact" });
  }
});

// PUT оновлення контакту
app.put("/api/contact", async (req, res) => {
  try {
    const { name, address, email, phone, director } = req.body;

    let contact = await Contact.findOne();
    if (!contact) {
      // якщо запису ще нема – створимо
      contact = await Contact.create({ name, address, email, phone, director });
    } else {
      await contact.update({ name, address, email, phone, director });
    }

    res.json({ success: true, contact });
  } catch (err) {
    console.error("PUT /contact error:", err);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
