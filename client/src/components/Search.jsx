import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Table from "./Table";
import SideBar from "./SideBar";
import { CSVLink } from "react-csv";
import { Tooltip, ButtonToolbar, OverlayTrigger } from "react-bootstrap";
import Documentation from "./Documentation";
var btoa = require("btoa");

const tool = (
  <Tooltip id="tooltip">
    <strong>Holy guacamole!</strong> Check this info.
  </Tooltip>
);

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [{}],
      query: {
        type: "samples",
        filters: {},
        show: []
      },
      column: [
        {
          columns: []
        }
      ],
      attributes: [],
      user: "frontend",
      password: ""
    };

    this.postSearch = this.postSearch.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeShow = this.changeShow.bind(this);
    this.constructMulti = this.constructMulti.bind(this);
    this.columnConstructor = this.columnConstructor.bind(this);
    this.constructRange = this.constructRange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.login = this.login.bind(this);
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

  handleChange(event) {
    this.setState({ user: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  changeType(value) {
    let query = this.state.query;
    query.type = value;

    this.setState({ query });
  }

  changeShow(value) {
    const show = this.state.query.show;
    var showIndex = show.indexOf(value);

    if (showIndex !== -1) {
      let fiery = this.state.query.show;
      fiery = fiery.splice(showIndex, 1);
      this.setState({ fiery });
      console.log(this.state.query.show, "pushing");
    } else {
      let query = this.state.query;

      query.show.push(value);
      this.setState({ query });
      console.log(this.state.query.show, "pushing");
    }
    this.postSearch();
  }

  //Multi Select construct array
  constructMulti(attribute, arr) {
    let query = this.state.query;
    if (arr.length) {
      query.filters[attribute] = arr.map(option => option.value);
    } else {
      delete query.filters[attribute];
    }

    if (Object.keys(this.state.query.filters).length) {
      this.postSearch();
    }

    console.log(this.state.query);
  }

  constructRange(min, max, attribute) {
    console.log(typeof min, typeof max, "checking if zero");
    let query = this.state.query;
    if (min === 0 && max === 0) {
      delete query.filters[attribute];
    } else {
      query.filters[attribute] = [Number(min), Number(max)];
      this.postSearch();
      console.log(this.state.query);
    }
  }

  postSearch() {
    console.log("before sending", this.state.query);
    var that = this;
    axios
      .post("/api/post", this.state.query, {
        headers: {
          Authorization: `Basic ${btoa(
            `${this.state.user}:${this.state.password}`
          )}`
        }
      })
      .then(function(response) {
        console.log(response.data);
        that.setState({
          data: response.data
        });
        that.columnConstructor(that.state.data[0]);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  login() {
    console.log("before sending", this.state.user, this.state.password);
    var that = this;
    axios
      .get("/api/get", {
        headers: {
          Authorization: `Basic ${btoa(
            `${this.state.user}:${this.state.password}`
          )}`
        }
      })
      .then(function(response) {
        console.log(response);
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
          user={this.state.user}
          password={this.state.password}
          data={this.state.data}
          postSearch={this.postSearch}
        />

        <div id="page-wrap">
          <Table
            column={this.state.column}
            data={this.state.data}
            columnConstructor={this.columnConstructor}
          />
          <br />
          {`${JSON.stringify(this.state.query)}`}
          <br />

          <button onClick={this.postSearch}>Post</button>

          <br />

          <CSVLink data={this.state.data} filename={"Stanford-sgp.csv"}>
            Export
          </CSVLink>

          <br />
          <Documentation
            handleChange={this.handleChange}
            handlePasswordChange={this.handlePasswordChange}
            login={this.login}
            user={this.state.user}
            password={this.state.password}
          />
        </div>
      </div>
    );
  }
}

export default Search;
