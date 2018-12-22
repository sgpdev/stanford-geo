import React, { Component } from "react";
import "./../styles/LoginModal.css";

export default class LoginModal extends Component {
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
    this.props.login();
  }

  render() {
    const { show } = this.state;

    const { user, handleChange, password, handlePasswordChange } = this.props;

    return (
      <main>
        <Modal show={show} handleClose={this.hideModal}>
          <img
            src={require("./../images/sgp_logo.png")}
            className="img-modal"
          />
          <div id="user">
            <label className="label-header" for="textInput">
              User
            </label>
            <input
              className="userInput"
              type="text"
              name="name"
              required
              size="10"
              value={user}
              onChange={handleChange}
            />
          </div>

          <div id="password">
            <label className="label-header" for="textInput">
              Password
            </label>
            <input
              className="userInput"
              type="password"
              name="password"
              required
              size="10"
              value={password}
              onChange={handlePasswordChange}
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
        <button className="login-btn-modal" onClick={handleClose}>
          Login
        </button>
      </section>
    </div>
  );
};
