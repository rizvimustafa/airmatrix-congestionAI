import React from 'react';
import './Navbar.style.css'; 
import { NavLink } from 'react-router-dom'; // Changed from 'Link' to 'NavLink'

import AirMatrixLogo from './logo/airmatrix-mobile.svg';
import DashboardIcon from './logo/layout-dashboard.svg';
import AnalysisIcon from './logo/analysis.svg';
import MonitorIcon from './logo/wall-camare.svg';
import ShieldIcon from './logo/shield-alert.svg';
import SettingsIcon from './logo/settings.svg';
import LogoutIcon from './logo/logout.svg'; 

const NavItem = ({ icon, to }) => (
  <NavLink to={to} className={({ isActive }) => `NavItem ${isActive ? 'selected' : ''}`}>
    {/* Removed onClick and isSelected props */}
    <img src={icon} alt='' />
  </NavLink>
);

const Nav = () => {
  return (
    <nav className="NavWrapper">
      <div className="MenuHeader">
        {/* Changed NavItem usage to direct NavLink usage */}
        <NavLink to='/' className="NavItem" style={{ width: '30px', height: '30px' }}>
          <img src={AirMatrixLogo} alt='' />
        </NavLink>
      </div>
      
      <div className="NavBody">
        {/* Updated each NavItem to use NavLink directly, removing the need for onClick and isSelected */}
        <NavItem icon={DashboardIcon} to='/' />
        <NavItem icon={MonitorIcon} to='/monitor' />
        <NavItem icon={AnalysisIcon} to='/analytics' />
        <NavItem icon={ShieldIcon} to='/shield' />
        <NavItem icon={SettingsIcon} to='/settings' />

        </div>
        
        <div className="Logout">
          <img src={LogoutIcon} alt="Logout" />
        </div>
    </nav>
  );
};

export default Nav;
