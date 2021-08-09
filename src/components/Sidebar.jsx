import React from "react";
import { slide as Menu } from "react-burger-menu";

export default props => {
  return (
    <Menu {...props}>
      <a className="menu-item" href="/">
        Home
      </a>

      <a className="menu-item" href="/...">
        Activity
      </a>

      <a className="menu-item" href="/...">
        Calendar
      </a>

      <a className="menu-item" href="/...">
        Logout
      </a>

    </Menu>
  );
};
