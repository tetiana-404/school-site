'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomeCounter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HomeCounter.init({
    icon: DataTypes.STRING,
    value: DataTypes.INTEGER,
    text: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HomeCounter',
  });
  return HomeCounter;
};