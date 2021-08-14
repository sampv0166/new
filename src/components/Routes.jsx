import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Login from '../pages/Login';
import PermissionScreen from '../pages/PermissionScreen';
import ProductScreen from '../pages/ProductScreen';
import EditProductScreen from '../pages/EditProductScreen';
import VariationScreen from '../pages/VariationScreen';
import AddNewUserScreen from '../pages/AddNewUserScreen';
import CategoryScreen from '../pages/CategoryScreen';
import AdddNewShopScreen from '../pages/AddNewShopScreen';
import ShopScreen from '../pages/shopScreen';
import AddNewCategoryScreen from '../pages/AddNewCategoryScreen';
import SubCategoryScreen from '../pages/SubCategoryScreen';
import AddNewSubCategoryScreen from '../pages/AddNewSubCategoryScreen';
import AddProductScreen from '../pages/AddNewProductscreen';
import useUserInfo from '../pages/useToken';

import Orders from '../pages/Orders';
import { getProduct } from '../pages/api/products';
import { useEffect } from 'react';
import OrderDetailsScreen from '../pages/OrderDetailsScreen';

const Routes = () => {
  const [refresh, setRefresh] = useState(0);
  const { user, setUser } = useUserInfo();
  const [varId, setVarId] = useState(0);
  const [showVariatio0nscreen, setShowVariationScreen] = useState(false);

  const [show, setShow] = useState(false);
  const [editVariationShow, setEditVariationShow] = useState(false);

  const [products, setProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProduct();
      setProduct(data.data);
    };
  }, []);

  return (
    <Switch>
      <PrivateRoute path="/" exact component={Dashboard} />

      <PrivateRoute path="/orders" exact component={Orders} />

      <PrivateRoute path="/users" component={Users} />

      <PrivateRoute
        exact
        path="/orderdetails/:id"
        render={({ match, history }) => (
          <OrderDetailsScreen match={match} history={history} />
        )}
      ></PrivateRoute>

      <Route
        exact
        path="/login"
        render={({ match, history }) => (
          <Login
            match={match}
            history={history}
            user={user}
            setUser={setUser}
          />
        )}
      ></Route>

      <PrivateRoute
        path="/permissions/:id"
        exact
        component={PermissionScreen}
      />
      <PrivateRoute
        path="/products"
        exact
        render={({ match, history }) => (
          <ProductScreen
            match={match}
            history={history}
            refresh={refresh}
            setRefresh={setRefresh}
            products={products}
            setProduct={setProduct}
          />
        )}
      />

      <PrivateRoute path="/addproduct" exact component={AddProductScreen} />

      <PrivateRoute
        path="/product/:id"
        exact
        render={({ match, history }) => (
          <EditProductScreen
            match={match}
            history={history}
            refresh={refresh}
            setRefresh={setRefresh}
            varId={varId}
            setVarId={setVarId}
            showVariatio0nscreen={showVariatio0nscreen}
            setShowVariationScreen={setShowVariationScreen}
            show={show}
            setShow={setShow}
            products={products}
            setProduct={setProduct}
            editVariationShow={editVariationShow}
            setEditVariationShow={setEditVariationShow}
          />
        )}
      />

      <PrivateRoute
        path="/variations/:id/:variationId"
        exact
        component={VariationScreen}
      />

      <PrivateRoute path="/variations/:id" exact component={VariationScreen} />

      <PrivateRoute path="/addnewuser" exact component={AddNewUserScreen} />
      <PrivateRoute path="/edituser/:id" exact component={AddNewUserScreen} />
      <PrivateRoute path="/categories" exact component={CategoryScreen} />

      <PrivateRoute
        path="/addnewcategory"
        exact
        component={AddNewCategoryScreen}
      />
      <PrivateRoute
        path="/editcategory/:id"
        exact
        component={AddNewCategoryScreen}
      />

      <PrivateRoute path="/subcategories" exact component={SubCategoryScreen} />
      <PrivateRoute
        path="/addnewsubcategory"
        exact
        component={AddNewSubCategoryScreen}
      />

      <PrivateRoute
        path="/editsubcategory/:"
        exact
        component={AddNewSubCategoryScreen}
      />

      <PrivateRoute path="/shop" exact component={ShopScreen} />
      <PrivateRoute path="/addnewshop" exact component={AdddNewShopScreen} />
      <PrivateRoute path="/editshop/:id" exact component={AdddNewShopScreen} />
    </Switch>
  );
};

export default Routes;
