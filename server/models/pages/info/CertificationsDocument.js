// models/CertificationsDocument.js
module.exports = (sequelize, DataTypes) => {
  const CertificationsDocument = sequelize.define('CertificationsDocument', {
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

  return CertificationsDocument;
};
