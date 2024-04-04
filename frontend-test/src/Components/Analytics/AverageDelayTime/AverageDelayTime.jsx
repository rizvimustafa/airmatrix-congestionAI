import React from 'react';
import clock from './clock.svg'
import './AverageDelayTime.css'


function AverageDelayTime() {

  return (
    <div className='DelayTimeDiv'>
      <h3 className='DelayTimeh3' > Average Delay Time </h3>
      <h1 className='DelayTimeh1'>
        <img className = "DelayClock" src={clock} alt="Clock" style={{verticalAlign: 'middle'}} /> 14m. 40s.
      </h1>
      <h5 className='DelayTimeh5'>  2 min. decreases than last month </h5>
    </div>
  );
}

export default AverageDelayTime;
