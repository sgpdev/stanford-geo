import React, { Component } from "react";
import AsyncSelect from "react-select/lib/Async";
import axios from "axios";
var btoa = require("btoa");

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: "1px dotted pink",
    color: "#9cc2e6,",
    padding: "2%",
    width: "400px"
  })
};

export default class AsyncMulti extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedOption: "" };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  async getOptions(inputValue) {
    if (!inputValue) {
      var attribute = {
        limit: 10,
        attribute: this.props.attribute
      };
    } else {
      var attribute = {
        limit: 10,
        attribute: this.props.attribute,
        current_search: inputValue
      };
    }

    var answer = await axios.post("api/post/attr", attribute, {
      headers: {
        Authorization: `Basic ${btoa(
          `${this.props.user}:${this.props.password}`
        )}`
      }
    });

    return await answer.data.map(option => ({
      value: option[this.props.attribute],
      label: option[this.props.attribute]
    }));
  }
  handleChange(selectedOption) {
    this.setState({ selectedOption });
    this.props.constructMulti(this.props.attribute, selectedOption);
  }
  handleInputChange(inputValue) {
    this.setState({ inputValue });
    return inputValue;
  }

  render() {
    const { selectedOption } = this.state;
    return (
      <AsyncSelect
        // This is the example that the list was cleared (FIXED)
        defaultOptions
        value={selectedOption}
        loadOptions={this.getOptions}
        onChange={this.handleChange}
        closeMenuOnSelect={false}
        isMulti
        styles={customStyles}
      />
    );
  }
}
