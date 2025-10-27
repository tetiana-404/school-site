// models/SchoolClubsTimetable.js
module.exports = (sequelize, DataTypes) => {
  const SchoolClubsTimetable = sequelize.define('SchoolClubsTimetable', {
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
    tableName: 'SchoolClubsTimetable'
  });

  return SchoolClubsTimetable;
};
