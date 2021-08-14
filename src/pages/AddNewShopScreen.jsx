/*  shop_name_ar	String	✅
shop_name_en	String	✅
image	File	✅
email	email	✅
password	String	✅
shop_trn	String	
shop_mob	String	
shop_website	String	
open	1/0	
booth	Number	  */

import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Row } from "react-bootstrap";
import { addShop, getShops, updateShop } from "./api/shop";

import { Card } from "react-bootstrap";

const AdddNewShopScreen = ({ match, history }) => {
  const [currentShop, setCurrentshop] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [open, setopen] = useState({ checked: false });
  const [active, setActive] = useState({ checked: false });

  const shopId = match.params.id;

  const validate = Yup.object({
    shop_name_en: Yup.string().required("Required"),
    email: Yup.string().required("Required"),
    image: Yup.string(),
    password: Yup.string().required("Required"),
    shop_trn: Yup.string(),
    shop_mob: Yup.string(),
    shop_website: Yup.string(),

    booth: Yup.number(),
  });

  const handleImageChange = (e, formik) => {
    if (e.target.files) {
      const U = URL.createObjectURL(e.target.files[0]);
      setProductImage(U);
      URL.revokeObjectURL(e.target.files);
    }
    formik.setFieldValue("image", e.currentTarget.files[0]);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const fetchShops = async () => {
      const data = await getShops(user.success.token);
      data.data.map((shop, index) => {
        if (shop.id == shopId) {
          console.log(shop);
          setCurrentshop(shop);

          if (shop.open === true) {
            setopen({ checked: true });
          } else {
            setopen({ checked: false });
          }

          if (shop.status === true) {
            setActive({ checked: true });
          } else {
            setActive({ checked: false });
          }
        }
      });
    };
    fetchShops();

    console.log(currentShop);
  }, []);

  const handleSubmit = async (formdata) => {
    
    console.log("o");
    if (shopId) {
      console.log(shopId);
      await updateShop(formdata);
    } else {
      await addShop(formdata);
    }

    history.push('/shop');
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Formik
          enableReinitialize
          initialValues={{
            shop_name_en: currentShop.shop_name || "",
            email: currentShop.shop_email || "",
            image: currentShop.shop_coverImage || "",
            password: "",
            shop_trn: currentShop.shop_trn || "",
            shop_mob: currentShop.shop_mob || "",
            shop_website: currentShop.shop_website || "",
            open: currentShop.open || '',
            isactive:currentShop.status || "",
            booth: "",
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            //shop_name_en
            //console.log(values.name_ar)
            let formdata = new FormData();

            if (shopId) {
              formdata.append("id", shopId);
            }

            formdata.append("shop_name_en", values.shop_name_en);
            formdata.append("shop_name_ar", values.shop_name_en);
            formdata.append("name_en", values.shop_name_en);
            formdata.append("email", values.email);

            // if (values.image.prototype === File.prototype) {

            if (typeof values.image === "string") {
              formdata.delete("image");
            } else {
              formdata.append("image", values.image);
            }

            // it's a string
            //}
            formdata.append("password", values.password);
            formdata.append("shop_trn", values.shop_trn);
            formdata.append("shop_mob", values.shop_mob);
            formdata.append("shop_website", values.shop_website);

            // formdata.append("open", values.open);
            //formdata.append("isactive", values.isactive);

            values.open === true
              ? formdata.append("open", 1)
              : formdata.append("open", 0);

              values.isactive === true
              ? formdata.append("status", 1)
              : formdata.append("status", 0);

            formdata.append("booth", values.booth);
            console.log("k");
            handleSubmit(formdata);
          }}
        >
          {(formik) => (
            <div className="my-4">
              <div className="row">
                <div className="col-5">
                  {console.log(formik.values)}
                  {shopId ? (
                    <div>
                      <Card
                        className="my-2 p-1 rounded"
                        style={{ height: "280px", objectFit: "cover" }}
                      >
                        <Card.Img
                          style={{ height: "270px", objectFit: "contain" }}
                          src={
                            productImage.length > 0
                              ? productImage
                              : "https://www.khaymatapi.mvp-apps.ae/storage/" +
                                currentShop.shop_coverImage
                          }
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
                          <i className="bx bx-cloud-upload mx-2"></i>Upload New
                          Image
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
                          src={productImage}
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
                          <i className="bx bx-cloud-upload mx-2"></i>Upload New
                          Image
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-7">
                  <Row>
                    <Form>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <TextField
                            label="English Name"
                            name="shop_name_en"
                            type="text"
                          />
                        </div>
                        <div className="col-md-6">
                          <TextField
                            label="Password"
                            name="password"
                            type="password"
                          />
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <TextField
                            label="Shop TRN"
                            name="shop_trn"
                            type="text"
                          />
                        </div>

                        <Col>
                          <TextField label="Email" name="email" type="text" />
                        </Col>
                      </div>
                      <div className="row g-3">
                        <Col>
                          <TextField
                            label="Shop Website"
                            name="shop_website"
                            type="text"
                          />
                        </Col>
                        <div className="col-md-6">
                          <TextField
                            label="Shop Mob"
                            name="shop_mob"
                            type="text"
                          />
                        </div>
                      </div>

                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckDefault"
                          checked={active.checked}
                          onChange={(d) => {
                            active.checked === true ? (d = false) : (d = true);
                            setActive({ checked: d });
                            formik.setFieldValue("isactive", d);
                          }}
                        />
                        <label
                          class="form-check-label"
                          for="flexSwitchCheckDefault"
                        >
                          Active
                        </label>
                      </div>

                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckDefault"
                          checked={open.checked}
                          onChange={(d) => {
                            open.checked === true ? (d = false) : (d = true);
                            setopen({ checked: d });
                            formik.setFieldValue("open", d);
                          }}
                        />
                        <label
                          class="form-check-label"
                          for="flexSwitchCheckDefault"
                        >
                          Open
                        </label>
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

export default AdddNewShopScreen;
