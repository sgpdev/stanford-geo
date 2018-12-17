import React, { Component } from "react";
import "./Documentation.css";

import { Alert, Button } from "react-bootstrap";

export default class Documentation extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);

    this.state = {
      show: true
    };
  }

  handleDismiss() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    if (this.state.show) {
      return (
        <Alert bsClass="login" bsStyle="info" onDismiss={this.handleDismiss}>
          <h4>Please Login!</h4>
          <p>To access the SGP data please enter the Password</p>
          {/* <label for="textInput">User:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            size="10"
            value={this.props.user}
            onChange={this.props.handleChange}
          /> */}
          <label for="textInput">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            size="10"
            value={this.props.password}
            onChange={this.props.handlePasswordChange}
          />
          <br />
          <p>
            <Button
              onClick={this.props.login}
              bsStyle="info"
              bsClass="login-btn"
            >
              Login
            </Button>
          </p>
        </Alert>
      );
    }
    // return <Button onClick={this.handleShow}>Show Alert</Button>;
  }
}
