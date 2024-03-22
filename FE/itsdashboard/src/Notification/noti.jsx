import React from 'react';
import './noti.style.css';

const Noti = () => {
  return (
    <nav className='noti'>
      <h2>
        Traffic Congestion Detected
      </h2>
      <div className="button-group">
        <button className='dispatch'>Send Dispatch</button>
        <button className='ack'>Acknowledge</button>
      </div>
    </nav>
  )
}

export default Noti;
