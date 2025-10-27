module.exports = (sequelize, DataTypes) => {
  const HomeMeta = sequelize.define('HomeMeta', {
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Наші досягнення за 2023 - 2024 навчальний рік'
    },
  }, {
    tableName: 'HomeMeta'
  });

  return HomeMeta;
};
