import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { Logo, Tips } from "./Utils";

export default class Table extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    console.log(this.props.data, "dayta");
    this.props.columnConstructor();
  }

  render() {
    const { data, column } = this.props;
    return (
      <div>
        <ReactTable
          data={data}
          columns={column}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onMouseEnter: e =>
                console.log("Cell - onMouseEnter", {
                  state,
                  rowInfo,
                  column,
                  instance,
                  event: e
                })
            };
          }}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
        <Tips />
        <Logo />
      </div>
    );
  }
}
