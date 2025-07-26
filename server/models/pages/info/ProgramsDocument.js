// models/ProgramsDocuments.js
module.exports = (sequelize, DataTypes) => {
  const ProgramsDocuments = sequelize.define('ProgramsDocuments', {
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
  });

  return ProgramsDocuments;
};
