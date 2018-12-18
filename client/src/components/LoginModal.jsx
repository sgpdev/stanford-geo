import React, { Component } from "react";
import { Button, Popover, Modal, Tooltip } from "react-bootstrap";
import "./About.css";

export default class LoginModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <div>
        <p>Login to access the Data Set!</p>

        <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
          Login!
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Login Page</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Please Login!</h4>
            <p>To access the SGP data please enter the Password</p>
            <label for="textInput">User:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              size="10"
              value={this.props.user}
              onChange={this.props.handleChange}
            />
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
            <h4>Text in a modal</h4>
            <p>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>

            <hr />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
