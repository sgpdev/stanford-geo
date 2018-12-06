import React, { Component } from "react";
import "./Radiobox.css";

export default class Radiobox extends Component {
  constructor(props) {
    super(props);
  }
  //When selected hide the unwanted filters

  render() {
    return (
      <div onChange={event => this.props.changeType(event.target.value)}>
        <input type="radio" value="samples" name="gender" /> {" Samples  "}
        <input type="radio" value="analyses" name="gender" /> {" Analyses  "}
        <input type="radio" value="nhhrxf" name="gender" /> {" No HHRXF  "}
      </div>
    );
  }
}
