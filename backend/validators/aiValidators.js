const Yup = require("yup");

const aiPromptSchema = Yup.object({
  prompt: Yup.string()
    .trim()
    .required("Falta el mensaje para generar la rutina")
    .max(1000, "El mensaje no puede superar los 1000 caracteres"),
});

module.exports = { aiPromptSchema };
