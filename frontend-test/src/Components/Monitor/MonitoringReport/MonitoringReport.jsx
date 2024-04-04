import { React, useState } from 'react';

import reportImage from './reportImage.jpg';
import downloadindividual from './downloadindividual.svg';
import left from './chevron-left.svg';
import Top from '../../../Components/Top/top'
import highshield from '../shield-alert-high.svg';
import mediumshield from '../shield-alert-medium.svg';
import lowshield from '../shield-alert-low.svg';


function MonitoringReport({ selectedEntry, onBackClick }){
    const getShieldImage = (scale) => {
        switch (scale) {
            case 'high':
                return highshield;
            case 'medium':
                return mediumshield;
            case 'low':
                return lowshield;
            default:
                return '';
        }
    };
    if (!selectedEntry) return null;
    return (
        <>
        <Top title='Report'/>
        <div className = 'MonitoringReportDiv'>
        <div className = 'BackButtonAndReportIDAndDownloadButton'>
          <div className = 'BackButtonAndReportID'>
          <img className="ReportBackButton" src={left} onClick={onBackClick}/>
          <h2 className= 'ReportID'> {selectedEntry.id}</h2>
          </div>
          <img className="ReportDownloadButton" src={downloadindividual} onClick={onBackClick}/>
          </div>
          <div className = 'ReportDetailsAndImage'>
          <img className = 'ReportImage' src={reportImage}/>
          
          <div className="vertical-line"></div>

          <div className = 'reportDetails'>
              <div className = 'reportDetailsHeader'> Details </div>
              <div className = 'AlertTypeReport'> 
                  <p className = 'LighterColorP'>Alert Type</p>
                  <p className =  'DarkerP'>{selectedEntry.alert_type}</p>
              </div>
              <div className = 'CameraNumberReport'>
                  <p className = 'LighterColorP'>Camera</p>
                  <p className =  'DarkerP'>{selectedEntry.camera}</p>
              </div>
              <div className = 'DateOfDetectionReport'>
                  <p className = 'LighterColorP'>Date of Detection</p>
                  <p className =  'DarkerP'>{selectedEntry.date_of_detection}</p>
              </div>
              <div className = 'TimeOfDetectionReport'>
                  <p className = 'LighterColorP'>Time of Detection</p>
                  <p className =  'DarkerP'>{selectedEntry.time_of_detection}</p>
              </div>
              <div className = 'DurationReport'>
                  <p className = 'LighterColorP'>Duration</p>
                  <p className =  'DarkerP'>00.22.32</p>
              </div>
              <div className = 'LocationReport'>
                  <p className = 'LighterColorP'>Location</p>
                  <p className =  'DarkerP'>Dixie & Dundas</p>
              </div>
              <div className = 'Scale'>
                  <p className = 'LighterColorP'>Scale</p>
                  <p className =  'DarkerP'>
                  <img src={getShieldImage(selectedEntry.scale)} alt={`${selectedEntry.scale} shield`} style={{ backgroundColor: '#151517', marginRight: '0.5rem' }} />
                  {selectedEntry.scale}
                  </p>
              </div>
          </div>
          </div>
          <div className="horizontal-line"></div>
              <h2 className = 'ReportNoteHeader'>Notes</h2>
           <input className="commentBoxReport" type="text" placeholder="Comment" />
           <p className = 'commentNote'> 
           Be aware that this action is irreversible; once a comment is added, it cannot be deleted.
           </p>        
        </div>
        </>
      );
}

export default MonitoringReport;