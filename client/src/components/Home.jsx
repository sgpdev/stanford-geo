import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Checkbox from "./Checkbox";

export default class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        type: "Sample",
        filters: {},
        show: []
      }
    };
    this.changeType = this.changeType.bind(this);
  }

  changeType(value) {
    let query = this.state.query;
    query.type = value;
    this.setState({ query });
  }

  render() {
    return (
      <div style={{ marginTop: "100px" }}>
        <Checkbox type={this.state.query.type} changeType={this.changeType} />
        <div>{this.state.query.type}</div>
      </div>
    );
  }
}
