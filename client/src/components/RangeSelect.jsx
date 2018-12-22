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
    this.setState({ min: event.target.value });

    this.props.constructRange(
      Number(event.target.value),
      Number(this.state.max),
      this.props.attribute
    );
  }

  handleMaxChange(event) {
    this.setState({ max: event.target.value });

    this.props.constructRange(
      Number(this.state.min),
      Number(event.target.value),
      this.props.attribute
    );
  }

  render() {
    const { min, max } = this.state;
    const { title } = this.props;

    return (
      <div>
        {title}
        <input
          onChange={this.handleMinChange}
          value={min}
          type="number"
          style={{
            width: "50px",
            border: "2px solid #7d90b8",
            borderRadius: "4px"
          }}
        />
        {" - "}
        <input
          onChange={this.handleMaxChange}
          value={max}
          type="number"
          style={{
            width: "50px",
            border: "2px solid #7d90b8",
            borderRadius: "4px"
          }}
        />
      </div>
    );
  }
}
