import React from 'react';
import './piee.css'
import pieImg from "./pieImg.png"

function PieChart() {

  return (
    <div className='pieChart'>
      <h3 className='congTitle'>Congestion</h3>
      <img className='picturePie'src={pieImg} alt="" />
    </div>
  );
}

export default PieChart;
