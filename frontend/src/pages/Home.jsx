import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./Home.css";

function Home({ setIsLoggedIn }) {


  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('el email es obligatorio'),
    password: Yup.string().min(6).max(10).required('password obligatoria'),
  });

  const onSubmit = ( values, {setErrors}) => {

      axios.post("http://localhost:3000/api/user/login", values).then((response) => {
        alert("Usuario inicio sesion con exito");

        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        
        navigate('/routines');
        }).catch((error) => {
          const errorMsg = error.response?.data?.mensaje || error.response?.data?.error;

          if (error.response && error.response.status === 400) {
            setErrors({
              email: errorMsg || "Credenciales incorrectas"
            });
          } else {
            alert("Ocurrió un error. Vuelva a intentarlo.");
          }
          console.error("Error al iniciar sesión:", error);
      });       
  };
  return (
    <>
      <div className="home-page">
        <h1>Bienvenido a GymRoutines</h1>
        <p>Organizá tus ejercicios y armá tus rutinas de entrenamiento.</p>
        <h1>Inicio de sesion</h1>
      </div>

      <div className="login"> 
          <Formik
              initialValues={initialValues} 
              onSubmit={onSubmit}
              validationSchema={validationSchema}
          >
                <Form className="formContainer">
                  <label>Email: </label>
                  <ErrorMessage name ="email" component="span" />
                  <Field 
                    id="inputEmail" 
                    name="email"
                    type="email"
                    placeholder="ej: aranda@gmail.com.." 
                    autoComplete="off" 
                  />
          
                  <label>Password: </label>
                  <ErrorMessage name ="password" component="span" />
                  <Field 
                    id="inputPassword" 
                    name="password"
                    type="password" // Para ocultar los caracteres al escribir la contra
                    placeholder="******" 
                    autoComplete="off" 
                  />   

                  <button type="submit"> Iniciar sesion </button>
                </Form>
          </Formik>
      </div>
    </>
  );

  
}

export default Home;
