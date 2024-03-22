// import React, { useEffect, useState } from 'react';
// import './EventsMonitoring.css'; // Make sure this path is correct
// import eventData from '../test.json'; // Update the import to match the location of your JSON file

// const EventsMonitoring = () => {
//   // Update the state to handle an array of event details
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     // Map over your JSON data to transform it into a suitable format for your state
//     const loadedEvents = eventData.filter(event => event.success).map(event => ({
//       camera: event.data.camera_number,
//       congType: event.data.congestion_level,
//       start: event.data.detection_time,
//       end: event.data.expected_end_time,
//     }));

//     setEvents(loadedEvents);
//   }, []);

//   return (
//     <section>
//       <div className="events-monitoring">
//         <header className="events-header">
//           <h2>Events Monitoring</h2>
//           <span className="new-events-count">{events.length} new events</span>
//         </header>
//         <div className="events-list"> {/* Wrapper for scrollable list */}
//           <div className="events-table">
//             <div className="table-row header">
//               <div className="table-cell">Camera</div>
//               <div className="table-cell">Congestion Type</div>
//               <div className="table-cell">Start Time</div>
//               <div className="table-cell">Expected End</div>
//             </div>
//             {/* Iterate over the events state to render each event */}
//             {events.map((event, index) => (
//               <div className="table-row" key={index}>
//                 <div className="table-cell">{event.camera}</div>
//                 <div className="table-cell">{event.congType}</div>
//                 <div className="table-cell">{event.start}</div>
//                 <div className="table-cell">{event.end}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default EventsMonitoring;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from 'react';
import './EventsMonitoring.css';
import { useData } from '../sendBackEnd/dataContext';

const EventsMonitoring = () => {
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
  
  

  return (
    <section>
      <div className="events-monitoring">
        <header className="events-header">
          <h2>Events Monitoring</h2>
          <span className="new-events-count">{events.length} new events</span>
        </header>
        <div className="events-list">
          <div className="events-table">
            <div className="table-row header">
              <div className="table-cell">Camera</div>
              <div className="table-cell">Congestion Type</div>
              <div className="table-cell">Start Time</div>
              <div className="table-cell">Expected End</div>
            </div>
            {events.map((event, index) => (
              <div className="table-row" key={index}>
                <div className="table-cell">{event.camera}</div>
                <div className="table-cell">{event.congType}</div>
                <div className="table-cell">{event.start}</div>
                <div className="table-cell">{event.end}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsMonitoring;

