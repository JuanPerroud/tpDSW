const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authenticate, requireAdmin } = require("../middlewares/auth");
const { validateBody, validateId } = require("../middlewares/validate");
const {
  registerSchema,
  loginSchema,
  updateSchema,
  changePasswordSchema,
} = require("../validators/userValidators");

router.param("id", validateId);

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags: [Usuarios]
 *     summary: Iniciar sesión
 *     description: Devuelve el usuario y un JWT que debe enviarse como `Authorization Bearer <token>`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: admin@gymroutines.com }
 *               password: { type: string, example: adminpassword123 }
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string }
 *                 token: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400: { description: Datos inválidos o contraseña incorrecta, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       403: { description: Cuenta desactivada, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: El usuario no existe, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post("/login", validateBody(loginSchema), UserController.login);

/**
 * @openapi
 * /api/user:
 *   post:
 *     tags: [Usuarios]
 *     summary: Registrar un usuario (rol usuario común)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surname, age, email, password]
 *             properties:
 *               name: { type: string }
 *               surname: { type: string }
 *               age: { type: integer, minimum: 1, maximum: 120 }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6, maxLength: 20 }
 *     responses:
 *       201: { description: Usuario creado, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 *       400: { description: Datos inválidos o email ya registrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar usuarios (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string }, description: Filtra por nombre o email }
 *     responses:
 *       200: { description: Lista de usuarios, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/User' } } } } }
 *       401: { description: Sin sesión, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       403: { description: No es administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.post("/", validateBody(registerSchema), UserController.create);
router.get("/", authenticate, requireAdmin, UserController.getAll);

/**
 * @openapi
 * /api/user/change-password:
 *   put:
 *     tags: [Usuarios]
 *     summary: Cambiar la contraseña del usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string, minLength: 6, maxLength: 20 }
 *     responses:
 *       200: { description: Contraseña modificada }
 *       400: { description: Datos inválidos, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       401: { description: Sin sesión, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.put("/change-password", authenticate, validateBody(changePasswordSchema), UserController.changePassword);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener un usuario (admin o el propio usuario)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Usuario, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 *       403: { description: Sin permisos, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar perfil (admin o el propio usuario)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               surname: { type: string }
 *               age: { type: integer }
 *               password: { type: string, description: Opcional }
 *     responses:
 *       200: { description: Usuario actualizado }
 *       403: { description: Sin permisos, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario (solo admin; no se puede eliminar a otro admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Usuario eliminado }
 *       400: { description: Es un administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       403: { description: No es administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.get("/:id", authenticate, UserController.getById);
router.put("/:id", authenticate, validateBody(updateSchema), UserController.update);
router.delete("/:id", authenticate, requireAdmin, UserController.delete);

/**
 * @openapi
 * /api/user/{id}/toggle-active:
 *   patch:
 *     tags: [Usuarios]
 *     summary: Activar o desactivar un usuario (solo admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Estado actualizado }
 *       400: { description: Es un administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       403: { description: No es administrador, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       404: { description: No encontrado, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
router.patch("/:id/toggle-active", authenticate, requireAdmin, UserController.toggleActive);

module.exports = router;
