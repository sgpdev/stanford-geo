import React, { Component } from "react";
import Select, { components } from "react-select";

//function tahat takes all of the distinc countries from the database.
const array = ["USA", "Albania"];
function makeOptions(array) {
  return array.map(option => ({ value: option, label: option }));
}

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && <components.DropdownIndicator {...props} />
  );
};

class MultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    //Whenever it's run query db for list of countries
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption });
    this.props.constructMulti(this.props.attribute, selectedOption);
    console.log(`Option selected:`, selectedOption);
  }

  render() {
    return (
      <Select
        closeMenuOnSelect={false}
        components={{ DropdownIndicator }}
        isMulti
        options={makeOptions(array)}
        value={this.state.selectedOption}
        onChange={this.handleChange}
      />
    );
  }
}

export default MultiSelect;
