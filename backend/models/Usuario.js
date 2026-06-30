const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');



const Usuario = sequelize.define("Usuario" , {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
}, {
    tableName: 'Usuario',
    timestamps: true
});
    

module.exports = Usuario;