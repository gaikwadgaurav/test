import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({ component: Component, location, ...rest }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return (
    <Route
      {...rest}
      render={props =>
        !userData ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/app/dashboard", location }} />
        )
      }
    />
  );
};
