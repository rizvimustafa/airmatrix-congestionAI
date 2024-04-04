import React, { useState, useEffect } from 'react';
import './CameraList.css';
import img from './trash-2.svg';
import cameraicon from './wall-camare.svg';
import AddCameraModal from "../Camera/CameraModal";
import greencircle from './greencircle.png';
import redcircle from './redcircle.png';

import {useData} from '../../send-backend/dataContext';
import CongTest from '../Congestion/congTest'

function CameraList() {
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isCongested, setIsCongested] = useState(false);

  const { setVideoSelections, responseData, checkCong, cong } = useData();
  

  useEffect(() => {
    // Define a function that checks `responseData`
    const checkResponse = () => {
      if (responseData) { // Check if responseData is not null or undefined
        responseData.success ? checkCong(true) : checkCong(false);
      }
    };
  
    // Set a timeout to delay the check
    const timeoutId = setTimeout(checkResponse, 5000); // 5000 milliseconds = 5 seconds
  
    // Clean up the timeout if the component unmounts before the timeout is complete
    // or if the `responseData` changes before the timeout is complete.
    return () => clearTimeout(timeoutId);
  
  }, [responseData]); // Depend on `responseData` so the effect runs when it changes
  
  

  const toggleAddCamera = () => {
    setShowAddCamera(!showAddCamera);
  };
  
  const toggleAllCheckbox = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked); // Toggle the global checked state

    // Update videoSelections to play/pause all videos based on the new allChecked state
    setVideoSelections(rows.map(() => newAllChecked)); // Set all videos to the new allChecked state

    const updatedRows = rows.map(row => ({ ...row, isChecked: newAllChecked }));
    setRows(updatedRows); // Apply the toggled state to all rows
};

  const toggleShowDelete = () => {
    setShowDelete(!showDelete);
  };
  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const intersections = [
    "Dixie & Dundas",
    "King & Spadina",
    "Mavis & Twen",
    "Derry & Mavis",
    "Lint & Power",
    "Fir & Spruce",
    "Elm & Birch",
    "Maple & Oak",
    "Hazel & Ivy",
    "Cedar & Pine"
  ];

  const getRandomIntersection = () => {
    // Get a random index based on the length of the intersections array
    const randomIndex = Math.floor(Math.random() * intersections.length);
    // Return the intersection name at the random index
    return intersections[randomIndex];
  };

  const addCamera = (cameraData) => {
    // Convert monitor array to a comma-separated string if necessary
    const monitorString = cameraData.monitor.join(', ');
  
    const newCamera = {
      id: rows.length + 1,
      ...cameraData,
      monitor: monitorString, // Use the converted string
      isChecked: false,
      showVideo: false,
      intersection: getRandomIntersection(),
    };
  
    setRows(rows => [...rows, newCamera]);
    toggleAddCamera();
  };

  const {toggleVideo} = useData();
  
  const toggleCheckbox = (id) => {
    const updatedRows = rows.map((row, index) => {
      if (row.id === id) {
        toggleVideo(index); // Toggle the selection in the context based on the row index
        return { ...row, isChecked: !row.isChecked };
      }
      return row;
    });
    setRows(updatedRows);
  };
  console.log(rows); 


  return (
    <>
    {cong && <CongTest cameraRows={rows}/>}
    <div className='eventBox' style={{ height: cong ? '42%' : '89%' }}>
      <div className='heading'>
        <h3 className='title'>Camera Monitoring List</h3>
        <img className='trashimg' onClick={toggleShowDelete} src={img} alt="" />
      </div>
        <table className="table-container" style={{ height: cong ? '50%' : '80%' }}>
          <thead>
            <tr className="camera-header">
              <th>
                <label className="header-item">
                  <input type="checkbox" className="camera-checkbox"
                        checked={allChecked}
                        onChange={toggleAllCheckbox} />
                  Camera
                </label>
              </th>
              <th>Monitors</th>
              <th>Intersection</th>
              {showDelete && <th>Remove</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data-message">
                  <img src={cameraicon} alt="No Cameras" />
                  No Cameras
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      className="camera-checkbox" 
                      checked={row.isChecked}
                      onChange={() => toggleCheckbox(row.id)}
                    />
                    <img src={row.isChecked ? greencircle : redcircle} alt="" style={{width: '10px', height: '10px', marginRight: '5px'}} />
                    {`Camera ${row.camera}`}
                  </td>
                  <td>{row.monitor}</td>
                  <td>{row.intersection}</td>
                  {showDelete && (
                    <td>
                      <button className='-Button' onClick={() => deleteRow(row.id)}> − </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      <div className='buttons2'>
        <button className='connectCamera'>Connect Camera</button>
        <button onClick={toggleAddCamera} className='addCamera'>Add Camera</button>
        {showAddCamera && (
          <div className='overlay'>
            <AddCameraModal addCamera={addCamera} onClose={toggleAddCamera} />
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default CameraList;