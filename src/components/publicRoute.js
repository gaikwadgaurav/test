import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({ component: Component, ...rest }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return (
    <Route
      {...rest}
      render={props =>
        !userData ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/app/dashboard", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
