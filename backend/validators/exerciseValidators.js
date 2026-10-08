const Yup = require("yup");

const MUSCLE_GROUPS = [
  "cuadriceps",
  "isquiotibiales",
  "gluteos",
  "gemelos",
  "pecho",
  "espalda",
  "hombros",
  "biceps",
  "triceps",
  "abdomen",
  "cardio",
];

const exerciseSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("El nombre del ejercicio es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  description: Yup.string().trim().nullable(),
  muscleGroup: Yup.string()
    .lowercase()
    .oneOf(MUSCLE_GROUPS, "El grupo muscular no es válido")
    .required("El grupo muscular es obligatorio"),
});

module.exports = { exerciseSchema, MUSCLE_GROUPS };
