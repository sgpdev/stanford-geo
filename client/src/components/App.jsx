import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Radiobox from "./Radiobox";
import MultiSelect from "./MultiSelect";
import Checkbox from "./Checkbox";
import Table from "./Table";
import AsyncMulti from "./AsyncMulti";
import RangeSelect from "./RangeSelect";
import Dropdown from "./Dropdown";
import { push as Menu } from "react-burger-menu";

var styles = {
  bmBurgerButton: {
    position: "fixed",
    width: "18px",
    height: "15px",
    left: "14px",
    top: "14px"
  },
  bmBurgerBars: {
    background: "#8c1515"
  },
  bmCrossButton: {
    top: "0.5%",
    height: "20px",
    width: "20px"
  },
  bmCross: {
    background: "#8c1515"
  },
  bmMenu: {
    paddingTop: "5%",
    background: "rgba(140, 21, 21, 0.35)",
    fontSize: "1.15em"
  },
  bmMorphShape: {
    fill: "#8c1515"
  },
  bmItemList: {
    color: "white"
  },
  bmItem: {
    display: "block"
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)"
  }
};

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
      attributes: [],
      location: [
        {
          id: 0,
          title: "New York",
          selected: false,
          key: "location"
        },
        {
          id: 1,
          title: "Dublin",
          selected: false,
          key: "location"
        },
        {
          id: 2,
          title: "California",
          selected: false,
          key: "location"
        },
        {
          id: 3,
          title: "Istanbul",
          selected: false,
          key: "location"
        },
        {
          id: 4,
          title: "Izmir",
          selected: false,
          key: "location"
        },
        {
          id: 5,
          title: "Oslo",
          selected: false,
          key: "location"
        }
      ]
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
  showSettings(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div style={{ marginTop: "40px" }} id="outer-container">
        <Menu
          pageWrapId={"page-wrap"}
          width={"33%"}
          isOpen={true}
          styles={styles}
          noOverlay
        >
          <div className="filter-menu-item">Filters</div>
          <div id="type" className="menu-item">
            <span className="test">Type:</span>
            <Radiobox
              type={this.state.query.type}
              changeType={this.changeType}
            />
          </div>
          <a
            style={{ backgroundColor: "rgba(140, 21, 21, 0.37)" }}
            className="menu-item"
          >
            Defaults
          </a>
          <Dropdown title="Collection Site" list={this.state.location}>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Country:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="country"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              State/Province:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="country"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Site Type:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="site_type"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Section Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="section_name"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Craton/Terrane:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="craton_terrane"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Basin Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="basin_name"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Basin Type:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="basin_type"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Metamorphic Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="meta_bin"
              />
            </div>
          </Dropdown>
          <Dropdown title="People/Batches/Insights" list={this.state.location}>
            {" "}
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Collector's First Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="collector_first"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Collector's Lat Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="collector_last"
              />
            </div>
            {this.state.query.type === "analyses" && (
              <div>
                <div
                  id="contact"
                  className="menu-item"
                  style={{ width: "200px" }}
                >
                  Run By Last Name:{" "}
                  <AsyncMulti
                    style={{ float: "right" }}
                    constructMulti={this.constructMulti}
                    attribute="run_by_last"
                  />
                </div>
                <div
                  id="contact"
                  className="menu-item"
                  style={{ width: "200px" }}
                >
                  Lab Provider:{" "}
                  <AsyncMulti
                    style={{ float: "right" }}
                    constructMulti={this.constructMulti}
                    attribute="provider_lab"
                  />
                </div>
              </div>
            )}
          </Dropdown>
          <Dropdown
            title="Geological Environmental Context"
            list={this.state.location}
          >
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Long Stratigraphy Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="strat_name_long"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Environmental Bin:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="environment_bin"
              />
            </div>
            <RangeSelect
              constructRange={this.constructRange}
              attribute="interpreted_age"
              title="Interpreted Age:"
            />
          </Dropdown>
          <Dropdown title="Misc" list={this.state.location}>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Project Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="project_name"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Data Source:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="data_source"
              />
            </div>
          </Dropdown>

          <Dropdown title="Lithology" list={this.state.location}>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              ICS Age:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="age_ics_name"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Lithology Name:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="lithology_name"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Lithology Type:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="lithology_type"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Lithology Class:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="lithology_class"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Lithology Texture:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="lithology_texture"
              />
            </div>
            <div id="contact" className="menu-item" style={{ width: "200px" }}>
              Lithology Composition:{" "}
              <AsyncMulti
                style={{ float: "right" }}
                constructMulti={this.constructMulti}
                attribute="lithology_comp"
              />
            </div>
          </Dropdown>
          {this.state.query.type !== "analyses" && (
            <Dropdown title="Analytes" list={this.state.location} />
          )}
        </Menu>
        <div id="page-wrap">
          {/* Range:
          <RangeSelect
            constructRange={this.constructRange}
            attribute="interpreted_age"
          />
          <br />
          TYPE:
          <Radiobox type={this.state.query.type} changeType={this.changeType} />
          <br />
          Filters:
          <MultiSelect
            constructMulti={this.constructMulti}
            attribute="country"
          />
          <br />
          <AsyncMulti
            constructMulti={this.constructMulti}
            attribute="country"
          />
          <br />
          <Checkbox changeShow={this.changeShow} />
          <br />
          <div>{this.state.query.type}</div>
          <br /> */}
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
