import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// components
import Layout from "./Layout";
import Documentation from "./Documentation";

// pages
import Error from "../pages/error";
import Login from "../pages/login";

// context
// import { useUserState } from "../context/UserContext";
import { PrivateRoute } from "./privateRoute";
import { PublicRoute } from "./publicRoute";
import Ecommerce from "../pages/ecommerce/Ecommerce";
import CreateVariable from "../pages/ecommerce/CreateVariable";
export default function App() {
  // global
  // var { isAuthenticated } = useUserState();
  return (
    <Router>
      <Switch>
        <Route path="/documentation" component={Documentation} />
        <PrivateRoute path="/" component={Layout} />
        <PublicRoute path="/login" component={Login} />
        <Route component={Error} />
      </Switch>
    </Router>
  );
}
