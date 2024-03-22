import React, { useState, useEffect, useRef } from 'react';
import './video.styles.css'; 
import EventsMonitoring from '../Events/EventsMonitoring';
import AddCameraModal from "../Camera/CameraModal"
import VideoFrameSender from "../sendBackEnd/sendBack"; 
import { useData } from '../sendBackEnd/dataContext';
import { useCongestion } from '../Congestion/CongestionContext';

function VideoPlayer({videoId}) {
  const [showVideo1, setShowVideo1] = useState(false);
  const [showVideo2, setShowVideo2] = useState(false);
  const [showVideo3, setShowVideo3] = useState(false);
  const [showVideo4, setShowVideo4] = useState(false);
  const [showText, setText] = useState(true);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [activeVideoss, setActiveVideoss] = useState([]);
  const [showDelete, setShowDelete] = useState(false); // New state for showing delete buttons
  const [activeVideoSizes, setActiveVideoSizes] = useState([]);
  const [containerCenter, setContainerCenter] = useState([0, 0]);
  const [noti, setNoti] = useState(true)
  const [activeVideoIDs, setActiveVideoIDs] = useState([])
  const { congestionStates } = useCongestion();
  
  const isCongested = congestionStates[videoId];

  const videoClass = isCongested ? 'video-congested' : '';
  
  // Managing rows in state
  const [rows, setRows] = useState([
    { id: 1, camera: "Camera 1", monitor: "TC, AC, NM", intersection: "Dixie & Dundas", showVideo: showVideo1, setShowVideo: setShowVideo1, videoId: "vid1" },
    { id: 2, camera: "Camera 2", monitor: "TC, AC, NM", intersection: "Eglinton & Hurontario", showVideo: showVideo2, setShowVideo: setShowVideo2, videoId: "vid2" },
    { id: 3, camera: "Camera 3", monitor: "TC, AC, NM", intersection: "Terry Fox & Eglinton", showVideo: showVideo3, setShowVideo: setShowVideo3, videoId: "vid3" },
    { id: 4, camera: "Camera 4", monitor: "TC, AC, NM", intersection: "Dixie & Mavis", showVideo: showVideo4, setShowVideo: setShowVideo4, videoId: "vid4" },
  ]);
  
  const toggleShowDelete = () => {
    setShowDelete(!showDelete);
  };
  const deleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const toggleAddCamera = () => {
    setShowAddCamera(!showAddCamera);
  }
 
  const toggleNoti = () => {
    setNoti(false);
  }

  const activeVideos = [showVideo1, showVideo2, showVideo3, showVideo4].filter(Boolean).length;
  const boxClass = `box ${activeVideos === 1 ? "full" : activeVideos === 2 ? "half" : "quarter"}`;

  let x,y = 0;
  useEffect(() => {
    x = useData[0]; // This will log the center coordinates array
    y = useData[1]; // This will log the center coordinates array
  }, [useData]);

  const dotStyle = {
    position: 'absolute',
    top: `${containerCenter[1]}px`,  // Y value is at index 1
    left: `${containerCenter[0]}px`, // X value is at index 0
    width: '20px',
    height: '20px',
    backgroundColor: 'red',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)'
};

  //export const useData = () => useContext(DataContext);

  const videoRefs = useRef([
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ]);
  
  const addCamera = (cameraData) => {
    const newCamera = {
      id: rows.length + 1,
      ...cameraData,
      showVideo: false,
      monitor: "TC, AC, NM",
      intersection: "Dixie & Dundas"
    };
    setRows([...rows, newCamera]);
  };

  useEffect(() => {
    if (!showVideo1 && !showVideo2 && !showVideo3 && !showVideo4) {
      setText(true);
    } else {
      setText(false);
    }
  }, [showVideo1, showVideo2, showVideo3, showVideo4]);

  const playVideo = (videoIndex) => {
    const videoElement = videoRefs.current[videoIndex].current;
    if (videoElement) {
      videoElement.play();
  
      // Update to add the video to the array of active videos
      setActiveVideoss((prevVideos) => [...prevVideos, videoElement]);
      setActiveVideoIDs((prevIDs) => [...prevIDs, rows[videoIndex].id]);
      
      // Immediately calculate and set the video size for the new active video
      if (videoElement.parentNode) {
        const size = { 
          width: videoElement.parentNode.clientWidth, 
          height: videoElement.parentNode.clientHeight 
        };
        setActiveVideoSizes((prevSizes) => Array.isArray(prevSizes) ? [...prevSizes, size] : [size]);

      }
    }
  };
  


  const logVideoSize = (index) => {
    const videoElement = videoRefs.current[index].current;
    if (videoElement && videoElement.parentNode) {
      const width = videoElement.parentNode.clientWidth;
      const height = videoElement.parentNode.clientHeight;
      console.log(`Video ${index + 1} size:`, `${width}px by ${height}px`);
      setActiveVideoSizes({ width, height }); // Update state with container size
    }
  };

  // useEffect(() => {
  //   const handleResize = (index) => {
  //     // Check if there's an active video and it has a parent node
  //     if (activeVideoss[index] && activeVideoss[index].parentNode) {
  //       const width = activeVideoss[index].parentNode.clientWidth;
  //       const height = activeVideoss[index].parentNode.clientHeight;
  //       setActiveVideoSizes((prevSizes) => {
  //         const newSizes = [...prevSizes]; // Create a copy of the previous sizes array
  //         newSizes[index] = { width, height }; // Update the size for the current index
  //         return newSizes; // Return the updated sizes array
  //       });
  //     }
  //   };
  
  //   // Call once to set initial size
  //   activeVideoss.forEach((_, index) => handleResize(index));
  
  //   // Add event listener for future resizes
  //   const resizeHandler = () => {
  //     activeVideoss.forEach((_, index) => handleResize(index));
  //   };
  //   window.addEventListener('resize', resizeHandler);
  
  //   // Cleanup function to remove event listener
  //   return () => {
  //     window.removeEventListener('resize', resizeHandler);
  //   };
  // }, [activeVideoss]);

  useEffect(() => {
    const handleResize = () => {
      activeVideoss.forEach((videoElement, index) => {
        if (videoElement && videoElement.parentNode) {
          const width = videoElement.parentNode.clientWidth;
          const height = videoElement.parentNode.clientHeight;
          setActiveVideoSizes((prevSizes) => {
            const newSizes = [...prevSizes]; // Create a copy of the previous sizes array
            newSizes[index] = { width, height }; // Update the size for the current index
            return newSizes; // Return the updated sizes array
          });
        }
      });
    };
  
    // Call once to set initial size
    handleResize();
  
    // Add event listener for future resizes
    window.addEventListener('resize', handleResize);
  
    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [activeVideoss]);

 // className={`video-container ${videoClass}`}
  return (
    <div className={`video-container ${videoClass}`}>
    
      <div className="gTNrZz">
       <h2>Camera Monitoring List</h2>
       <div className='Patrols'>
    <table className="Headerlist">
        <thead>
            <tr>
                <th>Camera</th>
                <th>Monitor</th>
                <th>Intersection</th>
                {showDelete /*&& <th>Remove</th>} */}
            </tr>
        </thead>
        <tbody className='ScrollableList'>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{row.camera}
                  <button className='xButton' onClick={(e) => {
                        e.preventDefault(); // Prevent the default action
                        if(row.id ===1) setShowVideo1(false);
                        if(row.id ===2) setShowVideo2(false);
                        if(row.id ===3) setShowVideo3(false);
                        if(row.id ===4) setShowVideo4(false);
                    }}> X </button>
                    <button className='yButton' onClick={(e) => {
                        e.preventDefault(); // Prevent the default action
                        playVideo(index);
                        if(row.id ===1) setShowVideo1(true);
                        if(row.id ===2) setShowVideo2(true);
                        if(row.id ===3) setShowVideo3(true);
                        if(row.id ===4) setShowVideo4(true);
                        setText(false);
                    }}> ✓ </button></td>
                  <td>{row.monitor}</td>
                  <td>{row.intersection}</td>
                  {showDelete && (
                    <td>
                      <button className='-Button' onClick={() => deleteRow(row.id)}> − </button>
                    </td>
                  )}
                </tr>
              ))}
         </tbody>
      </table>
          </div>

          <div className='buttoncontainer'>
            <button onClick={toggleAddCamera} className='addbutton button'>Add Camera</button>
            <button onClick={toggleShowDelete} className='removebutton button'>Remove Camera</button>
          </div>
      </div>

      <div className='noti'>
       <h2 className='notiHeading'>
        Traffic Congestion Detected
       </h2>
       <div className="noti-button-group">
         <button className='dispatch'>Send Dispatch</button>
         <button className='ack' onClick={toggleNoti}>Acknowledge</button>
       </div>
      </div>
      
      <div  className={`box ${boxClass}`}>
        {showText && (
        <div className='noCamera'>
          <h2 className='videotext'> Please Select A Video.</h2>
          <h6 className='videotext'> Note: For best usability, active camera displays have been limited to a maximum of four.</h6>
        </div>        
        )}
        {showAddCamera && 
        <div className='overlay'>
          <div className='addCameraPopup'>
            <AddCameraModal addCamera={addCamera} onClose={toggleAddCamera} />
          </div>
        </div>
      }

        {/* Existing JSX */}
        {showVideo1 && (
        <div className='video1'>
          <video ref={videoRefs.current[0]}  autoPlay muted loop onLoadedMetadata={() => logVideoSize(0)}>
            <source src={`${process.env.PUBLIC_URL}/vid1.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video> 
        </div>
        )}

        {showVideo2 && (
        <div className='video2'>
          <video ref={videoRefs.current[1]} autoPlay muted loop onLoadedMetadata={() => logVideoSize(1)}>
            <source src={`${process.env.PUBLIC_URL}/vid2.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        )}

      {showVideo3 && (
        <div className='video3'>
          <video ref={videoRefs.current[2]} autoPlay muted loop onLoadedMetadata={() => logVideoSize(2)}>
            <source src={`${process.env.PUBLIC_URL}/test_4.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        )}

        {showVideo4 && (
        <div className='video4'>
          <video ref={videoRefs.current[3]} autoPlay muted loop onLoadedMetadata={() => logVideoSize(3)}>
            <source src={`${process.env.PUBLIC_URL}/vid3.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        )}      
        </div>

      <div className='eventMonitoring'>
       <EventsMonitoring />
      </div>
      {activeVideoss.map((videoElement, index) => (
        <VideoFrameSender
        key={activeVideoIDs[index]}
        videoElement={videoElement}
        containerSize={activeVideoSizes[index]}
        onContainerCenterReceived={(centerArray) => setContainerCenter(centerArray)}
      videoId={activeVideoIDs[index]}
      />
))}
      
  </div>
  ) 
}

export default VideoPlayer;
