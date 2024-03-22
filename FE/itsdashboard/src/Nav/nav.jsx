import React from 'react';
import './nav.styles.css'; 

// Importing SVG icons to be used in the navigation bar
import AirMatrixLogo from './logo/airmatrix-mobile.svg';
import DashboardIcon from './logo/download.svg';
import AnalysisIcon from './logo/analysis.svg';
import ProfileIcon from './logo/profile.svg';
import SettingsIcon from './logo/settings.svg';
import LogoutIcon from './logo/logout.svg'; 

// Functional component to render an individual navigation item
// It receives an 'icon' prop which is the path to an SVG icon
const NavItem = ({ icon }) => (
  <div className="NavItem" >
    <img src={icon} alt='' />
  </div>
);

// Main navigation component
const Nav = () => {
  return (
    // Wraps the entire navigation bar
    <nav className="NavWrapper">
      {/* Header section of the navigation bar, typically for the main logo or brand */}
      <div className="MenuHeader">
        {/* // Uses NavItem component to render the logo as a navigable item */}
        <NavItem icon={AirMatrixLogo}  />
      </div>
      {/* // Body section containing various navigational links or icons */}
      <div className="NavBody">
        {/* // Each NavItem represents a different section or page of the application */}
        <NavItem icon={DashboardIcon}  />
        <NavItem icon={AnalysisIcon}  />
        <NavItem icon={ProfileIcon}  />
        <NavItem icon={SettingsIcon} />
        {/* // Explicit logout section styled differently or placed separately from other navigation items */}
        <div className="Logout">
          {/* // Directly renders the logout icon without using NavItem wrapper for custom styling or behavior */}
          <img src={LogoutIcon} alt="Logout" />
        </div>
      </div>
    </nav>
  );
};

// Makes the Nav component available for import in other parts of the application
export default Nav;