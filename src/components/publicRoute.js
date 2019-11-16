import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        !localStorage.getItem("userData") ? (
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
