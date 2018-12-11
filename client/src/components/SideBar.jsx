import React, { Component } from "react";

import "./SideBar.css";
import Radiobox from "./Radiobox";
import MultiSelect from "./MultiSelect";
import Checkbox from "./Checkbox";

import AsyncMulti from "./AsyncMulti";
import RangeSelect from "./RangeSelect";
import Dropdown from "./Dropdown";
import { push as Menu } from "react-burger-menu";

var btoa = require("btoa");

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="side-bar">
        <Menu pageWrapId={"page-wrap"} width={"33%"}>
          {/* <SideBar data={this.state.data} /> */}
          <div className="filter-menu-item">Filters</div>
          <div id="type" className="menu-item">
            <span className="test">Type:</span>
            <Radiobox
              type={this.props.query.type}
              changeType={this.props.changeType}
            />
          </div>
          <a style={{ backgroundColor: "rgba(140, 21, 21, 0.37)" }} zz>
            Defaults
          </a>
          <Dropdown title="Collection Site">
            <div id="contact" className="menu-item">
              Country:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="country"
              />
            </div>
            <div id="contact" className="menu-item">
              State/Province:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="state_province"
              />
            </div>
            <div id="contact" className="menu-item">
              Site Type:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="site_type"
              />
            </div>
            <div id="contact" className="menu-item">
              Section Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="section_name"
              />
            </div>
            <div id="contact" className="menu-item">
              Craton/Terrane:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="craton_terrane"
              />
            </div>
            <div id="contact" className="menu-item">
              Basin Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="basin_name"
              />
            </div>
            <div id="contact" className="menu-item">
              Basin Type:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="basin_type"
              />
            </div>
            <div id="contact" className="menu-item">
              Metamorphic Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="meta_bin"
              />
            </div>
          </Dropdown>
          <Dropdown title="People/Batches/Insights">
            {" "}
            <div id="contact" className="menu-item">
              Collector's First Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="collector_first"
              />
            </div>
            <div id="contact" className="menu-item">
              Collector's Lat Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="collector_last"
              />
            </div>
            {this.props.query.type === "analyses" && (
              <div>
                <div id="contact" className="menu-item">
                  Run By Last Name:{" "}
                  <AsyncMulti
                    user={this.props.user}
                    password={this.props.password}
                    className="async-multi"
                    constructMulti={this.props.constructMulti}
                    attribute="run_by_last"
                  />
                </div>
                <div id="contact" className="menu-item">
                  Lab Provider:{" "}
                  <AsyncMulti
                    user={this.props.user}
                    password={this.props.password}
                    className="async-multi"
                    constructMulti={this.props.constructMulti}
                    attribute="provider_lab"
                  />
                </div>
              </div>
            )}
          </Dropdown>
          <Dropdown title="Geological Environmental Context">
            <div id="contact" className="menu-item">
              Long Stratigraphy Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="strat_name_long"
              />
            </div>
            <div id="contact" className="menu-item">
              Environmental Bin:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="environment_bin"
              />
            </div>
            <RangeSelect
              constructRange={this.props.constructRange}
              attribute="interpreted_age"
              title="Interpreted Age:"
            />
          </Dropdown>
          <Dropdown title="Misc">
            <div id="contact" className="menu-item">
              Project Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="project_name"
              />
            </div>
            <div id="contact" className="menu-item">
              Data Source:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="data_source"
              />
            </div>
          </Dropdown>

          <Dropdown title="Lithology">
            <div id="contact" className="menu-item">
              ICS Age:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="age_ics_name"
              />
            </div>
            <div id="contact" className="menu-item">
              Lithology Name:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="lithology_name"
              />
            </div>
            <div id="contact" className="menu-item">
              Lithology Type:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="lithology_type"
              />
            </div>
            <div id="contact" className="menu-item">
              Lithology Class:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="lithology_class"
              />
            </div>
            <div id="contact" className="menu-item">
              Lithology Texture:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="lithology_texture"
              />
            </div>
            <div id="contact" className="menu-item">
              Lithology Composition:{" "}
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="lithology_comp"
              />
            </div>
          </Dropdown>
          {this.props.query.type !== "analyses" && (
            <Dropdown title="Analytes">
              <Checkbox changeShow={this.props.changeShow} />
            </Dropdown>
          )}
        </Menu>
      </div>
    );
  }
}

export default SideBar;
