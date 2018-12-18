import React, { Component } from "react";
import "./Documentation.css";

export default class Documentation extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ show: true });
  }

  hideModal() {
    this.setState({ show: false });
  }

  render() {
    return (
      <main>
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <div id="user">
            <label className="label-header" for="textInput">
              User:
            </label>
            <input
              className="userInput"
              type="text"
              name="name"
              required
              size="10"
              value={this.props.user}
              onChange={this.props.handleChange}
            />
          </div>

          <div id="password">
            <label className="label-header" for="textInput">
              Password:
            </label>
            <input
              className="userInput"
              type="password"
              name="password"
              required
              size="10"
              value={this.props.password}
              onChange={this.props.handlePasswordChange}
            />
          </div>
        </Modal>
        <button type="button" className="login-btn" onClick={this.showModal}>
          Login
        </button>
      </main>
    );
  }
}

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button className="login-btn" onClick={handleClose}>
          Login
        </button>
      </section>
    </div>
  );
};
