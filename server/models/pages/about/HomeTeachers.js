// models/HomeTeachers.js
module.exports = (sequelize, DataTypes) => {
  const HomeTeachers = sequelize.define('HomeTeachers', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
  }, {
    tableName: 'HomeTeachers'
  });

  return HomeTeachers;
};
