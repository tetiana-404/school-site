// models/BullyingDocuments.js
module.exports = (sequelize, DataTypes) => {
  const BullyingDocuments = sequelize.define('BullyingDocuments', {
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

  return BullyingDocuments;
};
