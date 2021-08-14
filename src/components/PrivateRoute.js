import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import useUserInfo from '../pages/useToken';
const PrivateRoute = ({ component: Component, ...rest }) => {


  return (
    <Route
      {...rest}
      render={(props) =>

        localStorage.getItem('userInfo') ? (
          Component ? (
            <Component {...props} />
          ) : (
            rest.render(props)
          )
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
