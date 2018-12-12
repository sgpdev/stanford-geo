import React, { Component } from "react";

export default class RangeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: null,
      max: null
    };

    this.handleMinChange = this.handleMinChange.bind(this);
    this.handleMaxChange = this.handleMaxChange.bind(this);
  }

  handleMinChange(event) {
    console.log(event.target.value);
    this.setState({ min: event.target.value });
    console.log("Min", this.state.min, this.state.max);
    this.props.constructRange(
      Number(event.target.value),
      Number(this.state.max),
      this.props.attribute
    );
  }

  handleMaxChange(event) {
    console.log(event.target.value);
    this.setState({ max: event.target.value });
    console.log(this.state.max);
    // console.log("Max", this.state.min, this.state.max);
    this.props.constructRange(
      Number(this.state.min),
      Number(event.target.value),
      this.props.attribute
    );
  }

  render() {
    return (
      <div>
        {this.props.title}
        <input
          onChange={this.handleMinChange}
          value={this.state.min}
          type="number"
          style={{
            width: "50px",
            border: "2px solid rgba(140, 21, 21, 0.85)",
            borderRadius: "4px"
          }}
        />
        {" - "}
        <input
          onChange={this.handleMaxChange}
          value={this.state.max}
          type="number"
          style={{
            width: "50px",
            border: "2px solid rgba(140, 21, 21, 0.85)",
            borderRadius: "4px"
          }}
        />
      </div>
    );
  }
}
