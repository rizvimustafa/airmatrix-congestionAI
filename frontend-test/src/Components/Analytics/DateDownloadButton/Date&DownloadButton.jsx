import React from 'react';
import './Date&DownloadButton.css';
import calenderimg from './calendar-days.svg';
import download from './download.svg'


function DateDownloadButton() {

  return (
    <div className='DateDownloadDiv'>
      <div className='leftSide'>
        <p className='DateButton'>
        <img className = "CalenderImage" src={calenderimg} alt="Clock" /> June 30th, 2023 - August 30th, 2023
        </p>
      </div>
      
      <button className='DownloadButton'>
        <img className = "DownloadImage" src={download} alt="Clock" style={{verticalAlign: 'middle'}} /> Downloads
      </button>
    </div>
  );
}

export default DateDownloadButton;
