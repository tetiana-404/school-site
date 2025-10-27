// models/schoolrating.js
module.exports = (sequelize, DataTypes) => {
  const SchoolRating  = sequelize.define('SchoolRating', {
    year: DataTypes.STRING,
    cityRank: DataTypes.INTEGER,
    cityLink: DataTypes.STRING,
    countryRank: DataTypes.INTEGER,
    countryLink: DataTypes.STRING
  }, {
    tableName: 'SchoolRating'
  });

  return SchoolRating;
};
