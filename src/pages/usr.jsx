import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { Formik, Form } from "formik";
import { Col, Row } from "react-bootstrap";
import Select from "../components/Select";
import { addProduct, getProduct, updateProduct } from "./api/products";
import { getCategory } from "./api/category";
import { getShops, getshops } from "./api/shop";

import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductVariationScreen from "./VariationScreen";
import { ColorPicker, useColor } from "react-color-palette";
import { SignalCellularNull } from "@material-ui/icons";
import { ChromePicker, SketchPicker } from "react-color";
import { Modal } from "bootstrap";

const AddProductScreen = ({ match, history }) => {
  const [productVariations, setProductVariations] = useState([]);
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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formikFileArray, setFormikFileArray] = useState([]);
  const [ProductVariationList, setProductVariationList] = useState([]);

  const [showColorPicker, setShowColorPicker] = useState(false);

  let arr = new Array();

  const [color, setColor] = useState("#fff");
  const TableHead = ["id", "name", " ", " "];

  const productId = match.params.id;

  const validate = Yup.object({
    name_ar: Yup.string().required("Required"),
    name_en: Yup.string().required("Required"),
    image: Yup.string().required("Required"),
    shop_id: Yup.number(),
    description_ar: Yup.string().required("Required"),
    description_en: Yup.string().required("Required"),
    category_id: Yup.number(),
    subcategory_id: Yup.number(),
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
    if (window.confirm("Are you sure")) {
      //deleteProduct(id);
      console.log(id + " user deleted");
    }
  };

  const addToVariationList = (formik) => {
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

    setFormikFileArray([]);
    setSelectedFiles([]);
  };

  const renderPhotos = (source) => {
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
          </Card>
          <div className="col mx-1">
            <button
              onClick={(e) =>
                handleRemoveVariationImage(
                  e,
                  source[index],
                  index,
                  source,
                  formikFileArray
                )
              }
              type="button"
              className="btn btn-danger w-100"
            >
              Remove
            </button>
          </div>
        </div>
      );
    });
  };

  const handleRemoveVariationImage = (
    e,
    fileToRemove,
    index,
    source,
    formikFileArray
  ) => {
    e.preventDefault();
    // console.log(fileToRemove);

    source = source.filter((fileName) => fileName !== fileToRemove);

    formikFileArray.filter((fileName) => fileName !== fileToRemove);

    setSelectedFiles(source);

    const fileimages = formikFileArray.filter(
      (filename, index) => filename[index] !== fileToRemove
    );

    //console.log(fileimages);

    setFormikFileArray(fileimages);

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
      console.log(selectedFiles);

      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }

    Array.from(e.target.files).map((file) =>
      setFormikFileArray([...formikFileArray, file])
    );

    formik.setFieldValue("images", formikFileArray);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProduct();
      data.data.map((product) => {
        if (product.id == productId) {
          setCurrentProduct(product);
          setProductVariations(product.variations);
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
      //const { data } = await getCategory();
      const category2 = [
        {
          active: "false",
          name_ar: "ABC",
          name_en: "CBA",
          created_at: "2021-07-01 18:11:18",
          id: 8,
          fullimageurl:
            "http://127.0.0.1:8000/storage/cdn/dxoU2rRvuky3Pvn4IyakNjT2ijIleNMMtezQzmJf.png",
        },
      ];
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
    console.log(ProductVariationList);
    console.log([formikFileArray]);
  }, [productId, ProductVariationList, formikFileArray]);

  const handleSubmit = async (formdata, arr) => {
    const s = ProductVariationList;

    const res = await addProduct(formdata, ProductVariationList);

    // history.push('/product');
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          name_ar: currentProduct.name_ar || "",
          name_en: currentProduct.name_en || "",
          image: currentProduct.image || "",
          shop_id: currentProduct.shop_id || "",
          description_ar: currentProduct.description_ar || "",
          description_en: currentProduct.description_en || "",
          category_id: 0,
          subcategory_id: 0,
          sort_index: currentProduct.sort_index || 0,
          variation_name_ar: productVariations.bio_ar || "",
          variation_name_en: productVariations.bio_en || "",
          images: [],
          price: productVariations.price || "",
          offerprice: productVariations.offerprice || "",
          stocks: productVariations.stocks || "",
          sku: productVariations.sku || "",
          color_name: productVariations.color_name || "",
          color_value: productVariations.color_value || color.hex,
        }}
        validationSchema={validate}
        onSubmit={(values) => {
          //e.log(ProductVariationList);

          let formdata = new FormData();
          formdata.append("name_ar", values.name_ar);
          formdata.append("name_en", values.name_en);

          formdata.append("description_ar", values.description_ar);
          formdata.append("description_en", values.description_en);
          formdata.append("image", values.image);

          handleSubmit(formdata, ProductVariationList);
        }}
      >
        {(formik) => (
          <Form>
            <div className="d-flex justify-content-end">
              <button className="btn btn-success mt-3 px-5 py-3" type="submit">
                Save
              </button>
            </div>
            {console.log(formik.values)}
            <div className="my-4">
              <div className="row">
                <h3 className="pb-3 border-bottom main-heading-global">
                  Product Details
                </h3>
                <div className="col-5">
                  {productId ? (
                    <Card
                      className="my-2 p-1 rounded"
                      style={{ height: "280px", objectFit: "cover" }}
                    >
                      <Card.Img
                        style={{ height: "270px", objectFit: "contain" }}
                        src={
                          productImage.length > 0
                            ? productImage
                            : currentProduct.coverimage
                        }
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
                        src={productImage}
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
                      </Row>
                    </Card.Body>
                  </Card>
                </div>

                <Row>
                  {productId ? <strong>Variations</strong> : ""}
                  {productVariations.map((pv) => (
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
                <Row>
                  <div className="my-4">
                    <h3 className="pb-3 border-bottom main-heading-global">
                      Product Variation
                    </h3>

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
                        <TextField label="Price" name="price" type="number" />
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
                        <TextField label="Stock" name="stocks" type="number" />
                      </div>
                      <div className="col-md-6">
                        <TextField label="SKU" name="sku" type="number" />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-3 ">
                        <label
                          style={{ cursor: "pointer" }}
                          className="text-nowrap border py-3 px-4 text-light add-photo  rounded"
                          htmlFor="file"
                        >
                          <i className="px-2 pb-1 bi bi-images"></i>
                          ADD PHOTO
                        </label>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <div>
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
                            {renderPhotos(selectedFiles)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <TextField
                          label="Color Name"
                          name="color_name"
                          type="text"
                        />
                        <div className="row g-3">
                          <div className="col-md-3">
                            <div className="col-md-4">
                              <SketchPicker
                                color={color}
                                onChange={(updatedColor) =>
                                  setColor(updatedColor.hex)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Col></Col>
                    </div>

                    <div className="col-md-4 my-5">
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

                                  <td>
                                    <button
                                      style={{ cursor: "pointer" }}
                                      className="rounded"
                                      onClick={() => deletevariation(item.id)}
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
                    <div
                      style={{ cursor: "pointer", width: "210px" }}
                      className="justify-content-start text-nowrap my-5 bg-success rounded  p-4 text-white"
                      onClick={(e) => {
                        addToVariationList(formik);
                      }}
                    >
                      ADD NEW VARIATION
                    </div>
                  </div>
                </Row>
              </div>
            </div>
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
