const db = require('../config/db');

const Ejercicio = {
    getAll: (callback) => {
        db.query('SELECT * FROM ejercicios', callback);
    },

    getById: (id, callback) => {
        db.query('SELECT * FROM ejercicios WHERE id = ?', [id], callback);
    },

    create: (data, callback) => {
        const { nombre, descripcion } = data;
        db.query(
            'INSERT INTO ejercicios (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion],
            callback
        );
    },

    update: (id, data, callback) => {
        const { nombre, descripcion} = data;
        db.query(
            'UPDATE ejercicios SET nombre=?, descripcion=? WHERE id=?',
            [nombre, descripcion, id],
            callback
        );
    },

    delete: (id, callback) => {
        db.query('DELETE FROM ejercicios WHERE id=?', [id], callback);
    }
};

module.exports = Ejercicio;