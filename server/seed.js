const { sequelize, User, Post, Document } = require("./models");
const bcrypt = require("bcrypt");

async function seed() {
  await sequelize.sync({ force: true });

  const admin = await User.create({
    username: "admin",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
  });

  await Post.create({ title: "First Post", content: "This is the first post!", userId: admin.id });
  await Document.create({ name: "School Report", url: "/files/report.pdf", userId: admin.id });

  console.log("✅ Seed data added!");
  process.exit();
}

seed();
