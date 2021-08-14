import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import TextField from '../components/TextField';
import { Formik, Form } from 'formik';
import { Col, Row, Tabs } from 'react-bootstrap';
import Select from '../components/Select';
import { addProduct } from './api/products';

import { Modal } from 'react-bootstrap';

import { Card } from 'react-bootstrap';

import { SketchPicker } from 'react-color';
import { Tab } from 'bootstrap';
import { addVariation } from './api/variations';

const UpdateVariationScreen = ({ productId }) => {
  const [offer, setOffer] = useState({ checked: false });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formikFileArray, setFormikFileArray] = useState([]);
  const [ProductVariationList, setProductVariationList] = useState([]);

  let arr = new Array();

  const [color, setColor] = useState('#fff');
  const TableHead = ['id', 'name', 'Image', 'price', 'size', ' '];

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

  const addToVariationList = (formik) => {
    formik.setFieldValue('blobImage', selectedFiles);

    setProductVariationList((prev) => [...prev, formik.values]);

    formik.setFieldValue('variation_name_ar', '');
    formik.setFieldValue('variation_name_en', '');
    formik.setFieldValue('price', '');
    formik.setFieldValue('offerprice', '');
    formik.setFieldValue('stocks', '');
    formik.setFieldValue('sku', '');
    formik.setFieldValue('color_name', '');
    formik.setFieldValue('color_value', '');
    formik.setFieldValue('hasoffer', '');
    formik.setFieldValue('size_value', '');

    setFormikFileArray([]);
    setSelectedFiles([]);
    formik.setFieldValue('images', []);

    formik.setFieldValue('blobImage', []);
  };

  const renderPhotos = (source) => {
    return source.map((photo, index) => {
      return (
        <div className="col w-100">
          <Card
            className="my-2 p-1 rounded"
            style={{ height: '180px', objectFit: 'contain' }}
          >
            <Card.Img
              style={{ height: '170px', objectFit: 'contain' }}
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
    console.log(fileToRemove);
    console.log(index);
    console.log(source);
    console.log(formikFileArray);
    source = source.filter((fileName) => fileName !== fileToRemove);
    console.log(source);
    formikFileArray.filter((fileName) => fileName !== fileToRemove);

    setSelectedFiles(source);

    const files = Array.from(formikFileArray).filter((file, i) => index !== i);
    console.log(files);
    setFormikFileArray(files);
    //console.log(fileimages);
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

    formik.setFieldValue('images', formikFileArray);
  };

  useEffect(() => {
    console.log([formikFileArray]);
  }, [productId, formikFileArray]);

  const handleSubmit = async (formdata, arr) => {
    const res = await addVariation(formdata);
    // history.push('/product');
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          variation_name_ar: '',
          variation_name_en: '',
          images: [],
          price: '',
          offerprice: '',
          stocks: '',
          sku: '',
          color_name: '',
          color_value: color.hex,
          hasoffer: '',
          size_value: '',
        }}
        validationSchema={validate}
        onSubmit={(values) => {
          let formdata = new FormData();
          formdata.append('product_id', values.productId);
          formdata.append('name_ar', values.name_ar);
          formdata.append('name_en', values.name_en);
          formdata.append('images', values.images);
          formdata.append('price', values.price);
          formdata.append('offerprice', values.offerprice);
          formdata.append('stocks', values.stocks);
          formdata.append('sku', values.sku);
          formdata.append('color_name', values.color_name);
          formdata.append('color_value', values.color_value);
          formdata.append('size_value', values.size_value);

          values.hasoffer === true
            ? formdata.append('hasoffer', 1)
            : formdata.append('hasoffer', 0);

          handleSubmit(formdata);
        }}
      >
        {(formik) => (
          <Form>
            <div className="d-flex justify-content-end my-2">
              <button
                className="btn btn-success mt-3 px-5 py-3 shadow"
                type="submit"
              >
                Save Product
              </button>
            </div>
            <Card border="light" className="bg-white shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex justify-content-end">
                  <Card border="light" className="bg-white shadow-sm mb-4">
                    <Card.Body>
                      <div
                        style={{
                          cursor: 'pointer',
                          width: '210px',
                        }}
                        className="d-flex justify-content-end text-nowrap bg-success rounded p-3 text-white"
                        onClick={(e) => {
                          addToVariationList(formik);
                        }}
                      >
                        ADD NEW VARIATION
                      </div>

                      <Tabs
                        defaultActiveKey="profile"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                      >
                        <Tab eventKey="addphotos" title="ADD IMAGES">
                          <div className="row g-3">
                            <div className="col-md-3 ">
                              <label
                                style={{ cursor: 'pointer' }}
                                className="text-nowrap border py-3 px-4 text-light add-photo  rounded"
                                htmlFor="file"
                              >
                                <i className="bx bx-image-add"></i>
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
                        </Tab>
                        <Tab eventKey="details" title="DETAILS">
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
                                    formik.setFieldValue('hasoffer', d);
                                  }}
                                />

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
                                  'color_value',
                                  updatedColor.hex
                                );
                              }}
                              width="300px"
                            />
                          </div>

                          <Col></Col>
                        </Tab>
                      </Tabs>
                    </Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
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

export default UpdateVariationScreen;
