import React from "react";
import Select, { components } from "react-select";

function makeOptions(array) {
  return array.map(option => ({ value: option, label: option }));
}

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && <components.DropdownIndicator {...props} />
  );
};

const MultiSelect = () => (
  <Select
    closeMenuOnSelect={false}
    components={{ DropdownIndicator }}
    isMulti
    options={countryOptions}
  />
);

export default MultiSelect;
