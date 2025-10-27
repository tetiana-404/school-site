module.exports = (sequelize, DataTypes) => {
  return sequelize.define('HomeAboutPage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
};
