import React from "react";
import { NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = ({ num, href, children }) => (
  <NavItem
    eventKey={num}
    componentClass={Link}
    href={`${href || "/"}`}
    to={`${href || "/"}`}
  >
    {children}
  </NavItem>
);

export default Menu;
