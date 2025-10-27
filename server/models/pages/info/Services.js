// models/HomeServices.js
module.exports = (sequelize, DataTypes) => {
  const Services = sequelize.define('Services', {
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
    tableName: 'Services'
  });

  return Services;
};
