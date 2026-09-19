import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import { useCreateUser } from '../../hooks/useCreateUser';
import "../Home/Home.css";

const CreateUser = () => {
  const { registerError, initialValues, validationSchema, onSubmit } = useCreateUser();

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

                <div className="form-group">
                  <label htmlFor="inputConfirmPassword">Confirmar Contraseña</label>
                  <Field
                    id="inputConfirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Repetí tu contraseña"
                    autoComplete="new-password"
                    className={errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}
                  />
                  <ErrorMessage name="confirmPassword" component="span" className="field-error" />
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