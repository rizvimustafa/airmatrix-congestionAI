import React from 'react';
import barImg from './barImg.png'
import './bar.css'


function BarChart() {

  return (
    <div className='barChart'>
      <h3 className='barTitle'>Congestion Analysis</h3>
      <img className='barLine'src={barImg} alt="" />
    </div>
  );
}

export default BarChart;
