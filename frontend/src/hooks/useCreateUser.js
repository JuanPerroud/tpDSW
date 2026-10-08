import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';

export function useCreateUser() {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");

  const initialValues = {
    name: "",
    surname: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    surname: Yup.string().required('El apellido es obligatorio'),
    age: Yup.number()
      .min(1, 'La edad debe ser mayor a 0')
      .max(120, 'La edad debe ser menor a 120')
      .required('La edad es obligatoria'),
    email: Yup.string()
      .email('Ingresá un correo electrónico válido')
      .required('El email es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(20, 'La contraseña no puede superar los 20 caracteres')
      .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required('La confirmación de contraseña es obligatoria'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setRegisterError("");
    try {
      await authService.register({
        name: values.name,
        surname: values.surname,
        age: values.age,
        email: values.email,
        password: values.password,
      });
      alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
      navigate("/");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setRegisterError(
        getErrorMessage(error, "Ocurrió un error al crear la cuenta. Intentalo de nuevo."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    registerError,
    initialValues,
    validationSchema,
    onSubmit
  };
}
