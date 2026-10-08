const { Router } = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { authenticate } = require("../middlewares/auth");
const { validateBody } = require("../middlewares/validate");
const { aiPromptSchema } = require("../validators/aiValidators");
const ApiError = require("../utils/ApiError");

const airouter = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @openapi
 * /api/ai/generate:
 *   post:
 *     tags: [IA]
 *     summary: Genera una rutina de un día con Gemini (Markdown)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt: { type: string, maxLength: 1000, example: Rutina de pecho para principiantes }
 *     responses:
 *       200:
 *         description: Rutina generada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 generatedRoutine: { type: string }
 *       400: { description: Prompt inválido, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       401: { description: Sin sesión, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 *       502: { description: La IA no devolvió una rutina, content: { application/json: { schema: { $ref: '#/components/schemas/Error' } } } }
 */
airouter.post("/generate", authenticate, validateBody(aiPromptSchema), async (req, res) => {
  const { prompt } = req.body;

  // Configuramos el modelo de Gemini y le pasamos el System Prompt
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    systemInstruction:
      "Eres un preparador físico de alto rendimiento deportivo. Diseña rutinas estructuradas, para un dia, indicando ejercicios, series y repeticiones. Redacta la respuesta en Markdown de forma motivadora y clara, lista para que el usuario pueda guardarla en su perfil o publicarla para compartirla con la comunidad.",
  });

  let generatedRoutine;
  try {
    const result = await model.generateContent(prompt);
    generatedRoutine = result.response.text().trim();
  } catch (error) {
    console.error("Error en IA Gemini:", error);
    throw new ApiError(500, "Hubo un error al generar la rutina con IA");
  }

  if (!generatedRoutine) {
    throw new ApiError(502, "La IA no devolvió una rutina");
  }

  res.json({ generatedRoutine });
});

module.exports = airouter;
