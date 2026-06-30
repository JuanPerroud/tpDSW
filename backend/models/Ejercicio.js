const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');


const Ejercicio = sequelize.define("Ejercicio" , {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false
        },
}, {
    tableName: 'Ejercicio',
    timestamps: true
});  

module.exports = Usuario;

