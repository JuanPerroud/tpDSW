'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('User', [
      {
        id: 1,
        name: 'Admin',
        surname: 'Gym',
        age: 30,
        email: 'admin@gymroutines.com',
        password: 'adminpassword123',
        isAdmin: true,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Carlos',
        surname: 'Gomez',
        age: 26,
        email: 'carlos.gomez@example.com',
        password: 'password123',
        isAdmin: false,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Lucia',
        surname: 'Fernandez',
        age: 24,
        email: 'lucia.fernandez@example.com',
        password: 'password123',
        isAdmin: false,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  }
};
