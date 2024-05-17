import React from "react";


const NavbarItem = ({ title }) => <li>{title}</li>;

const Navbar = () => {
  return (
    <div className="nav">
            <div className="header">CelestiaAds</div>

      <nav className="navbar">
        <ul>
          {["About Us", "Mission", "FAQ", "Contact", "Site Map","Explore", "Roadmap", "More"].map((item, index) => (
            <NavbarItem key={item + index} title={item} />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
