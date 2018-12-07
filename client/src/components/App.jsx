import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Table from "./Table";
import SideBar from "./SideBar";

var btoa = require("btoa");

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
      .post("/api/post", this.state.query, {
        Authorization: `Basic ${btoa("admin:supersecret")}`
      })
      .then(function(response) {
        that.setState({
          data: response.data
        });
        that.columnConstructor(that.state.data[0]);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div id="outer-container">
        <SideBar
          query={this.state.query}
          changeType={this.changeType}
          constructMulti={this.constructMulti}
          constructRange={this.constructRange}
          changeShow={this.changeShow}
        />

        <div id="page-wrap">
          <Table
            column={this.state.column}
            data={this.state.data}
            columnConstructor={this.columnConstructor}
          />
          <br />
          <button onClick={this.postSearch}>Post</button>
        </div>
      </div>
    );
  }
}

export default App;
