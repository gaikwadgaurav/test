import React from 'react';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from './pages/login/Login';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Redirect to="/login" />}
        />
        <Route path="/login" component={Login} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );
}

export default App;
