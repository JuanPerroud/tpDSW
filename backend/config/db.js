const mysql = require('mysql2'); //Este es la libreria que permite conectar a MySQL desde Node.js
require('dotenv').config();

const connection = mysql.createConnection({     //Utiliza processs.env para cargar las variables de entorno desde el archivo .env
    host: process.env.DB_HOST,          
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) console.error('Error conectando a MySQL:', err);
    else console.log('Conectado a MySQL ✓');
});

module.exports = connection;