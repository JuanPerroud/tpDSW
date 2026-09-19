import { useState } from 'react';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export function useLogin(onLoginSuccess) {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Ingresá un correo electrónico válido')
      .required('El email es obligatorio'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es obligatoria'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setLoginError("");
    try {
      const response = await axios.post("http://localhost:3000/api/user/login", values);
      if (response.data && response.data.user) {
        if (onLoginSuccess) onLoginSuccess(response.data.user);
        navigate('/routines');
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      const serverMessage =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "Credenciales incorrectas. Verificá tu email y contraseña.";
      setLoginError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loginError,
    initialValues,
    validationSchema,
    onSubmit
  };
}
