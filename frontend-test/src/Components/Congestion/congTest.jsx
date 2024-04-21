// Import necessary React hooks for state management and side effects.
import React, { useEffect, useState } from 'react';
// Import custom styles for this component.
import './CongestionDetection.css';
// Import image assets.
import alerttriangle from './alert-triangle.png';
// Import custom hook from dataContext to access shared state.
import { useData } from '../../send-backend/dataContext';

function CongTest({ cameraRows }) {
  // Destructuring to access responseData and checkCong function from context.
  const { responseData } = useData();
  const { checkCong } = useData();

  // State for holding new detected events.
  const [newEvent, setNewEvent] = useState({});
  // State to store the matched intersection based on camera ID.
  const [matchedIntersection, setMatchedIntersection] = useState('');

  // Effect hook to process response data and update local state.
  useEffect(() => {
    if (responseData && responseData.success) {
      // Construct a new event object based on the responseData.
      const event = {
        camera: responseData.data.video_id,
        isCongestion: responseData.data.is_congestion ? 'Yes' : 'No',
        start: responseData.data.congestion_start_time,
        end: responseData.data.congestion_stop_time,
        congType: responseData.data.congestion_level,
      };
      setNewEvent(event); // Update the newEvent state with this object.

      // Find a camera row that matches the camera ID from the event.
      const matchedRow = cameraRows.find(row => row.camera === event.camera);
      // If a match is found, update the intersection state.
      if (matchedRow) {
        setMatchedIntersection(matchedRow.intersection);
      }
    }
  }, [responseData, cameraRows]); // React to changes in responseData or cameraRows.

  // Function to handle closing of the congestion alert.
  const closeButton = () => {
    checkCong(false); // Trigger checkCong to clear the congestion state.
  };

  // Rendering the component with the detected congestion information.
  return (
    <div className='detectedDiv'>
        <div className='headerandicon'>
            <img src={alerttriangle} alt="Alert"/>
            <h2 className='title'> Detected Congestion </h2> {/* Title for the detected congestion alert */}
        </div>
        
        <div className='congestionVideo'>
          <video className='smallVideo' autoPlay muted loop style={{border: `1px solid red`}}>
            {/* Source path for the video, assuming video id is static here for demonstration */}
            <source src={`${process.env.PUBLIC_URL}/vid${1}.mp4`} type="video/mp4" /> 
          </video>
        </div>

        <div className='cameraNumber'>
          <h6 className='details'>Camera</h6> {/* Displaying the camera number */}
          <h6 className='descrip'>{cameraRows[0].camera}</h6> {/* Camera number from cameraRows */}
        </div>

        <div className='reportNumber'>
          <h6 className='details'>Report</h6> {/* Label for the report number */}
          <h6 className='descrip'>00096</h6> {/* Static report number */}
        </div>

        <div className='congestionLocation'>
           <h6 className='details'>Location</h6> {/* Label for the location of congestion */}
           <h6 className='descrip'>{cameraRows[0].intersection}</h6> {/* Location from cameraRows */}
        </div>

        <div className='congestionButtons'>
            <button onClick={closeButton} className='clean buttonss'> Clean Alert </button> {/* Button to clear the congestion alert */}
            <button onClick={closeButton} className='dispatch buttonss'> Contact Dispatch </button> {/* Button to contact dispatch in case of emergency */}
        </div>
    </div>
  );
}

// Export the component for use elsewhere in the application.
export default CongTest;
