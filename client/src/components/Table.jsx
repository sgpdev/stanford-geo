import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { makeData, Logo, Tips } from "./Utils";

export default class Table extends Component {
  constructor() {
    super();
    this.state = {
      data: makeData(),
      column: [
        {
          columns: [
            {
              Header: "Sample Identifier",
              accessor: "sample_id"
            },
            {
              Header: "Sample Original Name",
              accessor: "original_num"
            },
            {
              Header: "Analysis Result Identifier",
              accessor: "analyte_det_id"
            },
            {
              Header: "Analyte Code",
              accessor: "analyte_code"
            },
            {
              Header: "Analyte Abundance",
              accessor: "abundance"
            }
          ]
        }
      ]
    };
  }

  componentDidMount() {
    console.log(this.props.show);
    this.ColumnConstructor(this.props.show);
  }

  ColumnConstructor(show) {
    this.setState({
      column: [
        { columns: show.map(item => ({ Header: item, accessor: item })) }
      ]
    });
  }

  render() {
    const { data, column } = this.state;
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
