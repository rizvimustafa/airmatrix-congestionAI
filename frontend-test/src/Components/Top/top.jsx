import React from 'react'
import './top.styles.css'

import line from './logo/line.svg'; 


const NavItem = ({ icon }) => (
  <div name='dateLine'>
    <img src={icon} alt='' />
  </div>
);
const Top =({title})=> {
  const date = new Date();
  return (
    <nav className='top'>
      
      <h2>
        {title}
      </h2>

      <div className = 'dateLineDiv'>
      <NavItem icon={line}/>
      </div>
      <div className='date'>
       <h6>{date.toDateString()}</h6>
      </div>
    </nav>
  )
}

export default Top;