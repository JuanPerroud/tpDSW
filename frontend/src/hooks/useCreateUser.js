import { useState } from 'react';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export function useCreateUser() {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
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
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
      };
      await axios.post("http://localhost:3000/api/user", userData);
      alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
      navigate("/");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      const serverMessage =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "Ocurrió un error al crear la cuenta. Intentalo de nuevo.";
      setRegisterError(serverMessage);
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
