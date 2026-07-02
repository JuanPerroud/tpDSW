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

  const onSubmit = (data, {setErrors}) => {
  
      axios.post("http://localhost:3000/api/user", data).then((response) => {
        alert("¡User create in the DATABASE! ");
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
    <div className="createUserAccount"> 
  
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
                    placeholder="(example.Jhonny...)" 
                    autoComplete="off" 
                />
          
                <label>Email: </label>
                <ErrorMessage name ="email" component="span" />
                <Field 
                    id="inputCreateUser" 
                    name="email"
                    placeholder="(example.juanjosebruzzesi@gmail.com...)" 
                    autoComplete="off" 
                />
          
                <label>Password: </label>
                <ErrorMessage name ="password" component="span" />
                <Field 
                    id="inputCreateUser" 
                    name="password"
                    placeholder="(example.clarita123...)" 
                    autoComplete="off" 
                />   

                <button type="submit"> Create Account </button>
            </Form>
        </Formik>
    </div>
  );
}

export default CreateUser;