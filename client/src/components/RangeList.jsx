import React, { Component } from "react";
import RangeSelect from "./RangeSelect";

export default class RangeList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { constructRange, attributes } = this.props;
    return (
      <div>
        {Object.entries(attributes).map((item, key) => (
          <RangeSelect
            constructRange={constructRange}
            attribute={item[0]}
            title={`${item[1]} (Younger-Older):  `}
          />
        ))}
      </div>
    );
  }
}
