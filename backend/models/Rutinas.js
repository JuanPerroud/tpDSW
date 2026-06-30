const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');


const Rutinas = sequelize.define("Rutinas" , {
        idRutina: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descRutina: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        grupoMuscular: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
}, {
    tableName: 'Rutinas',
    timestamps: true
});
Usuario.associate = (models) => {
        Usuario.hasMany(models.Rutinas, {
            foreignKey: "creatorId",
            onDelete: "cascade",
        });
};
    

module.exports = Usuario;