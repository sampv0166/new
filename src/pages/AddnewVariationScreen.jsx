import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { Formik, Formik as Formik2 } from "formik";
import React, { useEffect, useState } from "react";
import { Alert, Card, Col, Form, Row, Tabs } from "react-bootstrap";
import {
  deleteVariation,
  deleteVariationImage,
  getvariations,
  updateProductVariation,
} from "./api/variations";
import TextField from "../components/TextField";
import * as Yup from "yup";
import "./ProductVariationScreen.css";
import { getProduct } from "./api/products";
import { Link } from "react-router-dom";
import { SketchPicker } from "react-color";
import { Tab } from "bootstrap";

const AddNewProductVariationScreen = ({
  match,
  history,
  heading,
  varId,
  setVarId,
  setShow,
  setProductVariations,
  setRefresh,
}) => {
  const [variationId, setVariationId] = useState([]);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formikFileArray, setFormikFileArray] = useState([]);
  const [ProductVariationList, setProductionVariationList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [offer, setOffer] = useState({ checked: false });

  const [color, setColor] = useColor("hex", "#121212");
  const TableHead = ["id", "name", "image", " ", " "];

  const handleImageChange = (e, formik) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      // console.log('filesArray: ', filesArray);
      setSelectedFiles((prevImages) => prevImages.concat(filesArray));

      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
    setFormikFileArray([e.target.files]);

    formik.setFieldValue("images", formikFileArray);
  };

  const clear = (e, formik) => {
    e.preventDefault();
    formik.setFieldValue("name_ar", "");
    formik.setFieldValue("name_en", "");
    formik.setFieldValue("price", 0);
    formik.setFieldValue("offerprice", 0);
    formik.setFieldValue("stocks", "");
    formik.setFieldValue("sku", "");
    formik.setFieldValue("color_name", "");
    formik.setFieldValue("color_value", "");
    formik.setFieldValue("hasoffer", false);
    formik.setFieldValue("size_value", "");

    setFormikFileArray([]);
    setSelectedFiles([]);
    formik.setFieldValue("images", []);

    setVarId(0);
  };

  const handleDeletevariation = async (e, id) => {
    e.preventDefault();
    if (window.confirm("Are you sure")) {
      deleteVariation(id);
      console.log(id + " user deleted");
    }
  };

  const handleVariationAddUpdate = async (e, formik2) => {
    e.preventDefault();
    console.log(formik2.values);
    let formdata = new FormData();

    formdata.append("product_id", productId);

    formdata.append("name_ar", formik2.values.variation_name_ar);
    formdata.append("name_en", formik2.values.variation_name_en);

    if (typeof formik2.values.images === "string") {
      formdata.delete("images");
    } else {
      for (var i = 0; i < formik2.values.images.length; i++) {
        formdata.append(`images[${i}]`, formik2.values.images[i]);
      }
    }

    formdata.append("price", formik2.values.price);
    formdata.append("offerprice", formik2.values.offerprice);
    formdata.append("stocks", formik2.values.stocks);
    formdata.append("sku", formik2.values.sku);
    formdata.append("color_name", formik2.values.color_name);
    formdata.append("color_value", formik2.values.color_value);
    formdata.append("size_value", formik2.values.size_value);

    formik2.values.hasoffer === true
      ? formdata.append("hasoffer", 1)
      : formdata.append("hasoffer", 0);

    handleSubmit(formdata);
  };
  const handleVariationImageChange = async (e, formik) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );

      setSelectedFiles((prevImages) => prevImages.concat(filesArray));

      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }

    const files = Array.from(e.target.files).map((file) => file);
    //
    console.log(files);

    //setFormikFileArray([...formikFileArray, files]);
    //im.push(e.target.files);

    Array.from(e.target.files).forEach((file) => {
      formikFileArray.push(file);
    });

    console.log(formikFileArray);

    formik.setFieldValue("images", formikFileArray);
  };
  const handleRemoveVariationImage = (
    e,
    fileToRemove,
    index,
    source,
    formikFileArray,
    formik
  ) => {
    e.preventDefault();

    source = source.filter((fileName) => fileName !== fileToRemove);
    console.log(source);
    formikFileArray.filter((fileName) => fileName !== fileToRemove);

    setSelectedFiles(source);
    const files = Array.from(formikFileArray).filter((file, i) => index !== i);
    formik.setFieldValue("images", files);
    console.log(files);
    setFormikFileArray(files);
    //console.log(fileimages);
  };
  const renderPhotos = (source, formik) => {
    //.log('source: ', source);

    return source.map((photo, index) => {
      return (
        <div className="col w-100">
          <Card
            className="my-2 p-1 rounded"
            style={{ height: "180px", objectFit: "contain" }}
          >
            <Card.Img
              style={{ height: "170px", objectFit: "contain" }}
              src={photo}
              variant="top"
              key={photo}
            />
            <button
              onClick={(e) =>
                handleRemoveVariationImage(
                  e,
                  source[index],
                  index,
                  source,
                  formikFileArray,
                  formik
                )
              }
              type="button px-1"
              className="btn btn-white text-danger rounded fs-3"
              style={{ position: "absolute" }}
            >
              <i className="bx bx-trash"></i>
            </button>
          </Card>
        </div>
      );
    });
  };

  const handleClick = (e, id) => {
    setVariationId(id);
  };
  const productId = match.params.id;

  //const varId = match.params.variationId;

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProduct();
      data.data.map((product) => {
        if (product.id == productId) {
          setCurrentProduct(product);
          console.log("products");
          setProducts(product.variations);
          console.log(products);
          product.variations.map((variations) => {
            if (variations.id == varId) {
              setImages();
              setSelectedFiles(variations.images);

              if (variations.hasoffer === true) {
                setOffer({ checked: true });
              } else {
                setOffer({ checked: false });
              }
              //  console.log(images);
            } else if (varId === 0) {
              setSelectedFiles([]);
            }
            //  console.log(variationId);
            //
            variations.images.map((variationimages) => {
              // console.log(variationimages);
            });
          });

          // console.log(product);
        }
      });
    };
    fetchProducts();
  }, [varId]);

  const handleSubmit = async (formdata) => {
    const res = await updateProductVariation(formdata);
    // history.push('/product');
  };

  const validate = Yup.object({
    variation_name_ar: Yup.string(),
    variation_name_en: Yup.string(),
    images: Yup.array(),
    product_id: Yup.number(),
    price: Yup.number(),
    offerprice: Yup.number(),
    hasoffer: Yup.number(),
    stocks: Yup.number(),
    sku: Yup.string(),
    color_name: Yup.string(),
    color_value: Yup.string(),
  });

  return (
    <div>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <div>
            <Formik
              enableReinitialize
              initialValues={{
                variation_name_ar: "",
                variation_name_en: "",
                images: [],
                price: "",
                offerprice: "",
                stocks: "",
                sku: "",
                color_name: "",
                color_value: "",
                hasoffer: "",
                size_value: "",
              }}
              validationSchema={validate}
              onSubmit={(e, values) => {}}
            >
              {(formik) => (
                <div className="my-4">
                  <Form>
                    <Tabs
                      defaultActiveKey="details"
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="details" title="DETAILS">
                        <div>
                          <div className="row g-3">
                            <div className="my-4">
                              <label
                                style={{ cursor: "pointer" }}
                                className="text-nowrap border shadow py-3 px-4 bg-white text-success add-photo rounded w-100"
                                htmlFor="file"
                              >
                                <i className="bx bx-image-add my-5 mx-4"> </i>
                              </label>
                            </div>
                            <div className="col">
                              <input
                                name="images"
                                type="file"
                                id="file"
                                multiple
                                onChange={(e) =>
                                  handleVariationImageChange(e, formik)
                                }
                              />

                              <div className="result">
                                <Row>{renderPhotos(selectedFiles, formik)}</Row>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Row>
                          <div className="my-4">
                            <div className="row g-3">
                              <div className="col-md-6">
                                <TextField
                                  label="Arabic Name"
                                  name="variation_name_ar"
                                  type="text"
                                />
                              </div>
                              <div className="col-md-6">
                                <TextField
                                  label="English Name"
                                  name="variation_name_en"
                                  type="text"
                                />
                              </div>
                            </div>

                            <div className="row g-3">
                              <div className="col-md-6">
                                <TextField
                                  className="form-control shadow-none rounded"
                                  label="Price"
                                  name="price"
                                  type="number"
                                />
                              </div>

                              <div className="col-md-6">
                                <TextField
                                  label="Offer Price"
                                  name="offerprice"
                                  type="number"
                                />
                              </div>
                            </div>

                            <div className="row g-3">
                              <div className="col-md-6">
                                <TextField
                                  label="Stock"
                                  name="stocks"
                                  type="number"
                                />
                              </div>
                              <div className="col-md-6">
                                <TextField
                                  label="SKU"
                                  name="sku"
                                  type="number"
                                />
                              </div>
                            </div>

                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                checked={offer.checked}
                                onChange={(d) => {
                                  offer.checked === true
                                    ? (d = false)
                                    : (d = true);
                                  setOffer({ checked: d });
                                  formik.setFieldValue("hasoffer", d);
                                }}
                              />
                              {console.log(formik.values)}
                              <label
                                class="form-check-label"
                                for="flexSwitchCheckDefault"
                              >
                                Has Offer
                              </label>
                            </div>
                          </div>
                        </Row>
                      </Tab>

                      <Tab eventKey="choose" title="COLOR & SIZE">
                        <div className="row g-3 mx-1">
                          <div className="col-md-6">
                            <TextField
                              label="Color Name"
                              name="color_name"
                              type="text"
                            />
                          </div>

                          <div className="col-md-6">
                            <TextField
                              label="Size"
                              name="size_value"
                              type="text"
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <SketchPicker
                            color={color}
                            onChange={(updatedColor) => {
                              setColor(updatedColor.hex);
                              formik.setFieldValue(
                                "color_value",
                                updatedColor.hex
                              );
                            }}
                            width="300px"
                          />
                        </div>

                        <Col></Col>
                      </Tab>
                    </Tabs>

                    <div
                      style={{
                        cursor: "pointer",
                        width: "210px",
                      }}
                      className="d-flex W-100 justify-content-center text-nowrap bg-success rounded p-3 my-2 text-white"
                      onClick={(e) => {
                        if (
                          formik.values.images.length === 0 ||
                          formik.values.price === "" ||
                          formik.values.stocks === "" ||
                          formik.values.stocks === "" ||
                          (formik.values.color_name === "" &&
                            formik.values.color_value !== "")
                        ) {
                          setShowAlert(true);
                          setTimeout(() => {
                            // ***
                            setShowAlert(false);
                          }, 5000);
                        } else {
                          handleVariationAddUpdate(e, formik);
                          setShow(false);
                          setShowAlert(false);
                          setColor("");

                          const fetchProducts = async () => {
                            const { data } = await getProduct();
                            data.data.map((product) => {
                              if (product.id == productId) {
                                setCurrentProduct(product);
                                setProducts(product.variations);
                                setProductVariations(product.variations);
                              }
                            });
                          };
                          fetchProducts();

                          setRefresh((oldKey) => oldKey + 1);
                        }
                      }}
                    >
                      SAVE
                    </div>
                    {showAlert ? (
                      formik.values.images.length === 0 ? (
                        <Alert variant="danger">image required</Alert>
                      ) : formik.values.price === "" ? (
                        <Alert variant="danger">price required</Alert>
                      ) : formik.values.stocks === "" ? (
                        <Alert variant="danger">stock is required</Alert>
                      ) : formik.values.color_name === "" &&
                        formik.values.color_value !== "" ? (
                        <Alert variant="danger">enter color name</Alert>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </Form>
                </div>
              )}
            </Formik>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddNewProductVariationScreen;
