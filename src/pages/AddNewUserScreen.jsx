import { Formik, Form, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import TextField from "../components/TextField";
import * as Yup from "yup";
import { userRegister } from "./api/authentication";
import { Button, Card, Col, Row } from "react-bootstrap";
import { addCategory, getCategory, updateCategory } from "./api/category";
import CheckboxGroup from "../components/CheckboxGroup";
import { addUser, getUsers, updateUser } from "./api/users";

const AddNewUserScreen = ({ match, history, heading }) => {
  const [currentUser, setCurrentUser] = useState([]);
  const [UserImage, setUserImage] = useState([]);
  const [userId, setUserId] = useState(match.params.id);

  //const [active, setActive] = useState([{ key: "Active", value: "true" }]);

  //const [tr, setTr] = useState(["false"]);

  const validate = Yup.object({
    name: Yup.string()
      .min(1, "Name must be atleast one character")
      .required("Required"),
    email: Yup.string().email("email is invalid").required("Required"),
    password: Yup.string()
      .min(6, "password must be 6 characters")
      .required("Required"),
  });

  const handleImageChange = (e, formik) => {
    if (e.target.files) {
      const U = URL.createObjectURL(e.target.files[0]);
      setUserImage(U);
      URL.revokeObjectURL(e.target.files);
    }
    formik.setFieldValue("image", e.currentTarget.files[0]);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const fetchUser = async () => {
      const data = await getUsers(user.success.token);

      data.data.map((user, index) => {
        if (user.id == userId) {
          console.log(user);
          setCurrentUser(user);
          setUserImage(user.photo);
          // const arr = new Array(1);
          //const status = category.active;
          // if (status === true) {
          //  setTr("true");
          // }
        }
      });
    };
    fetchUser();

    console.log(currentUser);
    console.log(userId);
  }, []);

  const handleSubmit = async (formdata) => {
    if (userId) {
      await updateUser(formdata);
      console.log("ok");
    } else {
      await addUser(formdata);
    }
    // history.push("/users");
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Formik
          enableReinitialize
          initialValues={{
            name: currentUser.name || "",
            email: currentUser.email || "",
            password: currentUser.password || "",
            image: UserImage || "",
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            let formdata = new FormData();

            if (userId) {
              formdata.append("id", userId);
            }
            formdata.append("name", values.name);
            formdata.append("email", values.email);
            formdata.append("password", values.password);

            if (typeof values.image === "string") {
              formdata.delete("image");
            } else {
              formdata.append("photo", values.photo);
            }

            // formdata.append("image", values.image);
            handleSubmit(formdata);
          }}
        >
          {(formik) => (
            <Form>
              <div className="my-4">
                <div className="row">
                  <div className="col-5">
                    {console.log(formik.values)}
                    {userId ? (
                      <div>
                        <Card
                          className="my-2 p-1 rounded"
                          style={{ height: "280px", objectFit: "cover" }}
                        >
                          <Card.Img
                            style={{ height: "270px", objectFit: "contain" }}
                            src={UserImage}
                            variant="top"
                          />
                        </Card>

                        <div className="d-flex my-2 ">
                          <label className="custom-file-upload w-100">
                            <input
                              type="file"
                              onChange={(e) => handleImageChange(e, formik)}
                              name="image"
                            />
                            <ErrorMessage
                              component="div"
                              className="error text-danger"
                              name={"image"}
                            />
                            <i className="bx bx-cloud-upload mx-2"></i>Upload
                            New Image
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Card
                          className="my-2 p-1 rounded"
                          style={{ height: "280px", objectFit: "cover" }}
                        >
                          <Card.Img
                            style={{ height: "270px", objectFit: "contain" }}
                            src={UserImage}
                            variant="top"
                          />
                        </Card>

                        <div className="d-flex my-2 ">
                          <label className="custom-file-upload w-100">
                            <input
                              type="file"
                              onChange={(e) => handleImageChange(e, formik)}
                              name="image"
                            />
                            <ErrorMessage
                              component="div"
                              className="error text-danger"
                              name={"image"}
                            />
                            <i className="bx bx-cloud-upload mx-2"></i>Upload
                            New Image
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-7">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <TextField label="Name" name="name" type="text" />
                      </div>
                      <div className="col-md-6">
                        <TextField label="email" name="email" type="text" />
                      </div>
                    </div>
                    <div className="row g-3">
                      <TextField
                        label="Admin Password"
                        name="password"
                        type="password"
                      />
                    </div>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <TextField
                          className="form-control  shadow-none rounded"
                          label="Image"
                          name="image"
                          type="text"
                        ></TextField>
                      </div>
                    </div>
                    <button className="btn btn-success mt-3 my-2" type="submit">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default AddNewUserScreen;
