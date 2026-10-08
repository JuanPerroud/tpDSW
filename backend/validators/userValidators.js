const Yup = require("yup");

// Un input vacío ("") se trata como ausente
const emptyToUndefined = (value, original) => (original === "" ? undefined : value);

const password = Yup.string()
  .min(6, "La contraseña debe tener al menos 6 caracteres")
  .max(20, "La contraseña no puede superar los 20 caracteres");

const age = Yup.number()
  .transform(emptyToUndefined)
  .typeError("La edad debe ser un número")
  .integer("La edad debe ser un número entero")
  .min(1, "La edad debe ser mayor a 0")
  .max(120, "La edad debe ser menor a 120");

const registerSchema = Yup.object({
  name: Yup.string().trim().required("El nombre es obligatorio").max(255),
  surname: Yup.string().trim().required("El apellido es obligatorio").max(255),
  age: age.required("La edad es obligatoria"),
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Ingresá un correo electrónico válido")
    .required("El email es obligatorio"),
  password: password.required("La contraseña es obligatoria"),
});

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Ingresá un correo electrónico válido")
    .required("El email es obligatorio"),
  password: Yup.string().required("La contraseña es obligatoria"),
});

const updateSchema = Yup.object({
  name: Yup.string().trim().min(1, "El nombre no puede estar vacío").max(255),
  surname: Yup.string().trim().min(1, "El apellido no puede estar vacío").max(255),
  age,
  password: Yup.string()
    .transform(emptyToUndefined)
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(20, "La contraseña no puede superar los 20 caracteres"),
});

const changePasswordSchema = Yup.object({
  password: password.required("La nueva contraseña es obligatoria"),
});

module.exports = { registerSchema, loginSchema, updateSchema, changePasswordSchema };
