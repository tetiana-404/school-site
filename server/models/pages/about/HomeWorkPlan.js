// models/HomeWorkPlan.js
module.exports = (sequelize, DataTypes) => {
  const HomeWorkPlan = sequelize.define('HomeWorkPlan', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'HomeWorkPlan'
  });

  return HomeWorkPlan;
};
