import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { Formik, Form, ErrorMessage } from "formik";
import { Alert, Col, Row, Tabs } from "react-bootstrap";
import Select from "../components/Select";
import { addProduct, getProduct, updateProduct } from "./api/products";
import { getShops } from "./api/shop";
import { Modal } from "react-bootstrap";

import { Button, Card } from "react-bootstrap";

import { ChromePicker, SketchPicker } from "react-color";
import ProductVariationScreen from "./VariationScreen";
import { Tab } from "bootstrap";
import { getCategory } from "./api/category";
import { findAllByDisplayValue, render } from "@testing-library/react";

const AddProductScreen = ({ match, history, setRefresh}) => {
  
  const [addproductVariations, setaddProductVariations] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [shops, setShops] = useState([]);
  const [images, setImages] = useState([]);
  const [variationId, setVariationId] = useState(0);
  const [img, setImg] = useState(0);
  const [showProductVariation, setProductvariation] = useState(0);
  const [varId, setVarId] = useState(0);
  const [show, setShow] = useState(false);
  const [imageError, setimageError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showSucess, setShowSuccess] = useState(false);

  const [active, setActive] = useState({ checked: false });
  const [special, setSpecial] = useState({ checked: false });
  const [bestSeller, setBestSeller] = useState({ checked: false });
  const [offer, setOffer] = useState({ checked: false });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formikFileArray, setFormikFileArray] = useState([]);

  const [ProductVariationList, setProductVariationList] = useState([]);

  const [showColorPicker, setShowColorPicker] = useState(false);

  


  const [color, setColor] = useState("FAF5F5");
  const TableHead = ["id", "name", "price", "size", " "];

  const productId = match.params.id;

  const validate = Yup.object({
    name_ar: Yup.string().required("Required"),
    name_en: Yup.string().required("Required"),
    image: Yup.mixed().required("Required"),
    shop_id: Yup.number().required("Required"),
    description_ar: Yup.string().required("Required"),
    description_en: Yup.string().required("Required"),
    category_id: Yup.number().required("Required"),
    sort_index: Yup.number(),
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

  const deletevariation = async (id) => {
    let arr;

    arr = ProductVariationList.filter((item, index) => index !== id);

    console.log(arr);

    //setProductVariationList(arr);
    setProductVariationList(arr);
  };

  const addToVariationList = (e, formik) => {
    e.preventDefault();
    formik.setFieldValue("blobImage", selectedFiles);
    // console.log(ProductVariationList)
    //console.log([formik.values]);
    // arr.push(formik.values);
    //const ar = [...produc]
    //let list ;
    //list = formik.values

    //setProductVariationList([...ProductVariationList, formik.values]);

    /*async function asyncCall() {
      const result = await setProductVariationList(prev => ([...prev, formik.values]));;
      // expected output: "resolved"
    }*/

    setProductVariationList((prev) => [...prev, formik.values]);

    // arr.push(formik.values)
    // console.log(arr);

    //console.log('result');
    //console.log(ProductVariationList);

    formik.setFieldValue("variation_name_ar", "");
    formik.setFieldValue("variation_name_en", "");
    formik.setFieldValue("price", "");
    formik.setFieldValue("offerprice", "");
    formik.setFieldValue("stocks", "");
    formik.setFieldValue("sku", "");
    formik.setFieldValue("color_name", "");
    formik.setFieldValue("color_value", "");
    formik.setFieldValue("hasoffer", "");
    formik.setFieldValue("size_value", "");

    setFormikFileArray([]);
    setSelectedFiles([]);
    formik.setFieldValue("images", []);

    formik.setFieldValue("blobImage", []);
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

  const handleImageChange = (e, formik) => {
    if (e.target.files) {
      const U = URL.createObjectURL(e.target.files[0]);
      setProductImage(U);
      URL.revokeObjectURL(e.target.files);
    }

    formik.setFieldValue("image", e.currentTarget.files[0]);

    setImg(e.currentTarget.files[0]);
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

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProduct();
      data.data.map((product) => {
        if (product.id == productId) {
          setCurrentProduct(product);

          setaddProductVariations(product.variations);
          //console.log(productVariations);
          product.variations.map((variations) => {
            setImages(variations.images);
            setVariationId(variations.id);
            // console.log(variationId);
            // console.log(images);
            variations.images.map((variationimages) => {
              // console.log(variationimages);
            });
          });
          // console.log(product);
        }
      });
    };

    products.map((product) => {
      //console.log(product);
      if (product.id == productId) {
        setCurrentProduct(product);
      }
    });

    const fetCategory = async () => {
      const category2 = await getCategory();

      console.log(category2);

      let objects = [category2.length];

      for (var x = 0; x < category2.length; x++) {
        objects[x] = { key: category2[x].name_en, value: category2[x].id };
      }
      objects.unshift({ key: "choose", value: "" });
      setCategory(objects);
      setSubCategory(objects);
    };

    const fetchShops = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      const data = await getShops(user.success.token);
      const shops = data.data;
      // console.log(users);
      let arr = [shops.length];
      for (var x = 0; x < shops.length; x++) {
        arr[x] = { key: shops[x].shop_name_en, value: shops[x].id };
      }
      arr.unshift({ key: "choose", value: "" });
      //const { data } = await getshops();
      setShops(arr);
    };
    fetchShops();
    fetCategory();
    fetchProducts();
    console.log(ProductVariationList);
    console.log([formikFileArray]);
  }, [productId, ProductVariationList, formikFileArray]);

  const handleSubmit = async (formdata, arr, resetForm) => {
    const s = ProductVariationList;

    if (s.length > 0) {
      const res = await addProduct(formdata, ProductVariationList);
      setShowSuccess(true);
      setProductVariationList("");
      resetForm();
      setProductImage(null);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else {
      alert("Add atleast one variation");
    }
    // history.push('/product');
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          name_ar: "",
          name_en: "",
          image: null,
          shop_id: "",
          description_ar: "",
          description_en: "",
          category_id: "",
          subcategory_id: "",
          sort_index: "",
          bestseller: false,
          special: false,
          isactive: false,
          blobImage: [],

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
        onSubmit={(values, { resetForm }) => {
          //e.log(ProductVariationList);

          let formdata = new FormData();

          formdata.append("name_ar", values.name_ar);
          formdata.append("name_en", values.name_en);
          formdata.append("description_ar", values.description_ar);
          formdata.append("description_en", values.description_en);
          formdata.append("image", values.image);
          formdata.append("category_id", values.category_id);
          formdata.append("subcategory_id", values.subcategory_id);
          formdata.append("shop_id", values.shop_id);

          values.special === true
            ? formdata.append("special", 1)
            : formdata.append("special", 0);
          values.isactive === true
            ? formdata.append("isactive", 1)
            : formdata.append("isactive", 0);
          values.bestseller === true
            ? formdata.append("bestseller", 1)
            : formdata.append("bestseller", 0);
          formdata.append("sort_index", values.sort_index);

          handleSubmit(formdata, ProductVariationList, resetForm);
        }}
      >
        {(formik) => (
          <Form>
            <Card border="light" className="bg-white shadow-sm mb-4">
              <Card.Body>
                <Modal
                  show={show}
                  onHide={() => setShow(false)}
                  fullscreen="xxl-down"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Add new variation</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
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
                            setShowAlert(false); // *** If you want to clear the error message as well
                          }, 5000);
                        } else {
                          addToVariationList(e, formik);
                          setShow(false);
                          setShowAlert(false);
                          setColor("");
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
                  </Modal.Body>
                </Modal>

                <div className="my-4">
                  <div className="row">
                    <div className="col-5">
                      <Card
                        className="my-2 p-1 rounded"
                        style={{ height: "280px", objectFit: "cover" }}
                      >
                        <Card.Img
                          style={{ height: "270px", objectFit: "contain" }}
                          src={productImage}
                          alt=""
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
                    <div className="col-7">
                      <Card border="light" className="bg-white shadow-sm mb-4">
                        <Card.Body>
                          <Row>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <TextField
                                  label="Arabic Name"
                                  name="name_ar"
                                  type="text"
                                />
                              </div>
                              <div className="col-md-6">
                                <TextField
                                  label="English Name"
                                  name="name_en"
                                  type="text"
                                />
                              </div>
                            </div>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <TextField
                                  label="Arabic Description"
                                  name="description_ar"
                                  type="text"
                                />
                              </div>
                              <div className="col-md-6">
                                <TextField
                                  label="English Description"
                                  name="description_en"
                                  type="text"
                                />
                              </div>
                            </div>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <Select
                                  control="select"
                                  label="Category"
                                  name="category_id"
                                  options={category}
                                ></Select>
                              </div>
                              <div className="col-md-6">
                                <Select
                                  control="select"
                                  label="Sub Category"
                                  name="subcategory_id"
                                  options={category}
                                ></Select>
                              </div>
                            </div>

                            <div className="row g-3">
                              <div className="col-md-6">
                                <Select
                                  control="select"
                                  label="Shop Name"
                                  name="shop_id"
                                  options={shops}
                                ></Select>
                              </div>
                            </div>

                            <div className="row g-3">
                              <Col>
                                <TextField
                                  label="Sort Index"
                                  name="sort_index"
                                  type="number"
                                />
                              </Col>
                            </div>

                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                checked={active.checked}
                                onChange={(d) => {
                                  active.checked === true
                                    ? (d = false)
                                    : (d = true);
                                  setActive({ checked: d });
                                  formik.setFieldValue("isactive", d);
                                }}
                              />
                              {console.log(active)}
                              <label
                                class="form-check-label"
                                for="flexSwitchCheckDefault"
                              >
                                Active Status
                              </label>
                            </div>

                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                checked={special.checked}
                                onChange={(d) => {
                                  special.checked === true
                                    ? (d = false)
                                    : (d = true);
                                  setSpecial({ checked: d });
                                  formik.setFieldValue("special", d);
                                }}
                              />
                              <label
                                class="form-check-label"
                                for="flexSwitchCheckDefault"
                              >
                                Special
                              </label>
                            </div>

                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                                checked={bestSeller.checked}
                                onChange={(d) => {
                                  bestSeller.checked === true
                                    ? (d = false)
                                    : (d = true);
                                  setBestSeller({ checked: d });
                                  formik.setFieldValue("bestseller", d);
                                }}
                              />
                              <label
                                class="form-check-label"
                                for="flexSwitchCheckDefault"
                              >
                                Best Seller
                              </label>
                            </div>
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>

                    <Row>
                      {productId ? <strong>Variations</strong> : ""}
                      {addproductVariations.map((pv) => (
                        <Col>
                          {/* <Link to={`/variations/${productId}/${pv.id}`}> */}
                          <Card
                            className="my-2 p-1 rounded"
                            style={{
                              height: "60px",
                              objectFit: "contain",
                              width: "50px",
                            }}
                          >
                            <Card.Img
                              style={{
                                height: "50px",
                                objectFit: "contain",
                                cursor: "pointer",
                              }}
                              src={pv.images[0]}
                              variant="top"
                              onClick={(e) => {
                                setVarId(pv.id);
                              }}
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>

                    {/* variation details*/}
                  </div>
                </div>
              </Card.Body>
            </Card>

            <div className="row align-items-end">
              <div className="d-flex justify-content-end">
                <button
                  style={{
                    cursor: "pointer",
                    width: "210px",
                  }}
                  className="text-nowrap btn btn-outline-success rounded p-3 my-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setShow(true);
                  }}
                >
                  ADD NEW VARIATION
                </button>

                <button
                  className="text-nowrap btn btn-outline-success mx-2 rounded p-3 my-2"
                  type="submit"
                >
                  Save Product
                </button>
              </div>
              <Card border="light" className="bg-white shadow-sm mb-4">
                <Card.Body>
                  <div className="col-md-4 my-5 w-100">
                    <h6 className="text-dark">ADDED VARIATIONS</h6>
                    <table>
                      <thead>
                        <tr>
                          {TableHead.map((item, index) => (
                            <th key={index}>{item}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {ProductVariationList
                          ? ProductVariationList.map((item, index) => (
                              <tr key={index}>
                                <td>{index}</td>
                                <td>{item.variation_name_en}</td>
                                <td>{item.price}</td>
                                <td>{item.size_value}</td>
                                <td>
                                  <button
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    className="rounded"
                                    onClick={() => deletevariation(index)}
                                  >
                                    {" "}
                                    <i className="bx bx-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          : ""}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </div>
            {showSucess ? (
              <div
                className="alert alert-success position-absolute position-sticky"
                role="alert"
              >
                success
              </div>
            ) : (
              ""
            )}
            <div className="d-flex justify-content-end my-2"></div>
          </Form>
        )}
      </Formik>
      <div>
        {/* 
      <div className="d-flex ms-auto my-2">
        <button className={`btn btn-success mt-3 px-5 py-3`} type="submit">
            ADD NEW VARIATION
        </button>
      </div> */}
      </div>
    </div>
  );
};

export default AddProductScreen;
