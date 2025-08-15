// models/SchoolTimetable.js
module.exports = (sequelize, DataTypes) => {
  const SchoolTimetable = sequelize.define('SchoolTimetable', {
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
    tableName: 'SchoolTimetable'
  });

  return SchoolTimetable;
};
