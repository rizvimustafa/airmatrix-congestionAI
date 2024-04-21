// Importing React and useState hook for component state management.
import React, { useState } from "react";
// Import the CSS for styling the modal.
import "./CameraModal.css";

// Component definition for AddCameraModal which receives props for controlling the modal.
function AddCameraModal({ show, onClose, addCamera }) {
  // State to hold camera data, including the selected camera and monitoring options.
  const [cameraData, setCameraData] = useState({
    camera: '',
    monitor: [],
  });

  // Handles changes to form inputs, managing both text/select inputs and checkboxes.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      // For checkbox inputs, add or remove values from the 'monitor' array.
      const newMonitorValues = checked 
        ? [...cameraData.monitor, value] // Add value if checkbox is checked.
        : cameraData.monitor.filter(v => v !== value); // Remove value if unchecked.

      setCameraData({ ...cameraData, monitor: newMonitorValues });
    } else {
      // For other inputs, update the corresponding state.
      setCameraData({ ...cameraData, [name]: value });
    }
  };

  // Handles form submission, passing the cameraData to the addCamera function and closing the modal.
  const handleSubmit = (e) => {
    e.preventDefault();
    addCamera(cameraData); // Pass the current state to the addCamera function.
    onClose(); // Close the modal after submission.
  };

  // If show is false, do not render anything.
  if (!show) return null;

  // Render the modal with form for adding a new camera.
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} /> {/* Overlay that can be clicked to close the modal */}
      <div className="modal-container">
        <div className="modal-content">
          <h3 className="formBox">Add New Camera</h3>
          <form className='formDiv' onSubmit={handleSubmit}>
            <p className="paragraph">Please select the type of camera and the specific traffic conditions you would like to monitor in the camera feed.</p>
            <h3 className="paragraph">Camera Name</h3>
            <div className="paragraph">
              <select className='dropDown' name="camera" value={cameraData.camera} onChange={handleChange}>
                <option className="paragraph" value="" disabled>Select your option</option>
                {/* Dropdown options for selecting a camera */}
                <option className="paragraph" value="1">Camera 1</option>
                <option className="paragraph" value="2">Camera 2</option>
                <option className="paragraph" value="3">Camera 3</option>
                <option className="paragraph" value="4">Camera 4</option>
                <option className="paragraph" value="5">Camera 5</option>
                <option className="paragraph" value="6">Camera 6</option>
                <option className="paragraph" value="7">Camera 7</option>
                {/* Additional options omitted for brevity */}
              </select>
            </div>
            <h3 className="paragraph">Monitor</h3>
            <div className="MonitorCheckbox">
              {/* Checkboxes for selecting monitoring options */}
              <label className="paragraph"><input className="label" name="monitor" type="checkbox" />Select All</label>
              <label className="paragraph"><input className="label" name="monitor" value='TC' type="checkbox" onChange={handleChange}/>Traffic Congestion</label>
              <label className="paragraph"><input className="label" name="monitor" value='RA' type="checkbox" onChange={handleChange}/>Road Accidents</label>
              <label className="paragraph"><input className="label" name="monitor" value='NM' type="checkbox" onChange={handleChange}/>Near Misses</label>
              <label className="paragraph"><input className="label" name="monitor" value='PF' type="checkbox" onChange={handleChange}/>Pedestrian Flow</label>
              <label className="paragraph"><input className="label" name="monitor" value='BT' type="checkbox" onChange={handleChange}/>Bicycle Traffic</label>
              <label className="paragraph"><input className="label" name="monitor" value='EV' type="checkbox" onChange={handleChange}/>Emergency Vehicles</label>
              <label className="paragraph"><input className="label" name="monitor" value='PT' type="checkbox" onChange={handleChange}/>Public Transport</label>
            </div>

            <div className="buttons">
              <button className='btn cancel' onClick={onClose}>Cancel</button> {/* Button to cancel and close the modal */}
              <button type='submit' className='btn addcamera'>Add Camera</button> {/* Button to submit the form */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Export the AddCameraModal component for use in other parts of the application.
export default AddCameraModal;
