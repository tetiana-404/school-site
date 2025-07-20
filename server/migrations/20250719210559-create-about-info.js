'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AboutInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: Sequelize.TEXT,
      address: Sequelize.TEXT,
      contacts: Sequelize.TEXT,
      schedule: Sequelize.TEXT,
      image: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AboutInfos');
  }
};
