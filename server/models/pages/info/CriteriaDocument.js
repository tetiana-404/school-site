// models/HomeCriteria.js
module.exports = (sequelize, DataTypes) => {
  const Criteria = sequelize.define('Criteria', {
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
    tableName: 'Criteria'
  });

  return Criteria;
};
