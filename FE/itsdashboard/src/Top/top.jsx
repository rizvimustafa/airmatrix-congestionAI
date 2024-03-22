import React from 'react'
import './top.styles.css'


const Top =()=> {
  const date = new Date();
  return (
    <nav className='top'>
      
      <h1>
        AirMatrix ITS Dashboard
      </h1>

      <div className='date'>
       <h6>{date.toDateString()}</h6>
      </div>
    </nav>
  )
}

export default Top;