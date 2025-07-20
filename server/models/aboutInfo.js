// models/AboutInfo.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("AboutInfo", {
    fullName: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.TEXT,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    schedule: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
  });
};
