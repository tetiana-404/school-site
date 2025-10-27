// models/donations.js
module.exports = (sequelize, DataTypes) => {
  const Donations = sequelize.define('Donations', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'Donations'
  });

  return Donations;
};
