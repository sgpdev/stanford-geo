import React, { Component } from "react";

import "./SideBar.css";
import Radiobox from "./Radiobox";
import MultiSelect from "./MultiSelect";
import ReactTooltip from "react-tooltip";
import { FaFileDownload } from "react-icons/fa";
import Checkbox from "./Checkbox";
import { CSVLink } from "react-csv";
import AsyncMulti from "./AsyncMulti";
import RangeSelect from "./RangeSelect";
import Dropdown from "./Dropdown";
import { push as Menu } from "react-burger-menu";

const toolTips = {
  environment_bin:
    "Environments are divided into five bins - inner shelf/outer shelf/basinal/lacustrine/fluvial  - according to the following criteria (1-3 from Sperling et al. 2015).",
  section_name:
    "This could be a drillcore, stratigraphic section, or spot-sampling locality. In some rare instances where complete information could be not obtained, a best-guess sampling locality was created (for instance, the geographic center of New York state if the only geographical information was 'New York State'). More information can be found under 'geological context notes'",
  craton_terrane:
    "The name of the craton or terrane e.g. Laurentia, Avalonia. As entered by SGP collaborative team members",
  basin_name:
    "The name of the sedimentary basin e.g. Taconic Foreland Basin. As entered by SGP collaborative team members",
  basin_type: "The type of basin e.g. peripheral foreland, rift, etc.",
  metamorphic_bin:
    "Sites are sorted into three low-grade metamorphic bins, roughly based on metapelite zones as follows:      1) Diagenetic zone. Under mature, preserved biomarkers, KI>0.42, CAI ≤3, Ro <2.0, facies: zeolite-subgreenschist facies, grade: diagenesis-very low grade      2) Anchizone. Over-mature, no preserved biomarkers, CAI=4, Ro 2-4, facies: sub-greenschist, grade: very low grade     3) Epizone. Ro>4, CAI=5, KI<0.25, facies: greenschist, grade: low-grade ",
  age_ics_name: "International Commission on Stratigraphy age names",
  lithology_name: "The primary sediment type of the sample",
  lithology_text: "Textural modifiers (siltey, muddy, sandy, clayey)",
  lithology_comp:
    "Compositional modifiers (e.g., phosphatic, calcareous, dolomitic, etc.)",
  interpreted_age:
    "A numerical estimate for the age of the sample in millions of years",
  project_name:
    "SGP data are organized as 'Projects.' In most cases, these represent the data contained in a published paper. However, in some cases they may represent groupings of papers, data from a particular region, or samples run by a particular person or lab.",
  data_source:
    "Data in the SGP database come from three main data sources: 1) information provided by the SGP collaborative team, 2) legacy USGS data from the National Geochemical Database, 3) data compiled by the USGS Critical Metals In Black Shales project (CMIBS)"
};

var btoa = require("btoa");

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="side-bar">
        <Menu pageWrapId={"page-wrap"} width={"33%"}>
          <div id="type" className="menu-item">
            <div className="filter-menu-item">Type</div>
            <Radiobox
              type={this.props.query.type}
              changeType={this.props.changeType}
            />
          </div>
          <div className="filter-menu-item">Filters</div>
          <div id="contact" className="menu-item">
            Original Name:{" "}
            <AsyncMulti
              user={this.props.user}
              password={this.props.password}
              className="async-multi"
              constructMulti={this.props.constructMulti}
              attribute="original_name"
            />
          </div>

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
              <ReactTooltip place="right" />
              <text data-tip={toolTips.section_name}>Section Name: </text>
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="section_name"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.craton_terrane}>Craton/Terrane: </text>

              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="craton_terrane"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.basin_name}>Basin Name: </text>
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="basin_name"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.basin_type}>Basin Type: </text>
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="basin_type"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.metamorphic_bin}>
                Metamorphic Name:{" "}
              </text>
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
              <ReactTooltip />
              <text data-tip={toolTips.environment_bin}>
                Environmental Bin:{" "}
              </text>

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
              title="Interpreted Age (Younger-Older):  "
            />
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.age_ics_name}>ICS Age: </text>
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="age_ics_name"
              />
            </div>
          </Dropdown>
          <Dropdown title="Project/Data Source">
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.project_name}>Project Name: </text>
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="project_name"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.data_source}>Data Source: </text>
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
              <ReactTooltip place="right" />
              <text data-tip={toolTips.lithology_name}>Lithology Name: </text>
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
              <ReactTooltip place="right" />
              <text data-tip={toolTips.lithology_text}>
                Lithology Texture:{" "}
              </text>
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="lithology_text"
              />
            </div>
            <div id="contact" className="menu-item">
              <ReactTooltip place="right" />
              <text data-tip={toolTips.lithology_comp}>
                Lithology Composition:{" "}
              </text>
              <AsyncMulti
                user={this.props.user}
                password={this.props.password}
                className="async-multi"
                constructMulti={this.props.constructMulti}
                attribute="lithology_comp"
              />
            </div>
          </Dropdown>
          <div className="filter-menu-item">Show</div>

          <Dropdown title="Show">
            <Checkbox changeShow={this.props.changeShow} />
          </Dropdown>
          {/* {this.props.query.type !== "analyses" && (
            <Dropdown title="Analytes">
              <Checkbox changeShow={this.props.changeShow} />
            </Dropdown>
          )} */}
          <br />

          <CSVLink
            className="export-btn"
            data={this.props.data}
            filename={"Stanford-sgp.csv"}
          >
            {" Export "}
            <FaFileDownload />
          </CSVLink>
        </Menu>
      </div>
    );
  }
}

export default SideBar;
