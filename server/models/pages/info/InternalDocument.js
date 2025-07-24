// models/InternalDocument.js
module.exports = (sequelize, DataTypes) => {
  const InternalDocument = sequelize.define('InternalDocument', {
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

  return InternalDocument;
};
