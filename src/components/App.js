import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// components
import Layout from "./Layout";

// pages
// import Error from "../pages/error";
import Login from "../pages/login";

import { PrivateRoute } from "./privateRoute";
import { PublicRoute } from "./publicRoute";

export class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Redirect to="/app/dashboard" />}
            />
            {/* <Route
          exact
          path="/app"
          render={() => <Redirect to="/app/dashboard" />}
        /> */}
            <PrivateRoute path="/app/dashboard" component={Layout} />
            <PublicRoute path="/login" component={Login} />
            {/* <Route component={Error} /> */}
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
