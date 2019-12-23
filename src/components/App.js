import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// components
import Layout from "./Layout";
import Documentation from "./Documentation";

// pages
import Error from "../pages/error";
import Login from "../pages/login";
import InvitedUserRegistration from "../pages/user/invitedUserRegistration";

// context
// import { useUserState } from "../context/UserContext";
import { PrivateRoute } from "./privateRoute";
import { PublicRoute } from "./publicRoute";
export default function App() {
  // global
  // var { isAuthenticated } = useUserState();
  return (
    <Router>
      <Switch>
        <Route path="/documentation" component={Documentation} />
        <PublicRoute exact path="/login" component={Login} />
        <Route
          exact
          path="/invited-user-registration/:token"
          component={InvitedUserRegistration}
        />
        <PrivateRoute path="/" component={Layout} />
        <Route component={Error} />
      </Switch>
    </Router>
  );
}
