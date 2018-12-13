import React, { Component } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Search from "./Search";
import About from "./About";
import Documentation from "./Documentation";

import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Router>
          <div>
            <NavBar />
            <Route exact path="/sgp-search" component={Search} />
            <Route path="/sgp-search/documentation" component={Documentation} />
            <Route path="/sgp-search/about" component={About} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
