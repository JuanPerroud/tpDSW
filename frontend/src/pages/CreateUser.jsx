import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";

function CreateUser(){
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string().min(6).max(10).required(),
  });

  const onSubmit = (values, {setErrors}) => {
  
      axios.post("http://localhost:3000/api/user", values).then((response) => {
        alert("el usuario ha sido creado");
        window.location.href = "/"; 
        }).catch((error) => {

          if (error.response && error.response.status === 400) {
            setErrors({
              email: error.response.data.error
            });
          } else {
            alert("Error connection to server.");
          }
          console.error("Error to create user:", error);
        });
  };

  return (
    <div className="createUser"> 
  
        <Formik
           initialValues={initialValues} 
           onSubmit={onSubmit}
           validationSchema={validationSchema}
        >
            <Form className="formContainer">
                <label>Name: </label>
                <ErrorMessage name ="name" component="span" />
                <Field 
                    id="inputCreateUser" 
                    name="name"
                    placeholder="ej: Lautaro.." 
                    autoComplete="off" 
                />
          
                <label>Email: </label>
                <ErrorMessage name ="email" component="span" />
                <Field 
                    id="inputCreateUser" 
                    name="email"
                    placeholder="ej: blanco@gmail.com.." 
                    autoComplete="off" 
                />
          
                <label>Password: </label>
                <ErrorMessage name ="password" component="span" />
                <Field 
                    id="inputCreateUser" 
                    name="password"
                    placeholder="ej: septima7.." 
                    autoComplete="off" 
                />   

                <button type="submit"> Crear Cuenta </button>
            </Form>
        </Formik>
    </div>
  );
}

export default CreateUser;