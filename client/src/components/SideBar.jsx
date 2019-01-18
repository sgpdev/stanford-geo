import React, { Component } from "react";

import "./../styles/SideBar.css";
import Radiobox from "./Radiobox";
import MultiSelect from "./MultiSelect";
import ReactTooltip from "react-tooltip";
import Checkbox from "./Checkbox";
import AsyncMulti from "./AsyncMulti";
import RangeSelect from "./RangeSelect";
import Dropdown from "./Dropdown";
import RangeList from "./RangeList";
import { push as Menu } from "react-burger-menu";
import {
  customElements,
  iron,
  carbon,
  sulfur,
  metalIsotope,
  nitrogen,
  defaultShow
} from "./attributeShow";
import toolTips from "./toolTips";

var btoa = require("btoa");

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      query,
      changeType,
      user,
      password,
      constructMulti,
      constructRange,
      changeShow
    } = this.props;
    return (
      <div id="side-bar">
        <Menu pageWrapId={"page-wrap"} width={"33%"}>
          <div id="type" className="menu-item">
            <div className="filter-menu-item">Type</div>
            <Radiobox type={query.type} changeType={changeType} />
          </div>
          <div className="filter-menu-item">Filters</div>
          <div id="contact" className="menu-item original-name">
            Original Name:{" "}
            <AsyncMulti
              user={user}
              password={password}
              className="async-multi"
              constructMulti={constructMulti}
              attribute="original_name"
            />
          </div>

          <Dropdown title="Collection Site">
            <div id="contact" className="menu-item">
              Country:{" "}
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="country"
              />
            </div>
            <div id="contact" className="menu-item">
              State/Province:{" "}
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="state_province"
              />
            </div>
            <div id="contact" className="menu-item">
              Site Type:{" "}
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="site_type"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.section_name}>Section Name: </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="section_name"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.craton_terrane}>Craton/Terrane: </text>

              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="craton_terrane"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.basin_name}>Basin Name: </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="basin_name"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.basin_type}>Basin Type: </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="basin_type"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.metamorphic_bin}>
                Metamorphic Name:{" "}
              </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="meta_bin"
              />
            </div>
          </Dropdown>
          <Dropdown title="People/Batches/Insights">
            {" "}
            <div id="contact" className="menu-item">
              Collector's First Name:{" "}
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="collector_first"
              />
            </div>
            <div id="contact" className="menu-item">
              Collector's Lat Name:{" "}
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="collector_last"
              />
            </div>
            {query.type === "analyses" && (
              <div>
                <div id="contact" className="menu-item">
                  Run By Last Name:{" "}
                  <AsyncMulti
                    user={user}
                    password={password}
                    className="async-multi"
                    constructMulti={constructMulti}
                    attribute="run_by_last"
                  />
                </div>
                <div id="contact" className="menu-item">
                  Lab Provider:{" "}
                  <AsyncMulti
                    user={user}
                    password={password}
                    className="async-multi"
                    constructMulti={constructMulti}
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
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="strat_name_long"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip />
              <text data-tip={toolTips.environment_bin}>
                Environmental Bin:{" "}
              </text>

              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="environment_bin"
              />
            </div>
            <RangeSelect
              constructRange={constructRange}
              attribute="interpreted_age"
              title="Interpreted Age (Younger-Older):  "
            />
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.age_ics_name}>ICS Age: </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="age_ics_name"
              />
            </div>
          </Dropdown>
          <Dropdown title="Project/Data Source">
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.project_name}>Project Name: </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="project_name"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.data_source}>Data Source: </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="data_source"
              />
            </div>
          </Dropdown>

          <Dropdown title="Lithology">
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.lithology_name}>Lithology Name: </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="lithology_name"
              />
            </div>
            <div id="contact" className="menu-item">
              Lithology Type:{" "}
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="lithology_type"
              />
            </div>
            <div id="contact" className="menu-item">
              Lithology Class:{" "}
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="lithology_class"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.lithology_text}>
                Lithology Texture:{" "}
              </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="lithology_text"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.lithology_comp}>
                Lithology Composition:{" "}
              </text>
              <AsyncMulti
                user={user}
                password={password}
                className="async-multi"
                constructMulti={constructMulti}
                attribute="lithology_comp"
              />
            </div>
          </Dropdown>
          {(query.type === "samples" || query.type === "nhhrxf") && (
            <div>
              <div className="filter-menu-item">Analytes</div>
              <Dropdown title="Iron">
                <RangeList constructRange={constructRange} attributes={iron} />
              </Dropdown>
              <Dropdown title="Carbon">
                <RangeList
                  constructRange={constructRange}
                  attributes={carbon}
                />
              </Dropdown>
              <Dropdown title="Sulfur">
                <RangeList
                  constructRange={constructRange}
                  attributes={sulfur}
                />
              </Dropdown>
              <Dropdown title="Nitrogen">
                <RangeList
                  constructRange={constructRange}
                  attributes={nitrogen}
                />
              </Dropdown>
              <Dropdown title="Metal Isotopes">
                <RangeList
                  constructRange={constructRange}
                  attributes={metalIsotope}
                />
              </Dropdown>

              <Dropdown title="Elemental Data">
                <RangeList
                  constructRange={constructRange}
                  attributes={customElements}
                />
              </Dropdown>
            </div>
          )}
          <div className="filter-menu-item">Show</div>
          {(query.type === "samples" || query.type === "nhhrxf") && (
            <span>
              <Dropdown title="Iron">
                <Checkbox changeShow={changeShow} attributes={iron} />
              </Dropdown>
              <Dropdown title="Carbon">
                <Checkbox changeShow={changeShow} attributes={carbon} />
              </Dropdown>
              <Dropdown title="Sulfur">
                <Checkbox changeShow={changeShow} attributes={sulfur} />
              </Dropdown>
              <Dropdown title="Nitrogen">
                <Checkbox changeShow={changeShow} attributes={nitrogen} />
              </Dropdown>
              <Dropdown title="Metal Isotopes">
                <Checkbox changeShow={changeShow} attributes={metalIsotope} />
              </Dropdown>
              <Dropdown title="Elemental Data">
                <Checkbox changeShow={changeShow} attributes={customElements} />
              </Dropdown>
            </span>
          )}

          <Dropdown title="Samples Context">
            <Checkbox changeShow={changeShow} attributes={defaultShow} />
          </Dropdown>

          <br />
        </Menu>
      </div>
    );
  }
}

export default SideBar;
