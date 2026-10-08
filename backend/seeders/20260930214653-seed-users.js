'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Las contraseñas se guardan hasheadas (bcrypt); las credenciales de prueba son las del README
    const hash = (plain) => bcrypt.hashSync(plain, 10);

    await queryInterface.bulkInsert('User', [
      {
        id: 1,
        name: 'Admin',
        surname: 'Gym',
        age: 30,
        email: 'admin@gymroutines.com',
        password: hash('adminpassword123'),
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
        password: hash('password123'),
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
        password: hash('password123'),
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
