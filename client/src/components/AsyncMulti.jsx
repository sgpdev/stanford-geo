import React, { Component } from "react";
import AsyncSelect from "react-select/lib/Async";
import axios from "axios";

// const filterOptions = inputValue => {
//   if (inputValue) {
//     return inputOption.filter(i =>
//       i.label.toLowerCase().includes(inputValue.toLowerCase())
//     );
//   }
//   return inputOption;
// };
let kiki = [];
const koko = inputValue => {
  var attribute = {
    limit: 10,
    attribute: "country",
    current_search: inputValue
  };
  getAttributes(attribute);
  return kiki;
};

const promiseOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(koko(inputValue));
    }, 2000);
  });

const getAttributes = attribute => {
  var that = this;
  axios
    .post("/api/post/attr", attribute)
    .then(function(response) {
      kiki = response.data.map(option => ({
        value: option.country,
        label: option.country
      }));
    })
    .catch(function(error) {
      console.log(error);
    });
};

export default class AsyncMulti extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedOption: "" };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(selectedOption) {
    console.log(selectedOption);
    this.setState({ selectedOption });
    this.props.constructMulti(this.props.attribute, selectedOption);
    console.log(`Option selected:`, selectedOption);
  }
  handleInputChange(newValue) {
    const inputValue = newValue.replace(/\W/g, "");
    console.log("noticing change");
    this.setState({ inputValue });
    return inputValue;
  }

  render() {
    return (
      <AsyncSelect
        // This is the example that the list was cleared (FIXED)
        cacheOptions
        defaultOptions
        value={this.state.selectedOption}
        loadOptions={promiseOptions}
        onChange={this.handleChange}
        closeMenuOnSelect={false}
        isMulti
      />
    );
  }
}
