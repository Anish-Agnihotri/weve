import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home';
import Login from './pages/Login';
import Mail from './pages/Mail';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/mail" exact component={Mail} />
          <Route component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
