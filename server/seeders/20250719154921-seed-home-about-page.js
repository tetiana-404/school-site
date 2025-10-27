'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('HomeAboutPages', [
      {
        content: `
<div class="mb-4">
  <h4>Повна назва установи</h4>
  <p>Львівська гімназія "Євшан"</p>
</div>
<div class="mb-4">
  <h4>Юридична адреса</h4>
  <p>вул. Любінська, 93а, м. Львів, Україна, 79054</p>
</div>
<div class="mb-4">
  <h4>Контакти</h4>
  <p>Телефон: (032) 262-20-36</p>
  <p>Email: yevshan79@gmail.com</p>
</div>
<div class="mb-4">
  <h4>Графік роботи школи</h4>
  <p>Понеділок – П’ятниця: 8:00 – 17:00</p>
  <p>Субота, Неділя – вихідні</p>
</div>
        `.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('HomeAboutPages', null, {});
  }
};
