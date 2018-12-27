import React, { Component } from "react";
import { FaFileDownload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import ReactTooltip from "react-tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";

import "./../styles/SidePanel.css";

class SidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  render() {
    const { query, data } = this.props;
    return (
      <div>
        <div className="sidenav">
          <a
            className="api-btn-closed"
            data-tip={query}
            onClick={this.copyToClipboard}
          >
            <CopyToClipboard
              text={query}
              onCopy={() => this.setState({ copied: true })}
            >
              <span>
                <img src={require("./../images/api-logo.png")} />
              </span>
            </CopyToClipboard>
          </a>
          <ReactTooltip place="right" />
          <CSVLink
            className="export-btn-closed"
            data={data}
            filename={"Stanford-sgp.csv"}
            target="_self"
          >
            <FaFileDownload />
          </CSVLink>
        </div>
      </div>
    );
  }
}

export default SidePanel;
