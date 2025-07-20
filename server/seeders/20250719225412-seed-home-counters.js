'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('HomeAboutCounters', [
      {
        value: 569,
        text: 'учнів на 2025 рік',
        icon: 'icofont-teacher',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 37,
        text: 'педагогічних працівників',
        icon: 'icofont-student-alt',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 33,
        text: 'навчальних кабінети',
        icon: 'icofont-calendar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 20,
        text: 'мультимедійних класів',
        icon: 'icofont-group-students',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('HomeAboutCounters', null, {});
  },
};
