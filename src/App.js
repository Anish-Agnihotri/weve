import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from './pages/Home';
import Mail from './pages/Mail';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isAuthenticated: false,
    }
  }
  getAuthStatus = () => {
    if (sessionStorage.getItem('keyfile') !== null) {
      this.setState({isAuthenticated: true});
    } else {
      this.setState({isAuthenticated: false});
    }
  }
  componentDidMount() {
    this.getAuthStatus();
  }
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/:location" component={this.state.isAuthenticated ? props => <Mail {...props} key={Date.now()} /> : props => <Home {...props} key={Date.now()} />} />
            <Route component={this.state.isAuthenticated ? Mail : Home} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
