import {React, useEffect,useState} from 'react';
import './CongestionDetection.css';
// import alerttriangle from './alert-triangle.png';
import { useData } from '../../send-backend/dataContext';

function CongestionDetection() {

  const [events, setEvents] = useState([]);
  const { responseData } = useData(); // Assuming this provides the data correctly

  
  useEffect(() => {
    console.log("Response Data:", responseData); 
  
    if (responseData && responseData.success) {
      const newEvent = {
        camera: responseData.data.video_id,
        congType: responseData.data.is_congestion ? 'Yes' : 'No',
        start: responseData.data.congestion_start_time,
        end: responseData.data.congestion_stop_time,
      };
  
      console.log("New Event:", newEvent); // Debugging line to verify the new event
  
      // Check if congType is 'no' and remove the event with the corresponding camera ID
      if (newEvent.congType === 'No') {
        setEvents(prevEvents => prevEvents.filter(event => event.camera !== newEvent.camera));
      } else {
        // Check if an event with the same camera ID already exists
        if (!events.some(event => event.camera === newEvent.camera)) {
          // If not, add the new event to the existing events
          setEvents(prevEvents => [...prevEvents, newEvent]);
        }
      }
    }
  }, [responseData, events]); // Include events in the dependency array
  

  return(
    <div className = 'detectedDiv'>
        <div className = 'headerandicon'>
            {/* <img src={alerttriangle}/> */}
            <h1> Detected Congestion </h1>
        </div>
        <div className= 'congestionImg'>
            {/* <img/> */}
        </div>
        <div className= 'cameraNumber'>
          {/* {videoId && <span>Camera ID: {videoId}</span>} */}
        </div>
        <div className= 'reportNumber'>
            
        </div>
        <div className='congestionLocation'>
            
        </div>

        <div className = 'congestionButtons'>
            <button> Clean Alert </button>
            <button> Contact Dispatch </button>
        </div>
    </div>
  )
}

export default CongestionDetection;