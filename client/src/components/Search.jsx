import React from "react";
import { makeData, Logo, Tips } from "./Utils";

// Import React Table
import ReactTable from "react-table";
import Table from "./Table";
import Drawer from "./Drawer";
import "react-table/react-table.css";

export default class Search extends React.Component {
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
      ],
      api: {
        filter: [1, 2, 3],
        show: ["sample_id", "abundance"]
      }
    };
    this.changeColumns = this.changeColumns.bind(this);
  }
  changeColumns() {
    this.setState({
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
            }
          ]
        }
      ]
    });
  }

  render() {
    const { data, column } = this.state;
    return (
      <div>
        <Drawer />
        <br />
        <strong>Open your console and hover over some cells!</strong>
        <br />
        <br />
        <Table show={this.state.api.show} />
        <br />
        <Tips />
        <Logo />
        <button onClick={this.changeColumns}> Click</button>
      </div>
    );
  }
}
