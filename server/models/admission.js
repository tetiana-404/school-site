// models/Admission.js
module.exports = (sequelize, DataTypes) => {
  const Admission = sequelize.define("Admission", {
    section: {
      type: DataTypes.STRING,
      allowNull: false, // general / ukr_exam / math_exam
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
  }, {
    tableName: "Admission",
  });

  return Admission;
};
