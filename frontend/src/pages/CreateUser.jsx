import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "./Home.css";

function CreateUser() {
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState("");

  const initialValues = {
    name: "",
    email: "",
    password: "",
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
  });

  const onSubmit = async (values, { setSubmitting }) => {
    setRegisterError("");
    try {
      await axios.post("http://localhost:3000/api/user", values);
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

  return (
    <div className="home-page">
      <div className="home-hero">
        <span className="hero-badge">🚀 Unite a GymRoutines</span>
        <h1>Crea tu Cuenta Gratis</h1>
        <p>Comenzá hoy a estructurar tus entrenamientos y alcanzar tus objetivos fitness.</p>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          <div className="card-header">
            <h2>Crear Cuenta</h2>
            <p>Completá los datos para registrarte</p>
          </div>

          {registerError && (
            <div className="auth-error-banner" role="alert">
              <span className="error-icon">⚠️</span>
              <span>{registerError}</span>
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
                  <label htmlFor="inputName">Nombre</label>
                  <Field
                    id="inputName"
                    name="name"
                    type="text"
                    placeholder="Ej: Lautaro"
                    autoComplete="name"
                    className={errors.name && touched.name ? "input-error" : ""}
                  />
                  <ErrorMessage name="name" component="span" className="field-error" />
                </div>

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
                    placeholder="Contrasenia123"
                    autoComplete="new-password"
                    className={errors.password && touched.password ? "input-error" : ""}
                  />
                  <ErrorMessage name="password" component="span" className="field-error" />
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando Cuenta..." : "Registrarme"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="card-footer">
            <p>
              ¿Ya tenés una cuenta?{" "}
              <Link to="/" className="register-link">
                Iniciá sesión acá
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;