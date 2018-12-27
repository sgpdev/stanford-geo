import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import "./../styles/NavBar.css";

export default class CustomNavBar extends Component {
  render() {
    return (
      <div className="sticky-nav">
        <Navbar default collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">
                <img
                  src={require("./../images/sgp_logo.png")}
                  width="68"
                  height="48"
                />
              </Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <Menu num={1} href="/sgp-search">
              HOME
            </Menu>
            <Menu num={2} href="/sgp-search/documentation">
              DOCUMENTATION
            </Menu>
            <Menu num={3} href="/sgp-search/about">
              ABOUT
            </Menu>
          </Nav>
        </Navbar>
      </div>
    );
  }
}
