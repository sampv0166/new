import React, { useEffect, useState } from 'react';
import CheckboxGroup from '../components/CheckboxGroup';
import * as Yup from 'yup';

import { getUsers } from './api/users';
import { Col, Form, Row } from 'react-bootstrap';
import { Formik } from 'formik';

const PermissionScreen = ({ match }) => {
  const [permissions, setPermissions] = useState([]);
  const [prodPermission, setProdPermission] = useState([]);

  const [usersdata, setUsersData] = useState([]);

  const [productPermissions, setProductPermissions] = useState([
    { key: 'add', value: 'add' },
    { key: 'update', value: 'update' },
    { key: 'delete', value: 'delete' },
  ]);
  const [permissionPermissions, setPermissionPermissions] = useState([
    { key: 'add', value: 'add' },
    { key: 'update', value: 'update' },
    { key: 'delete', value: 'delete' },
  ]);
  const [categoryPermissions, setCategoryPermissions] = useState([
    { key: 'add', value: 'add' },
    { key: 'update', value: 'update' },
    { key: 'delete', value: 'delete' },
  ]);
  const [shopPermissions, setShopPermissions] = useState([
    { key: 'add', value: 'add' },
    { key: 'update', value: 'update' },
    { key: 'delete', value: 'delete' },
  ]);
  const [subCategoryPermissions, setsubCategoryPermissions] = useState([
    { key: 'add', value: 'add' },
    { key: 'update', value: 'update' },
    { key: 'delete', value: 'delete' },
  ]);

  const [variationPermissions, setvariationPermissions] = useState([
    { key: 'add', value: 'add' },
    { key: 'update', value: 'update' },
    { key: 'delete', value: 'delete' },
  ]);

  const userid = match.params.id;
  const populateProductpermissions = (permissions) => {
    console.log(permissions);
    const product = permissions.product;

    setProdPermission(permissions.product);
    console.log(prodPermission);
    const arr = new Array(3);
    if (product) {
      //  console.log(product);
      for (let i = 0; i < product.length; i++) {
        //console.log(product[0]);
        arr[i] = { key: product[i], value: product[i] };
      }
    }

    // setProductPermissions(arr)
    // console.log(permissions.product);
    return arr;
  };

  const populateshoppermissions = (permissions) => {
    const shop = permissions.shop;
    const arr1 = new Array(3);
    if (shop) {
      // console.log(shop);
      for (let i = 0; i < shop.length; i++) {
        // console.log(shop[0]);
        arr1[i] = { key: shop[i], value: shop[i] };
      }
    }

    // setShopPermissions(arr1)
    // console.log(arr1);
    return arr1;
  };

  const populatecategorypermissions = (permissions) => {
    const category = permissions.category;
    const arr1 = new Array(3);
    if (category) {
      // console.log(category);
      for (let i = 0; i < category.length; i++) {
        //  console.log(category[0]);
        arr1[i] = { key: category[i], value: category[i] };
      }
    }

    // setShopPermissions(arr1)

    //  console.log(arr1);
    return arr1;
  };

  const populatepermissionpermissions = (permissions) => {
    const permission = permissions.permission;

    const arr1 = new Array(3);
    if (permission) {
      // console.log(permission);
      for (let i = 0; i < permission.length; i++) {
        // console.log(permission[0]);
        arr1[i] = { key: permission[i], value: permission[i] };
      }
    }

    // setShopPermissions(arr1)
    //  console.log(arr1);
    return arr1;
  };

  const populateSubCategorypermissions = (permissions) => {
    const subcategory = permissions.subcategory;

    const arr1 = new Array(3);
    if (subcategory) {
      // console.log(permission);
      for (let i = 0; i < subcategory.length; i++) {
        // console.log(permission[0]);
        arr1[i] = { key: subcategory[i], value: subcategory[i] };
      }
    }

    // setShopPermissions(arr1)
    //  console.log(arr1);
    return arr1;
  };

  const populateVariationspermissions = (permissions) => {
    const variations = permissions.variation;

    const arr1 = new Array(3);
    if (variations) {
      // console.log(permission);
      for (let i = 0; i < variations.length; i++) {
        // console.log(permission[0]);
        arr1[i] = { key: variations[i], value: variations[i] };
      }
    }

    // setShopPermissions(arr1)
    //  console.log(arr1);
    return arr1;
  };

  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers(user.success.token);
      for (let i = 0; i < data.data.length; i++) {
        if (data.data[i].id == userid) {
          setPermissions(data.data[i].permissionslist);
        }
      }
    };
    fetchUsers();
  }, [user.success.token, userid]);

  const validate = Yup.object({
    name_ar: Yup.string().required('Required'),
    name_en: Yup.string().required('Required'),
    image: Yup.string().required('Required'),
    shop_id: Yup.string().required('Required'),
    description_ar: Yup.string().required('Required'),
    description_en: Yup.string().required('Required'),
    category_id: Yup.string().required('Required'),
    subcategory_id: Yup.string().required('Required'),
    sort_index: Yup.string().required('Required'),
    bestseller: Yup.number(),
    special: Yup.number(),
    isactive: Yup.number(),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        product: permissions.product || '',
        permission: permissions.permission || '',
        shop: permissions.shop || '',
        category: permissions.category || '',
        subcategory: permissions.subcategory || '',
        variation: permissions.variation || '',
      }}
      
      //validationSchema={validate}
      onSubmit={(values) => {
        // console.log(values);
        //  console.log(permissions);
        //handleSubmit(values);
      }}
    >
      {(formik) => (
        <Form>
          <Row>
            <Col className="col-6">
              <CheckboxGroup
                control="checkbox"
                label="Product Permissions"
                name="product"
                options={productPermissions}
              />

              {console.log(formik.values)}

              <CheckboxGroup
                control="checkbox"
                label="Permission Permissions"
                name="permission"
                options={permissionPermissions}
              />

              <CheckboxGroup
                control="checkbox"
                label="Shop Permissions"
                name="shop"
                options={shopPermissions}
              />
            </Col>
            <Col className="col-6">
              <CheckboxGroup
                control="checkbox"
                label="Category Permissions"
                name="category"
                options={categoryPermissions}
              />

              <CheckboxGroup
                control="checkbox"
                label="Sub Category Permissions"
                name="subcategory"
                options={subCategoryPermissions}
              />

              <CheckboxGroup
                control="checkbox"
                label="Variation Permissions"
                name="variation"
                options={variationPermissions}
              />
            </Col>
            <button className="btn btn-success mt-3 my-2" type="submit">
              Save
            </button>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default PermissionScreen;
