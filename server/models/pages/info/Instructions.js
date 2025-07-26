// models/Instructions.js
module.exports = (sequelize, DataTypes) => {
  const Instructions = sequelize.define('Instructions', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'Instructions'
  });

  return Instructions;
};
