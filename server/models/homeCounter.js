module.exports = (sequelize, DataTypes) => {
  const HomeCounter = sequelize.define('HomeCounter', {
    
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return HomeCounter;
};
