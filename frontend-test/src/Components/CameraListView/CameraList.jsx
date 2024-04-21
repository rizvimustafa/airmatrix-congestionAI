// Importing React, necessary hooks, styles, and other components.
import React, { useState, useEffect } from 'react';
import './CameraList.css';
import img from './trash-2.svg';
import cameraicon from './wall-camare.svg';
import AddCameraModal from "../Camera/CameraModal";
import greencircle from './greencircle.png';
import redcircle from './redcircle.png';
import { useData } from '../../send-backend/dataContext';
import CongTest from '../Congestion/congTest';

function CameraList() {
  // State variables to manage UI states and camera list data.
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [rows, setRows] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isCongested, setIsCongested] = useState(false);

  // Using a custom hook from the context to manage video selections and retrieve congestion data.
  const { setVideoSelections, responseData, checkCong, cong } = useData();

  useEffect(() => {
    // Check response data periodically for changes, particularly looking at congestion data.
    const checkResponse = () => {
      if (responseData) {
        responseData.success ? checkCong(true) : checkCong(false);
      }
    };
    const timeoutId = setTimeout(checkResponse, 5000); // Check every 5 seconds
    return () => clearTimeout(timeoutId);
  }, [responseData]);

  // Toggles the visibility of the add camera modal.
  const toggleAddCamera = () => {
    setShowAddCamera(!showAddCamera);
  };

  // Toggles the checkbox state of all camera entries.
  const toggleAllCheckbox = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);
    setVideoSelections(rows.map(() => newAllChecked));
    const updatedRows = rows.map(row => ({ ...row, isChecked: newAllChecked }));
    setRows(updatedRows);
  };

  // Toggles the visibility of delete option.
  const toggleShowDelete = () => {
    setShowDelete(!showDelete);
  };

  // Deletes a camera row by ID.
  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  // Pre-defined list of intersections as possible camera locations.
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

  // Randomly selects an intersection for a new camera.
  const getRandomIntersection = () => {
    const randomIndex = Math.floor(Math.random() * intersections.length);
    return intersections[randomIndex];
  };

  // Adds a new camera to the list with given camera data.
  const addCamera = (cameraData) => {
    const monitorString = cameraData.monitor.join(', ');
    const newCamera = {
      id: rows.length + 1,
      ...cameraData,
      monitor: monitorString,
      isChecked: false,
      showVideo: false,
      intersection: getRandomIntersection(),
    };
    setRows(rows => [...rows, newCamera]);
    toggleAddCamera();
  };

  // Toggles a checkbox for a specific camera row.
  const {toggleVideo} = useData();
  const toggleCheckbox = (id) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        toggleVideo(rows.indexOf(row));
        return { ...row, isChecked: !row.isChecked };
      }
      return row;
    });
    setRows(updatedRows);
  };

  // Log the current state of rows for debugging.
  console.log(rows); 

  // Render the component, including conditional rendering based on the congestion state.
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
                  <input type="checkbox" checked={allChecked} onChange={toggleAllCheckbox} />
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
                    <input type="checkbox" checked={row.isChecked} onChange={() => toggleCheckbox(row.id)} />
                    <img src={row.isChecked ? greencircle : redcircle} alt="" style={{width: '10px', height: '10px', marginRight: '5px'}} />
                    {`Camera ${row.camera}`}
                  </td>
                  <td>{row.monitor}</td>
                  <td>{row.intersection}</td>
                  {showDelete && (
                    <td>
                      <button onClick={() => deleteRow(row.id)}> − </button>
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

// Export the CameraList component for use in other parts of the application.
export default CameraList;
