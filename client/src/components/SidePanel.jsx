import React, { Component } from "react";

import "./SidePanel.css";

class SidePanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div class="sidenav">
          <a href="#">Export</a>
          <a href="#">API</a>
        </div>
      </div>
    );
  }
}

export default SidePanel;
