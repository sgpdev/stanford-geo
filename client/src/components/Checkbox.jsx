import React, { Component } from "react";
import "./Checkbox.css";

export default class Checkbox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { changeShow, attributes } = this.props;
    return (
      <div onChange={event => changeShow(event.target.value)}>
        {Object.entries(attributes).map((item, key) => (
          <label className="options">
            {item[1]}:
            <input type="checkbox" value={item[0]} />
          </label>
        ))}
      </div>
    );
  }
}
