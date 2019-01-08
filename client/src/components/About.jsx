import React, { Component } from "react";
import axios from "axios";
import { Jumbotron } from "react-bootstrap";
import "./../styles/About.css";
import LoginModal from "./LoginModal";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: 1,
      samples: 1,
      countries: 1
    };
  }

  async componentDidMount() {
    await this.getInfoSamples();
    await this.getInfoResults();
    await this.getInfoCountries();
  }

  getInfoSamples() {
    const that = this;

    axios
      .get("get/info/samples")
      .then(function(response) {
        that.setState({
          samples: response.data[0].count
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getInfoResults() {
    const that = this;

    axios
      .get("get/info/results")
      .then(function(response) {
        that.setState({
          results: response.data[0].count
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  getInfoCountries() {
    const that = this;

    axios
      .get("get/info/countries")
      .then(function(response) {
        that.setState({
          countries: response.data[0].count
        });
      })
      .catch(function(error) {
        console.log(error);
      });
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
    const {
      handleChange,
      handlePasswordChange,
      login,
      user,
      password
    } = this.props;
    return (
      <span>
        <Jumbotron>
          <h1 className="text header">
            Sedimentary Geochemistry and Paleoenvironments Project
          </h1>

          <p className="text">
            The Sedimentary Geochemistry and Paleoenvironments Project (SGP) is
            a research consortium that seeks to address questions of
            environmental evolution across Earth history through statistical
            analyses of the sedimentary geochemical record. The search site is
            currently password-protected and only available to analysts working
            on Phase 1 Working Group manuscripts. Upon publication of these
            manuscripts the search site will be publicly available.
          </p>
          <span className="login-container">
            <LoginModal
              handleChange={handleChange}
              handlePasswordChange={handlePasswordChange}
              login={login}
              user={user}
              password={password}
            />
          </span>
          <div id="wrapper">
            <div id="c1">
              <h1>{this.state.countries}</h1>
              <h4>Countries</h4>
            </div>
            <div id="c2">
              <h1>{this.state.samples}</h1>
              <h4>Samples</h4>
            </div>
            <div id="c3">
              <h1>{this.state.results}</h1>
              <h4>Results</h4>
            </div>
          </div>
        </Jumbotron>
      </span>
    );
  }
}

export default About;
