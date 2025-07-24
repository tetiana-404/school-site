// models/RegDocuments.js
module.exports = (sequelize, DataTypes) => {
  const RegDocuments = sequelize.define('RegDocuments', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'RegDocuments'
  });

  return RegDocuments;
};
