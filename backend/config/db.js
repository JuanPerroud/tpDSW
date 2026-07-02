const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, 
        port: 3306     
    }
);

sequelize.authenticate()
    .then(() => console.log('Conectado a MySQL con Sequelize ✓'))
    .catch(err => console.error('Error al conectar con Sequelize:', err));


module.exports = sequelize;