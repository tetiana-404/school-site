require('dotenv').config({ path: '../.env' });
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize, User, Post, Document, Comment } = require("./models");

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

// Статичний доступ до файлів
app.use("/uploads", express.static("uploads"));

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

    console.log(`user: ${JSON.stringify(user)}`);
    console.log(`isPasswordValid: ${isPasswordValid}`);

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
    console.log(`token: ${token}`);

    res.json({ token }); // Send the token to the client

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
  const posts = await Post.findAll({ include: User,  order: [["createdAt", "DESC"]]});
  res.json(posts);
});

app.post("/posts", authenticateToken, async (req, res) => {
  const { title, content, updatedAt } = req.body;

  const post = await Post.create({ title, content, userId: req.user.id, updatedAt: updatedAt || new Date(), });
  res.status(201).json(post);
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



// Start the server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
