import React from 'react';
import './Buttons.style.css'; 

import mappin from "./logo/map-pin.svg";
import editview from "./logo/layout-grid.svg";

const NavItem = ({ icon }) => (
    <div>
      <img src={icon} alt='' />
    </div>
  );

const Buttons =()=> {
    return (
      <div className = 'buttons1'>
        <button className = 'locations'>
            <NavItem icon={mappin}/>
            Locations
        </button>

        <button className = 'editView'>
            <NavItem icon={editview}/>
            Edit View
        </button>

      </div>
    )
  }
  
  export default Buttons;