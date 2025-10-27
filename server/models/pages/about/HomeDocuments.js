// models/HomeDocuments.js
module.exports = (sequelize, DataTypes) => {
  const HomeDocuments = sequelize.define('HomeDocuments', {
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
    tableName: 'HomeDocuments'
  });

  return HomeDocuments;
};
