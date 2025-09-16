// models/Instructions.js
module.exports = (sequelize, DataTypes) => {
  const Instructions = sequelize.define('Instructions', {
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
    tableName: 'Instructions'
  });

  return Instructions;
};
