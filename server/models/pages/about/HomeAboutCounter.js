// models/HomeAboutCounter.js
module.exports = (sequelize, DataTypes) => {
  const HomeAboutCounter = sequelize.define('HomeAboutCounter', {
    icon: DataTypes.STRING,
    value: DataTypes.INTEGER,
    text: DataTypes.STRING,
  }, {
    tableName: 'HomeAboutCounters' 
  });

  return HomeAboutCounter;
};