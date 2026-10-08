const Yup = require("yup");
const { MUSCLE_GROUPS } = require("./exerciseValidators");

const setSchema = Yup.object({
  setNumber: Yup.number().integer().min(1, "El número de serie debe ser mayor a 0").required(),
  reps: Yup.number()
    .integer("Las repeticiones deben ser un número entero")
    .min(0, "Las repeticiones no pueden ser negativas")
    .required("Las repeticiones son obligatorias"),
  // null = ejercicio con peso corporal
  weightKg: Yup.number()
    .nullable()
    .min(0, "El peso no puede ser negativo")
    .max(999.99, "El peso es demasiado alto"),
});

const routineExerciseSchema = Yup.object({
  exerciseId: Yup.number().integer().min(1).required("Cada ejercicio de la rutina necesita un exerciseId"),
  orderIndex: Yup.number().integer().min(1).default(1),
  restSeconds: Yup.number().integer().min(0, "El descanso no puede ser negativo").default(90),
  ExerciseSets: Yup.array().of(setSchema).default([]),
});

const routineSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("El nombre de la rutina es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  description: Yup.string().trim().nullable(),
  muscleGroup: Yup.string().lowercase().oneOf(MUSCLE_GROUPS, "El grupo muscular no es válido").nullable(),
  RoutineExercises: Yup.array().of(routineExerciseSchema),
});

module.exports = { routineSchema };
