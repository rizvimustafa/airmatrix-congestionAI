// Import React and useState from 'react' for state management.
import { React, useState } from 'react';
// Import the CSS for styling the component.
import './MonitoringList.css';
// Import images and icons used in the component.
import calenderimg from './calendar-days.svg';
import download from './download.svg';
import highshield from '../shield-alert-high.svg';
import mediumshield from '../shield-alert-medium.svg';
import lowshield from '../shield-alert-low.svg';
import tworights from './chevron-2rights.svg';
import right from './chevron-right.svg';
import left from './chevron-left.svg';
import twolefts from './chevrons-2lefts.svg';
// Import MonitoringReport for conditional rendering.
import MonitoringReport from '../MonitoringReport/MonitoringReport';

// Functional component definition for MonitoringList.
function MonitoringList() {
    // State to manage the currently selected entry.
    const [selectedEntry, setSelectedEntry] = useState(null);

    // Handler for row click events in the list, avoiding clicks on checkboxes.
    const handleRowClick = (entry, event) => {
        if (event.target.type === 'checkbox' || event.target.closest('input[type="checkbox"]')) {
          return; // Do nothing if a checkbox is clicked to prevent selection toggle.
        }
        setSelectedEntry(entry); // Set the clicked entry as the selected entry.
    };
    
    // Static data for list entries.
    const list_entries = [
        // Example entries with details for traffic congestion alerts.
        { id: 230001, alert_type: 'Traffic Congestion', scale : 'high', time_of_detection: '12:00:00 PM', camera: '02', date_of_detection: '07/05/2023' },
        // Additional entries omitted for brevity.
    ];

    // Function to get the appropriate shield image based on the alert 'scale'.
    const getShieldImage = (scale) => {
        switch (scale) {
            case 'high':
                return highshield;
            case 'medium':
                return mediumshield;
            case 'low':
                return lowshield;
            default:
                return ''; // Return empty if scale does not match.
        }
    };

    // Conditionally render MonitoringReport if an entry is selected.
    if (selectedEntry) {
        return <MonitoringReport selectedEntry={selectedEntry} onBackClick={() => setSelectedEntry(null)} />;
    }

    // Main component rendering.
    return (
        <div className='EntireMonitoringDiv'>
            <p className='DatepMonitoringList'>
                <img className="CalenderImageMonitoringList" src={calenderimg} alt="calendar" /> June 30th, 2023 - August 30th, 2023
            </p>
            <button className='DownloadButtonMonitoringList'>
                <img className="DownloadImageMonitoringList" src={download} alt="download" /> Download Selected
            </button>

            <div className='MonitoringListTableDiv'>
                <table className='MonitoringListTable'>
                    <thead>
                        <tr>
                            <th><input type="checkbox" className=""/>ID</th>
                            <th>Alert Type</th>
                            <th>Scale</th>
                            <th>Time of Detection</th>
                            <th>Camera</th>
                            <th>Date of Detection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list_entries.map(entry => (
                            <tr key={entry.id} onClick={(e) => handleRowClick(entry, e)}>
                                <td><input type="checkbox" className=""/>{entry.id}</td>
                                <td>{entry.alert_type}</td>
                                <td>
                                    <img src={getShieldImage(entry.scale)} alt={`${entry.scale} shield`} style={{ backgroundColor: '#151517', marginRight: '0.5rem' }} />
                                    {entry.scale}
                                </td>
                                <td>{entry.time_of_detection}</td>
                                <td>{entry.camera}</td>
                                <td>{entry.date_of_detection}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className= 'RowsAndPageNumber'>
                <p className='rowsSelected'>0 rows selected</p>
                <div className='PageNumberAndIcons'>
                    <h5 className='PageNumber'>Page 1 of 10</h5>
                    <img className="twolefts" src={twolefts}/> 
                    <img className="left" src={left}/>
                    <img className="right" src={right}/>  
                    <img className="tworights" src={tworights}/>
                </div>
            </div>
        </div>
    );
}

// Export the MonitoringList component for use in other parts of the application.
export default MonitoringList;

