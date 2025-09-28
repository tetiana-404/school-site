// models/HomeReports.js
module.exports = (sequelize, DataTypes) => {
  const HomeReports = sequelize.define('HomeReports', {
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {             
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'HomeReports'
  });

  return HomeReports;
};
