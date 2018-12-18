import React, { Component } from "react";
import { Jumbotron, Button, Row, Col, code } from "react-bootstrap";
import "./About.css";
import Documentation from "./Documentation";

class About extends Component {
  constructor(props) {
    super(props);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  // This is just personal preference.
  // I prefer to not show the the whole text area selected.

  render() {
    return (
      <div>
        <Jumbotron>
          <h1 className="text header">
            Sedimentary Geochemistry and Paleoenvironments Project
          </h1>

          <p className="text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur
            obcaecati vero aliquid libero doloribus ad, unde tempora maiores,
            ullam, modi qui quidem minima debitis perferendis vitae cumque et
            quo impedit. modi qui quidem minima debitis perferendis vitae cumque
            et quo impedit.
          </p>
          <p className="login-container">
            {/* <LoginModal
              handleChange={this.handleChange}
              handlePasswordChange={this.handlePasswordChange}
              login={this.login}
              user={this.state.user}
              password={this.state.password}
            /> */}
            <Documentation />
          </p>
          <div id="wrapper">
            <div id="c1">
              <h1>55</h1>
              <h4>Countries</h4>
            </div>
            <div id="c2">
              <h1>125</h1>
              <h4>Results</h4>
            </div>
            <div id="c3">
              <h1>1,155</h1>
              <h4>Samples</h4>
            </div>
          </div>
        </Jumbotron>
      </div>
    );
  }
}

export default About;
