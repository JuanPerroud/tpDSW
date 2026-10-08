import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { getErrorMessage } from '../services/api';

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
      const { user, token } = await authService.login(values);
      if (user && token) {
        if (onLoginSuccess) onLoginSuccess(user, token);
        navigate('/routines');
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setLoginError(
        getErrorMessage(error, "Credenciales incorrectas. Verificá tu email y contraseña."),
      );
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
