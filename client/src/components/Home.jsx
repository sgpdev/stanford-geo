import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Radiobox from "./Radiobox";
import MultiSelect from "./MultiSelect";
import Checkbox from "./Checkbox";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        type: "samples",
        filters: {},
        show: []
      }
    };
    this.changeType = this.changeType.bind(this);
    this.constructMulti = this.constructMulti.bind(this);
  }

  changeType(value) {
    let query = this.state.query;
    query.type = value;
    this.setState({ query });
  }

  //Multi Select construct array
  constructMulti(array) {
    let query = this.state.query;
    query.filters["Country"] = array.map(option => option.value);
    console.log("home", this.state.query.filters);
  }

  render() {
    return (
      <div style={{ marginTop: "100px" }}>
        TYPE:
        <Radiobox type={this.state.query.type} changeType={this.changeType} />
        <br />
        Filters:
        <MultiSelect constructMulti={this.constructMulti} />
        <br />
        <Checkbox />
        <br />
        <div>{this.state.query.type}</div>
        <br />
      </div>
    );
  }
}
