'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomeSlider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HomeSlider.init({
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'HomeSlider',
    timestamps: true,
  });
  return HomeSlider;
};