import React, { useEffect, useState } from 'react';
import './CongestionDetection.css';
import alerttriangle from './alert-triangle.png';
import { useData } from '../../send-backend/dataContext';

function CongTest({ cameraRows }) {
  const { responseData } = useData();
  const { checkCong } = useData();
  const [newEvent, setNewEvent] = useState({});
  const [matchedIntersection, setMatchedIntersection] = useState('');

  console.log()
  useEffect(() => {
    if (responseData && responseData.success) {
      const event = {
        camera: responseData.data.video_id,
        isCongestion: responseData.data.is_congestion ? 'Yes' : 'No',
        start: responseData.data.congestion_start_time,
        end: responseData.data.congestion_stop_time,
        congType: responseData.data.congestion_level,
      };
      setNewEvent(event);
      
      // Attempt to match the camera ID with one from the cameraRows to find the intersection
      const matchedRow = cameraRows.find(row => row.camera === event.camera);
      if (matchedRow) {
        setMatchedIntersection(matchedRow.intersection);
      }
    }
  }, [responseData, cameraRows]); // Include cameraRows in dependency array

  const closeButton = () => {
    checkCong(false);
  };


  
  return (
    <div className='detectedDiv'>
        <div className='headerandicon'>
            <img src={alerttriangle} alt="Alert"/>
            <h2 className='title'> Detected Congestion </h2>
        </div>
        
        <div className='congestionVideo'>
          <video className='smallVideo' autoPlay muted loop style={{border: `1px solid red`}}>
            <source src={`${process.env.PUBLIC_URL}/vid${1}.mp4`} type="video/mp4" />
          </video>
        </div>

        <div className='cameraNumber'>
          <h6 className='details'>Camera</h6>
          <h6 className='descrip'>{cameraRows[0].camera}</h6>
        </div>

        <div className='reportNumber'>
          <h6 className='details'>Report</h6>
          <h6 className='descrip'>00096</h6>
        </div>

        <div className='congestionLocation'>
           <h6 className='details'>Location</h6>
           <h6 className='descrip'>{cameraRows[0].intersection}</h6>
        </div>

        <div className='congestionButtons'>
            <button onClick={closeButton} className='clean buttonss'> Clean Alert </button>
            <button onClick={closeButton} className='dispatch buttonss'> Contact Dispatch </button>
        </div>
    </div>
  );
}

export default CongTest;