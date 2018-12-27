import React, { Component } from "react";
import "./../styles/Radiobox.css";

export default class Radiobox extends Component {
  constructor(props) {
    super(props);
  }
  //When selected hide the unwanted filters

  render() {
    const { changeType } = this.props;
    return (
      <div
        onChange={event => changeType(event.target.value)}
        className="radio-btn"
      >
        <input type="radio" value="samples" name="gender" />
        {" Samples "}
        <input type="radio" value="analyses" name="gender" /> {"Analyses "}
        <input type="radio" value="nhhrxf" name="gender" /> {"No HHRXF"}
      </div>
    );
  }
}
