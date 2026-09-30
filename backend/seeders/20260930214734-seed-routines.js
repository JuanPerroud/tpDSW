'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Routine', [
      {
        id: 1,
        name: 'Rutina Torso Fuerza',
        description: 'Enfocada en press de banca, remo y press militar para ganar masa muscular y fuerza.',
        muscleGroup: 'espalda',
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Rutina Pierna Completa',
        description: 'Trabajo intenso de cuádriceps e isquiotibiales con sentadillas y peso muerto.',
        muscleGroup: 'cuadriceps',
        creatorId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Routine', null, {});
  }
};
