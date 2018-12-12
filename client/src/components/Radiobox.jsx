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
        <div style={{ display: "inline-block" }}>
          <label>
            <input type="radio" value="samples" name="gender" checked />
            Samples
          </label>
        </div>
        <div style={{ display: "inline-block" }}>
          <label>
            <input type="radio" value="analyses" name="gender" /> Analyses
          </label>
        </div>
        <div style={{ display: "inline-block" }}>
          <label>
            <input type="radio" value="nhhrxf" name="gender" /> No HHRXF
          </label>
        </div>
      </div>
    );
  }
}
