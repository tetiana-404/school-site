// models/FamilyEducation.js
module.exports = (sequelize, DataTypes) => {
  const FamilyEducation = sequelize.define('FamilyEducation', {
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
    tableName: 'FamilyEducation'
  });

  return FamilyEducation;
};
