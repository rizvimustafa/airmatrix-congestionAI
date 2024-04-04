import React from 'react';
import lineImg from './lineImg.png'
import './line.css'


function LineChart() {

  return (
    <div className='lineChart'>
      <h3 className='lineTitle'>Congestion Levels at Derry & Financial</h3>
      <img className='pictureLine'src={lineImg} alt="" />
    </div>
  );
}

export default LineChart;
