import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { Formik, Form } from "formik";
import { Col, Modal, Row } from "react-bootstrap";
import Select from "../components/Select";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "./api/products";
import { getCategory } from "./api/category";
import { getShops, getshops } from "./api/shop";

import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductVariationScreen from "./VariationScreen";
import AddNewProductVariationScreen from "./AddnewVariationScreen";

import { deleteVariation } from "./api/variations";

const TableHead = ["id", "name", "Image", "price", "size", " ", " "];

let variations;

const EditProductScreen = ({
  match,
  history,
  setRefresh,
  refresh,
  varId,
  setVarId,
  showVariatio0nscreen,
  setShowVariationScreen,
  show,
  setShow,
  setProduct,
  products,
  editVariationShow,
  setEditVariationShow,
}) => {
  const [productImage, setProductImage] = useState([]);

  const [currentProduct, setCurrentProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [shops, setShops] = useState([]);
  const [images, setImages] = useState([]);
  const [variationId, setVariationId] = useState(0);
  const [img, setImg] = useState(0);
  const [showProductVariation, setProductvariation] = useState(0);
  const [productVariations, setProductVariations] = useState([]);

  const [active, setActive] = useState({ checked: false });
  const [special, setSpecial] = useState({ checked: false });
  const [bestSeller, setBestSeller] = useState({ checked: false });

  const productId = match.params.id;

  const rendermodal = (show) => (
    <Modal show={true} fullscreen="xxl-down">
      <Modal.Header closeButton>
        <Modal.Title>Add new variation</Modal.Title>
      </Modal.Header>

      <Modal.Body></Modal.Body>
    </Modal>
  );

  const renderVariationscreen = () => {
    return (
      <Modal show={show} onHide={() => setShow(false)} fullscreen="xxl-down">
        <Modal.Header closeButton>
          <Modal.Title>Add new variation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddNewProductVariationScreen
            match={match}
            setRefresh={setRefresh}
            setShow={setShow}
            setProductVariations={setProductVariations}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const renderEditVariationscreen = () => {
    return (
      <Modal
        show={editVariationShow}
        onHide={() => setEditVariationShow(false)}
        fullscreen="xxl-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit variation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductVariationScreen
            match={match}
            setRefresh={setRefresh}
            varId={varId}
            setVarId={setVarId}
            setEditVariationShow={setEditVariationShow}
            setProductVariations={setProductVariations}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const validate = Yup.object({
    name_ar: Yup.string().required("Required"),
    name_en: Yup.string().required("Required"),
    image: Yup.mixed().required("Required"),
    shop_id: Yup.number().required("Required"),
    description_ar: Yup.string().required("Required"),
    description_en: Yup.string().required("Required"),
    category_id: Yup.number().required("Required"),
  });

  const handleDeletevariation = async (e, id, i) => {
    e.preventDefault();
    if (window.confirm("Are you sure")) {
      let arr;

      arr = productVariations.filter((item, index) => index !== i);

      setProductVariations(arr);

      deleteVariation(id);
    }
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

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProduct();
      data.data.map((product) => {
        if (product.id == productId) {
          setProductImage(
            "https://www.khaymatapi.mvp-apps.ae/storage/" + product.urls
          );
          console.log(product);
          setCurrentProduct(product);

          let currentToCompare = product.variations;
          setProductVariations(currentToCompare);

          console.log(product.variations);

          if (product.bestseller === true) {
            setBestSeller({ checked: true });
          } else {
            setBestSeller({ checked: false });
          }
          if (product.isactive === true) {
            setActive({ checked: true });
          } else {
            setActive({ checked: false });
          }
          if (product.special === true) {
            setSpecial({ checked: true });
          } else {
            setSpecial({ checked: false });
          }
          //console.log(productVariations);

          product.variations.map((variations) => {
            setImages(variations.images);
            setVariationId(variations.id);

            // console.log(variationId);
            console.log(images);
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

      setCategory(objects);
      setSubCategory(objects);
    };

    const fetchShops = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      const data = await getShops(user.success.token);
      const shops = data.data;
      console.log(shops);
      // console.log(users);
      let arr = [shops.length];

      for (var x = 0; x < shops.length; x++) {
        arr[x] = { key: shops[x].shop_name_en, value: shops[x].id };
      }
      //const { data } = await getshops();
      setShops(arr);
    };
    fetchShops();
    fetCategory();
    fetchProducts();
  }, [productId, refresh, editVariationShow, varId]);

  const handleSubmit = async (formdata) => {
    const res = await updateProduct(formdata, history);
    setRefresh(1);
    history.push("/products");
  };

  const deleteProductHandler = async (id) => {
    await deleteProduct(id);

    console.log(id + " product deleted");

    const fetchProducts = async () => {
      const { data } = await getProduct(1);

      setProduct(data.data);

      let currentToCompare = data.data;
      setProduct(currentToCompare);

      console.log(data);
    };
    fetchProducts();

    setRefresh(1);
    history.push("/products");
  };

  return (
    <div>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Formik
            enableReinitialize
            initialValues={{
              name_ar: currentProduct.description || "",
              name_en: currentProduct.description || "",
              image: currentProduct.urls || "",
              shop_id: currentProduct.id || "",
              description_ar: currentProduct.description || "",
              description_en: currentProduct.description || "",
              category_id: currentProduct.category_id,
              subcategory_id: currentProduct.subcategory_id,
              sort_index: currentProduct.sort_index || 0,
              bestseller: currentProduct.bestseller || false,
              special: currentProduct.special || false,
              isactive: currentProduct.isactive || false,
            }}
            validationSchema={validate}
            onSubmit={(values) => {
              //console.log(values.name_ar)
              let formdata = new FormData();
              formdata.append("id", productId);
              formdata.append("name_ar", values.name_ar);
              formdata.append("name_en", values.name_en);
              formdata.append("description_ar", values.description_ar);
              formdata.append("description_en", values.description_en);

              if (typeof values.image === "string") {
                formdata.delete("image");
              } else {
                formdata.append("image", values.image);
              }

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
              for (var value of formdata.entries()) {
                console.log(value);
              }
              handleSubmit(formdata);
            }}
          >
            {(formik) => (
              <Form>
                <div className="my-4">
                  <div className="row">
                    <div className="col-5">
                      {console.log(formik.values)}

                      <Card
                        className="my-2 p-1 rounded"
                        style={{ height: "280px", objectFit: "cover" }}
                      >
                        <Card.Img
                          style={{ height: "270px", objectFit: "contain" }}
                          src={`${productImage}`}
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
                          <i className="bx bx-cloud-upload mx-2"></i>Upload New
                          Image
                        </label>
                      </div>
                    </div>

                    <div className="col-7">
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
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-outline-danger    mx-2 mt-3 my-2 px-5 py-3"
                    onClick={() => deleteProductHandler(productId)}
                  >
                    Delete Product
                  </button>
                  <button
                    className="btn btn-outline-success mt-3 my-2 px-5 py-3"
                    type="submit"
                  >
                    Update Product
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
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

        {show ? renderVariationscreen() : ""}
      </div>
      {editVariationShow ? renderEditVariationscreen() : ""}
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
                {productVariations
                  ? productVariations.map((item, index) => (
                      <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                          <Card.Img
                            style={{
                              height: "100px",
                              width: "100px",
                              objectFit: "contain",
                            }}
                            src={item.images[0]}
                            variant="top"
                          />
                        </td>
                        <td>{item.price}</td>
                        <td>{item.size_value}</td>
                        <td>
                          <button
                            style={{
                              cursor: "pointer",
                            }}
                            className="rounded"
                            onClick={(e) =>
                              handleDeletevariation(e, item.id, index)
                            }
                          >
                            {" "}
                            <i className="bx bx-trash"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            style={{
                              cursor: "pointer",
                            }}
                            className="rounded"
                            onClick={(e) => {
                              e.preventDefault();

                              setVarId(item.id);

                              setEditVariationShow(true);
                            }}
                          >
                            <i className="bx bx-pencil"></i>
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
  );
};

export default EditProductScreen;
