const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

let sequelize;

// --- PRODUCTION: PostgreSQL on Railway ---
if (env === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  });

} else {

  // --- DEVELOPMENT: SQLite ---
  if (config.dialect === "sqlite") {
    config.storage = path.join(__dirname, "../database.sqlite");
  }
  sequelize = new Sequelize(config);
}

// DB object
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.User = require("./user")(sequelize, DataTypes);
db.Post = require("./post")(sequelize, DataTypes);
db.Document = require("./document")(sequelize, DataTypes);
db.Comment = require("./comment")(sequelize, DataTypes);
db.HomeAbout = require('./homeAbout')(sequelize, DataTypes);
db.HomeSlider = require("./homeslider")(sequelize, DataTypes);
db.HomeCounter = require('./homeCounter')(sequelize, DataTypes);
db.HomeMeta = require('./homemeta')(sequelize, DataTypes);
db.TeamMember = require('./teamMember')(sequelize, DataTypes);

db.HomeAboutPage = require('./pages/about/HomeAboutPage')(sequelize, DataTypes);
db.HomeAboutCounter = require('./pages/about/HomeAboutCounter')(sequelize, DataTypes);
db.HomeHistory = require('./pages/about/HomeHistory')(sequelize, DataTypes);
db.HomeDocuments = require('./pages/about/HomeDocuments')(sequelize, DataTypes);
db.HomeAnthem = require('./pages/about/HomeAnthem')(sequelize, DataTypes);
db.HomeStrategy = require('./pages/about/HomeStrategy')(sequelize, DataTypes);
db.HomeWorkPlan = require('./pages/about/HomeWorkPlan')(sequelize, DataTypes);
db.HomeReports = require('./pages/about/HomeReports')(sequelize, DataTypes);
db.HomeTeachers = require('./pages/about/HomeTeachers')(sequelize, DataTypes);

db.RegDocuments = require('./pages/info/RegDocuments')(sequelize, DataTypes);
db.InternalDocument = require('./pages/info/InternalDocument')(sequelize, DataTypes);
db.Area = require('./pages/info/Area')(sequelize, DataTypes);
db.Language = require('./pages/info/Language')(sequelize, DataTypes);
db.Facilities = require('./pages/info/Facilities')(sequelize, DataTypes);
db.Services = require('./pages/info/Services')(sequelize, DataTypes);
db.FamilyEducation = require('./pages/info/FamilyEducation')(sequelize, DataTypes);
db.Rules = require('./pages/info/Rules')(sequelize, DataTypes);
db.Instructions = require('./pages/info/Instructions')(sequelize, DataTypes);
db.Bullying = require('./pages/info/BullyingDocument')(sequelize, DataTypes);
db.Programs = require('./pages/info/ProgramsDocument')(sequelize, DataTypes);
db.Certifications = require('./pages/info/CertificationsDocument')(sequelize, DataTypes);
db.Criteria = require('./pages/info/CriteriaDocument')(sequelize, DataTypes);

db.SchoolRating = require('./pages/achievements/SchoolRating')(sequelize, DataTypes);
db.SchoolMedals = require('./pages/achievements/SchoolMedals')(sequelize, DataTypes);
db.Olympiads = require('./pages/achievements/OlympiadWinner')(sequelize, DataTypes);

db.SchoolBells = require('./pages/forparents/schoolbells')(sequelize, DataTypes);
db.SchoolTimetable = require('./pages/forparents/schooltimetable')(sequelize, DataTypes);
db.SchoolClubsTimetable = require('./pages/forparents/schoolclubstimetable')(sequelize, DataTypes);
db.Donations = require('./pages/forparents/donations')(sequelize, DataTypes);

db.Admission = require('./admission')(sequelize, DataTypes);
db.Finance = require('./finance')(sequelize, DataTypes);
db.Contact = require('./contact')(sequelize, DataTypes);

// Associations
db.User.hasMany(db.Post, { foreignKey: "userId" });
db.Post.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Document, { foreignKey: "userId" });
db.Document.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Comment, { foreignKey: "userId" });
db.Comment.belongsTo(db.User, { foreignKey: "userId" });

db.Post.hasMany(db.Comment, { foreignKey: "postId" });
db.Comment.belongsTo(db.Post, { foreignKey: "postId" });

module.exports = db;
