'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Видалення старих полів
    await queryInterface.removeColumn('Services', 'title');
    await queryInterface.removeColumn('Services', 'content');

    // Додавання нових полів
    await queryInterface.addColumn('Services', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Services', 'file', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Services', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Відкат змін — повернення старих полів
    await queryInterface.removeColumn('Services', 'title');
    await queryInterface.removeColumn('Services', 'file');
    await queryInterface.removeColumn('Services', 'isActive');

    await queryInterface.addColumn('Services', 'title', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('Services', 'content', {
      type: Sequelize.TEXT,
    });
  }
};
