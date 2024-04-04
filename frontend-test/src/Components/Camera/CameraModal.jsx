import React, { useState } from "react";
import "./CameraModal.css";

function AddCameraModal({ show, onClose, addCamera }) {
  const [cameraData, setCameraData] = useState({
    camera: '',
    monitor: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      // Handle checkbox changes
      const newMonitorValues = checked 
        ? [...cameraData.monitor, value] // Add checkbox value if checked
        : cameraData.monitor.filter(v => v !== value); // Remove checkbox value if not checked

      setCameraData({ ...cameraData, monitor: newMonitorValues });
    } else {
      // Handle other inputs (e.g., select dropdown)
      setCameraData({ ...cameraData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we keep monitor as an array, assuming addCamera can handle it.
    // If not, convert it to a string or another format as needed.
    addCamera(cameraData);
    onClose();
  };

  if (show) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
        <div className="modal-container">
          <div className="modal-content">
            <h3 className="formBox" >Add New Camera</h3>
            {/* Form fields and submit logic here */}
            <form className='formDiv'onSubmit={handleSubmit}>
            <p className="paragraph">Please select the type of camera and the specific traffic conditions you would like to monitor in the camera feed.</p>
            <h3 className="paragraph" >Camera Name</h3>
            <div className="paragraph">
               <select className='dropDown' name="camera" value={cameraData.camera} onChange={handleChange} >
                <option className="paragraph" value="" disabled>Select your option</option>
                <option className="paragraph" value="1">Camera 1</option>
                <option className="paragraph" value="2">Camera 2</option>
                <option className="paragraph" value="3">Camera 3</option>
                <option className="paragraph" value="4">Camera 4</option>
                <option className="paragraph" value="5">Camera 5</option>
                <option className="paragraph" value="6">Camera 6</option>
                <option className="paragraph" value="7">Camera 7</option>
              </select>
            </div>
            <h3 className="paragraph">Monitor</h3>
            <div  className="MonitorCheckbox">
            <label className="paragraph"><input className="label" name="monitor" type="checkbox"/>Select All</label>
            <label className="paragraph"><input className="label" name="monitor" value='TC' type="checkbox" onChange={handleChange}/>Traffic Congestion</label>
            <label className="paragraph"><input className="label" name="monitor" value='RA' type="checkbox" onChange={handleChange}/>Road Accidents</label>
            <label className="paragraph"><input className="label" name="monitor" value='NM' type="checkbox" onChange={handleChange}/>Near Misses</label>
            <label className="paragraph"><input className="label" name="monitor" value='PF' type="checkbox" onChange={handleChange}/>Pedestrian Flow</label>
            <label className="paragraph"><input className="label" name="monitor" value='BT' type="checkbox" onChange={handleChange}/>Bicycle Traffic</label>
            <label className="paragraph"><input className="label" name="monitor" value='EV' type="checkbox" onChange={handleChange}/>Emergency Vehicles</label>
            <label className="paragraph"><input className="label" name="monitor" value='PT' type="checkbox" onChange={handleChange}/>Public Transport</label>
            </div>

            <div className="buttons">
            <button className='btn cancel'onClick={onClose}>Cancel</button>
            <button type= 'submit' className='btn addcamera'>Add Camera</button>
            </div>

            </form>
          </div>
        </div>
        </>
  );
}

export default AddCameraModal;