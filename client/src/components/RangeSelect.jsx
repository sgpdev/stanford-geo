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
      event.target.value,
      this.state.max,
      this.props.attribute
    );
  }

  handleMaxChange(event) {
    console.log(event.target.value);
    this.setState({ max: event.target.value });
    // console.log("Max", this.state.min, this.state.max);
    this.props.constructRange(
      this.state.min,
      event.target.value,
      this.props.attribute
    );
  }

  render() {
    return (
      <div>
        <input
          onChange={this.handleMinChange}
          value={this.state.min}
          type="number"
        />
        -
        <input
          onChange={this.handleMaxChange}
          value={this.state.max}
          type="number"
        />
      </div>
    );
  }
}
