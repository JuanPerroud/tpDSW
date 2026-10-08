require('dotenv').config();

const common = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql'
};

module.exports = {
    development: common,
    production: {
        ...common,
        dialectOptions:
            process.env.DB_SSL === 'true'
                ? { ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true } }
                : {}
    }
};