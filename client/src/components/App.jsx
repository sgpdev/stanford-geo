import React, { Component } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Home from "./Home";
import About from "./About";
import Join from "./Join";
import References from "./References";
import Team from "./Team";
import Search from "./Search";
import Drawer from "./Drawer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  postSearch() {
    axios
      .post("/api", {
        type: "dups",
        filters: {
          country: ["USA", "Canada"]
        },
        show: ["country", "sec_name", "height_m"]
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Router>
          <div className="navigation">
            <NavBar />
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/join" component={Join} />
            <Route path="/references" component={References} />
            <Route path="/team" component={Team} />
            <Route path="/search" component={Search} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
