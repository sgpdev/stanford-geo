import React, { Component } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      headerTitle: this.props.title
    };
  }

  handleClickOutside() {
    this.setState({
      listOpen: false
    });
  }
  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }));
  }
  render(props) {
    const { list } = this.props;
    const { listOpen, headerTitle } = this.state;
    return (
      <div className="dd-wrapper">
        <div className="dd-header" onClick={() => this.toggleList()}>
          <div
            className="dd-header-title"
            style={{ backgroundColor: "rgba(140, 21, 21, 0.37)" }}
          >
            {headerTitle}
            <span style={{ float: "right", paddingRight: "10px" }}>
              {" "}
              {listOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
        </div>
        {listOpen && <div className="dd-list">{this.props.children}</div>}
      </div>
    );
  }
}
