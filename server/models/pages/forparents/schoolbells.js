module.exports = (sequelize, DataTypes) => {
  const SchoolBells = sequelize.define("SchoolBells", {
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false
    }
  }, {
    tableName: "SchoolBells"
  });

  return SchoolBells;
};
