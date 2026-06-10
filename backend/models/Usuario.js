const db = require('../config/db');

const Usuario = {
    getAll: (callback) => {
        db.query('SELECT * FROM usuarios', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        const { nombre, email, password } = data;
        db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, password], callback);
    },

    update: (id, data, callback) => {
        const { nombre, email, password } = data;
        db.query('UPDATE usuarios SET nombre=?, email=?, password=? WHERE id=?',
            [nombre, email, password, id], callback);
    },

    delete: (id, callback) => {
        db.query('DELETE FROM usuarios WHERE id=?', [id], callback);
    }
};

module.exports = Usuario;