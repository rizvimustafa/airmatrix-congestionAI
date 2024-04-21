// Importing necessary hooks and context from React and custom contexts.
import { useEffect, useState } from 'react';
import { useData } from './dataContext';
import { useCongestion } from '../Components/Congestion/CongestionContext';

// Component to handle video frame processing and congestion management.
function VideoFrameSender({ videoElement, containerSize, videoId }) {
  // Access to the congestion context to update the congestion state.
  const { updateCongestionState } = useCongestion(); 
  // State to track if the current video is congested.
  const [isCongested, setIsCongested] = useState(false);
  // State to track the level of congestion.
  const [congestionLevel, setCongestionLevel] = useState("");
  // Hook to set response data in the application's context.
  const {setResponseData} = useData();

  // Function to process the video frame and send it to the server.
  const sendFrameAndSize = () => {
    // Log if the videoElement is not available.
    if (!videoElement) console.log(videoElement);

    // Create a canvas to capture the current video frame.
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    // Draw the current frame from videoElement to the canvas.
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a Blob and send it to the server.
    canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('frame', blob, 'frame.jpg');
      formData.append('video_id', videoId);
      formData.append('width', Math.round(containerSize.width));
      formData.append('height', Math.round(containerSize.height));

      // Post the form data to the server for processing.
      fetch('http://3.97.2.158:5000/process', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        // Update the local and global state based on server response.
        setResponseData(data)
        if (data.success && data.data && data.data.is_congestion) {
          console.log('Congestion is true for videoId:', videoId);
          console.log("congestion level: ", data.data.congestion_level)
          updateCongestionState(videoId, true);
          setCongestionLevel(data.data.congestion_level);
          setIsCongested(true);
        } else {
          console.log('Congestion is false for videoId:', videoId);
          updateCongestionState(videoId, false);
          setIsCongested(false);
          setCongestionLevel("");
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }, 'image/jpeg');
  };

  // UseEffect to set an interval for sending video frames every 5 seconds.
  useEffect(() => {
    const intervalId = setInterval(sendFrameAndSize, 5000);
    // Cleanup interval on component unmount.
    return () => clearInterval(intervalId);
  }, [videoElement, containerSize, videoId]);

  // UseEffect to visually indicate congestion status on the video element.
  useEffect(() => {
    const videoIdElement = document.querySelector(`.video${videoId}`);
    console.log(videoIdElement);
    if (videoIdElement) {
      let borderColor = 'none'; 
      // Set the border color based on the congestion level.
      if (isCongested) {
        switch(congestionLevel) {
          case "HIGH":
            borderColor = '1px solid red';
            break;
          case "MEDIUM":
            borderColor = '1px solid orange';
            break;
          case "LOW":
            borderColor = '1px solid yellow';
            break;
          default:
            borderColor = 'none'; 
        }
      }
      videoIdElement.style.border = borderColor;
    }
  }, [isCongested, congestionLevel, videoId]);

  // This component does not render anything to the DOM.
  return null;
}

// Exporting the component to be used elsewhere in the application.
export default VideoFrameSender;

