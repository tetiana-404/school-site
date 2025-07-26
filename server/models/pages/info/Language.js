// models/HomeLanguage.js
module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('Language', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'Language'
  });

  return Language;
};
