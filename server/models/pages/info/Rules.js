// models/Rules.js
module.exports = (sequelize, DataTypes) => {
  const Rules = sequelize.define('Rules', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'Rules'
  });

  return Rules;
};
