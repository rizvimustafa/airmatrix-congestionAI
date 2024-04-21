// Import React and useState (though useState is not used here, it's imported unnecessarily).
import { React, useState } from 'react';

// Import static image assets and components for use in the component.
import reportImage from './reportImage.jpg';
import downloadindividual from './downloadindividual.svg';
import left from './chevron-left.svg';
import Top from '../../../Components/Top/top';
import highshield from '../shield-alert-high.svg';
import mediumshield from '../shield-alert-medium.svg';
import lowshield from '../shield-alert-low.svg';

// Functional component MonitoringReport takes selectedEntry and onBackClick as props.
function MonitoringReport({ selectedEntry, onBackClick }){
    // Function to determine which shield icon to display based on the 'scale' of the alert.
    const getShieldImage = (scale) => {
        switch (scale) {
            case 'high':
                return highshield;   // Returns the high alert shield image.
            case 'medium':
                return mediumshield; // Returns the medium alert shield image.
            case 'low':
                return lowshield;    // Returns the low alert shield image.
            default:
                return '';            // Returns an empty string if no match is found.
        }
    };

    // Guard clause to prevent rendering if no selectedEntry is provided.
    if (!selectedEntry) return null;

    // Render the component structure.
    return (
        <>
        <Top title='Report'/>  {/* Renders the Top component with the title "Report". */}
        <div className='MonitoringReportDiv'>
            <div className='BackButtonAndReportIDAndDownloadButton'>
                <div className='BackButtonAndReportID'>
                    <img className="ReportBackButton" src={left} onClick={onBackClick}/> {/* Back button image with click handler. */}
                    <h2 className='ReportID'>{selectedEntry.id}</h2> {/* Displays the report ID. */}
                </div>
                <img className="ReportDownloadButton" src={downloadindividual} onClick={onBackClick}/> {/* Download button image with click handler using the same back function (likely a mistake). */}
            </div>
            <div className='ReportDetailsAndImage'>
                <img className='ReportImage' src={reportImage}/> {/* Displays the main report image. */}
                
                <div className="vertical-line"></div> {/* A styled divider. */}
    
                <div className='reportDetails'>
                    <div className='reportDetailsHeader'> Details </div>
                    <div className='AlertTypeReport'>
                        <p className='LighterColorP'>Alert Type</p>
                        <p className='DarkerP'>{selectedEntry.alert_type}</p> {/* Displays the type of alert. */}
                    </div>
                    <div className='CameraNumberReport'>
                        <p className='LighterColorP'>Camera</p>
                        <p className='DarkerP'>{selectedEntry.camera}</p> {/* Displays the camera ID or location. */}
                    </div>
                    <div className='DateOfDetectionReport'>
                        <p className='LighterColorP'>Date of Detection</p>
                        <p className='DarkerP'>{selectedEntry.date_of_detection}</p> {/* Displays the date of detection. */}
                    </div>
                    <div className='TimeOfDetectionReport'>
                        <p className='LighterColorP'>Time of Detection</p>
                        <p className='DarkerP'>{selectedEntry.time_of_detection}</p> {/* Displays the time of detection. */}
                    </div>
                    <div className='DurationReport'>
                        <p className='LighterColorP'>Duration</p>
                        <p className='DarkerP'>00.22.32</p> {/* Example static duration; should ideally use data. */}
                    </div>
                    <div className='LocationReport'>
                        <p className='LighterColorP'>Location</p>
                        <p className='DarkerP'>Dixie & Dundas</p> {/* Example static location; should ideally use data. */}
                    </div>
                    <div className='Scale'>
                        <p className='LighterColorP'>Scale</p>
                        <p className='DarkerP'>
                            <img src={getShieldImage(selectedEntry.scale)} alt={`${selectedEntry.scale} shield`} style={{ backgroundColor: '#151517', marginRight: '0.5rem' }} />
                            {selectedEntry.scale} {/* Displays the alert scale with an appropriate icon. */}
                        </p>
                    </div>
                </div>
            </div>
            <div className="horizontal-line"></div>
            <h2 className='ReportNoteHeader'>Notes</h2>
            <input className="commentBoxReport" type="text" placeholder="Comment" /> {/* Input field for adding comments. */}
            <p className='commentNote'>
                Be aware that this action is irreversible; once a comment is added, it cannot be deleted. {/* Warning about the permanence of comments. */}
            </p>
        </div>
        </>
    );
    
}

// Export the MonitoringReport component for use in other parts of the application.
export default MonitoringReport;
