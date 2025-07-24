// models/HomeDocuments.js
module.exports = (sequelize, DataTypes) => {
  const HomeDocuments = sequelize.define('HomeDocuments', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'HomeDocuments'
  });

  return HomeDocuments;
};
