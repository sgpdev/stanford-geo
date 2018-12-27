import React, { Component } from "react";
import axios from "axios";
import About from "./About";
import Table from "./Table";
import SideBar from "./SideBar";
import SidePanel from "./SidePanel";
import "./../styles/Search.css";

var btoa = require("btoa");

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
      password: "",
      login: ""
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
    } else {
      let query = this.state.query;

      query.show.push(value);
      this.setState({ query });
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
    } else {
      this.setState({
        data: [{}]
      });
    }
  }

  constructRange(min, max, attribute) {
    let query = this.state.query;
    if (min === 0 && max === 0) {
      delete query.filters[attribute];
    } else {
      query.filters[attribute] = [Number(min), Number(max)];
      this.postSearch();
    }
  }

  postSearch() {
    var that = this;
    axios
      .post("sgp-search/api/post", this.state.query, {
        headers: {
          Authorization: `Basic ${btoa(
            `${this.state.user}:${this.state.password}`
          )}`
        }
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

  login() {
    var that = this;
    axios
      .get("sgp-search/api/get", {
        headers: {
          Authorization: `Basic ${btoa(
            `${this.state.user}:${this.state.password}`
          )}`
        }
      })
      .then(function(response) {
        that.setState({
          login: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  showSettings(event) {
    event.preventDefault();
  }

  render() {
    const { user, password, login, data, query, column } = this.state;
    return (
      <div>
        {login !== "login succeeded" && (
          <About
            handleChange={this.handleChange}
            handlePasswordChange={this.handlePasswordChange}
            login={this.login}
            user={user}
            password={password}
          />
        )}

        {login === "login succeeded" && (
          <div id="outer-container">
            <SidePanel data={data} query={`${JSON.stringify(query)}`} />
            <SideBar
              query={query}
              changeType={this.changeType}
              constructMulti={this.constructMulti}
              constructRange={this.constructRange}
              changeShow={this.changeShow}
              user={user}
              password={password}
              data={data}
              postSearch={this.postSearch}
            />

            <div id="page-wrap">
              <Table
                column={column}
                data={data}
                columnConstructor={this.columnConstructor}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Search;
