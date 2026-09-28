import { Formik, Form, Field, ErrorMessage } from 'formik';
import { usePassword } from '../../hooks/usePassword';
import "../Home/Home.css";

const ChangePassword = () => {
    const { registerError, initialValues, validationSchema, onSubmit } = usePassword();

    return (
        <div className="home-page">
            <div className="home-hero">
                <span className="hero-badge">🚀 Unite a GymRoutines</span>
            </div>

            <div className="login-card-container">
                <div className="login-card">
                    <div className="card-header">
                        <h1>Cambia tu contraseña</h1>
                        <p>Completá los datos para cambiar tu contraseña</p>
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
                                    {isSubmitting ? "Guardando..." : "Cambiar Contraseña"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                </div>
            </div>
        </div>
    );
}

export default ChangePassword;