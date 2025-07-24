// models/HomeReports.js
module.exports = (sequelize, DataTypes) => {
  const HomeReports = sequelize.define('HomeReports', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'HomeReports'
  });

  return HomeReports;
};
