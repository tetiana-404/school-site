'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.removeColumn('HomeCounters', 'title');
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.addColumn('HomeCounters', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
