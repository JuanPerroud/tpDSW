const express = require("express");
const router = express.Router();
const RoutineController = require("../controllers/RoutineController");
const { authenticate } = require("../middlewares/auth");
const { validateBody, validateId } = require("../middlewares/validate");
const { routineSchema } = require("../validators/routineValidators");

router.param("id", validateId);
router.use(authenticate);

/**
 * @openapi
 * /api/routine:
 *   get:
 *     tags: [Rutinas]
 *     summary: Listar todas las rutinas (propias y de la comunidad) con ejercicios y series
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de rutinas, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Routine' } } } } }
 *       401: { description: Sin sesión, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   post:
 *     tags: [Rutinas]
 *     summary: Crear una rutina con sus ejercicios y series (el dueño es el usuario autenticado)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RoutineInput' }
 *     responses:
 *       201: { description: Rutina creada, content: { application/json: { schema: { $ref: '#/components/schemas/Routine' } } } }
 *       400: { description: Datos inválidos, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/", RoutineController.getAll);
router.post("/", validateBody(routineSchema), RoutineController.create);

/**
 * @openapi
 * /api/routine/{id}:
 *   get:
 *     tags: [Rutinas]
 *     summary: Detalle de una rutina (rutina + ejercicios + series + creador)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Rutina, content: { application/json: { schema: { $ref: '#/components/schemas/Routine' } } } }
 *       404: { description: No encontrada, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   put:
 *     tags: [Rutinas]
 *     summary: Actualizar una rutina (solo su dueño o un admin). Reemplaza los ejercicios y series.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RoutineInput' }
 *     responses:
 *       200: { description: Rutina actualizada }
 *       403: { description: No es el dueño, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrada, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   delete:
 *     tags: [Rutinas]
 *     summary: Eliminar una rutina (solo su dueño o un admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Rutina eliminada }
 *       403: { description: No es el dueño, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrada, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/:id", RoutineController.getById);
router.put("/:id", validateBody(routineSchema), RoutineController.update);
router.delete("/:id", RoutineController.delete);

module.exports = router;
