import { observer } from 'mobx-react-lite';
import React from 'react';
import { ErrorMessage, Form, Formik } from "formik";
import { Button,Header } from "semantic-ui-react";
import CustomTextInput from "../../app/common/form/CustomTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup'; 
import ValidationErrors from '../errors/ValidationErrors';


function RegisterForm() {

const {userStore} = useStore();

// Yup.setLocale({
//   displayName: "Name field is required",
//   username: "Username is required",
//   email: "Email is required",
//   password: "Password is required",
// })

return (
  <Formik
    initialValues={{
      displayName: "",
      username: "",
      email: "",
      password: "",
      error: null,
    }}
    onSubmit={(values, { setErrors }) =>
      userStore.register(values).catch((error) => {
        console.log(error);
        setErrors({ error });
      })
    }
    validationSchema={Yup.object({
      displayName: Yup.string().required("Name field is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().required("Email is required").email(field=>`${field.value} is not a valid email`),
      password: Yup.string().required("Password is required"),
    })}
  >
    {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
      <Form
        className="ui form error"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Header
          content="Sign Up To Reactivities"
          as="h2"
          color="teal"
          textAlign="center"
        />
        <CustomTextInput name="displayName" placeholder="Display Name" />
        <CustomTextInput name="username" placeholder="Username" />
        <CustomTextInput name="email" placeholder="Email" />
        <CustomTextInput
          name="password"
          placeholder="Password"
          type="password"
        />
        {/* {errors.customError?<ValidationErrors errors={errors.customError}/>:null}     */}
        <ErrorMessage
          name="error"
          render={() => <ValidationErrors errors={errors.error} />}
        />
        <Button
          disabled={!isValid || !dirty || isSubmitting}
          loading={isSubmitting}
          positive
          content="Register"
          type="submit"
          fluid
        />
      </Form>
    )}
  </Formik>
);
}

export default observer(RegisterForm);