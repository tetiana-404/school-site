// models/HomeFacilities.js
module.exports = (sequelize, DataTypes) => {
  const Facilities = sequelize.define('Facilities', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'Facilities'
  });

  return Facilities;
};
