import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";

function Home({ onLoginSuccess }) {
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
        onLoginSuccess(response.data.user);
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

  return (
    <div className="home-page">
      <div className="home-hero">
        <span className="hero-badge">💪 Tu Gimnasio, Tu Control</span>
        <h1>Bienvenido a GymRoutines</h1>
        <p>
          Organizá tus ejercicios, diseñá tus rutinas de entrenamiento y
          descubrí las mejores rutinas de la comunidad.
        </p>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <div className="card-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresá a tu cuenta para continuar</p>
          </div>

          {loginError && (
            <div className="auth-error-banner" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="auth-form">
                <div className="form-group">
                  <label htmlFor="inputEmail">Correo Electrónico</label>
                  <Field
                    id="inputEmail"
                    name="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    className={errors.email && touched.email ? "input-error" : ""}
                  />
                  <ErrorMessage name="email" component="span" className="field-error" />
                </div>

                <div className="form-group">
                  <label htmlFor="inputPassword">Contraseña</label>
                  <Field
                    id="inputPassword"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={errors.password && touched.password ? "input-error" : ""}
                  />
                  <ErrorMessage name="password" component="span" className="field-error" />
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="card-footer">
            <p>
              ¿No tenés una cuenta?{" "}
              <Link to="/CreateUser" className="register-link">
                Registrate acá
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
