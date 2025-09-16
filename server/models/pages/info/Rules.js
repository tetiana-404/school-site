// models/Rules.js
module.exports = (sequelize, DataTypes) => {
  const Rules = sequelize.define('Rules', {
   title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'Rules'
  });

  return Rules;
};
