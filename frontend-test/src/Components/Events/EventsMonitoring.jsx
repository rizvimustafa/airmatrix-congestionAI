// Import React library and its hooks, and include the component-specific stylesheet.
import React, { useEffect, useState } from 'react';
import './EventsMonitoring.css';
// Import the custom hook from the dataContext to access shared data.
import { useData } from '../../send-backend/dataContext';

const EventsMonitoring = () => {
  // State to store event data.
  const [events, setEvents] = useState([]);
  // Destructure responseData from the context which holds response from a backend or service.
  const { responseData } = useData(); 

  useEffect(() => {
    // Log the current response data for debugging.
    console.log("Response Data:", responseData); 

    // Process the response data if it exists and indicates a successful operation.
    if (responseData && responseData.success) {
      // Construct a new event object based on the response data.
      const newEvent = {
        camera: responseData.data.video_id,
        congType: responseData.data.is_congestion ? 'Yes' : 'No',
        start: responseData.data.congestion_start_time,
        end: responseData.data.congestion_stop_time,
      };

      // Log the new event for debugging purposes.
      console.log("New Event:", newEvent); 

      // Conditional logic based on the congestion status.
      if (newEvent.congType === 'No') {
        // If there is no congestion, filter out the event related to this camera from the events state.
        setEvents(prevEvents => prevEvents.filter(event => event.camera !== newEvent.camera));
      } else {
        // If there is congestion, check if an event for this camera already exists.
        if (!events.some(event => event.camera === newEvent.camera)) {
          // If not, add the new event to the events state.
          setEvents(prevEvents => [...prevEvents, newEvent]);
        }
      }
    }
  }, [responseData, events]); // Dependencies for useEffect include responseData and events to handle updates correctly.

  // Render the component with a structured layout of events data.
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

// Export the EventsMonitoring component to be used in other parts of the application.
export default EventsMonitoring;

