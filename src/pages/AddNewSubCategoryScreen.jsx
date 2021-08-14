import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import TextField from "../components/TextField";
import * as Yup from "yup";
import { userRegister } from "./api/authentication";
import { Button, Card, Col, Row } from "react-bootstrap";
import { addCategory, getCategory, updateCategory } from "./api/category";
import CheckboxGroup from "../components/CheckboxGroup";
import {
  addsubCategory,
  getSubCategory,
  updateSubCategory,
} from "./api/subcategory";

const AddNewSubCategoryScreen = ({ match, history, heading }) => {
  const [currentcategory, setCurrentCategory] = useState([]);
  const [CategoryImage, setCategoryImage] = useState([]);
  const [CategoryId, setCategoryId] = useState(match.params.id);

  const [active, setActive] = useState([{ key: "Active", value: "true" }]);

  const [tr, setTr] = useState(["false"]);

  const validate = Yup.object({
    name_en: Yup.string()
      .min(1, "Name must be atleast one character")
      .required("Required"),
    name_ar: Yup.string()
      .min(1, "Name must be atleast one character")
      .required("Required"),
    image: Yup.string().required("Required"),
  });

  const handleImageChange = (e, formik) => {
    if (e.target.files) {
      const U = URL.createObjectURL(e.target.files[0]);
      setCategoryImage(U);
      URL.revokeObjectURL(e.target.files);
    }
    formik.setFieldValue("image", e.currentTarget.files[0]);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const fetchCategory = async () => {
      const { data } = await getSubCategory(user.success.token);
      data.map((category, index) => {
        if (category.id == CategoryId) {
          console.log(category);
          setCurrentCategory(category);
          // const arr = new Array(1);
          const status = category.active;
          if (status === true) {
            setTr("true");
          }
        }
      });
    };
    fetchCategory();

    console.log(currentcategory);
    console.log(CategoryId);
  }, []);

  const handleSubmit = async (formdata) => {
    if (CategoryId) {
      console.log("ok");
      await updateSubCategory(formdata);
    } else {
      await addsubCategory(formdata);
    }
    history.push("/categories");
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Formik
          enableReinitialize
          initialValues={{
            name_en: currentcategory.name_en || "",
            name_ar: currentcategory.name_ar || "",
            isactive: tr || "",
            image: currentcategory.fullimageurl || "",
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            let formdata = new FormData();
            if (CategoryId) {
              formdata.append("id", CategoryId);
            }
            formdata.append("name_en", values.name_en);
            formdata.append("name_ar", values.name_ar);

            if (values.isactive === "true") {
              formdata.append(1, values.isactive);
            } else {
              formdata.append(0, values.isactive);
            }

            if (values.image.prototype === File.prototype) {
              formdata.append("image", values.image);
            }
            // formdata.append("image", values.image);
            handleSubmit(formdata);
          }}
        >
          {(formik) => (
            <div className="my-4">
              <div className="row">
                <div className="col-5">
                  {console.log(formik.values)}
                  {CategoryId ? (
                    <Card
                      className="my-2 p-1 rounded"
                      style={{ height: "280px", objectFit: "cover" }}
                    >
                      <Card.Img
                        style={{ height: "270px", objectFit: "contain" }}
                        src={currentcategory.fullimageurl}
                        variant="top"
                      />
                      <div className="d-flex my-3">
                        <span className="icon icon-md"></span>
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, formik)}
                          name="image"
                        />
                      </div>
                    </Card>
                  ) : (
                    <Card
                      className="my-2 p-1 rounded"
                      style={{ height: "280px", objectFit: "cover" }}
                    >
                      <Card.Img
                        style={{ height: "270px", objectFit: "contain" }}
                        src={CategoryImage}
                        variant="top"
                      />
                      <div className="d-flex my-3">
                        <span className="icon icon-md"></span>
                        <input
                          type="file"
                          onChange={(e) => handleImageChange(e, formik)}
                          name="image"
                        />
                      </div>
                    </Card>
                  )}
                </div>

                <div className="col-7">
                  <Row>
                    <Form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <TextField
                            label="English Name"
                            name="name_en"
                            type="text"
                          />
                        </div>
                        <div className="col-md-6">
                          <TextField
                            label="Arabic Name"
                            name="name_ar"
                            type="text"
                          />
                        </div>
                      </div>

                      <div className="row g-3">
                        <CheckboxGroup
                          control="checkbox"
                          label="status"
                          name="isactive"
                          options={active}
                        />
                      </div>

                      <button
                        className="btn btn-success mt-3 my-2"
                        type="submit"
                      >
                        Save
                      </button>
                    </Form>
                  </Row>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
};

export default AddNewSubCategoryScreen;
