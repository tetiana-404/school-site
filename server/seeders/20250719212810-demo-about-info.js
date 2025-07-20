'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('AboutInfos', [
      {
        fullName: 'КЗ "Гімназія №1 м. Прикладова"',
        address: 'м. Прикладова, вул. Шкільна, 1',
        contacts: 'Тел: (012) 345-67-89\nEmail: school@example.com',
        schedule: 'Пн-Пт: 08:00–17:00',
        image: 'default.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('AboutInfos', null, {});
  },
};
