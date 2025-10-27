'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    

    await queryInterface.addColumn('HomeCounters', 'text', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('HomeCounters', 'icon');
    await queryInterface.removeColumn('HomeCounters', 'text');
  },
};
