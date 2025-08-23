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
db.HomeAbout = require('./homeAbout')(sequelize, DataTypes);
db.HomeSlider = require("./homeslider")(sequelize, DataTypes);
db.HomeCounter = require('./homeCounter')(sequelize, DataTypes);
db.HomeMeta = require('./homemeta')(sequelize, DataTypes);
db.TeamMember = require('./teamMember')(sequelize, DataTypes);
db.HomeAboutPage = require('./pages/about/HomeAboutPage')(sequelize, DataTypes);
const HomeAboutPageModel = require('./pages/about/HomeAboutPage');
const HomeAboutPage = HomeAboutPageModel(sequelize, DataTypes);
db.HomeAboutPage = HomeAboutPage;

db.AboutInfo = require('./aboutInfo')(sequelize, Sequelize.DataTypes);
const HomeAboutCounter = require('./pages/about/HomeAboutCounter')(sequelize, DataTypes);
db.HomeAboutCounter = HomeAboutCounter;

const homeHistoryRoutes = require('./pages/about/HomeHistory')(sequelize, DataTypes);
db.HomeHistory = homeHistoryRoutes;

const homeDocuments = require('./pages/about/HomeDocuments')(sequelize, DataTypes);
db.HomeDocuments = homeDocuments;

const homeAnthem = require('./pages/about/HomeAnthem')(sequelize, DataTypes);
db.HomeAnthem = homeAnthem;

const homeStrategy = require('./pages/about/HomeStrategy')(sequelize, DataTypes);
db.HomeStrategy = homeStrategy;

const homeWorkPlan = require('./pages/about/HomeWorkPlan')(sequelize, DataTypes);
db.HomeWorkPlan = homeWorkPlan;

const homeReports = require('./pages/about/HomeReports')(sequelize, DataTypes);
db.HomeReports = homeReports;

const homeTeachers = require('./pages/about/HomeTeachers')(sequelize, DataTypes);
db.HomeTeachers = homeTeachers;

const regDocuments = require('./pages/info/RegDocuments')(sequelize, DataTypes);
db.RegDocuments = regDocuments;

const internalDocument = require('./pages/info/InternalDocument')(sequelize, DataTypes);
db.InternalDocument = internalDocument;

const area = require('./pages/info/Area')(sequelize, DataTypes);
db.Area = area;

const language = require('./pages/info/Language')(sequelize, DataTypes);
db.Language = language;

const facilities = require('./pages/info/Facilities')(sequelize, DataTypes);
db.Facilities = facilities;

const services = require('./pages/info/Services')(sequelize, DataTypes);
db.Services = services;

const familyEducation = require('./pages/info/FamilyEducation')(sequelize, DataTypes);
db.FamilyEducation = familyEducation;

const rules = require('./pages/info/Rules')(sequelize, DataTypes);
db.Rules = rules

const instructions = require('./pages/info/Instructions')(sequelize, DataTypes);
db.Instructions = instructions

const bullying = require('./pages/info/BullyingDocument')(sequelize, DataTypes);
db.Bullying = bullying

const programs = require('./pages/info/ProgramsDocument')(sequelize, DataTypes);
db.Programs = programs

const certifications = require('./pages/info/CertificationsDocument')(sequelize, DataTypes);
db.Certifications = certifications; 

const criteria = require('./pages/info/CriteriaDocument')(sequelize, DataTypes);
db.Criteria = criteria;

const schoolRating = require('./pages/achievements/SchoolRating')(sequelize, DataTypes);
db.SchoolRating = schoolRating;

const medals = require('./pages/achievements/SchoolMedals')(sequelize, DataTypes);
db.SchoolMedals = medals;

const olympiads = require('./pages/achievements/OlympiadWinner')(sequelize, DataTypes);
db.Olympiads = olympiads;

const schoolBells = require('./pages/forparents/schoolbells')(sequelize, DataTypes);
db.SchoolBells = schoolBells;

const schoolTimetable = require('./pages/forparents/schooltimetable')(sequelize, DataTypes);
db.SchoolTimetable = schoolTimetable;

const schoolClubsTimetable = require('./pages/forparents/schoolclubstimetable')(sequelize, DataTypes);
db.SchoolClubsTimetable = schoolClubsTimetable;

const donations = require('./pages/forparents/donations')(sequelize, DataTypes);
db.Donations = donations;

const admission = require('./admission')(sequelize, DataTypes);
db.Admission = admission;

const finance = require('./finance')(sequelize, DataTypes);
db.Finance = finance;

const contact = require('./contact')(sequelize, DataTypes);
db.Contact = contact;

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
