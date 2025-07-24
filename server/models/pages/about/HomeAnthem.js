// models/HomeAnthem.js
module.exports = (sequelize, DataTypes) => {
  const HomeAnthem = sequelize.define('HomeAnthem', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'HomeAnthems'
  });

  return HomeAnthem;
};
