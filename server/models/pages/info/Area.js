// models/HomeAnthem.js
module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'Area'
  });

  return Area;
};
