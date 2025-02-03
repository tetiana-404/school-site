const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.json")["development"];

const sequelize = new Sequelize(config);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, DataTypes);
db.Post = require("./post")(sequelize, DataTypes);
db.Document = require("./document")(sequelize, DataTypes);
db.Comment = require("./comment")(sequelize, DataTypes);

// Define relationships
db.User.hasMany(db.Post, { foreignKey: "userId" });
db.Post.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Document, { foreignKey: "userId" });
db.Document.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Comment, { foreignKey: "userId" });
db.Comment.belongsTo(db.User, { foreignKey: "userId" });

db.Post.hasMany(db.Comment, { foreignKey: "postId" });
db.Comment.belongsTo(db.Post, { foreignKey: "postId" });

module.exports = db;
