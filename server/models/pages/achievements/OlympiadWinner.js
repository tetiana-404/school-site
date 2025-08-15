// models/olympiadwinner.js
module.exports = (sequelize, DataTypes) => {
  const OlympiadWinner = sequelize.define('OlympiadWinner', {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
        tableName: 'OlympiadWinner'
    });

  return OlympiadWinner;
};
