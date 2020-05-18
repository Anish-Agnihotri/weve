import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom"; // Navigation setup
import Home from './pages/Home';
import Mail from './pages/Mail';
import Store from './stores';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isAuthenticated: false, // Default authenticated value is false
    }
  }

  getAuthStatus = () => {
    // If keyfile is present in sessionStorage
    if (sessionStorage.getItem('keyfile') !== null) {
      // Change authenticated value to true
      this.setState({isAuthenticated: true});
    } else {
      // Else, keep authenticated value at false
      this.setState({isAuthenticated: false});
    }
  };

  componentDidMount() {
    // Get authentication status when app loads
    this.getAuthStatus();
  }

  render() {
    return (
      <div className="App">
        <Store.Container>
          <Router>
            <Switch>
              {/* / Path is dynamically changed depending on authenticated status */}
              <Route path="/:location/:id" component={this.state.isAuthenticated ? Mail : Home} />
              {/* Default fall-back path is dynamically changed depending on authenticated status */}
              <Route component={this.state.isAuthenticated ? Mail : Home} />
            </Switch>
          </Router>
        </Store.Container>
      </div>
    );
  }
}

export default App;
