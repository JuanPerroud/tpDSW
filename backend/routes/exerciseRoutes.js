const express = require("express");
const router = express.Router();
const ExerciseController = require("../controllers/ExerciseController");
const { authenticate } = require("../middlewares/auth");
const { validateBody, validateId } = require("../middlewares/validate");
const { exerciseSchema } = require("../validators/exerciseValidators");

router.param("id", validateId);
router.use(authenticate);

/**
 * @openapi
 * /api/exercise:
 *   get:
 *     tags: [Ejercicios]
 *     summary: Listar ejercicios globales y los privados del usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de ejercicios, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Exercise' } } } } }
 *       401: { description: Sin sesión, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   post:
 *     tags: [Ejercicios]
 *     summary: Crear ejercicio (global si lo crea un admin, privado si lo crea un usuario)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ExerciseInput' }
 *     responses:
 *       201: { description: Ejercicio creado, content: { application/json: { schema: { $ref: '#/components/schemas/Exercise' } } } }
 *       400: { description: Datos inválidos, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/", ExerciseController.getAll);
router.post("/", validateBody(exerciseSchema), ExerciseController.create);

/**
 * @openapi
 * /api/exercise/{id}:
 *   get:
 *     tags: [Ejercicios]
 *     summary: Obtener un ejercicio
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Ejercicio, content: { application/json: { schema: { $ref: '#/components/schemas/Exercise' } } } }
 *       403: { description: Ejercicio privado de otro usuario, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   put:
 *     tags: [Ejercicios]
 *     summary: Editar ejercicio (global solo admin; privado solo su creador)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ExerciseInput' }
 *     responses:
 *       200: { description: Ejercicio actualizado }
 *       403: { description: Sin permisos, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   delete:
 *     tags: [Ejercicios]
 *     summary: Eliminar ejercicio (global solo admin; privado solo su creador)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Ejercicio eliminado }
 *       403: { description: Sin permisos, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/:id", ExerciseController.getById);
router.put("/:id", validateBody(exerciseSchema), ExerciseController.update);
router.delete("/:id", ExerciseController.delete);

module.exports = router;
