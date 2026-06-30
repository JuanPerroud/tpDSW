const express = require('express');
const router = express.Router();
const EjercicioController = require('../controllers/EjercicioController');

router.get('/', EjercicioController.getAll);
router.get('/:id', EjercicioController.getById);
router.post('/', EjercicioController.create);
router.put('/:id', EjercicioController.update);
router.delete('/:id', EjercicioController.delete);

module.exports = router;