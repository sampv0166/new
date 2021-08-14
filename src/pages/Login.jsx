import { Formik, Form } from "formik";
import TextField from "../components/TextField";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { userLogin } from "./api/authentication";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "bootstrap";

//import useUserInfo from "./useToken";

const LoginScreen = ({ location, history, setUser, user }) => {
  const [error, setError] = useState([]);
  const [showerror, setShowError] = useState(true);

  //const { user, setUser } = useUserInfo();

  const validate = Yup.object({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 charaters")
      .required("Password is required"),
  });

  const handleSubmit = async (values) => {
    const userinfo = await userLogin(values.email, values.password);
    setUser(userinfo);
    if (userinfo !== null && userinfo.success) {
      console.log("ok");
      // window.location.pathname = '/';
      history.push("/");
    } else {
      setShowError(false);
    }
  };

  useEffect(() => {}, [user, error, showerror]);

  //const redirect = location.search ? location.search.split('=')[1] : '/'

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validate}
      onSubmit={(values) => {
        console.log(values);
        handleSubmit(values);
      }}
    >
      {(formik) => (
        <div className="d-flex justify-content-center">
          <Card
            border="light"
            className="bg-white mb-4  bg-white p-4 my-5 rounded login shadow"
            style={{ width: "500px" }}
          >
            <Card.Body>
              <div className="">
                <div className="my-5">
                  <h1 className="my-4 font-weight-bold display-4">Log in</h1>

                  <Form>
                    <TextField label="Email" name="email" type="email" />
                    <TextField
                      label="password"
                      name="password"
                      type="password"
                    />

                    <button
                      className="link-button text-md-center fs-3  w-100 btn btn-dark mt-3"
                      type="submit"
                      onClick={() =>
                        setTimeout(() => {
                          // ***
                          setShowError(true); // *** If you want to clear the error message as well
                        }, 3000)
                      }
                    >
                      Login
                    </button>

                    {showerror ? (
                      ""
                    ) : (
                      <div className="bg-danger text-white my-2  rounded ">
                        Wrong Credntials !! please try again
                      </div>
                    )}

                    {/*!currentUser.success  ? <div className='bg-danger rounded my-3'>wrong credentials</div> : ""*/}
                  </Form>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </Formik>
  );
};

LoginScreen.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginScreen;
