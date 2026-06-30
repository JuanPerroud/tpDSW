const express = require('express');
const router = express.Router();
const RutinasController = require('../controllers/RutinasController');

router.get('/', RutinasController.getAll);
router.get('/:idRutinas', RutinasController.getById);
router.post('/', RutinasController.create);
router.put('/:idRutinas', RutinasController.update);
router.delete('/:idRutinas', RutinasController.delete);

module.exports = router;