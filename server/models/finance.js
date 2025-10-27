// models/Finance.js
module.exports = (sequelize, DataTypes) => {

const Finance = sequelize.define("Finance", {
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 2000, // мінімальний рік
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT("long"), // тут буде текст з Tiptap
    allowNull: false,
  },
}, {
    tableName: "Finance",
  });

  return Finance;
};

