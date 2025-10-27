'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HomeAbout extends Model {
    static associate(models) {
      
    }
  }

  HomeAbout.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    subText: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'HomeAbout',
    timestamps: true,
  });

  return HomeAbout;
};
