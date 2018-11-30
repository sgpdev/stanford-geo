import React from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import MultiSelect from "./MultiSelect";

// Be sure to include styles at some point, probably during your bootstraping
import "../../../node_modules/@trendmicro/react-sidenav/dist/react-sidenav.css";

const mql = window.matchMedia(`(min-width: 800px)`);

class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {},
      sidebarDocked: mql.matches,
      sidebarOpen: false
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  render() {
    return (
      <SideNav
        onSelect={selected => {
          // Add your code here
        }}
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="Filter">
            <NavIcon>
              <img src={require("./../images/icons8-slider-48.png")} />
            </NavIcon>
            <NavText>Filter</NavText>
            <NavItem>
              <NavText>Site</NavText>
            </NavItem>
          </NavItem>
          <NavItem eventKey="Show">
            <NavIcon>
              <i className="fa fa-download" style={{ fontSize: "1.75em" }} />
            </NavIcon>
            <NavText>Showyrthrthrthrthtlkdvdfbvndfblndfblnrbrtb</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    );
  }
}

export default Drawer;
