require('dotenv').config({ path: '../.env' });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize, User, Post, Document, Comment } = require("./models");

const app = express();
app.use(express.json({ limit: "10mb" })); // Default is 100kb, now increased to 50MB
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enable CORS for all origins (you can specify specific origins if needed)
app.use(cors());

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
  const { title, content } = req.body;
  const post = await Post.create({ title, content, userId: req.user.userId });
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

// Start the server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
