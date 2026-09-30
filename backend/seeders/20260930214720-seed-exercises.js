'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Exercise', [
      {
        id: 1,
        name: 'Press de Banca Plano',
        description: 'Ejercicio multiarticular básico para desarrollo de pectoral, tríceps y deltoides anterior.',
        muscleGroup: 'pecho',
        isPublic: true,
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Sentadilla Trasera',
        description: 'Ejercicio compuesto fundamental para tren inferior con barra sobre trapecios.',
        muscleGroup: 'cuadriceps',
        isPublic: true,
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Remo con Barra',
        description: 'Ejercicio de tracción horizontal para dorsal ancho, trapecio y romboides.',
        muscleGroup: 'espalda',
        isPublic: true,
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Press Militar',
        description: 'Press vertical de pie con barra para desarrollo completo del hombro y tríceps.',
        muscleGroup: 'hombros',
        isPublic: true,
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Peso Muerto Rumano',
        description: 'Enfocado en cadena posterior, isquiotibiales y glúteos.',
        muscleGroup: 'isquiotibiales',
        isPublic: true,
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Curl de Bíceps con Barra',
        description: 'Aislamiento de bíceps braquial con barra Z o barra recta.',
        muscleGroup: 'biceps',
        isPublic: true,
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Fondos en Paralelas',
        description: 'Ejercicio con peso corporal para pectoral inferior y tríceps.',
        muscleGroup: 'triceps',
        isPublic: false,
        creatorId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Exercise', null, {});
  }
};
