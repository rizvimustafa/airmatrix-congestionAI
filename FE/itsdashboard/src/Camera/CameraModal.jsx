import React, { useState } from "react";
import "./CameraModal.css";


function AddCameraModal({ show, onClose, addCamera }) {
  const [cameraData, setCameraData] = useState({
    camera: '',
    monitor: [],
  });  
  if (show) return null;
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCameraData({ ...cameraData, [name]: value });
    };
    // const handleCheckboxChange = (e) => {
    //   const { value, checked } = e.target;
    //   setCameraData((prevData) => {
    //     if (checked) {
    //       return { ...prevData, monitor: [...prevData.monitor, value] };
    //     } else {
    //       return { ...prevData, monitor: prevData.monitor.filter((item) => item !== value) };
    //     }
    //   });
    // };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Call the addCamera function with cameraData
      addCamera(cameraData);
    };
  
    return (
      <>
        <div className="modal-backdrop" onClick={onClose} />
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="">Add New Camera</h2>
            {/* Form fields and submit logic here */}
            <form onSubmit={handleSubmit}>
            <p>Please select the type of camera and the specific traffic conditions you would like to monitor in the camera feed.</p>
            <h3>Camera Name</h3>
            <div>
               <select name="camera" value={cameraData.camera} onChange={handleChange} >
                <option value="" disabled selected>Select your option</option>
                <option value="camera5">Camera 5</option>
                <option value="camera6">Camera 6</option>
                <option value="camera7">Camera 7</option>
                <option value="camera8">Camera 8</option>
              </select>
            </div>
            <h3>Monitor</h3>
            <div className="MonitorCheckbox">
            <label><input className="label" type="checkbox"/>Select All</label>
            <label><input className="label" type="checkbox" />Traffic Congestion</label>
            <label><input className="label" type="checkbox"/>Road Accidents</label>
            <label><input className="label" type="checkbox"/>Near Misses</label>
            <label><input className="label" type="checkbox"/>Pedestrian Flow</label>
            <label><input className="label" type="checkbox"/>Bicycle Traffic</label>
            <label><input className="label" type="checkbox" />Emergency Vehicles</label>
            <label><input className="label" type="checkbox" />Public Transport</label>
            </div>
            <button className='btn cancel'onClick={onClose}>Cancel</button>
            <button type= 'submit' className='btn addcamera'>Add Camera</button>
            </form>
          </div>
        </div>
      </>
    );
  }

  export default AddCameraModal;
