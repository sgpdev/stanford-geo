import React, { Component } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import "./../styles/Dropdown.css";

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
    const { listOpen, headerTitle } = this.state;
    return (
      <div className="dd-wrapper">
        <div className="dd-header" onClick={() => this.toggleList()}>
          <div className="dd-header-title">
            {headerTitle}
            <span className="dd-header-chevron">
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
