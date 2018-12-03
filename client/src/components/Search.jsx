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
      api: {
        filter: [1, 2, 3],
        show: ["sample_id", "abundance"]
      }
    };
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
