import React, { Component } from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import About from "./About";
import Footer from "./Footer";
import Documentation from "./Documentation";

import { BrowserRouter as Router, Route } from "react-router-dom";
import "./../styles/App.css";

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
            <Route exact path="/" component={Search} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/about" component={About} />
          </div>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
