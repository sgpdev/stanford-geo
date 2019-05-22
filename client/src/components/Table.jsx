import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Logo, Tips } from "./Utils";

export default class Table extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.columnConstructor();
  }

  render() {
    const { data, column } = this.props;
    return (
      <div>
        <ReactTable
          data={data}
          columns={column}
          defaultPageSize={25}
          className="-striped -highlight"
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}
