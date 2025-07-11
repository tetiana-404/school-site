'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TeamMembers', [
      {
        name: 'Назар Божена Володимирівна',
        position: 'Директор \nгімназії',
        img: '/img/team/Назар Б.В.2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Дячишин Ірина Миронівна',
        position: 'Заступник директора з навчально-методичної роботи',
        img: '/img/team/Дячишин І.М..jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Мадай Лідія Орестівна',
        position: 'Заступник директора з навчальної роботи',
        img: '/img/team/Мадай Л.О.2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Козак Мирослава Миронівна',
        position: 'Заступник директора з виховної роботи',
        img: '/img/team/Козак М.М.2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jony Smith',
        position: 'Drawing Teacher',
        img: 'assets/img/team/2.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jone Doe',
        position: 'Swimming Teacher',
        img: 'assets/img/team/1.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TeamMembers', null, {});
  }
};
