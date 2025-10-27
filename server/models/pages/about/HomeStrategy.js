// models/HomeStrategy.js
module.exports = (sequelize, DataTypes) => {
  const HomeStrategy = sequelize.define('HomeStrategy', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'HomeStrategy'
  });

  return HomeStrategy;
};
