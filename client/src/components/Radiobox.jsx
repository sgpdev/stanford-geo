import React, { Component } from "react";

export default class Radiobox extends Component {
  constructor(props) {
    super(props);
  }
  //When selected hide the unwanted filters

  render() {
    return (
      <div onChange={event => this.props.changeType(event.target.value)}>
        <input type="radio" value="samples" name="gender" /> samples
        <input type="radio" value="analyses" name="gender" /> analyses
        <input type="radio" value="nhhrxf" name="gender" /> NO HHRXF
      </div>
    );
  }
}
