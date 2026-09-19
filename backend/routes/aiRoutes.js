const { Router } = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const airouter = Router();

// Inicializamos Gemini leyendo la clave desde tu archivo .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

airouter.post('/generate', async (req, res) => {
    try {
        const { sport, goal, level } = req.body;

        if (!sport || !goal || !level) {
            return res.status(400).json({ message: "Faltan datos (deporte, objetivo, nivel) para armar la rutina" });
        }

        // Configuramos el modelo gratuito de Gemini y le pasamos el System Prompt
        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash",
            systemInstruction: "Eres un preparador físico de alto rendimiento deportivo. Diseña rutinas estructuradas, para un dia, indicando ejercicios, series y repeticiones. Redacta la respuesta en Markdown de forma motivadora y clara, lista para que el usuario pueda guardarla en su perfil o publicarla para compartirla con la comunidad."
        });

        // Este es el mensaje dinámico del usuario
        const prompt = `Necesito una rutina de gimnasio para un deportista de nivel ${level}. El deporte principal que practico es ${sport} y mi objetivo fundamental es ${goal}.`;

        // Llamamos a la API de Google
        const result = await model.generateContent(prompt);
        const generatedRoutine = result.response.text().trim();

        if (!generatedRoutine) {
            return res.status(502).json({ message: "La IA no devolvió una rutina" });
        }

        return res.json({ generatedRoutine });

    } catch (error) {
        console.error("Error en IA Gemini:", error);
        res.status(500).json({ message: "Hubo un error al generar la rutina con IA" });
    }
});

module.exports = airouter;