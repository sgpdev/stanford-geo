import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Radiobox from "./Radiobox";
import MultiSelect from "./MultiSelect";
import Checkbox from "./Checkbox";
import Table from "./Table";
import AsyncMulti from "./AsyncMulti";
import RangeSelect from "./RangeSelect";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          "sample identifier": 1202,
          "sample original name": "60"
        }
      ],
      query: {
        type: "samples",
        filters: {},
        show: ["country"]
      },
      column: [
        {
          columns: []
        }
      ],
      attributes: []
    };

    this.postSearch = this.postSearch.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeShow = this.changeShow.bind(this);
    this.constructMulti = this.constructMulti.bind(this);
    this.columnConstructor = this.columnConstructor.bind(this);
    this.constructRange = this.constructRange.bind(this);
  }
  columnConstructor() {
    this.setState({
      column: [
        {
          columns: Object.keys(this.state.data[0]).map(key => ({
            Header: key,
            accessor: key
          }))
        }
      ]
    });
  }

  changeType(value) {
    let query = this.state.query;
    query.type = value;

    this.setState({ query });
  }

  changeShow(value) {
    console.log(this.state.query.show);
    let query = this.state.query;
    console.log("changeshow working");
    query.show.push(value);
    this.setState({ query });
  }

  //Multi Select construct array
  constructMulti(attribute, arr) {
    let query = this.state.query;
    query.filters[attribute] = arr.map(option => option.value);
    console.log(this.state.query);
  }

  constructRange(min, max, attribute) {
    let query = this.state.query;
    query.filters[attribute] = [min, max];
    console.log(this.state.query);
  }

  postSearch() {
    console.log("before sending", this.state.query);
    var that = this;
    axios
      .post("/api/post", this.state.query)
      .then(function(response) {
        console.log(response.data);
        that.setState({
          data: response.data
        });
        that.columnConstructor(that.state.data[0]);
        console.log(that.state.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div style={{ marginTop: "100px" }}>
        Range:
        <RangeSelect
          constructRange={this.constructRange}
          attribute="interpreted_age"
        />
        <br />
        TYPE:
        <Radiobox type={this.state.query.type} changeType={this.changeType} />
        <br />
        Filters:
        <MultiSelect constructMulti={this.constructMulti} attribute="country" />
        <br />
        <AsyncMulti constructMulti={this.constructMulti} attribute="country" />
        <br />
        <Checkbox changeShow={this.changeShow} />
        <br />
        <div>{this.state.query.type}</div>
        <br />
        <Table
          column={this.state.column}
          data={this.state.data}
          columnConstructor={this.columnConstructor}
        />
        <br />
        <button onClick={this.postSearch}>Post</button>
      </div>
    );
  }
}

export default App;
