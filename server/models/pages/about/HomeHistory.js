// models/HomeHistory.js
module.exports = (sequelize, DataTypes) => {
  const HomeHistory = sequelize.define('HomeHistory', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'HomeHistories'
  });

  return HomeHistory;
};
